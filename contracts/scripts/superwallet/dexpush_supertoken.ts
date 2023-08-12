// This account sets a super user
import { ethers } from "hardhat";
import 'dotenv/config'
async function main() {
    let signers = await ethers.getSigners();
    let signer = signers[0];

    let DexPush = await ethers.getContractFactory("DexPush", signer)
    let dexPushAddress = "0x2A4D798F023a88Ebff928aE6b89B629C38F3A93b";

    const swt = {
        id: 1,
        goerli: "0x0564C3e8Fe23c5A6220A300c303f41e43D9be9e2",
        base: "0xe40c7856B6D0e1B01dECBF9976BB706B9Cd1229f",
    }


    let contract = await DexPush.attach(dexPushAddress);
    const baseDomain = 84531;
    const goerliDomain = 5;

    console.log(`Setting ${swt.id} token in source ${baseDomain}...`);
    let tx = await contract.setSuperToken(swt.id, baseDomain, swt.base);
    console.log(`waiting...${tx.hash}`);
    await tx.wait()
    console.log(`Done!`);
    console.log(`Setting ${swt.id} token in destination ${goerliDomain}...`);
    let tx2 = await contract.setSuperToken(swt.id, goerliDomain, swt.goerli);
    console.log(`waiting...${tx2.hash}`);
    await tx2.wait()
    console.log(`Done!`);
    console.log(`User is now a super user (SU) in unix terms`);

    return "done!"
}


main().then(console.log).catch(console.error);