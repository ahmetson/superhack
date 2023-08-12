import sepolia from './sepolia'
import goerli from './goerli'
// import op from './420'
// import zora from './999'
import baseTestnet from "./baseTestnet";

import {ethers} from "ethers";
import {Account, getSwtPrivateKey} from "../account";
import Safe, {EthersAdapter} from "@safe-global/protocol-kit";

// all supported networks
// and their smartcontract artifacts
export let contractNetworks = {sepolia, baseTestnet, goerli};

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
    safeAdapter?: EthersAdapter;    // only for pulls
    safeAccount?: Safe; // only for pulls
    dex?: ethers.Contract;
}

export const Networks: {[key: string]: Network} = {
    "baseTestnet": {
        chainId: 0,
        domain: 0,
        name: "baseTestnet",
        rpc: process.env.NEXT_PUBLIC_BASE_RPC,
        txServiceUrl: process.env.NEXT_PUBLIC_BASE_TX_SERVICE_RPC,
    },
    "goerli": {
        chainId: 0,
        domain: 0,
        name: "goerli",
        rpc: process.env.NEXT_PUBLIC_GOERLI_RPC,
        txServiceUrl: process.env.NEXT_PUBLIC_GOERLI_TX_SERVICE_RPC,
    },
    "sepolia": {
        chainId: 0,
        domain: 0,
        name: "sepolia",
        rpc: process.env.NEXT_PUBLIC_SEPOLIA_RPC,
        txServiceUrl: '',
    }
}
export const PushChain = "sepolia";

// config sync during the building
for (let contractNetwork of contractNetworks) {
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

    for (const network of contractNetworks) {
        if (!network.contracts.hasOwnProperty(contractName))
            continue;

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
export function getContracts(contractInfo: {[key: string]: ContractInfo}, networks: object) {
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
    for (const network of contractNetworks) {
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
    for (const network of contractNetworks) {
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

export const SupportedNetworks = async () => {
    const privateKey = getSwtPrivateKey();

    for (let name in Networks) {
        Networks[name].provider = new ethers.providers.JsonRpcProvider(Networks[name].rpc);
        Networks[name].account = new ethers.Wallet(privateKey, Networks[name].provider);

        if (name != PushChain) {
            let safeAdapter = new EthersAdapter({
                ethers,
                signerOrProvider: Networks[name].account,
            });

            Networks[name].safeAdapter = safeAdapter;
            Networks[name].safeAccount = await Safe.create({ethAdapter: safeAdapter, safeAddress: Account[name]});

            let inf = getContractInfoAt(pullName, name);
            Networks[name].dex = getContract(inf, Networks[name]) as ethers.Contract;
        } else {
            let inf = getContractInfoAt(pushName, name);
            Networks[name].dex = getContract(inf, Networks[name]) as ethers.Contract;
        }
    }

    return Networks;
}



