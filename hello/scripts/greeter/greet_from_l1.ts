import { ethers, getChainId } from "hardhat";
import {getSigner, greeterAddress, getOpposite, getController} from "./common";
import 'dotenv/config'
import {getCrossChainMessenger} from "../rollup/crosschain_messenger";
import {MessageStatus} from "@eth-optimism/sdk"

async function main() {
    console.log(`Script starts`);
    let chainId = parseInt(await getChainId());
    if (chainId != 11155111) {
        throw `Call this script from L1 network`
    }

    let l1Signer = getSigner(chainId)

    let l2ChainId = getOpposite(chainId)
    let l2GreeterAddr = greeterAddress(l2ChainId)
    let l2Signer = getSigner(l2ChainId);


    console.log(`Testing the greeter on ${l2ChainId} from L1 blockchain (chain id: ${chainId})`);
    let Greeter = await ethers.getContractFactory("Greeter", l2Signer)
    let l2Greeter = await Greeter.attach(l2GreeterAddr);
    let greeting = await l2Greeter.greet()
    console.log(`Greeting on L2: ${greeting}`);

    let Contract = await ethers.getContractFactory("FromL1_ControlL2Greeter", l1Signer)

    let contract = await Contract.attach(getController(chainId));

    console.log(`Updating the greet...`);
    let cdm = process.env.L1_CROSS_DOMAIN_MESSENGER;
    let tx = await contract.functions.setGreeting(cdm, l2GreeterAddr, `greeting from L1 at ${new Date()}`);
    console.log(`Waiting for the confirmation of ${tx.hash}`);
    await tx.wait()
    console.log(`Greeting was updated, recheck it, now submitting it to L1!`);

    while (true) {
        let updatedGreeting = await l2Greeter.greet()
        console.log(`Greeting on L2: ${updatedGreeting}`);
        if (updatedGreeting != greeting) {
            console.log(`It was updated!`);
            break
        }

        await delay(5000)
    }

    return "done!"
}

function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

main().then(console.log).catch(console.error);