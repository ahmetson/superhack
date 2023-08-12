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
import {contractNetworks} from "../../../superwallet/lib/deployments";

// Call is source and destination chains.
// it approves the DexPull to transfer user's tokens
async function main() {
    let dexPullAddr = contractNetworks[network.name].contracts.DexPull.address;
    let tokenAddr = contractNetworks[network.name].contracts.SuperWalletTest.address;

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