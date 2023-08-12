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

    // const baseSafeAddr = `0xEFe21201bdC8B3c2a659008F5806CE33eBC4dE45`;
    // const goerliSafeAddr = "0x07E5439921305486DF2505268349424E3886b647";

    // unsafe
    const baseSafeAddr = signer.address;
    const goerliSafeAddr = signer.address;
    const swtAddr = signer.address; // same as on metamask

    const baseDomain = parseInt(baseTestnet.chainId);
    const goerliDomain = parseInt(goerli.chainId);

    console.log(`Setting ${swtAddr} as super account in source ${baseDomain}...`);
    let tx = await contract.setSuperAccount(swtAddr, baseDomain, baseSafeAddr);

    console.log(`Setting ${swtAddr} as super account in destination ${goerliDomain}...`);
    let tx2 = await contract.setSuperAccount(swtAddr, goerliDomain, goerliSafeAddr);

    console.log(`waiting...${tx.hash}`);
    console.log(`waiting...${tx2.hash}`);
    await Promise.all([tx, tx2])
    console.log(`Done!`);

    return "done!"
}


main().then(console.log).catch(console.error);