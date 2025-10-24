
const hre = require("hardhat");
const fs = require("fs");

async function main() {
  const Reputation = await hre.ethers.getContractFactory("Reputation");
  const reputation = await Reputation.deploy();
  await reputation.deployed();
  console.log("Reputation contract deployed to:", reputation.address);

  const PredictionMarket = await hre.ethers.getContractFactory("PredictionMarket");
  const predictionMarket = await PredictionMarket.deploy(reputation.address);
  await predictionMarket.deployed();
  console.log("PredictionMarket contract deployed to:", predictionMarket.address);

  const contractData = {
    reputation: {
      address: reputation.address,
      abi: JSON.parse(reputation.interface.format("json"))
    },
    predictionMarket: {
      address: predictionMarket.address,
      abi: JSON.parse(predictionMarket.interface.format("json"))
    }
  };

  fs.writeFileSync("frontend/src/contracts.json", JSON.stringify(contractData, null, 2));
  console.log("Contract ABIs and addresses saved to frontend/src/contracts.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
