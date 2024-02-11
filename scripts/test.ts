import hre from "hardhat";

async function main() {
  const [owner] = await hre.viem.getWalletClients();

  const contract = await hre.viem.getContractAt("Chappie", "0xF1AA6884c8C44bDdb3Ab9F3F9B8bC93de9336C1E");

  const router = "";
  const pair = "0x214b6490e83f527b733e3fd7970723ff5b91b978";

  // Add all whitelists and define pair
 // await contract.write.setWhitelist([owner.account.address, false])
  //await contract.write.setWhitelist([contract.address, true])
  //await contract.write.setWhitelist([pair, true])
  //await contract.write.setUniswapPair([pair])
  //await contract.write.setMintEnabled([true])

  //await contract.write.setUniswapPair(["0x284ce279A9Fa24C2B1Ed23C3F15EC9575021c709"])
  //await contract.write.approve([router, 4004n * 10n ** 18n], { account: dev2.account })

  // Transfer the supply to the pair
  //await contract.write.transfer([pair.account.address, 4004n * units])

  // Enable mint after pair setted

  //await contract.write.setWhitelist([owner.account.address, false])
  //await contract.write.setWhitelist([pair, true])
  //await contract.write.setWhitelist([contract.address, true])

  //console.log(`${contract.address}`)
  //console.log(`${await contract.read.erc721TokensBankedInQueue()}`)
  //console.log(`${await contract.read.erc20BalanceOf(["0x2cc237Fa42c62466EbB9fBb081418BF3e55Ee5d0"])}`)
  //console.log(`${await contract.read.owned(["0x2cc237Fa42c62466EbB9fBb081418BF3e55Ee5d0"])}`)
  //console.log(`${await contract.read.lastCalculatedDay([contract.address])}`)
  //console.log(`${await contract.read.mintEnabled()}`)
  //console.log(`${await contract.read.owned(["0x530D940E7E266B13729559B41e64CE0727570390"])}`)
  //console.log(`${await contract.read.owned(["0xce7903e0ce9dfd8db4c496a480afd5affde6e562"])}`)
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
