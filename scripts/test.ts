

async function main() {
  const [owner] = await ethers.getSigners();

  const MyContract = await ethers.getContractFactory("Dogen");
  const contract = MyContract.attach(
      "0x72D165CDa08dB7984C7ED066Def424B70D4093B7"
  );

  await contract.setIsExcludedFromLimit("0xe49cb5406e00de969caf3d4ff69ab60255a9a96c", true);
  //await contract.enableLimit(true, 20);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});