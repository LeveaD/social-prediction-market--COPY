// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Market {
    enum Outcome { Undecided, Yes, No }

    struct MarketState {
        bool exists;
        bool resolved;
        Outcome outcome;
        uint256 totalYes;
        uint256 totalNo;
    }

    mapping(uint256 => MarketState) public markets;
    mapping(uint256 => mapping(address => uint256)) public contributionYes;
    mapping(uint256 => mapping(address => uint256)) public contributionNo;

    address public owner;

    event MarketCreated(uint256 indexed marketId);
    event BetPlaced(uint256 indexed marketId, address indexed bettor, uint256 amount, bool onYes);
    event MarketResolved(uint256 indexed marketId, Outcome outcome);

    modifier onlyOwner() {
        require(msg.sender == owner, "only owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function createMarket(uint256 marketId) external onlyOwner {
        require(!markets[marketId].exists, "market exists");
        markets[marketId] = MarketState({ exists: true, resolved: false, outcome: Outcome.Undecided, totalYes: 0, totalNo: 0 });
        emit MarketCreated(marketId);
    }

    function placeBet(uint256 marketId, bool onYes) external payable {
        require(markets[marketId].exists, "no market");
        require(!markets[marketId].resolved, "market resolved");
        require(msg.value > 0, "no value");

        if (onYes) {
            contributionYes[marketId][msg.sender] += msg.value;
            markets[marketId].totalYes += msg.value;
        } else {
            contributionNo[marketId][msg.sender] += msg.value;
            markets[marketId].totalNo += msg.value;
        }

        emit BetPlaced(marketId, msg.sender, msg.value, onYes);
    }

    function resolve(uint256 marketId, Outcome outcome) external onlyOwner {
        require(markets[marketId].exists, "no market");
        require(!markets[marketId].resolved, "already resolved");
        require(outcome == Outcome.Yes || outcome == Outcome.No, "invalid");

        markets[marketId].resolved = true;
        markets[marketId].outcome = outcome;

        emit MarketResolved(marketId, outcome);
    }

    function claim(uint256 marketId) external {
        require(markets[marketId].exists && markets[marketId].resolved, "not settled");
        Outcome win = markets[marketId].outcome;
        uint256 winnerTotal = win == Outcome.Yes ? markets[marketId].totalYes : markets[marketId].totalNo;
        uint256 loserTotal = win == Outcome.Yes ? markets[marketId].totalNo : markets[marketId].totalYes;
        require(winnerTotal > 0, "no winners");

        uint256 userContribution = win == Outcome.Yes ? contributionYes[marketId][msg.sender] : contributionNo[marketId][msg.sender];
        require(userContribution > 0, "no contribution");

        // calculate payout: contribution + share of loser pool
        uint256 payout = userContribution + (userContribution * loserTotal) / winnerTotal;

        // zero out contribution to prevent re-claim
        if (win == Outcome.Yes) {
            contributionYes[marketId][msg.sender] = 0;
        } else {
            contributionNo[marketId][msg.sender] = 0;
        }

        payable(msg.sender).transfer(payout);
    }
}
