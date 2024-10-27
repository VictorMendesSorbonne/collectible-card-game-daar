// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import "./Collection.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Main is Ownable {
  string public name = "Main";
  uint private count;
  Collection[] collections;
  string [] collectionName;
  mapping(string nameCollection => Collection) private nametoCollec;
  mapping(Collection => string) private collectoName;

  constructor() Ownable(msg.sender) {
    count = 0;
  }

  function createCollection(
    string calldata _name,
    uint _cardCount
  ) external onlyOwner {
    Collection newCollection = new Collection(_name, _cardCount);
    count++;
    collections.push(newCollection);
    collectionName.push(_name);
    nametoCollec[_name] = newCollection;
    collectoName[newCollection] = _name;
  }

  function getCollection(uint _idCollec) external view returns (Collection) {
    return collections[_idCollec];
  }

  function getCollections() external view returns (string[] memory) {
    //string[] memory res ;
    // for (uint i = 0; i < collections.length; i++) {
    //   res[i] = collectoName[collections[i]];
    // }
    return collectionName;
  }

  function getCollectionList(
    string memory _collecName
  ) external view returns (string[] memory) {
    Collection collec = nametoCollec[_collecName];
    return collec.getCards();
  }

  function getMyAddress() external view returns(address){
    return msg.sender;
  }

  function getMyAddressinColl(string memory _idCollec) external view returns(address){
    Collection collec = nametoCollec[_idCollec];
    return collec.getMyAddress();
  }


  function getCard(
    uint _idCollec,
    uint256 _tokenid
  ) external view returns (string memory) {
    return collections[_idCollec].getCard(_tokenid);
  }

  function getMyCardsinCollec(
    string memory _idCollection
  ) public view returns (string[] memory) {
    return nametoCollec[_idCollection].getMyCards(msg.sender);
  }

  function giveCardsto(
    string memory _collecName,
    address _dest,
    uint256 _from,
    uint256 _to
  ) external onlyOwner {
    Collection collec = nametoCollec[_collecName];
    collec.giveCardto(_dest, _from, _to);
  }

  fallback() external payable {}

  receive() external payable {}
}
