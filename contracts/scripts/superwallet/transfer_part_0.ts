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
import { ethers, network } from "hardhat";
import 'dotenv/config'
import {transferParams} from "./transfer_params";

async function main() {
    // goerli
    let dexPullAddr = "0x854b1CB04296594427db0f7e96bcCBC35a05638B";
    let tokenAddr = transferParams.sourceTokenAddr;
    // base
    // let dexPullAddr = "0x662dDF02cbf5A6CA8aAE237cAE7dC5BBDB06D057";
    // let tokenAddr = transferParams.destinationTokenAddr;

    // 100k SWT
    let totalAmountWei = "0x152D02C7E14AF6800000";

    let signers = await ethers.getSigners();
    let signer = signers[0];

    let SWT = await ethers.getContractFactory("SuperWalletTest", signer)
    let contract = await SWT.attach(tokenAddr);

    console.log(`Approve dex pull to use our tokens`);
    let tx = await contract.approve(dexPullAddr, totalAmountWei);
    console.log(`waiting for confirmation`);
    await tx.wait();
    console.log(`confirmed`);

    return "done!"
}


main().then(console.log).catch(console.error);