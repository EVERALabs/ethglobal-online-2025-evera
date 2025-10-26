// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import {INonfungiblePositionManager} from "../interfaces/INonfungiblePositionManager.sol";
import {PositionManagerRouter} from "../modules/PositionManager.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {MockETH} from "./MockETH.sol";
import {IUniswapV3Pool} from "@uniswap/v3-core/contracts/interfaces/IUniswapV3Pool.sol";
import {console} from "forge-std/console.sol";

contract MockLP {
    INonfungiblePositionManager public immutable positionManager;

    constructor(INonfungiblePositionManager positionManager_) {
        positionManager = positionManager_;
    }

    function createPoolAndMintFullrange(
        uint160 sqrtRatioX96,
        address token0,
        address token1,
        uint24 fee
    ) external returns (address pool, uint256 tokenId) {
        _maxMint(token0);
        console.log("total %s", IERC20(token0).totalSupply());
        pool = positionManager.createAndInitializePoolIfNecessary(
            token0,
            token1,
            fee,
            sqrtRatioX96
        );
        IERC20(token0).approve(
            address(positionManager),
            IERC20(token0).balanceOf(address(this))
        );
        IERC20(token1).approve(
            address(positionManager),
            IERC20(token1).balanceOf(address(this))
        );
        (tokenId, , , ) = positionManager.mint(
            INonfungiblePositionManager.MintParams({
                token0: token0,
                token1: token1,
                fee: fee,
                tickLower: -887220,
                tickUpper: 887220,
                amount0Desired: IERC20(token0).balanceOf(address(this)),
                amount1Desired: IERC20(token1).balanceOf(address(this)),
                amount0Min: 0,
                amount1Min: 0,
                recipient: address(this),
                deadline: block.timestamp
            })
        );
        MockETH(token0).burn(
            address(this),
            IERC20(token0).balanceOf(address(this))
        );
        console.log("total %s", IERC20(token0).totalSupply());
    }

    function _maxMint(address token0) internal {
        uint256 maxMint = type(uint128).max - IERC20(token0).totalSupply();
        MockETH(token0).mint(address(this), maxMint);
    }
}
