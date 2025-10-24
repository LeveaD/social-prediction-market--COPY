import { ethers } from 'ethers';
import MarketAbi from '../contracts/MarketAbi';

const RPC_URL = process.env.RPC_URL || '';
const PRIVATE_KEY = process.env.PRIVATE_KEY || '';
const CONTRACT_ADDRESS = process.env.MARKET_CONTRACT_ADDRESS || '';

const abi: any = MarketAbi;

export async function postOutcomeToChain(marketId: number, outcome: number | string) {
  if (!RPC_URL || !PRIVATE_KEY || !CONTRACT_ADDRESS) {
    throw new Error('RPC_URL, PRIVATE_KEY and MARKET_CONTRACT_ADDRESS must be set');
  }

  // normalize outcome: accept 'yes'|'no' or numeric
  let outcomeNum: number;
  if (typeof outcome === 'string') {
    const s = outcome.toLowerCase();
    if (s === 'yes') outcomeNum = 1; else if (s === 'no') outcomeNum = 2; else outcomeNum = Number(outcome);
  } else {
    outcomeNum = Number(outcome);
  }

  if (![1, 2].includes(outcomeNum)) throw new Error('outcome must be 1 (Yes) or 2 (No)');

  const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

  const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, wallet);

  // call resolve(marketId, outcome)
  const tx = await contract.resolve(marketId, outcomeNum);
  await tx.wait();
  return tx;
}
