
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Reputation is Ownable {
    mapping(address => uint256) public reputations;

    event ReputationChanged(address user, uint256 newReputation);

    constructor() Ownable() {}

    function getReputation(address user) public view returns (uint256) {
        return reputations[user];
    }

    function setReputation(address user, uint256 reputation) public onlyOwner {
        reputations[user] = reputation;
        emit ReputationChanged(user, reputation);
    }

    function incrementReputation(address user, uint256 amount) public onlyOwner {
        reputations[user] += amount;
        emit ReputationChanged(user, reputations[user]);
    }

    function decrementReputation(address user, uint256 amount) public onlyOwner {
        if (reputations[user] >= amount) {
            reputations[user] -= amount;
        } else {
            reputations[user] = 0;
        }
        emit ReputationChanged(user, reputations[user]);
    }
}
