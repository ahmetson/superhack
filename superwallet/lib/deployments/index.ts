import sepolia from './sepolia'
import goerli from './goerli'
import opTestnet from "./opTestnet";

import {ethers} from "ethers";
import {getSwtPrivateKey} from "../account";

// all supported networks
// and their smartcontract artifacts
export let contractNetworks = {sepolia, opTestnet, goerli};

let pullName = "DexPull";
let pushName = "DexPush";

export type Network = {
    name: string;
    chainId: number;
    domain: number;
    rpc: string;
    provider?: ethers.providers.JsonRpcProvider;
    account?: ethers.Wallet;
    txServiceUrl?: string;  // only for pulls
    dex?: ethers.Contract;
}

export const Networks: {[key: string]: Network} = {
    "opTestnet": {
        chainId: 0,
        domain: 0,
        name: "opTestnet",
        rpc: process.env.NEXT_PUBLIC_OP_RPC,
        txServiceUrl: "",
    },
    "goerli": {
        chainId: 0,
        domain: 0,
        name: "goerli",
        rpc: process.env.NEXT_PUBLIC_GOERLI_RPC,
        txServiceUrl: "",
    },
    "sepolia": {
        chainId: 0,
        domain: 0,
        name: "sepolia",
        rpc: process.env.NEXT_PUBLIC_SEPOLIA_RPC,
        txServiceUrl: '',
    }
}
export const PushChain = "opTestnet";

// config sync during the building
for (let name in contractNetworks) {
    let contractNetwork = contractNetworks[name];
    if (!Networks.hasOwnProperty(contractNetwork.name)) {
        throw `contractNetwork ${contractNetwork.name} not in the Networks list`;
    } else {
        Networks[contractNetwork.name].chainId = parseInt(contractNetwork.chainId);
        Networks[contractNetwork.name].domain = parseInt(contractNetwork.chainId);
    }
}

export type ContractInfo = {
    networkName: string;
    chainId: string;
    address: string;
    abi: ethers.utils.Interface;
}

// Returns all instances
export function getContractInfo(contractName: string): {[key: string]: ContractInfo} {
    let contracts: {[key: string]: ContractInfo} = {};

    for (const networkName in contractNetworks) {
        if (networkName != contractName)
            continue;

        let network = contractNetworks[networkName];

        contracts[network.name] = {
            networkName: network.name,
            chainId: network.chainId,
            address: network.contracts[contractName].address,
            abi: new ethers.utils.Interface(network.contracts[contractName].abi),
        };
    }

    return contracts;
}

// Loads the instance of the contract
export function getContracts(contractInfo, networks) {
    let contracts = {}

    for (let networkName in contractInfo) {
        let inf = contractInfo[networkName];
        let network = networks[networkName];

        contracts[networkName] = new ethers.Contract(inf.address, inf.abi, network.account);
    }

    return contracts;
}

function getContract(inf: ContractInfo, network: Network) {
    return new ethers.Contract(inf.address, inf.abi, network.account);
}

export function getContractInfoAt(name: string, networkName: string): ContractInfo {
    for (const cName in contractNetworks) {
        let network = contractNetworks[cName];
        if (network.name === networkName) {
            return {
                networkName: network.name,
                chainId: network.chainId,
                address: network.contracts[name].address,
                abi: new ethers.utils.Interface(network.contracts[name].abi),
            }
        }
    }

    return undefined;
}

export function getSuperWalletInfoAt(chainId: string): ContractInfo {
    for (const networkName in contractNetworks) {
        let network = contractNetworks[networkName];
        if (network.chainId === chainId) {
            return {
                networkName: network.name,
                chainId: network.chainId,
                address: network.contracts["SuperWalletTest"].address,
                abi: new ethers.utils.Interface(network.contracts["SuperWalletTest"].abi),
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

        if (name != PushChain) {
            let inf = getContractInfoAt(pullName, name);
            Networks[name].dex = getContract(inf, Networks[name]) as ethers.Contract;
        } else {
            let inf = getContractInfoAt(pushName, name);
            Networks[name].dex = getContract(inf, Networks[name]) as ethers.Contract;
        }
    }

    return Networks;
}



