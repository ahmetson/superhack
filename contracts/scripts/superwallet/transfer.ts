// Registers the DexPulls
import { ethers, network } from "hardhat";
import 'dotenv/config';
import {transferParams} from "./transfer_params";
import {contractNetworks, PushChain} from "../../../superwallet/lib/deployments";

async function main() {
    if (network.name !== PushChain) {
        throw `Call it with --${PushChain}`;
    }

    let destAmountWei = "0x1BC16D674EC80000"; // 2 SWT
    let sourceAmountWei = "0xDE0B6B3A7640000"; // 1 SWT

    let signers = await ethers.getSigners();
    let signer = signers[0];

    console.log(`Sending a transaction to the DexPush about a new message`);

    let queueTx = queueTransfer(signer, sourceAmountWei, destAmountWei);
    if (parseInt(sourceAmountWei, 16) == 0) {
        console.log(`It's one direct, waiting for transaction confirmation`);
        await queueTx.wait();

        return "done";
    }

    console.log(`Calling one source`);
    let sourceTx = sourceTransfer(sourceAmountWei);
    console.log(`Waiting for all transactions`);
    Promise.all([queueTx, sourceTx]).then(() => {
        console.log(`Finished! Your token should be in the destination soon`);
        console.log(`Push: ${queueTx.hash}, Source: ${sourceTx.hash}`);
    }).catch(err => {
        console.error(err);
    });
}

async function sourceTransfer(sourceAmountWei) {
    let tokenAddr = transferParams.sourceTokenAddr;

    let provider = new ethers.JsonRpcProvider(process.env.GOERLI_RPC);
    let signer = new ethers.Wallet(process.env.ADMIN_PRIVATE_KEY, provider);

    let artifact = contractNetworks["goerli"].contracts.DexPull;
    let dexPull = new ethers.Contract(artifact.address, artifact.abi, signer);

    console.log(`Sending a transaction to the Source...`);
    return await dexPull["transferToken"](sourceAmountWei, tokenAddr)
}

async function queueTransfer(signer, sourceAmountWei, destAmountWei) {
    let dexPushAddress = contractNetworks[PushChain].contracts.DexPush.address;
    let DexPush = await ethers.getContractFactory("DexPush", signer)
    let contract = await DexPush.attach(dexPushAddress);

    const destDomain = parseInt(contractNetworks["sepolia"].chainId);
    const sourceDomain = parseInt(contractNetworks["goerli"].chainId);

    console.log(`All data prepared. Let's create a Safe account and prepare the transaction to send on destination`);

    console.log(`Sending a transaction to the SuperWallet...`);
    return await contract["transferToken"](
        sourceDomain,
        transferParams.tokenId,
        destDomain,
        sourceAmountWei,
        destAmountWei,
        transferParams.to,
        "0x01",
        "0x01",
    );
}

main().then(console.log).catch(console.error);