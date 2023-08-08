import { ethers, getChainId } from "hardhat";
import {getSigner, greeterAddress, getOpposite, getController} from "./common";
import 'dotenv/config'
import {getCrossChainMessenger} from "../rollup/crosschain_messenger";
import {MessageStatus} from "@eth-optimism/sdk"

async function main() {
    console.log(`Script starts`);
    let chainId = parseInt(await getChainId());
    if (chainId == 11155111) {
        throw `Call this script from L2 network`
    }

    let l2Signer = getSigner(chainId)

    let l1ChainId = getOpposite(chainId)
    let l1GreeterAddr = greeterAddress(l1ChainId)


    console.log(`Testing the greeter on ${l1ChainId} from L2 blockchain (chain id: ${chainId})`);
    let Contract = await ethers.getContractFactory("FromL2_ControlL1Greeter", l2Signer)

    let contract = await Contract.attach(getController(chainId));

    console.log(`Updating the greet...`);
    let tx = await contract.functions.setGreeting(l1GreeterAddr, `greeting from L2 at ${new Date()}`);
    console.log(`Waiting for the confirmation of ${tx.hash}`);
    await tx.wait()
    console.log(`Greeting was updated, recheck it, now submitting it to L1!`);

    //////////////////////////////////////////////////////////////
    //
    // Submitting to L1
    //
    //////////////////////////////////////////////////////////////
    let hash = tx.hash;
    let l1Signer = getSigner(l1ChainId);
    let l2Url = process.env.L2_RPC;
    let crossChainMessenger = getCrossChainMessenger(l1ChainId, chainId, l1Signer, new ethers.providers.JsonRpcProvider(l2Url));

    while (true) {
        console.log(`Check is ready to prove? ${new Date()}`);
        let status = await crossChainMessenger.getMessageStatus(hash);
        if (status == MessageStatus.READY_TO_PROVE) {
            console.log(`Transaction ${hash} is ready to prove`);
            break
        } else {
            console.log(`Transaction status: ${status}, wait for two seconds...`)
        }
        await delay(2000)
    }

    console.log(`Sending prove to L1...`);
    let proveTx = await crossChainMessenger.proveMessage(hash)
    console.log(`Waiting for the confirmation of ${proveTx.hash}`);
    await proveTx.wait()

    while (true) {
        console.log(`Check is ready to prove? ${new Date()}`);
        let status = await crossChainMessenger.getMessageStatus(hash);
        if (status == MessageStatus.READY_FOR_RELAY) {
            console.log(`Transaction ${tx.hash} is ready to relay`);
            break
        } else {
            console.log(`Transaction status: ${status}, wait for two seconds...`)
        }
        await delay(2000)
    }

    console.log(`Transaction is relayed, let's finalize the message`);
    let finalTx = await crossChainMessenger.finalizeMessage(hash)
    console.log(`Waiting for the confirmation of ${finalTx.hash}`);
    await finalTx.wait()

    console.log(`Transaction is submitted`)

    let Greeter = await ethers.getContractFactory("Greeter", l1Signer)

    let l1Greeter = await Greeter.attach(l1GreeterAddr);

    let greeting = await l1Greeter.greet()

    console.log(`Greeting on L1: ${greeting}`);

    return "done!"
}

function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

main().then(console.log).catch(console.error);