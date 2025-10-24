const MarketAbi = [
  {
    inputs: [
      { internalType: 'uint256', name: 'marketId', type: 'uint256' },
      { internalType: 'uint8', name: 'outcome', type: 'uint8' }
    ],
    name: 'resolve',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'uint256', name: 'marketId', type: 'uint256' },
      { indexed: false, internalType: 'uint8', name: 'outcome', type: 'uint8' }
    ],
    name: 'MarketResolved',
    type: 'event'
  }
];

export default MarketAbi;
