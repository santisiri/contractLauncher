pragma solidity ^0.5.11;

contract Basic {
  string message;

  constructor() public {
    message = "Basic contract for testing";
  }

  function setGreetings(string memory _message) public {
    message = _message;
  }

  function getGreetings() public view returns (string memory) {
    return message;
  }
}