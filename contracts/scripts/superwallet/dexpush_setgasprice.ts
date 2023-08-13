import { ethers } from "hardhat";
import 'dotenv/config'
import {PushChain, contractNetworks} from "../../../superwallet/lib/deployments";
import goerli from "../../../superwallet/lib/deployments/goerli";
import sepolia from "../../../superwallet/lib/deployments/sepolia";
import {tokenIdByName} from "../../../superwallet/lib/token";

async function main() {
    let signers = await ethers.getSigners();
    let signer = signers[0];

    let DexPush = await ethers.getContractFactory("DexPush", signer)
    let dexPushAddress = contractNetworks[PushChain].contracts.DexPush.address;

    let gasAmount = 202094;
    let contract = await DexPush.attach(dexPushAddress);

    let tx = await contract.setGasPrice(gasAmount);
    console.log(`waiting...${tx.hash}`);

    return "done!"
}


main().then(console.log).catch(console.error);