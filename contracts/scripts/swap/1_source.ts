// Adding a liquidity starts in one of the side chains.
import { ethers, network } from "hardhat";
import 'dotenv/config'
import {Params} from "./params";
import {contractNetworks} from "../../../superwallet/lib/deployments";

// Call is source and destination chains.
// it approves the DexPull to transfer user's tokens
async function main() {
    if (network.name != Params.source) {
        throw `You can call it from pool.source only`;
    }

    // address _token0, uint32 _token1, uint32 _destination, uint _amountIn, bool isToken0

    let token0 = Params.token0 as string;
    let token1 = Params.tokenId;
    let destination = parseInt(contractNetworks[Params.destination].chainId) as number;
    let amountIn = ethers.parseEther(Params.amountIn.toString());
    let isToken0 = true

    let dexPullAddr = contractNetworks[network.name].contracts.DexPull.address;


    let signers = await ethers.getSigners();
    let signer = signers[0];

    let contract = await ethers.getContractAt("DexPull", dexPullAddr, signer)

    console.log(`Swapping from goerli to sepolia ${dexPullAddr}..`, contract);
    let tx = await contract.swap(token0, token1, destination, amountIn, isToken0);
    console.log(`waiting for confirmation ${tx.hash}...`);
    await tx.wait();
    console.log(`confirmed`);

    return "done!"
}


main().then(console.log).catch(console.error);