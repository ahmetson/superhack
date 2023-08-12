// Registers the DexPulls
import { ethers } from "hardhat";
import 'dotenv/config'

async function main() {
    let signers = await ethers.getSigners();
    let signer = signers[0];

    let DexPush = await ethers.getContractFactory("DexPush", signer)
    let dexPushAddress = "0xB1A9a37543fB8919B17f0707d00857c6855BBDBf";

    const dexPulls = {
        goerli: "0xCb3B96E8c57E90b8B74959c8475cD3245D02f053",
        base: "0x14eEF697c9b0cE96ed0C06d20EcB338cd7BEA11a",
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