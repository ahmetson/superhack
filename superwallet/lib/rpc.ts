export default {
       111551111: {
           url: process.env.NEXT_PUBLIC_L1_RPC!,
           accounts: [process.env.NEXT_PUBLIC_ADMIN_PRIVATE_KEY!],
        },
    84531: {
            url: "https://1rpc.io/base-goerli",
            accounts: [process.env.NEXT_PUBLIC_ADMIN_PRIVATE_KEY],
    },
    999: {
            url: "https://testnet.rpc.zora.energy",
            accounts: [process.env.NEXT_PUBLIC_ADMIN_PRIVATE_KEY],
        },
    420: {
            url: "https://goerli.optimism.io",
            accounts: [process.env.NEXT_PUBLIC_ADMIN_PRIVATE_KEY],
    }
};
