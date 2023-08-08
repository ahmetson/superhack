import {CrossChainMessenger} from "@eth-optimism/sdk";
import l1Contracts from "./l1";
import {bridges} from "./bridge";

export let getCrossChainMessenger = function(l1ChainId: number, l2ChainId: number, l1Signer: any, l2Signer: any): any {
    return new CrossChainMessenger({
        bedrock: true,
        contracts: {
            l1: l1Contracts
        },
        bridges: bridges,
        l1ChainId: l1ChainId,
        l2ChainId: l2ChainId,
        l1SignerOrProvider: l1Signer,
        l2SignerOrProvider: l2Signer,
    })
}