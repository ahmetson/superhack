// Adding a liquidity starts in one of the side chains.
import { ethers, network } from "hardhat";
import 'dotenv/config'
import {Pool} from "./pool";
import {contractNetworks} from "../../../superwallet/lib/deployments";

// Call is source and destination chains.
// it approves the DexPull to transfer user's tokens
async function main() {
    if (network.name != Pool.source) {
        throw `You can call it from pool.source only`;
    }

    let token0Name = Pool.token0.name
    let token0 = contractNetworks[Pool.source].contracts[token0Name].address;
    let destination = parseInt(contractNetworks[Pool.destination].chainId);
    let token1 = Pool.token1.id;
    let amount0 = ethers.parseEther(Pool.token0.amount.toString());
    let amount1 = ethers.parseEther(Pool.token1.amount.toString());


    let dexPullAddr = contractNetworks[network.name].contracts.DexPull.address;


    let signers = await ethers.getSigners();
    let signer = signers[0];

    let DexPull = await ethers.getContractFactory("DexPull", signer)
    let contract = await DexPull.attach(dexPullAddr);

    // address _token0, uint32 _destination, uint32 _token1, uint _amount0, uint _amount1

    console.log(`Add liquidity...`);
    let tx = await contract.addLiquidity(token0, destination, token1, amount0, amount1, {gasPrice: "2000000000"});
    console.log(`waiting for confirmation ${tx.hash}...`);
    await tx.wait();
    console.log(`confirmed`);

    return "done!"
}


main().then(console.log).catch(console.error);