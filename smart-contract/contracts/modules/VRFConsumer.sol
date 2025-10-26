// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import { IEntropyConsumer } from "@pythnetwork/entropy-sdk-solidity/IEntropyConsumer.sol";
import { IEntropyV2 } from "@pythnetwork/entropy-sdk-solidity/IEntropyV2.sol";
 
// @param entropyAddress The address of the entropy contract.
contract VRFConsumer is IEntropyConsumer {
  IEntropyV2 public entropy;
 
  constructor(address entropyAddress) {
    entropy = IEntropyV2(entropyAddress);
  }

  mapping(uint64 => uint256) public result; 
  mapping(uint64 => uint256) private pre;

function requestRandomNumber(uint256 no) external payable returns(uint64 sequenceNumber){
  uint256 fee = entropy.getFeeV2();
 
  sequenceNumber = entropy.requestV2{ value: fee }();
  pre[sequenceNumber] = no;
}   

 function entropyCallback(
    uint64 sequenceNumber,
    address provider,
    bytes32 randomNumber
  ) internal override {
    // Implement your callback logic here.
    result[sequenceNumber] = uint256(randomNumber) % pre[sequenceNumber];
  }
 
  // This method is required by the IEntropyConsumer interface.
  // It returns the address of the entropy contract which will call the callback.
  function getEntropy() internal view override returns (address) {
    return address(entropy);
  }
}

 