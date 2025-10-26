// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {IOracle} from "../src/interfaces/IOracle.sol";
import {PythStructs} from "@pythnetwork/pyth-sdk-solidity/PythStructs.sol";

contract ETHPYUSD {
    IOracle public immutable pyth;

    bytes32 public constant ETHUSD = 0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace;
    bytes32 public constant PYUSDUSD = 0xc1da1b73d7f01e7ddd54b3766cf7fcd644395ad14f70aa706ec5384c59e76692;

    constructor(address pyth_) {
        pyth = IOracle(pyth_);
    }

    function getETHPYUSD() external returns (uint256) {
        PythStructs.PriceFeed memory priceFeedETH = pyth.queryPriceFeed(ETHUSD);
        PythStructs.PriceFeed memory priceFeedPYUSD = pyth.queryPriceFeed(PYUSDUSD);
        uint256 latestETH = uint64(priceFeedETH.price.price);
        uint256 latestPYUSD = uint64(priceFeedPYUSD.price.price);

        return latestETH / latestPYUSD;
    }
}
