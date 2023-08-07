import { ethers } from "hardhat";
import 'dotenv/config'

const l2Url = process.env.L2_RPC
const privateKey = process.env.PRIV_KEY

let l2Provider = new ethers.providers.JsonRpcProvider(l2Url)
let l2Signer = new ethers.Wallet(privateKey).connect(l2Provider)

async function main() {
    console.log(`Testing the counter on L2 blockchain`);
    let Counter = await ethers.getContractFactory("Counter", l2Signer)
    let counterAddress = "0x412d1e5D144E8437F791BBF273105c1F3bFb4f74";

    let contract = await Counter.attach(counterAddress);

    let counter = await contract.counter()

    console.log(`Counter: ${counter}`);

    console.log(`Incrementing counter...`);
    let tx = await contract.inc();
    await tx.wait()
    console.log(`Incremented, recheck it!`);

    counter = await contract.counter()
    console.log(`Counter: ${counter}`);

    return "done!"
}


main().then(console.log).catch(console.error);