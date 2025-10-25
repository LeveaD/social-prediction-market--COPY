
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./Reputation.sol";

contract PredictionMarket is Ownable {
    Reputation public reputationContract;
    uint256 public treasury;

    enum State { Open, Resolved }

    struct Market {
        string question;
        uint256 endsAt;
        State state;
        uint256 totalYesAmount;
        uint256 totalNoAmount;
        mapping(address => uint256) yesBets;
        mapping(address => uint256) noBets;
        address[] yesBetters;
        address[] noBetters;
        mapping(address => bool) isYesBetter;
        mapping(address => bool) isNoBetter;
    }

    Market[] public markets;

    event MarketCreated(uint256 indexed marketId, string question, uint256 endsAt);
    event BetPlaced(uint256 indexed marketId, address indexed better, bool outcome, uint256 amount);
    event MarketResolved(uint256 indexed marketId, bool winningOutcome);
    event PayoutTransferred(address indexed user, uint256 amount);

    constructor(address reputationAddress) Ownable(msg.sender) {
        reputationContract = Reputation(reputationAddress);
    }

    function createMarket(string memory _question, uint256 _duration) public onlyOwner {
        uint256 marketId = markets.length;
        markets.push(Market({
            question: _question,
            endsAt: block.timestamp + _duration,
            state: State.Open,
            totalYesAmount: 0,
            totalNoAmount: 0
        }));
        emit MarketCreated(marketId, _question, block.timestamp + _duration);
    }

    function placeBet(uint256 marketId, bool outcome) public payable {
        require(marketId < markets.length, "Market does not exist");
        Market storage market = markets[marketId];
        require(market.state == State.Open, "Market is not open");
        require(block.timestamp < market.endsAt, "Market has ended");
        require(msg.value > 0, "Bet amount must be greater than 0");

        if (outcome) { // Yes bet
            if (!market.isYesBetter[msg.sender]) {
                market.isYesBetter[msg.sender] = true;
                market.yesBetters.push(msg.sender);
            }
            market.yesBets[msg.sender] += msg.value;
            market.totalYesAmount += msg.value;
        } else { // No bet
            if (!market.isNoBetter[msg.sender]) {
                market.isNoBetter[msg.sender] = true;
                market.noBetters.push(msg.sender);
            }
            market.noBets[msg.sender] += msg.value;
            market.totalNoAmount += msg.value;
        }

        emit BetPlaced(marketId, msg.sender, outcome, msg.value);
    }

    function resolveMarket(uint256 marketId, bool winningOutcome) public onlyOwner {
        require(marketId < markets.length, "Market does not exist");
        Market storage market = markets[marketId];
        require(market.state == State.Open, "Market is not open");

        market.state = State.Resolved;
        emit MarketResolved(marketId, winningOutcome);

        uint256 totalPot = market.totalYesAmount + market.totalNoAmount;
        if (totalPot == 0) {
            return; // No bets placed, nothing to do.
        }

        // A 1% fee is sent to the treasury
        uint256 fee = totalPot / 100;
        treasury += fee;
        uint256 distributablePot = totalPot - fee;

        if (winningOutcome) { // Yes wins
            distributeWinnings(distributablePot, market.totalYesAmount, market.yesBetters, market.yesBets);
        } else { // No wins
            distributeWinnings(distributablePot, market.totalNoAmount, market.noBetters, market.noBets);
        }
    }

    function distributeWinnings(uint256 distributablePot, uint256 totalWinningAmount, address[] memory winners, mapping(address => uint256) storage bets) private {
        if (totalWinningAmount == 0) {
            // No winners, pot goes to treasury
            treasury += distributablePot;
            return;
        }

        for (uint i = 0; i < winners.length; i++) {
            address winner = winners[i];
            uint256 betAmount = bets[winner];
            uint256 payout = (betAmount * distributablePot) / totalWinningAmount;
            if (payout > 0) {
                payable(winner).transfer(payout);
                emit PayoutTransferred(winner, payout);
            }
        }
    }

    function withdrawFees() public onlyOwner {
        uint256 amount = treasury;
        require(amount > 0, "No fees to withdraw");
        treasury = 0;
        payable(owner()).transfer(amount);
    }
}
