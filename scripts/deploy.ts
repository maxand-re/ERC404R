import hre from "hardhat";

async function main() {
  const [owner] = await hre.viem.getWalletClients();

  const contract = await hre.viem.deployContract("Chappie", [owner.account.address]);

  console.log(`Deployed at ${contract.address}`)
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
