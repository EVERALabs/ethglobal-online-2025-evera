// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity >=0.8.0;

library Events {
    event MintedPosition(
        uint256 indexed tokenId,
        address indexed owner,
        address token0,
        address token1,
        uint24 fee,
        address pool
    );
}
