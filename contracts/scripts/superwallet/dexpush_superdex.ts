// Registers the DexPulls
import { ethers } from "hardhat";
import 'dotenv/config'
import sepolia from "../../../superwallet/lib/deployments/sepolia";
import goerli from "../../../superwallet/lib/deployments/goerli";
import baseTestnet from "../../../superwallet/lib/deployments/baseTestnet";

async function main() {
    let signers = await ethers.getSigners();
    let signer = signers[0];

    let DexPush = await ethers.getContractFactory("DexPush", signer)
    let dexPushAddress = sepolia.contracts.DexPush.address;

    let contract = await DexPush.attach(dexPushAddress);
    const baseDomain = parseInt(baseTestnet.chainId);
    const goerliDomain = parseInt(goerli.chainId);

    console.log(`Setting dex pull of base(${baseDomain})...`);
    let tx = await contract.setSuperDex(baseDomain, baseTestnet.contracts.DexPull.address);
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