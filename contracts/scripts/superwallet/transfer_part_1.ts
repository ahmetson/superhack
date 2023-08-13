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
import 'dotenv/config';
import {transferParams} from "./transfer_params";
import {contractNetworks, PushChain} from "../../../superwallet/lib/deployments";

// Sets the SuperWallet chain about a transaction.
async function main() {
    let dexPushAddress = contractNetworks[PushChain].contracts.DexPush.address;

    // 2
    let destAmountWei = "0x1BC16D674EC80000";
    // 1
    // let sourceAmountWei = "0xDE0B6B3A7640000";
    let sourceAmountWei = "0x00";

    let signers = await ethers.getSigners();
    let signer = signers[0];

    console.log(`Sending a transaction to the DexPush about a new message`);

    let DexPush = await ethers.getContractFactory("DexPush", signer)
    let contract = await DexPush.attach(dexPushAddress);

    const baseDomain = parseInt(contractNetworks["sepolia"].chainId);
    const goerliDomain = parseInt(contractNetworks["goerli"].chainId);

    console.log(`All data prepared. Let's create a Safe account and prepare the transaction to send on destination`);

    console.log(`Sending a transaction to the SuperWallet...`);
    let tx = await contract["transferToken"](
        goerliDomain,
        transferParams.tokenId,
        baseDomain,
        sourceAmountWei,
        destAmountWei,
        transferParams.to,
        "0x01",
        "0x01",
    )
    console.log(`waiting for the confirmation: ${tx.hash}`);
    await tx.wait();
    console.log(`dex push received the message`);

    return "done!"
}


main().then(console.log).catch(console.error);