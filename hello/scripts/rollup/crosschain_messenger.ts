import optimismSDK from "@eth-optimism/sdk";
import l1Contracts from "./l1";
import {bridges} from "./bridge";

export let getCrossChainMessenger = async function(l1Signer: any, l2Signer: any): Promise<any> {
    return new optimismSDK.CrossChainMessenger({
        bedrock: true,
        contracts: {
            l1: l1Contracts
        },
        bridges: bridges,
        l1ChainId: await l1Signer.getChainId(),
        l2ChainId: await l2Signer.getChainId(),
        l1SignerOrProvider: l1Signer,
        l2SignerOrProvider: l2Signer,
    })
}