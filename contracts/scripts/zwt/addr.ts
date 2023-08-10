export type Param = {
    address: string;
    txid: string;
}

// all below are on testnet
const params: {[key: string]: Param} = {
    // sepolia
    111155111: {
        address: "0x4a64f4f3536a8486dDb1A72B641AbA6bFa42b952",
        txid: "0x3e2096319d8e8b7263ca3be96d7223f9088aa19cd5ab058d1a3e48f7218e4d0e",
    },
    // base
    84531: {
        address:"0xe40c7856B6D0e1B01dECBF9976BB706B9Cd1229f",
        txid: "0x4db4ecdb2fc715b80c4dbfe63cb9d6c0e718a30c66774ca783afb917c35daaa4"
    },
    999: {
        address: "0xe40c7856B6D0e1B01dECBF9976BB706B9Cd1229f",
        txid: "0xc76fc73dfe1783013275c026c1e76bee2bd5cfc95140559ba435cbf9fecb6121"
    },
    420: {
        address: "0xe40c7856B6D0e1B01dECBF9976BB706B9Cd1229f",
        txid: "0xacb7d58738e369e6b78b66cf58fef2912433961b9f68c26cb701e60d6f0b0ce0",
    }
}

export default params