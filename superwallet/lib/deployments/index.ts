import sepolia from './sepolia'
import goerli from './goerli'
import op from './420'
import base from './baseTestnet'
import zora from './999'

// all supported networks
let networks = [sepolia, op, base, zora, goerli];

export type ContractInfo = {
    networkName: string;
    chainId: string;
    address: string;
    abi: any;
}

export function getContractInfo(contractName): Array<ContractInfo> {
    let contracts: Array<ContractInfo> = [];

    for (const network of networks) {
        if (!network.contracts.hasOwnProperty(contractName))
            continue;

        contracts.push({
            networkName: network.name,
            chainId: network.chainId,
            address: network.contracts[contractName].address,
            abi: network.contracts[contractName].abi,
        })
    }

    return contracts;
}

export function getSuperWalletInfo(): Array<ContractInfo> {
    return getContractInfo("SuperWalletTest");
}

export function getSuperWalletInfoAt(chainId: string): ContractInfo {
    for (const network of networks) {
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
