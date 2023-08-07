import optimismSDK from "@eth-optimism/sdk";
import { ethers } from "hardhat";
import 'dotenv/config'
import l1 from "./rollup/l1";

const appName = process.env.APP
const l1Url = process.env.L1_RPC
const l2Url = process.env.L2_RPC
const privateKey = process.env.PRIV_KEY

let l1Provider = new ethers.providers.JsonRpcProvider(l1Url)
let l2Provider = new ethers.providers.JsonRpcProvider(l2Url)
let l1Signer = new ethers.Wallet(privateKey).connect(l1Provider)
let l2Signer = new ethers.Wallet(privateKey).connect(l2Provider)

console.log(`Hello World! App name: ${appName}`);


async function showBalances() {

    let balances1 = [
        await l1Provider.getBalance(l1Signer.address),
        await l2Provider.getBalance(l1Signer.address)
    ]

    console.log(`The '${l1Signer.address}' balance:`)
    console.log(`\tL1: ${balances1[0]/1e18} ETH`);
    console.log(`\tL2: ${balances1[1]/1e18} ETH`);
}

showBalances().then(console.log);