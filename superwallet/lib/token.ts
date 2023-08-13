export const Tokens = [
    {symbol: "SWT", "name": "SuperWalletTest", id: 1, contracts: {}},
    {symbol: "TT", "name": "TestToken", id: 2, contracts: {}}
]

export const tokenIdByName = (name: string): number => {
    for (let token of Tokens) {
        if (token.name === name) {
            return token.id
        }
    }
}