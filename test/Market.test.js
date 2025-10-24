
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PredictionMarket", function () {
  let PredictionMarket, predictionMarket, Reputation, reputation, owner, addr1, addr2, addr3;

  beforeEach(async function () {
    [owner, addr1, addr2, addr3] = await ethers.getSigners();

    // Deploy Reputation contract
    Reputation = await ethers.getContractFactory("Reputation");
    reputation = await Reputation.deploy();
    await reputation.deployed();

    // Deploy PredictionMarket contract
    PredictionMarket = await ethers.getContractFactory("PredictionMarket");
    predictionMarket = await PredictionMarket.deploy(reputation.address);
    await predictionMarket.deployed();
  });

  describe("Market Creation", function () {
    it("Should allow the owner to create a market", async function () {
      const question = "Will ETH reach $5000 by end of year?";
      const duration = 60 * 60 * 24 * 30; // 30 days
      const block = await ethers.provider.getBlock('latest');
      await expect(predictionMarket.createMarket(question, duration))
        .to.emit(predictionMarket, "MarketCreated")
        .withArgs(0, question, block.timestamp + duration + 1);
      
      const market = await predictionMarket.markets(0);
      expect(market.question).to.equal(question);
      expect(market.state).to.equal(0); // 0 = Open
    });

    it("Should not allow non-owners to create a market", async function () {
      const question = "Another question";
      const duration = 60 * 60 * 24;
      await expect(predictionMarket.connect(addr1).createMarket(question, duration))
        .to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  describe("Bet Placement", function () {
    beforeEach(async function () {
      await predictionMarket.createMarket("Test Market", 60 * 60);
    });

    it("Should allow users to place a 'Yes' bet and update total", async function () {
      const betAmount = ethers.utils.parseEther("1.0");
      await expect(predictionMarket.connect(addr1).placeBet(0, true, { value: betAmount }))
        .to.emit(predictionMarket, "BetPlaced")
        .withArgs(0, addr1.address, true, betAmount);

      const market = await predictionMarket.markets(0);
      expect(market.totalYesAmount).to.equal(betAmount);
    });

    it("Should allow users to place a 'No' bet and update total", async function () {
        const betAmount = ethers.utils.parseEther("0.5");
        await expect(predictionMarket.connect(addr2).placeBet(0, false, { value: betAmount }))
          .to.emit(predictionMarket, "BetPlaced")
          .withArgs(0, addr2.address, false, betAmount);
  
        const market = await predictionMarket.markets(0);
        expect(market.totalNoAmount).to.equal(betAmount);
      });

    it("Should not allow bets on non-existent markets", async function () {
      const betAmount = ethers.utils.parseEther("1.0");
      await expect(predictionMarket.connect(addr1).placeBet(1, true, { value: betAmount }))
        .to.be.revertedWith("Market does not exist");
    });
  });

  describe("Market Resolution and Payouts", function () {
    let addr1InitialBalance, addr2InitialBalance, addr3InitialBalance;

    beforeEach(async function () {
      await predictionMarket.createMarket("Payout Test", 60 * 60);
      // addr1 and addr2 bet YES
      await predictionMarket.connect(addr1).placeBet(0, true, { value: ethers.utils.parseEther("1.0") });
      await predictionMarket.connect(addr2).placeBet(0, true, { value: ethers.utils.parseEther("2.0") });
      // addr3 bets NO
      await predictionMarket.connect(addr3).placeBet(0, false, { value: ethers.utils.parseEther("3.0") });

      addr1InitialBalance = await ethers.provider.getBalance(addr1.address);
      addr2InitialBalance = await ethers.provider.getBalance(addr2.address);
      addr3InitialBalance = await ethers.provider.getBalance(addr3.address);
    });

    it("Should correctly distribute payouts when 'Yes' wins", async function () {
      const totalPot = ethers.utils.parseEther("6.0");
      const fee = totalPot.div(100);
      const distributablePot = totalPot.sub(fee);
      const totalYesAmount = ethers.utils.parseEther("3.0");

      await predictionMarket.resolveMarket(0, true); // Yes wins

      const addr1Payout = distributablePot.mul(ethers.utils.parseEther("1.0")).div(totalYesAmount);
      const addr2Payout = distributablePot.mul(ethers.utils.parseEther("2.0")).div(totalYesAmount);

      expect(await ethers.provider.getBalance(addr1.address)).to.be.closeTo(addr1InitialBalance.add(addr1Payout), ethers.utils.parseEther("0.001"));
      expect(await ethers.provider.getBalance(addr2.address)).to.be.closeTo(addr2InitialBalance.add(addr2Payout), ethers.utils.parseEther("0.001"));
      expect(await ethers.provider.getBalance(addr3.address)).to.equal(addr3InitialBalance); // Loser gets nothing back

      expect(await predictionMarket.treasury()).to.equal(fee);
    });

    it("Should send the entire pot to treasury if there are no winners", async function () {
        await predictionMarket.createMarket("No Winner Test", 60 * 60);
        await predictionMarket.connect(addr1).placeBet(1, true, { value: ethers.utils.parseEther("1.0") });
        
        const initialTreasury = await predictionMarket.treasury();
        await predictionMarket.resolveMarket(1, false); // No wins, but only Yes bets were placed

        const totalPot = ethers.utils.parseEther("1.0");
        const fee = totalPot.div(100);
        const distributablePot = totalPot.sub(fee);

        expect(await predictionMarket.treasury()).to.equal(initialTreasury.add(fee).add(distributablePot));
    });

    it("Should allow owner to withdraw fees", async function () {
        await predictionMarket.resolveMarket(0, true); // Resolve to generate fees
        const feeAmount = await predictionMarket.treasury();
        const ownerInitialBalance = await ethers.provider.getBalance(owner.address);

        const tx = await predictionMarket.withdrawFees();
        const receipt = await tx.wait();
        const gasUsed = receipt.gasUsed.mul(tx.gasPrice);

        const ownerFinalBalance = await ethers.provider.getBalance(owner.address);
        expect(ownerFinalBalance).to.equal(ownerInitialBalance.add(feeAmount).sub(gasUsed));
    });
  });
});
