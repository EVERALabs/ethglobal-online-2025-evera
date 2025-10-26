// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity ^0.8.17;

interface IPriceFeed {
    function getETHPYUSD() external returns (uint256);
}
