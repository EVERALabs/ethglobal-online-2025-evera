// LibAppStorage.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Position} from "./Types.sol";
import {MintParams, PositionBalance, MintBalance} from "./Types.sol";

library LibAppStorage {
    struct PositionStorage {
        mapping(uint256 => Position) positions;
        mapping(bytes32 => MintParams) keyToMinted;
        mapping(address => PositionBalance) userBalance;
        mapping(uint256 => MintBalance) tokenIdToMintBalance;
    }

    function s() internal pure returns (PositionStorage storage store) {
        bytes32 position = keccak256("myapp.storage");
        assembly {
            store.slot := position
        }
    }
}
