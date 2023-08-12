import { ethers } from "hardhat";
import 'dotenv/config'
import sepolia from "../../../superwallet/lib/deployments/sepolia";
import goerli from "../../../superwallet/lib/deployments/goerli";
import baseTestnet from "../../../superwallet/lib/deployments/baseTestnet";
import {tokenIdByName} from "../../../superwallet/lib/token";

async function main() {
    let signers = await ethers.getSigners();
    let signer = signers[0];

    let DexPush = await ethers.getContractFactory("DexPush", signer)
    let dexPushAddress = sepolia.contracts.DexPush.address;

    const swt = {
        id: tokenIdByName("SuperWalletTest"),
        goerli: goerli.contracts.SuperWalletTest.address,
        base: baseTestnet.contracts.SuperWalletTest.address,
    }


    let contract = await DexPush.attach(dexPushAddress);
    const baseDomain = parseInt(baseTestnet.chainId);
    const goerliDomain = parseInt(goerli.chainId);

    console.log(`Setting ${swt.id} token in source ${baseDomain}...`);
    let tx = await contract.setSuperToken(swt.id, baseDomain, swt.base);
    console.log(`waiting...${tx.hash}`);
    console.log(`Setting ${swt.id} token in destination ${goerliDomain}...`);

    let tx2 = await contract.setSuperToken(swt.id, goerliDomain, swt.goerli);

    console.log(`waiting...${tx.hash}`);
    console.log(`waiting...${tx2.hash}`);
    Promise.all([tx, tx2]).then(() => {console.log("Done")}).catch(err => {console.error(err)});

    return "done!"
}


main().then(console.log).catch(console.error);