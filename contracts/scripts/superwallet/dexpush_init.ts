import { ethers } from "hardhat";
import 'dotenv/config'

async function main() {
    let signers = await ethers.getSigners();
    let signer = signers[0];

    console.log(`Testing the counter on L2 blockchain`);
    let DexPush = await ethers.getContractFactory("DexPush", signer)
    let dexPushAddress = "0xE1EA187d652A4496285A971d40bfc346BDf9b854";

    let contract = await DexPush.attach(dexPushAddress);

    // base testnet
    const mailbox = "0x9d4Bdf4c343D4741E29362908f4FAB32b7a3fD83";

    console.log(`Initializing DexPush at ${dexPushAddress} to set MailBox ${mailbox}`);
    let tx = await contract.initialize(mailbox);
    await tx.wait()
    console.log(`Contract is ready to use!`);

    return "done!"
}


main().then(console.log).catch(console.error);