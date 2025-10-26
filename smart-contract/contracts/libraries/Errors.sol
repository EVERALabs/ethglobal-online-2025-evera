// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity >=0.8.0;

library Errors {
    error OnlyManagerCanMint(address sender, address manager);
    error OnlyPositionOwnerCanMint();
}
