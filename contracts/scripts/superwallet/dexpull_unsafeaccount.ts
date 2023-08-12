// This account sets a super user
import { ethers } from "hardhat";
import 'dotenv/config'
async function main() {
    let signers = await ethers.getSigners();
    let signer = signers[0];

    let DexPull = await ethers.getContractFactory("DexPull", signer)

    const dexPulls = {
        goerli: "0x854b1CB04296594427db0f7e96bcCBC35a05638B",
        base: "0x662dDF02cbf5A6CA8aAE237cAE7dC5BBDB06D057",
    }
    let contract = await DexPull.attach(dexPulls["base"]);

    // unsafe
    const swtAddr = "0x80Cbc1f7fd60B7026C0088e5eD58Fc6Ce1180141"; // same as on metamask

    // all accounts are same
    let tx = await contract.setUnsafe(swtAddr, true,{gasPrice: "2000000000"});
    console.log(`waiting...${tx.hash}`);
    await tx.wait()

    return "done!"
}


main().then(console.log).catch(console.error);