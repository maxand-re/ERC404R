

async function main() {
  const [owner] = await ethers.getSigners();

  const contract = await ethers.deployContract("Dogen", []);

  await contract.waitForDeployment();

  console.log(`${JSON.stringify(contract)}`)
  console.log(`Deployed at ${contract.address}`)
  console.log(`Deployed at ${contract.target}`)
  console.log(`Deployed at ${JSON.stringify(contract.target ?? '')}`)
  console.log(`Deployed at ${JSON.stringify(contract.address ?? '')}`)
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});