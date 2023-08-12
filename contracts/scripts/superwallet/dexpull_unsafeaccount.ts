import { ethers, network } from "hardhat";
import 'dotenv/config'
import {contractNetworks} from "../../../superwallet/lib/deployments";

async function setUnsafeAccounts() {
    let signers = await ethers.getSigners();
    let signer = signers[0];

    let DexPull = await ethers.getContractFactory("DexPull", signer)

    let addr = contractNetworks[network.name].contracts.DexPull.address;

    let contract = await DexPull.attach(addr);

    // unsafe
    const swtAddr = signer.address; // same as on metamask

    console.log(`The ${swtAddr} set as unsafe`);

    // all accounts are same
    let tx = await contract.setUnsafe(swtAddr, true,{gasPrice: "2000000000"});
    console.log(`waiting...${tx.hash}`);
    await tx.wait()

    return "done!"
}

setUnsafeAccounts().then(console.log).catch(console.error);