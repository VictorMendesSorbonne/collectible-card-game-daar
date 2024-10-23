// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Collection is ERC721, Ownable {
  uint256 public cardCount;

  mapping(uint256 tokenId => string) private uris;

  constructor(
    string memory _name
  ) ERC721(_name, "COLLECTION") Ownable(msg.sender) {
    cardCount = 0;
  }

  function tokenURI(
    uint256 _tokenId
  ) public view override returns (string memory) {
    _requireOwned(_tokenId);
    return uris[_tokenId];
  }

  function addCard(string memory _uri) external onlyOwner returns (uint256) {
    uris[cardCount++] = _uri;
    _update(msg.sender, cardCount, address(0));
    return cardCount;
  }

  function getCard(uint256 _tokenid) external view returns (string memory) {
    return uris[_tokenid];
  }

  function getCardByOwner(
    address _owner
  ) external view returns (string[] memory) {
    string[] memory res;
    uint256 nbCard = balanceOf(msg.sender);
    uint compteur = 0;
    for (uint i = 0; i < cardCount; i++) {
      if (_ownerOf(i) == _owner || res.length == nbCard) {
        res[compteur++] = uris[i];
      }
    }
    return res;
  }

  function getMyCards() external view returns (string[] memory) {
    string[] memory res;
    uint256 nbCard = balanceOf(msg.sender);
    uint compteur = 0;
    for (uint i = 0; i < cardCount; i++) {
      if (_ownerOf(i) == msg.sender || res.length == nbCard) {
        res[compteur++] = uris[i];
      }
    }
    return res;
  }
}
