import { ethers, getChainId } from "hardhat";
import 'dotenv/config'
import {getType, getSigner, greeterAddress} from "./common";

async function main() {
    console.log(`Script starts`);
    let chainId = parseInt(await getChainId());
    let signer = getSigner(chainId)

    console.log(`Testing the greeter on ${getType(chainId)} blockchain (chain id: ${chainId})`);
    let Greeter = await ethers.getContractFactory("Greeter", signer)

    let contract = await Greeter.attach(greeterAddress(chainId));

    let greeting = await contract.greet()

    console.log(`Greeting: ${greeting}`);

    console.log(`Updating the greet...`);
    let tx = await contract.functions.setGreeting(`greeting you at ${new Date()}`, signer.address);
    await tx.wait()
    console.log(`Greeting was updated, recheck it!`);

    greeting = await contract.greet()
    console.log(`Greeting: ${greeting}`);

    return "done!"
}


main().then(console.log).catch(console.error);