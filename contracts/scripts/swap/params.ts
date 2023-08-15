import {contractNetworks} from "../../../superwallet/lib/deployments";

export const Params = {
    to: "0xd1d5b8Ea43f07e5e127D97652C9924Fa6372809a",
    amountIn: 2,
    destination: "sepolia",
    source: "goerli",
    swt: "opTestnet",

    token0: contractNetworks["goerli"].contracts.SuperWalletTest.address,

    swtAcc: "0x80Cbc1f7fd60B7026C0088e5eD58Fc6Ce1180141",

    sourceTokenAddr: contractNetworks["goerli"].contracts.SuperWalletTest.address,
    destinationTokenAddr: contractNetworks["sepolia"].contracts.SuperWalletTest.address,
    tokenId: 2,
}