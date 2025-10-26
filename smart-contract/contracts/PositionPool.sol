// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import {Initializable} from "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {INonfungiblePositionManager} from "./interfaces/INonfungiblePositionManager.sol";
import {MintParams} from "./libraries/PositionStorage.sol";

contract PositionPool is Ownable {
    using SafeERC20 for IERC20;

    INonfungiblePositionManager public immutable positionManager;

    // address public immutable token1;
    // address public immutable baseToken;

    constructor(address _positionManager) Ownable(msg.sender) {
        positionManager = INonfungiblePositionManager(_positionManager);
    }

    function transfer(
        address _token,
        address _address,
        uint256 amount
    ) external onlyOwner returns (uint256) {
        IERC20(_token).safeTransfer(_address, amount);
        return amount;
    }

    function mintingPosition(
        INonfungiblePositionManager.MintParams calldata params
    ) external onlyOwner returns (uint256 tokenId) {
        IERC20(params.token0).approve(
            address(positionManager),
            params.amount0Desired
        );
        IERC20(params.token1).approve(
            address(positionManager),
            params.amount1Desired
        );
        (tokenId, , , ) = positionManager.mint(params);
    }
}
