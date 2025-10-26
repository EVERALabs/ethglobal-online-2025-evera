// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import {INonfungiblePositionManager} from "../interfaces/INonfungiblePositionManager.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IUniswapV3Pool} from "@uniswap/v3-core/contracts/interfaces/IUniswapV3Pool.sol";
import {LiquidityAmounts} from "@uniswap/v3-periphery/contracts/libraries/LiquidityAmounts.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {TickMath} from "../libraries/TickMath.sol";
import {PositionRegistry} from "../PositionRegistry.sol";
import {PositionPool} from "../PositionPool.sol";
import {LibAppStorage} from "../libraries/PositionStorage.sol";
import {Position, MintParams, PositionBalance, RebalanceType, MintBalance} from "../libraries/Types.sol";
import {Errors} from "../libraries/Errors.sol";
import {Events} from "../libraries/Events.sol";
import {console} from "forge-std/console.sol";

contract PositionManagerRouter {
    using SafeERC20 for IERC20;
    using LibAppStorage for *;

    INonfungiblePositionManager public immutable positionManager;
    PositionRegistry public immutable positionRegistry;
    address public immutable usdc;
    address public immutable eth;
    uint256 public tokenId;
    int24 public immutable TICK_SPACING;

    event PositionCreated(
        address owner,
        uint256 tokenId,
        uint256 amount0,
        uint256 amount1
    );
    event NFTMinted(address owner, uint256 tokenId);

    error PoolAddressIsZero();
    error NotEnoughBalance();

    constructor(
        INonfungiblePositionManager positionManager_,
        PositionRegistry positionRegistry_,
        address usdc_,
        address eth_
    ) {
        positionManager = positionManager_;
        positionRegistry = positionRegistry_;
        usdc = usdc_;
        eth = eth_;
        TICK_SPACING = 60;
    }

    mapping(uint256 => PositionBalance) public tokenIdToPositionBalance;

    function createPosition(
        uint256 amount0Deposit,
        uint256 amount1Deposit
    ) public payable {
        PositionPool pool = new PositionPool(address(positionManager));
        IERC20(usdc).safeTransferFrom(
            msg.sender,
            address(pool),
            amount1Deposit
        );
        IERC20(eth).safeTransferFrom(msg.sender, address(pool), amount0Deposit);
        tokenId++;
        LibAppStorage.s().userBalance[msg.sender] = PositionBalance({
            owner: msg.sender,
            amount0: amount0Deposit,
            amount1: amount1Deposit,
            ltv: 0,
            pool: address(pool),
            tokenId: tokenId
        });
        PositionRegistry(positionRegistry).mint(msg.sender, tokenId);
        tokenIdToPositionBalance[tokenId] = LibAppStorage.s().userBalance[
            msg.sender
        ];

        emit PositionCreated(
            msg.sender,
            tokenId,
            amount0Deposit,
            amount1Deposit
        );
    }

    function calculateTickRange(
        RebalanceType type_,
        address pool_
    )
        internal
        view
        returns (int24 tickLower, int24 tickUpper, uint160 sqrtPriceX96)
    {
        (
            uint160 currentSqrtPriceX96,
            int24 currentTick,
            ,
            ,
            ,
            ,

        ) = IUniswapV3Pool(pool_).slot0();
        int24 normallizedCurrentTick = (currentTick / TICK_SPACING) *
            TICK_SPACING;
        sqrtPriceX96 = currentSqrtPriceX96;
        if (type_ == RebalanceType.LOW) {
            tickUpper = normallizedCurrentTick + 15 * TICK_SPACING;
            tickLower = normallizedCurrentTick - 15 * TICK_SPACING;
        } else if (type_ == RebalanceType.MEDIUM) {
            tickUpper = normallizedCurrentTick + 60 * TICK_SPACING;
            tickLower = normallizedCurrentTick - 60 * TICK_SPACING;
        }
    }

    function _mint(
        MintParams calldata params,
        RebalanceType type_,
        address pool_
    ) external checkDeadline(params.deadline) returns (uint256 nftId) {
        PositionBalance storage position = LibAppStorage.s().userBalance[
            params.owner
        ];
        if (position.pool == address(0)) revert PoolAddressIsZero();
        if (params.owner != msg.sender)
            revert Errors.OnlyPositionOwnerCanMint();
        PositionPool pool = PositionPool(position.pool);
        if (
            IERC20(usdc).balanceOf(position.pool) < params.amount1Desired ||
            IERC20(eth).balanceOf(position.pool) < params.amount0Desired
        ) revert NotEnoughBalance();

        position.amount0 -= params.amount0Desired;
        position.amount1 -= params.amount1Desired;

        (int24 tickLower, int24 tickUpper, ) = calculateTickRange(type_, pool_);

        INonfungiblePositionManager.MintParams
            memory mintParams = INonfungiblePositionManager.MintParams({
                token0: params.token0,
                token1: params.token1,
                fee: params.fee,
                tickLower: tickLower,
                tickUpper: tickUpper,
                amount0Desired: params.amount0Desired,
                amount1Desired: params.amount1Desired,
                amount0Min: 0,
                amount1Min: 0,
                recipient: address(this),
                deadline: params.deadline
            });

        nftId = pool.mintingPosition(mintParams);
        LibAppStorage.s().tokenIdToMintBalance[nftId] = MintBalance(
            params.owner,
            params.token0,
            params.token1,
            params.fee,
            params.amount0Desired,
            params.amount1Desired,
            pool_,
            position.tokenId,
            abi.encode(position)
        );

        emit Events.MintedPosition(
            nftId,
            position.owner,
            params.token0,
            params.token1,
            params.fee,
            pool_
        );
    }

    function rebalance(
        RebalanceType type_,
        uint256 mintTokenId,
        uint256 deadline
    ) external checkDeadline(deadline) returns (uint256 nftId) {
        //check balance
        MintBalance memory mintPosition = LibAppStorage
            .s()
            .tokenIdToMintBalance[mintTokenId];
        PositionBalance storage position = LibAppStorage.s().userBalance[
            mintPosition.owner
        ];

        (uint256 amount0, uint256 amount1) = _emptyLiquidity(mintTokenId);
        LibAppStorage.s().tokenIdToMintBalance[mintTokenId] = MintBalance(
            address(0),
            address(0),
            address(0),
            0,
            0,
            0,
            address(0),
            0,
            ""
        );
        (
            int24 tickLower,
            int24 tickUpper,
            uint160 currentSqrtPriceX96
        ) = calculateTickRange(type_, mintPosition.pool);
        uint160 sqrtPriceLower = TickMath.getSqrtRatioAtTick(tickLower);
        uint160 sqrtPriceUpper = TickMath.getSqrtRatioAtTick(tickUpper);

        if (amount0 == 0) {
            uint256 preAmount1 = amount1;
            uint128 liquidity = LiquidityAmounts.getLiquidityForAmount1(
                sqrtPriceLower,
                sqrtPriceUpper,
                amount1
            );
            (amount0, amount1) = LiquidityAmounts.getAmountsForLiquidity(
                currentSqrtPriceX96,
                sqrtPriceLower,
                sqrtPriceUpper,
                liquidity
            );
            IERC20(mintPosition.token1).safeTransfer(position.pool, amount1);
            position.amount1 += (preAmount1 - amount1);
        } else {
            uint256 preAmount0 = amount0;
            uint128 liquidity = LiquidityAmounts.getLiquidityForAmount0(
                sqrtPriceLower,
                sqrtPriceUpper,
                amount0
            );
            (amount0, amount1) = LiquidityAmounts.getAmountsForLiquidity(
                currentSqrtPriceX96,
                sqrtPriceLower,
                sqrtPriceUpper,
                liquidity
            );
            IERC20(mintPosition.token0).safeTransfer(position.pool, amount0);
            position.amount0 += (preAmount0 - amount0);
        }

        INonfungiblePositionManager.MintParams
            memory params = INonfungiblePositionManager.MintParams({
                token0: mintPosition.token0,
                token1: mintPosition.token1,
                fee: mintPosition.fee,
                tickLower: tickLower,
                tickUpper: tickUpper,
                amount0Desired: amount0,
                amount1Desired: amount1,
                amount0Min: 0,
                amount1Min: 0,
                recipient: address(this),
                deadline: deadline
            });

        position.amount0 -= amount0;
        position.amount1 -= amount1;

        nftId = PositionPool(position.pool).mintingPosition(params);

        LibAppStorage.s().tokenIdToMintBalance[nftId] = MintBalance(
            mintPosition.owner,
            params.token0,
            params.token1,
            params.fee,
            params.amount0Desired,
            params.amount1Desired,
            mintPosition.pool,
            position.tokenId,
            abi.encode(position)
        );
    }

    function _emptyLiquidity(
        uint256 _tokenId
    ) internal returns (uint256 amount0, uint256 amount1) {
        (, , , , , , , uint128 liquidity, , , , ) = positionManager.positions(
            _tokenId
        );
        _decreaseLiquidity(_tokenId, liquidity);
        (amount0, amount1) = _collect(_tokenId);
        positionManager.burn(_tokenId);
    }

    function _decreaseLiquidity(
        uint256 _tokenId,
        uint128 liquidity
    ) internal returns (uint256 amount0, uint256 amount1) {
        INonfungiblePositionManager.DecreaseLiquidityParams
            memory decreaseLiquidityParams = INonfungiblePositionManager
                .DecreaseLiquidityParams({
                    tokenId: _tokenId,
                    liquidity: liquidity,
                    amount0Min: 0,
                    amount1Min: 0,
                    deadline: block.timestamp
                });
        (amount0, amount1) = positionManager.decreaseLiquidity(
            decreaseLiquidityParams
        );
    }

    function _collect(
        uint256 _tokenId
    ) internal returns (uint256 amount0, uint256 amount1) {
        INonfungiblePositionManager.CollectParams
            memory collectParams = INonfungiblePositionManager.CollectParams({
                tokenId: _tokenId,
                recipient: address(this),
                amount0Max: type(uint128).max,
                amount1Max: type(uint128).max
            });
        (amount0, amount1) = positionManager.collect(collectParams);
    }

    modifier checkDeadline(uint256 deadline) {
        require(block.timestamp <= deadline, "Deadline has passed");
        _;
    }
}
