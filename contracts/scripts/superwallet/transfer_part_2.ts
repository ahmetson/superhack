/**
 * Scenario:
 *
 * User wants to transfer 3 SWT token.
 * 2 tokens are on destination.
 * 1 token is on another chain.
 *
 * Need to transfer it.
 */

// Registers the DexPulls
import { ethers } from "hardhat";
import 'dotenv/config'
import {transferParams} from "./transfer_params";
import {contractNetworks} from "../../../superwallet/lib/deployments";

// call it from source
async function main() {
    let dexPullAddr = contractNetworks["goerli"].contracts.DexPull.address;
    let tokenAddr = transferParams.sourceTokenAddr;

    // 1
    let sourceAmountWei = "0xDE0B6B3A7640000";

    let signers = await ethers.getSigners();
    let signer = signers[0];

    console.log(`Sending a transaction to the DexPush about a new message`);

    let DexPull = await ethers.getContractFactory("DexPull", signer)
    let contract = await DexPull.attach(dexPullAddr);

    console.log(`Sending a transaction to the Source...`);
    let tx = await contract["transferToken"](sourceAmountWei, tokenAddr)

    return "done!"
}


main().then(console.log).catch(console.error);