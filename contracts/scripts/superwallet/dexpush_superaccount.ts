// This account sets a super user
import { ethers } from "hardhat";
import 'dotenv/config'
async function main() {
    let signers = await ethers.getSigners();
    let signer = signers[0];

    let DexPush = await ethers.getContractFactory("DexPush", signer)
    let dexPushAddress = "0xB1A9a37543fB8919B17f0707d00857c6855BBDBf";

    let contract = await DexPush.attach(dexPushAddress);
    const baseSafeAddr = `0xEFe21201bdC8B3c2a659008F5806CE33eBC4dE45`;
    const swtAddr = "0x80Cbc1f7fd60B7026C0088e5eD58Fc6Ce1180141"; // same as on metamask
    const goerliSafeAddr = "0x07E5439921305486DF2505268349424E3886b647";
    const baseDomain = 84531;
    const goerliDomain = 5;

    console.log(`Setting ${swtAddr} as super account in source ${baseDomain}...`);
    let tx = await contract.setSuperAccount(swtAddr, baseDomain, baseSafeAddr);
    console.log(`waiting...${tx.hash}`);
    await tx.wait()
    console.log(`Done!`);
    console.log(`Setting ${swtAddr} as super account in destination ${goerliDomain}...`);
    let tx2 = await contract.setSuperAccount(swtAddr, goerliDomain, goerliSafeAddr);
    console.log(`waiting...${tx2.hash}`);
    await tx2.wait()
    console.log(`Done!`);
    console.log(`User is now a super user (SU) in unix terms`);

    return "done!"
}


main().then(console.log).catch(console.error);