export const Networks = {
    baseTestnet: {},
    goerli: {},
    sepolia: {}
}
export const PushChain = "sepolia"

export const SupportedNetworks = () => {
    let networks = {};

    for (let name in Networks) {
        if (name != PushChain) {
            networks[name] = networks[name];
        }
    }

    return networks;
}


