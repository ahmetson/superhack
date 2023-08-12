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
import Safe, {EthersAdapter} from "@safe-global/protocol-kit";
import {OperationType, SafeTransactionDataPartial} from "@safe-global/safe-core-sdk-types";

export const transferParams = {
    to: "0xd1d5b8Ea43f07e5e127D97652C9924Fa6372809a",
    totalAmount: 3,
    sourceAmount: 1,
    destinationNetworkName: "baseTestnet",
    sourceNetworkName: "goerli",
    swtNetworkName: "sepolia",

    swtAcc: "0x80Cbc1f7fd60B7026C0088e5eD58Fc6Ce1180141",

    sourceTokenAddr: "0x0564C3e8Fe23c5A6220A300c303f41e43D9be9e2",
    destinationTokenAddr: "0xe40c7856B6D0e1B01dECBF9976BB706B9Cd1229f",
    tokenId: 1,
}

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