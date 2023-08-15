import {contractNetworks} from "../../../superwallet/lib/deployments";

export const transferParams = {
    to: "0xd1d5b8Ea43f07e5e127D97652C9924Fa6372809a",
    totalAmount: 3,
    sourceAmount: 1,
    destinationNetworkName: "sepolia",
    sourceNetworkName: "goerli",
    swtNetworkName: "opTestnet",

    swtAcc: "0x80Cbc1f7fd60B7026C0088e5eD58Fc6Ce1180141",

    sourceTokenAddr: contractNetworks["goerli"].contracts.SuperWalletTest.address,
    destinationTokenAddr: contractNetworks["sepolia"].contracts.SuperWalletTest.address,
    tokenId: 1,
}