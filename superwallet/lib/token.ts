import {SupportedNetworks} from '../lib/network';
import {ContractInfo, getContractInfo} from "./deployments";

export const Tokens = [
    {symbol: "TT", "name": "TestToken"},
    {symbol: "SWT", "name": "SuperWalletToken"}
]

export const SupportedTokens = () => {
    let tokens: Array<Array<ContractInfo>> = [];

    for (let token of Tokens) {
        tokens.push(getContractInfo(token.name))
    }

    return tokens;
}

