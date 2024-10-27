// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract Collection is ERC721, Ownable {
  uint256 public cardCount;
  string[] private cards;

  mapping(uint256 tokenId => string) private ids;

  constructor(
    string memory _name,
    uint256 _cardCount
  ) ERC721(_name, "COLLECTION") Ownable(msg.sender) {
    cardCount = _cardCount;
    for (uint i = 1; i < cardCount + 1; i++) {
      string memory res = string.concat(_name,"-", Strings.toString(i));
      ids[i - 1] = res;
      cards.push(res);
      _update(msg.sender, i - 1, address(0));
    }
  }

  function giveCardto(address _dest, uint256 _from, uint256 _to) external  onlyOwner {
    for (uint i = _from; i < _to; i++) {
      safeTransferFrom(msg.sender,_dest,i);
    }
  }

  function getCard(uint256 _tokenid) external view returns (string memory) {
    return ids[_tokenid];
  }

  function getMyAddress() external view returns(address){
    return msg.sender;
  }

  function getCards() external view returns (string[] memory) {
    return cards;
  }

  function haveOwner(uint256 _tokenid) external view returns (bool) {
    // Si l'admin est propriétaire alors il est a personne
    if (_ownerOf(_tokenid) == owner()) {
      return false;
    }
    return true;
  }

  function getCardsByOwner(
    address _owner
  ) external view returns (string[] memory) {
    string[] memory res;
    uint nbCard = balanceOf(msg.sender);
    uint compteur = 0;
    for (uint i = 0; i < cardCount; i++) {
      if (_ownerOf(i) == _owner || res.length == nbCard) {
        res[compteur] = ids[i];
        compteur++;
      }
    }
    return res;
  }

  function getMyCards(address _owner) external view returns (string[] memory) {
    string[] memory res = new string[](cardCount);
    uint256 nbCard = balanceOf(_owner);
    uint compteur = 0;
    for (uint i = 0; i < cardCount; i++) {
      if (_ownerOf(i) == _owner || res.length == nbCard) {
        res[compteur] = ids[i];
        compteur++;
      }
    }
    return res;
  }
}
