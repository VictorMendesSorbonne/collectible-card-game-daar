// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import "./Collection.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Main is Ownable {
  string public name = "Main";
  int private count;
  mapping(int idCollec=> Collection) private collections;

  constructor() Ownable(msg.sender) {
    count = 0;
  }

  function createCollection(
    string calldata _name
  ) external onlyOwner {
    collections[count++] = new Collection(_name);
  }

  function test() external view returns (Collection) {
    return collections[0];
  }

  function getCollection(int _idCollec) external view returns(Collection){
    return collections[_idCollec];
  }

  function setCard(int _idCollec,string memory _uri) external onlyOwner{
    collections[_idCollec].addCard(_uri);
  }

  function getCard(int _idCollec,uint256 _tokenid) external view returns(string memory){
    return collections[_idCollec].getCard(_tokenid);
  }

  function getMyCardsinCollec(int _idCollection) external view returns(string[] memory){
    return collections[_idCollection].getMyCards();
  }

  fallback() external payable {}

  receive() external payable {}
}
