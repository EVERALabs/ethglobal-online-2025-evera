// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {console} from "forge-std/console.sol";
import {INonfungiblePositionManager} from "./interfaces/INonfungiblePositionManager.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IUniswapV3Pool} from "@uniswap/v3-core/contracts/interfaces/IUniswapV3Pool.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Errors} from "./libraries/Errors.sol";

contract PositionRegistry is ERC721 {
    INonfungiblePositionManager public immutable nonfungiblePositionManager;
    IUniswapV3Pool public immutable pool;
    IERC20 public immutable token0;
    IERC20 public immutable token1;
    address public immutable MANAGER;

    constructor(
        address manager
    ) ERC721("Bloom Finance Position Registry", "BLOOM") {
        MANAGER = manager;
    }

    function mint(address account, uint256 _tokenId) external onlyManager {
        _mint(account, _tokenId);
    }

    modifier onlyManager() {
        if (msg.sender != MANAGER)
            revert Errors.OnlyManagerCanMint(msg.sender, MANAGER);
        _;
    }
}
