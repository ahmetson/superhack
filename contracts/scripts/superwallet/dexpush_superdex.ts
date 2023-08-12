// Registers the DexPulls
import { ethers } from "hardhat";
import 'dotenv/config'

async function main() {
    let signers = await ethers.getSigners();
    let signer = signers[0];

    let DexPush = await ethers.getContractFactory("DexPush", signer)
    let dexPushAddress = "0x2A4D798F023a88Ebff928aE6b89B629C38F3A93b";

    const dexPulls = {
        goerli: "0x854b1CB04296594427db0f7e96bcCBC35a05638B",
        base: "0x662dDF02cbf5A6CA8aAE237cAE7dC5BBDB06D057",
    }

    let contract = await DexPush.attach(dexPushAddress);
    const baseDomain = 84531;
    const goerliDomain = 5;

    console.log(`Setting dex pull of base(${baseDomain})...`);
    let tx = await contract.setSuperDex(baseDomain, dexPulls.base);
    console.log(`waiting...${tx.hash}`);
    await tx.wait()
    console.log(`Done!`);
    console.log(`Setting dex pull of goerli(${goerliDomain})...`);
    let tx2 = await contract.setSuperDex(goerliDomain, dexPulls.goerli);
    console.log(`waiting...${tx2.hash}`);
    await tx2.wait()
    console.log(`Done!`);
    console.log(`Now DexPush knows the pulls`);

    return "done!"
}


main().then(console.log).catch(console.error);