import sepolia from './sepolia'
import goerli from './goerli'
// import op from './420'
// import zora from './999'
import baseTestnet from "./baseTestnet";

import {ethers} from "ethers";
import {getSwtPrivateKey} from "../account";

// all supported networks
let contractNetworks = [sepolia, baseTestnet, goerli];

export const Networks = {
    baseTestnet: {
        name: "baseTestnet",
        rpc: process.env.NEXT_PUBLIC_BASE_RPC,
        provider: undefined,
        account: undefined,
    },
    goerli: {
        name: "goerli",
        rpc: process.env.NEXT_PUBLIC_GOERLI_RPC,
        provider: undefined,
        account: undefined,
    },
    sepolia: {
        name: "sepolia",
        rpc: process.env.NEXT_PUBLIC_SEPOLIA_RPC,
        provider: undefined,
        account: undefined,
    }
}
export const PushChain = "sepolia";

// checking during the deployment
for (let contractNetwork of contractNetworks) {
    if (!Networks.hasOwnProperty(contractNetwork.name)) {
        throw `contractNetwork ${contractNetwork.name} not in the Networks list`;
    }
}

export type ContractInfo = {
    networkName: string;
    chainId: string;
    address: string;
    abi: any;
}

export function getContractInfo(contractName): {[key: string]: ContractInfo} {
    let contracts: {[key: string]: ContractInfo} = {};

    for (const network of contractNetworks) {
        if (!network.contracts.hasOwnProperty(contractName))
            continue;

        contracts[network.name] = {
            networkName: network.name,
            chainId: network.chainId,
            address: network.contracts[contractName].address,
            abi: network.contracts[contractName].abi,
        };
    }

    return contracts;
}

export function getContracts(contractInfo: {[key: string]: ContractInfo}, networks: object) {
    let contracts = {}

    for (let networkName in contractInfo) {
        let inf = contractInfo[networkName];
        let network = networks[networkName];

        contracts[networkName] = new ethers.Contract(inf.address, inf.abi, network.account);
    }

    return contracts;
}

export function getSuperWalletInfo(): Array<ContractInfo> {
    return Object.values(getContractInfo("SuperWalletTest"));
}

export function getSuperWalletInfoAt(chainId: string): ContractInfo {
    for (const network of contractNetworks) {
        if (network.chainId === chainId) {
            return {
                networkName: network.name,
                chainId: network.chainId,
                address: network.contracts["SuperWalletTest"].address,
                abi: network.contracts["SuperWalletTest"].abi,
            }
        }
    }

    return undefined;
}


export const SupportedNetworks = () => {
    const privateKey = getSwtPrivateKey();

    for (let name in Networks) {
        Networks[name].provider = new ethers.providers.JsonRpcProvider(Networks[name].rpc);
        Networks[name].account = new ethers.Wallet(privateKey, Networks[name].provider);
    }

    return Networks;
}



