import sepolia from './11155111'
import op from './420'
import base from './84531'
import zora from './999'

// all supported networks
let networks = [sepolia, op, base, zora];

export type ContractInfo = {
    networkName: string;
    chainId: string;
    address: string;
    abi: any;
}

export function getSuperWalletInfo(): Array<ContractInfo> {
    let contracts: Array<ContractInfo> = [];

    for (const network of networks) {
        contracts.push({
            networkName: network.name,
            chainId: network.chainId,
            address: network.contracts.SuperWalletTest.address,
            abi: network.contracts.SuperWalletTest.abi,
        })
    }

    return contracts;
}

export function getSuperWalletInfoAt(chainId: string): ContractInfo {
    for (const network of networks) {
        if (network.chainId === chainId) {
            return {
                networkName: network.name,
                chainId: network.chainId,
                address: network.contracts.SuperWalletTest.address,
                abi: network.contracts.SuperWalletTest.abi,
            }
        }
    }

    return undefined;
}
