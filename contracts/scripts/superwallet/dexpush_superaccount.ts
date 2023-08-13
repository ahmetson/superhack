import { ethers } from "hardhat";
import 'dotenv/config'
import {contractNetworks, PushChain} from "../../../superwallet/lib/deployments";

async function main() {
    let signers = await ethers.getSigners();
    let signer = signers[0];

    let DexPush = await ethers.getContractFactory("DexPush", signer)
    let dexPushAddress = contractNetworks[PushChain].contracts.DexPush.address;

    let contract = await DexPush.attach(dexPushAddress);

    // unsafe
    const sepoliaSafeAddr = signer.address;
    const goerliSafeAddr = signer.address;
    const swtAddr = signer.address; // same as on metamask

    const sepoliaDomain = parseInt(contractNetworks["sepolia"].chainId);
    const goerliDomain = parseInt(contractNetworks["goerli"].chainId);

    console.log(`Setting ${swtAddr} as super account in source ${sepoliaDomain}...`);
    let tx = await contract.setSuperAccount(swtAddr, sepoliaDomain, sepoliaSafeAddr);

    console.log(`Setting ${swtAddr} as super account in destination ${goerliDomain}...`);
    let tx2 = await contract.setSuperAccount(swtAddr, goerliDomain, goerliSafeAddr);

    console.log(`waiting...${tx.hash}`);
    console.log(`waiting...${tx2.hash}`);
    await Promise.all([tx, tx2])
    console.log(`Done!`);

    return "done!"
}


main().then(console.log).catch(console.error);