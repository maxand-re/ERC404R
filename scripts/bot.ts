import * as fs from "fs";

// import {ethers} from "ethers";

const UNISWAP_ROUTER_ADDRESS = "0x5A8e4e0dD630395B5AFB8D3ac5b3eF269f0c8356";

async function main() {
    await buyRandomAmount();
}

async function buyRandomAmount() {
    const [w1, w2, w3, w4, w5] = await ethers.getSigners();

    const amounts = [
        10n * 10n ** 18n,
        50n * 10n ** 18n,
        100n * 10n ** 18n
    ];

    // get one of the amounts randomly
    const randomIndex = Math.floor(Math.random() * amounts.length);
    const amount = amounts[randomIndex];

    const wallet = Math.random() < 0.5 ? w1 : w2;
    console.log(`Buying for ${amount/10n**18n} $DEGEN with ${wallet.address}...`);
    await buy(wallet, amount);
    console.log(`Bought for ${amount/10n**18n} $DEGEN with ${wallet.address}!`);

    // Recall after 1-8 minutes
    const randomMinutes = Math.floor(Math.random() * 8) + 1;
    const delay = randomMinutes * 60 * 1000;
    console.log(`Waiting ${randomMinutes}min(s)...`);
    setTimeout(async () => await buyRandomAmount(), delay);
}

async function buy(wallet: any, amount: bigint) {
    //const amountIn = 1n * 10n**18n;
    const path = [
        "0xEb54dACB4C2ccb64F8074eceEa33b5eBb38E5387",
        "0x72D165CDa08dB7984C7ED066Def424B70D4093B7"
    ];
    const deadline = Math.floor(Date.now() / 1000) + 60 * 20;
    const amountOutMin = 0;
    const to = wallet.address;

    const router = new ethers.Contract(
        UNISWAP_ROUTER_ADDRESS,
        [
            'function getAmountsOut(uint amountIn, address[] memory path) public view returns (uint[] memory amounts)',
            'function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)',
            'function swapExactTokensForTokensSupportingFeeOnTransferTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)',
            'function swapExactETHForTokensSupportingFeeOnTransferTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable',
            'function swapExactTokensForETHSupportingFeeOnTransferTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external',
            'function swapETHForExactTokens(uint amountOut, address[] calldata path, address to, uint deadline) external  payable returns (uint[] memory amounts)'
        ],
        wallet
    );

    await router.swapExactETHForTokensSupportingFeeOnTransferTokens(
        amountOutMin,
        path,
        to,
        deadline,
        {value: amount, from: wallet.address}
    );
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});