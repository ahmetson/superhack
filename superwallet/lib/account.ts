export const Account = {
    opTestnet: `0xEFe21201bdC8B3c2a659008F5806CE33eBC4dE45`,     // safe address
    sepolia: "0x80Cbc1f7fd60B7026C0088e5eD58Fc6Ce1180141",          // eoa address
    goerli: "0x07E5439921305486DF2505268349424E3886b647"    // safe address
}
export const getSwtPrivateKey = () => {
    return process.env.NEXT_PUBLIC_PRIVATE_KEY
}

