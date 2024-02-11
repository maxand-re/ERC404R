import {expect} from "chai"
import hre from "hardhat";
import {loadFixture, time} from "@nomicfoundation/hardhat-network-helpers";

const units = 10n ** 18n;

const deploy = async () => {
    const [owner, bob, alice, max, pair] = await hre.viem.getWalletClients();

    // Deploy
    const contract = await hre.viem.deployContract("Chappie", [owner.account.address]);

    // Add all whitelists and define pair
    await contract.write.setWhitelist([pair.account.address, true])
    await contract.write.setWhitelist([contract.address, true])

    // Transfer the supply to the pair
    await contract.write.transfer([pair.account.address, 4004n * units])
    await contract.write.setUniswapPair([pair.account.address])
    await contract.write.setMintEnabled([true]);

    return { contract, wallets: { owner, bob, alice, max, pair } };
};

describe("Chappie", () => {
    describe("ERC404", () => {
        it("should mint 10 NFT when 10 tokens bought", async () => {
            // GIVEN
            const { contract, wallets } = await loadFixture(deploy);

            // WHERE
            await contract.write.transfer([wallets.bob.account.address, 10n * units], { account: wallets.pair.account }); // BUY

            // THEN
            expect(await contract.read.erc20BalanceOf([wallets.bob.account.address])).to.equal(10n * units);
            expect(await contract.read.erc721BalanceOf([wallets.bob.account.address])).to.equal(10n);
        })

        it("should raise an error if you reached the maxbuy", async () => {
            // GIVEN
            const { contract, wallets } = await loadFixture(deploy);

            // WHERE
            await contract.write.transfer([wallets.bob.account.address, 100n * units], { account: wallets.pair.account }); // BUY

            try {
                await contract.write.transfer([wallets.bob.account.address, 1n * units], { account: wallets.pair.account }); // BUY
            } catch (e) {
                console.log("Expected")
            }

            // THEN
            expect(await contract.read.erc20BalanceOf([wallets.bob.account.address])).to.equal(100n * units);
            expect(await contract.read.erc721BalanceOf([wallets.bob.account.address])).to.equal(100n);
        })

        it("should be able to transfer 1 NFT and transferring 1 token at the same time", async () => {
            // GIVEN
            const { contract, wallets } = await loadFixture(deploy);

            // WHERE
            await contract.write.transfer([wallets.bob.account.address, 10n * units], { account: wallets.pair.account }); // BUY
            await contract.write.transferFrom([wallets.bob.account.address, wallets.alice.account.address, 2n], { account: wallets.bob.account });

            // THEN
            expect(await contract.read.erc20BalanceOf([wallets.alice.account.address])).to.equal(1n * units);
            expect(await contract.read.erc20BalanceOf([wallets.bob.account.address])).to.equal(9n * units);
            expect(await contract.read.erc721BalanceOf([wallets.bob.account.address])).to.equal(9n);
            expect(await contract.read.erc721BalanceOf([wallets.alice.account.address])).to.equal(1n);
            expect(await contract.read.owned([wallets.alice.account.address])).to.contain(2n);
            expect(await contract.read.owned([wallets.bob.account.address])).to.not.contain(2n);
        })
    })

    describe("Rewards", () => {
        it("should taking 5 percent fees for selling only", async () => {
            // GIVEN
            const { contract, wallets } = await loadFixture(deploy);
            const amountSell = 10n * units;
            const feesPercentage = 5;

            // WHERE
            await contract.write.setRewardFees([feesPercentage], { account: wallets.owner.account });
            await contract.write.transfer([wallets.bob.account.address, amountSell], { account: wallets.pair.account }); // BUY
            await contract.write.transfer([wallets.pair.account.address, amountSell], { account: wallets.bob.account }); // SELL

            // THEN
            expect(await contract.read.erc20BalanceOf([contract.address])).to.equal(amountSell * 5n / 100n);
            expect(await contract.read.erc20BalanceOf([wallets.bob.account.address])).to.equal(0n);
        });

        it("should get the right rewards shares", async () => {
            // GIVEN
            const { contract, wallets } = await loadFixture(deploy);
            const amountSell = 10n * units;
            const feesPercentage = 5;

            // WHERE
            await contract.write.setRewardFees([feesPercentage], { account: wallets.owner.account });
            await contract.write.transfer([wallets.bob.account.address, amountSell + 10n * units], { account: wallets.pair.account }); // BOB BUY
            await contract.write.transfer([wallets.alice.account.address, 10n * units], { account: wallets.pair.account }); // ALICE BUY
            await contract.write.transfer([wallets.max.account.address, 10n * units], { account: wallets.pair.account }); // MAX BUY
            await contract.write.transfer([wallets.pair.account.address, amountSell], { account: wallets.bob.account }); // BOB SELL 10 tokens

            // THEN
            expect(await contract.read.getRewardsShares([wallets.bob.account.address])).to.equal(333333n);
            expect(await contract.read.getRewardsShares([wallets.alice.account.address])).to.equal(333333n);
            expect(await contract.read.getRewardsShares([wallets.max.account.address])).to.equal(333333n);
        });

        it("should get the estimated rewards", async () => {
            // GIVEN
            const { contract, wallets } = await loadFixture(deploy);
            const amountSell = 10n * units;
            const feesPercentage = 5;

            // WHERE
            await contract.write.setRewardFees([feesPercentage], { account: wallets.owner.account });
            await contract.write.transfer([wallets.bob.account.address, amountSell + 10n * units], { account: wallets.pair.account }); // BOB BUY
            await contract.write.transfer([wallets.alice.account.address, 10n * units], { account: wallets.pair.account }); // ALICE BUY
            await contract.write.transfer([wallets.max.account.address, 10n * units], { account: wallets.pair.account }); // MAX BUY
            await contract.write.transfer([wallets.pair.account.address, amountSell], { account: wallets.bob.account }); // BOB SELL 10 tokens

            await time.increase(84600);

            await contract.write.calculateRewards([wallets.bob.account.address], { account: wallets.bob.account });

            const pool = await contract.read.erc20BalanceOf([contract.address]);
            const shares = (pool * 20n / 100n) * 333333n / 1000000n;

            // THEN
            expect(await contract.read.getEstimatedRewards([wallets.bob.account.address])).to.equal(shares);
            expect(await contract.read.getEstimatedRewards([wallets.alice.account.address])).to.equal(shares);
            expect(await contract.read.getEstimatedRewards([wallets.max.account.address])).to.equal(shares);
        });

        it("should have great calculation", async () => {
            // GIVEN
            const { contract, wallets } = await loadFixture(deploy);
            const amountSell = 10n * units;
            const feesPercentage = 5;

            // WHERE
            await contract.write.setRewardFees([feesPercentage], { account: wallets.owner.account });
            await contract.write.transfer([wallets.bob.account.address, amountSell + 10n * units], { account: wallets.pair.account }); // BOB BUY
            await contract.write.transfer([wallets.alice.account.address, 10n * units], { account: wallets.pair.account }); // ALICE BUY
            await contract.write.transfer([wallets.max.account.address, 10n * units], { account: wallets.pair.account }); // MAX BUY
            await contract.write.transfer([wallets.pair.account.address, amountSell], { account: wallets.bob.account }); // BOB SELL 10 tokens

            await time.increase(84600);

            await contract.write.calculateRewards([wallets.bob.account.address], { account: wallets.bob.account });
            await contract.write.calculateRewards([wallets.alice.account.address], { account: wallets.alice.account });
            await contract.write.calculateRewards([wallets.max.account.address], { account: wallets.max.account });

            const pool = await contract.read.erc20BalanceOf([contract.address]);
            const shares = (pool * 20n / 100n) * 333333n / 1000000n;

            // THEN
            expect(await contract.read.calculatedRewards([wallets.bob.account.address])).to.equal(shares);
            expect(await contract.read.calculatedRewards([wallets.alice.account.address])).to.equal(shares);
            expect(await contract.read.calculatedRewards([wallets.max.account.address])).to.equal(shares);
        });

        it("should claim the right calculation", async () => {
            // GIVEN
            const { contract, wallets } = await loadFixture(deploy);
            const amountSell = 10n * units;
            const feesPercentage = 5;

            // WHERE
            await contract.write.setRewardFees([feesPercentage], { account: wallets.owner.account });
            await contract.write.transfer([wallets.bob.account.address, amountSell + 10n * units], { account: wallets.pair.account }); // BOB BUY
            await contract.write.transfer([wallets.alice.account.address, 10n * units], { account: wallets.pair.account }); // ALICE BUY
            await contract.write.transfer([wallets.max.account.address, 10n * units], { account: wallets.pair.account }); // MAX BUY
            await contract.write.transfer([wallets.pair.account.address, amountSell], { account: wallets.bob.account }); // BOB SELL 10 tokens

            await time.increase(84600);

            const pool = await contract.read.erc20BalanceOf([contract.address]);
            const shares = (pool * 20n / 100n) * 333333n / 1000000n;

            await contract.write.claim({ account: wallets.bob.account });
            await contract.write.claim({ account: wallets.alice.account });
            await contract.write.claim({ account: wallets.max.account });

            // THEN
            expect(await contract.read.erc20BalanceOf([wallets.bob.account.address])).to.equal(  10n * units + shares);
            expect(await contract.read.erc20BalanceOf([wallets.alice.account.address])).to.equal(10n * units + shares);
            expect(await contract.read.erc20BalanceOf([wallets.max.account.address])).to.equal(  10n * units + shares);
        });

        it("should claim the right calculation (2 days)", async () => {
            // GIVEN
            const { contract, wallets } = await loadFixture(deploy);
            const amountSell = 10n * units;
            const feesPercentage = 5;

            // WHERE
            await contract.write.setRewardFees([feesPercentage], { account: wallets.owner.account });
            await contract.write.transfer([wallets.bob.account.address, amountSell + 10n * units], { account: wallets.pair.account }); // BOB BUY
            await contract.write.transfer([wallets.alice.account.address, 10n * units], { account: wallets.pair.account }); // ALICE BUY
            await contract.write.transfer([wallets.max.account.address, 10n * units], { account: wallets.pair.account }); // MAX BUY
            await contract.write.transfer([wallets.pair.account.address, amountSell], { account: wallets.bob.account }); // BOB SELL 10 tokens

            await time.increase(84600);

            await contract.write.claim({ account: wallets.bob.account });
            await contract.write.claim({ account: wallets.alice.account });

            await time.increase(84600);

            await contract.write.claim({ account: wallets.bob.account });
            await contract.write.claim({ account: wallets.alice.account });
            await contract.write.claim({ account: wallets.max.account });

            // THEN
            expect(await contract.read.erc20BalanceOf([wallets.bob.account.address])).to.equal(  10060029460000000000n);
            expect(await contract.read.erc20BalanceOf([wallets.alice.account.address])).to.equal(10060029460000000000n);
            expect(await contract.read.erc20BalanceOf([wallets.max.account.address])).to.equal(  10059866920000000000n);
        });

        it("should claim the right calculation (40 days without activities)", async () => {
            // GIVEN
            const { contract, wallets } = await loadFixture(deploy);
            const amountSell = 10n * units;
            const feesPercentage = 5;

            // WHERE
            await contract.write.setRewardFees([feesPercentage], { account: wallets.owner.account });
            await contract.write.transfer([wallets.bob.account.address, amountSell + 10n * units], { account: wallets.pair.account }); // BOB BUY
            await contract.write.transfer([wallets.alice.account.address, 10n * units], { account: wallets.pair.account }); // ALICE BUY
            await contract.write.transfer([wallets.max.account.address, 10n * units], { account: wallets.pair.account }); // MAX BUY
            await contract.write.transfer([wallets.pair.account.address, amountSell], { account: wallets.bob.account }); // BOB SELL 10 tokens

            await time.increase(84600);

            await contract.write.claim({ account: wallets.bob.account });
            await contract.write.claim({ account: wallets.alice.account });

            await time.increase(84600 * 40); // 40 days later

            await contract.write.claim({ account: wallets.bob.account });
            await contract.write.claim({ account: wallets.alice.account });
            await contract.write.claim({ account: wallets.max.account });

            // THEN
            expect(await contract.read.erc20BalanceOf([wallets.bob.account.address])).to.equal(  10060029460000000000n);
            expect(await contract.read.erc20BalanceOf([wallets.alice.account.address])).to.equal(10060029460000000000n);
            expect(await contract.read.erc20BalanceOf([wallets.max.account.address])).to.equal(  10059866920000000000n);
        });

        it("should claim the right calculation (10 days with activities)", async () => {
            // GIVEN
            const { contract, wallets } = await loadFixture(deploy);
            const amountSell = 10n * units;
            const feesPercentage = 5;

            // WHERE
            await contract.write.setRewardFees([feesPercentage], { account: wallets.owner.account });
            await contract.write.transfer([wallets.bob.account.address, amountSell + 10n * units], { account: wallets.pair.account }); // BOB BUY
            await contract.write.transfer([wallets.alice.account.address, 10n * units], { account: wallets.pair.account }); // ALICE BUY
            await contract.write.transfer([wallets.max.account.address, 10n * units], { account: wallets.pair.account }); // MAX BUY
            await contract.write.transfer([wallets.pair.account.address, amountSell], { account: wallets.bob.account }); // BOB SELL 10 tokens

            for (let i = 0; i < 10; i++) {
                await time.increase(84600);

                if (i % 3 == 0) {
                    await contract.write.transfer([wallets.bob.account.address, 5n * units], { account: wallets.pair.account }); // BOB BUY
                    await contract.write.transfer([wallets.pair.account.address, 5n * units], { account: wallets.bob.account }); // BOB SELL 5 tokens
                }

                await contract.write.claim({ account: wallets.bob.account }); // CLAIM EVERYDAY
            }

            await contract.write.claim({ account: wallets.alice.account }); // ALICE CLAIMED AFTER
            await contract.write.claim({ account: wallets.max.account }); // MAX CLAIMED AFTER

            // THEN
            expect(await contract.read.erc20BalanceOf([wallets.bob.account.address])).to.equal(  10326189367952947200n);
            expect(await contract.read.erc20BalanceOf([wallets.alice.account.address])).to.equal(10317233301213977600n);
            expect(await contract.read.erc20BalanceOf([wallets.max.account.address])).to.equal(  10317233301213977600n);
        });
    })
});
