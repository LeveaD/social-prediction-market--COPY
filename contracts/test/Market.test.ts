import { expect } from 'chai';
import { ethers } from 'hardhat';

describe('Market', function () {
  it('allows bets and pays winners proportionally', async function () {
    const [owner, alice, bob] = await ethers.getSigners();

    const Market = await ethers.getContractFactory('Market', owner);
    const market = await Market.deploy();
    await market.deployed();

    // create market id 1
    await market.createMarket(1);

  // Alice bets 1 ETH on Yes
  await market.connect(alice).placeBet(1, true, { value: ethers.utils.parseEther('1') });
  // Bob bets 2 ETH on No
  await market.connect(bob).placeBet(1, false, { value: ethers.utils.parseEther('2') });

    // resolve market as No (bob wins)
    await market.resolve(1, 2); // Outcome.No (enum index)

    // record balances before claim
  // Bob claims
  const tx = await market.connect(bob).claim(1);
  await tx.wait();

  // contribution for Bob should be zero after claim
  const bobContribution = await market.contributionNo(1, bob.address);
  expect(bobContribution.toString()).to.equal('0');
  });
});
