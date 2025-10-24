// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {INonfungiblePositionManager} from "../contracts/interfaces/INonfungiblePositionManager.sol";
import {MockLP} from "../contracts/mocks/MockLP.sol";
import {MockUSDC} from "../contracts/mocks/MockUSDC.sol";
import {MockETH} from "../contracts/mocks/MockETH.sol";
import {PriceMath} from "../contracts/libraries/PriceMath.sol";
import {MintParams, Position, PositionBalance, RebalanceType} from "../contracts/libraries/Types.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import {IUniswapV3Pool} from "@uniswap/v3-core/contracts/interfaces/IUniswapV3Pool.sol";
import {PositionRegistry} from "../contracts/PositionRegistry.sol";
import {LiquidityAmounts} from "@uniswap/v3-periphery/contracts/libraries/LiquidityAmounts.sol";
import {TickMath} from "../contracts/libraries/TickMath.sol";
import {ISwapRouter} from "../contracts/interfaces/ISwapRouter.sol";
import {PositionManagerRouter} from "../contracts/modules/PositionManager.sol";

contract PositionManagerTest is Test {
    // Environment addresses
    address public NONFUNGIBLE_ARB_SEPOLIA =
        0x6b2937Bde17889EDCf8fbD8dE31C3C2a70Bc4d65;
    address public NONFUNGIBLE_BASE_SEPOLIA =
        0x27F971cb582BF9E50F397e4d29a5C7A34f11faA2;
    address public SWAP_ROUTER_ARB = 0x101F443B4d1b059569D643917553c771E1b9663E;

    PositionManagerRouter public positionManagerRouter;
    MockLP public mockLP;
    MockUSDC public mockUSDC;
    MockETH public mockETH;
    address public token0;
    address public token1;
    INonfungiblePositionManager public nonfungiblePositionManagerARB =
        INonfungiblePositionManager(NONFUNGIBLE_ARB_SEPOLIA);
    INonfungiblePositionManager public nonfungiblePositionManagerETH =
        INonfungiblePositionManager(NONFUNGIBLE_BASE_SEPOLIA);
    ISwapRouter public swapRouter = ISwapRouter(SWAP_ROUTER_ARB);
    PositionRegistry public positionRegistry;
    address public pool;
    address expectedPositionManagerAddress;

    address alice = makeAddr("alice");
    address bob = makeAddr("bob");

    function setUp() public {
        vm.createSelectFork(
            "https://arb-sepolia.g.alchemy.com/v2/IpWFQVx6ZTeZyG85llRd7h6qRRNMqErS"
        );

        uint64 nonce = vm.getNonce(address(this));
        expectedPositionManagerAddress = vm.computeCreateAddress(
            address(this),
            nonce + 5
        );

        positionRegistry = new PositionRegistry(expectedPositionManagerAddress);

        mockETH = new MockETH();
        mockUSDC = new MockUSDC();

        while (address(mockETH) > address(mockUSDC)) {
            mockETH = new MockETH();
            nonce += 1;
        }

        mockLP = new MockLP(nonfungiblePositionManagerARB);

        token0 = address(mockETH);
        token1 = address(mockUSDC);

        vm.setNonce(address(this), nonce + 5);
        positionManagerRouter = new PositionManagerRouter(
            nonfungiblePositionManagerARB,
            positionRegistry,
            address(mockUSDC),
            address(mockETH)
        );
        uint160 price = PriceMath.priceToSqrtPriceX96(2500e6, 18);
        console.log("price = %s", price);
        MockUSDC(token1).mint(address(mockLP), 10_000e6);
        if (address(mockETH) > address(mockUSDC))
            console.log("ETH is higher than USDC");

        (pool, ) = mockLP.createPoolAndMintFullrange(
            price,
            token0,
            token1,
            3000
        );

        deal(token0, alice, 10_000e18);
        deal(token1, alice, 10_000e6);
        deal(token0, address(this), 10_000e18);
        deal(token1, address(this), 10_000e6);
    }

    function test_CreatePosition_Happy() public {
        vm.startPrank(alice);
        IERC20(token0).approve(
            address(positionManagerRouter),
            type(uint128).max
        );
        IERC20(token1).approve(
            address(positionManagerRouter),
            type(uint128).max
        );

        positionManagerRouter.createPosition(1000e18, 10_000e6);
        vm.stopPrank();

        assertEq(positionManagerRouter.tokenId(), 1);
        assertEq(IERC721(address(positionRegistry)).ownerOf(1), alice);
    }

    function test_MintPosition_Happy()
        public
        returns (uint256 nftId, int24 tickLower, int24 tickUpper)
    {
        test_CreatePosition_Happy();
        //Calculating Amount 0 and Amount1
        (uint160 currentSqrt, int24 currentTick, , , , , ) = IUniswapV3Pool(
            pool
        ).slot0();
        int24 normallizedCurrentTick = (currentTick / 60) * 60;
        tickUpper = normallizedCurrentTick + 15 * 60;
        tickLower = normallizedCurrentTick - 15 * 60;

        uint160 sqrtPriceLower = TickMath.getSqrtRatioAtTick(tickLower);
        uint160 sqrtPriceUpper = TickMath.getSqrtRatioAtTick(tickUpper);

        uint128 liquidityForAmount0 = LiquidityAmounts.getLiquidityForAmount0(
            sqrtPriceLower,
            sqrtPriceUpper,
            1e18
        );
        (uint256 amount0, uint256 amount1) = LiquidityAmounts
            .getAmountsForLiquidity(
                currentSqrt,
                sqrtPriceLower,
                sqrtPriceUpper,
                liquidityForAmount0 * 2
            );

        console.log("amount0: ", amount0);
        console.log("amount1: ", amount1);

        MintParams memory params = MintParams({
            owner: alice,
            token0: token0,
            token1: token1,
            fee: 3000,
            amount0Desired: amount0,
            amount1Desired: amount1,
            deadline: block.timestamp + 10 minutes
        });
        vm.prank(alice);
        nftId = positionManagerRouter._mint(params, RebalanceType.LOW, pool);

        assertNotEq(nftId, 0);
    }

    function test_RebalanceSell_Happy() public {
        (
            uint256 nftId,
            int24 previousTickLower,
            int24 previousTickUpper
        ) = test_MintPosition_Happy();
        test_Swap_Sell();
        (, int24 currentTick, , , , , ) = IUniswapV3Pool(pool).slot0();

        assertLt(currentTick, previousTickLower);

        nftId = positionManagerRouter.rebalance(
            RebalanceType.LOW,
            nftId,
            block.timestamp + 1 minutes
        );

        (
            ,
            ,
            ,
            ,
            ,
            int24 currentTickLower,
            int24 currentTickUpper,
            ,
            ,
            ,
            ,

        ) = nonfungiblePositionManagerARB.positions(nftId);

        assertLt(
            currentTickLower,
            previousTickLower,
            "Lower Boundary Must Be Lower"
        );
        assertLt(
            currentTickUpper,
            previousTickUpper,
            "Upper Boundary Must Be Lower"
        );
    }

    function test_RebalanceBuy_Happy() public {
        (
            uint256 nftId,
            int24 previousTickLower,
            int24 previousTickUpper
        ) = test_MintPosition_Happy();
        test_Swap_Buy();
        (, int24 currentTick, , , , , ) = IUniswapV3Pool(pool).slot0();

        assertGt(
            currentTick,
            previousTickLower,
            "Current tick must be greater than upper boundary"
        );

        nftId = positionManagerRouter.rebalance(
            RebalanceType.LOW,
            nftId,
            block.timestamp + 1 minutes
        );

        (
            ,
            ,
            ,
            ,
            ,
            int24 currentTickLower,
            int24 currentTickUpper,
            ,
            ,
            ,
            ,

        ) = nonfungiblePositionManagerARB.positions(nftId);

        assertGt(
            currentTickLower,
            previousTickLower,
            "Lower Boundary Must Be Greater"
        );
        assertGt(
            currentTickUpper,
            previousTickUpper,
            "Upper Boundary Must Be Greater"
        );
    }

    function test_Swap_Sell() public {
        ISwapRouter.ExactInputSingleParams memory params = ISwapRouter
            .ExactInputSingleParams({
                tokenIn: token0,
                tokenOut: token1,
                fee: 3000,
                recipient: address(this),
                amountIn: 1.5e18,
                amountOutMinimum: 0,
                sqrtPriceLimitX96: 0
            });
        uint256 balanceBefore = IERC20(token1).balanceOf(address(this));
        IERC20(params.tokenIn).approve(address(swapRouter), params.amountIn);
        swapRouter.exactInputSingle(params);

        assertGt(IERC20(token1).balanceOf(address(this)), balanceBefore);
    }

    function test_Swap_Buy() public {
        ISwapRouter.ExactInputSingleParams memory params = ISwapRouter
            .ExactInputSingleParams({
                tokenIn: token1,
                tokenOut: token0,
                fee: 3000,
                recipient: address(this),
                amountIn: 2000e6,
                amountOutMinimum: 0,
                sqrtPriceLimitX96: 0
            });
        uint256 balanceBefore = IERC20(token0).balanceOf(address(this));
        IERC20(params.tokenIn).approve(address(swapRouter), params.amountIn);
        swapRouter.exactInputSingle(params);

        assertGt(IERC20(token0).balanceOf(address(this)), balanceBefore);
    }
}
