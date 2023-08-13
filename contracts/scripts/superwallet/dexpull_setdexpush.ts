import { ethers, network } from "hardhat";
import 'dotenv/config'
import {contractNetworks, PushChain} from "../../../superwallet/lib/deployments";

async function setUnsafeAccounts() {
    let signers = await ethers.getSigners();
    let signer = signers[0];

    let DexPull = await ethers.getContractFactory("DexPull", signer)

    let pushAddress = contractNetworks[PushChain].contracts.DexPush.address;

    let addr = contractNetworks[network.name].contracts.DexPull.address;

    let contract = await DexPull.attach(addr);

    // unsafe
    // all accounts are same
    let tx = await contract.setDexPush(pushAddress, true,{gasPrice: "2000000000"});
    console.log(`waiting...${tx.hash}`);
    await tx.wait()

    return "done!"
}

setUnsafeAccounts().then(console.log).catch(console.error);