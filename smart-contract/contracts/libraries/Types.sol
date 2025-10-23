// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

struct Position {
    address owner;
    uint256 price;
    address asset;
    uint256 amount;
}

struct MintParams {
    address owner;
    address token0;
    address token1;
    uint24 fee;
    uint256 amount0Desired;
    uint256 amount1Desired;
    uint256 deadline;
}

struct PositionBalance {
    address owner;
    uint256 amount0;
    uint256 amount1;
    uint256 ltv;
    address pool;
    uint256 tokenId;
}

struct MintBalance {
    address owner;
    address token0;
    address token1;
    uint24 fee;
    uint256 amount0;
    uint256 amount1;
    address pool;
    uint256 tokenId;
    bytes position;
}

enum RebalanceType {
    LOW,
    MEDIUM,
    HIGH
}
