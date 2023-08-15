// Registers the DexPulls in DexPush
import { ethers } from "hardhat";
import 'dotenv/config'
import {PushChain, contractNetworks} from "../../../superwallet/lib/deployments";
import goerli from "../../../superwallet/lib/deployments/goerli";
import sepolia from "../../../superwallet/lib/deployments/sepolia";

async function main() {
    let signers = await ethers.getSigners();
    let signer = signers[0];

    let DexPush = await ethers.getContractFactory("DexPush", signer)
    let dexPushAddress = contractNetworks[PushChain].contracts.DexPush.address;

    let contract = await DexPush.attach(dexPushAddress);
    const baseDomain = parseInt(sepolia.chainId);
    const goerliDomain = parseInt(goerli.chainId);

    console.log(`Setting dex pull of base(${baseDomain})...`);
    let tx = await contract.setSuperDex(baseDomain, sepolia.contracts.DexPull.address);
    console.log(`Setting dex pull of goerli(${goerliDomain})...`);
    let tx2 = await contract.setSuperDex(goerliDomain, goerli.contracts.DexPull.address);

    console.log(`waiting...${tx2.hash}`);
    console.log(`waiting...${tx.hash}`);
    await Promise.all([tx, tx2])

    console.log(`Done!`);
    console.log(`Now DexPush knows the pulls`);

    return "done!"
}


main().then(console.log).catch(console.error);