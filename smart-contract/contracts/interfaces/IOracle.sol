// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity ^0.8.17;

import {PythStructs} from "@pythnetwork/pyth-sdk-solidity/PythStructs.sol";

interface IOracle {
    function queryPriceFeed(bytes32 priceId) external returns (PythStructs.PriceFeed memory priceFeed);
}
