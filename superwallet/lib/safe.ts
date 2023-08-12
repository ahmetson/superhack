// @ts-ignore
import Safe, {ContractNetworksConfig, EthersAdapter, SafeAccountConfig, SafeFactory} from "@safe-global/protocol-kit";
import SafeApiKit from '@safe-global/api-kit'
import {ethers} from 'ethers';
// import { ContractNetworksConfig } from '@safe-global/protocol-kit'
import {ContractNetworkConfig} from "@safe-global/protocol-kit/dist/src/types";
import {OperationType, SafeTransactionDataPartial, TransactionOptions} from "@safe-global/safe-core-sdk-types";
import {ContractInfo, getSuperWalletInfoAt} from "./deployments";
const l1Rpc = process.env.NEXT_PUBLIC_L1_RPC!;
const privateKey = process.env.NEXT_PUBLIC_PRIVATE_KEY!;

// @ts-ignore
const web3Provider = new ethers.providers.JsonRpcProvider(l1Rpc);
console.log(`private key: ${privateKey}`);
// @ts-ignore
const signer = new ethers.Wallet(privateKey, web3Provider)
console.log(`signer: ${signer.address}`);

const txServiceUrl = process.env.NEXT_PUBLIC_L1_SAFE_TX_RPC;

const ethAdapter = new EthersAdapter({
    ethers,
    signerOrProvider: signer,
});

export const getSafeFactory = async() => {
    const safeFactory = await SafeFactory.create({ethAdapter})
    return safeFactory
};

export const createSafe = async() => {
    console.log(`Creating a new safe factory`);
    let factory = await getSafeFactory();

    const safeAccountConfig: SafeAccountConfig = {
        owners: [signer.address],
        threshold: 1,
    }

    let sdk = await factory.deploySafe({safeAccountConfig});
    let addr = await sdk.getAddress()

    return addr;
}

export const getSafeInfo = async(safeAddress: string)=> {
    let safe = await Safe.create({ethAdapter, safeAddress});
    let addr = await safe.getAddress()
    let nonce = await safe.getNonce();
    let chainId = await safe.getChainId();
    let deployed = await safe.isSafeDeployed();
    return {
        addr,
        nonce,
        chainId,
        deployed,
    }
}

export const getNonce = async(safeAddress: string) => {
    const safeService = new SafeApiKit({txServiceUrl, ethAdapter})
    const chainId = await ethAdapter.getChainId()

    const nonce = await safeService.getNextNonce(safeAddress)
    console.log(`The chain ${chainId} safe address ${safeAddress} nonce: ${nonce}`);

    return nonce
}

export const isDeployed = async(safeAddress: string) => {
    let {deployed} = await getSafeInfo(safeAddress);
    return deployed;
}

const loadContract = (info: ContractInfo): ethers.utils.Interface => {
    return new ethers.utils.Interface(info.abi);
}

export const createTx = async(to: string, amount: number, safeAddress?: string) => {
    if (safeAddress.length == 0) {
        safeAddress = "0x9aA406F08c02c33E3377a38d543d9C284E0fa6A6";
    }

    const chainId = await ethAdapter.getChainId()
    let swtInfo = getSuperWalletInfoAt(chainId.toString());
    if (!swtInfo) {
        throw `no super wallet info at ${chainId}`;
    }
    let swt = loadContract(swtInfo);

    let value = ethers.utils.parseEther(amount.toString()).toHexString();

    // https://github.com/ethers-io/ethers.js/issues/826
    // safe sdk requires etherjs v5.
    //
    // https://ethereum.stackexchange.com/questions/116761/how-to-send-erc20-erc721-tokens-using-safe-core-sdk
    let data = swt.encodeFunctionData("transfer", [to, value]);

    let safe = await Safe.create({ethAdapter, safeAddress});

    console.log(`send ${value} ETH to ${to}`);

    // @ts-ignore
    let txParams: SafeTransactionDataPartial = {
        to: swtInfo.address,
        value: "0",
        data: data,
        operation: OperationType.Call,
    }

    console.log(`Creating a transaction to ${amount} SWT. SWT address on ${chainId} is ${swtInfo.address}`, txParams);

    let safeTx = await safe.createTransaction({safeTransactionData: txParams})
    const txHash = await safe.getTransactionHash(safeTx)
    console.log(`sign the transaction (${txHash}): `, safeTx);
    const signedSafeTx = await safe.signTransactionHash(txHash)
    console.log(`signed tx: `, signedSafeTx.data);

    console.log(`approving the submitted transaction: ${txHash}`);
    const txResponse = await safe.approveTransactionHash(txHash)
    console.log(`pushed to the network, waiting for the confirmation`);
    await txResponse.transactionResponse?.wait()
    console.log(`transaction was approved on block #`, txResponse.transactionResponse.blockNumber)
    console.log(`execute the tx`);
    let txOptions: TransactionOptions = {

    }

    const execResponse = await safe.executeTransaction(safeTx)
    console.log(`waiting for finishing`);
    const contractReceipt = await execResponse.transactionResponse.wait()

    console.log('Transaction executed.')
    console.log('- Transaction hash:', contractReceipt?.transactionHash)

    return txHash;
}

// const contractNetworks: ContractNetworksConfig = {
//     [chainId.toString()]: {
//         safeMasterCopyAddress: safeAddress,
//         safeProxyFactoryAddress:
//             deployments.getProxyFactoryDeployment({network: chainId.toString()}).networkAddresses[chainId.toString()],
//         multiSendAddress:
//             deployments.getMultiSendDeployment({network: chainId.toString()}).networkAddresses[chainId.toString()],
//         multiSendCallOnlyAddress:
//             deployments.getMultiSendCallOnlyDeployment({network: chainId.toString()}).networkAddresses[chainId.toString()],
//         fallbackHandlerAddress:
//             deployments.getFallbackHandlerDeployment({network: chainId.toString()}).networkAddresses[chainId.toString()],
//         signMessageLibAddress:
//             deployments.getSignMessageLibDeployment({network: chainId.toString()}).networkAddresses[chainId.toString()],
//         createCallAddress:
//             deployments.getCreateCallDeployment({network: chainId.toString()}).networkAddresses[chainId.toString()],
//         simulateTxAccessorAddress:
//             deployments.getSimulateTxAccessorDeployment({network: chainId.toString()}).networkAddresses[chainId.toString()],
//     }
// }
export const getSafeFactoryCustomNetwork = async(chainId: string, contractNetwork: ContractNetworkConfig): Promise<SafeFactory> => {
    const contractNetworks: ContractNetworksConfig = {
    [chainId]: contractNetwork,
    }
    const safeFactory = await SafeFactory.create({ ethAdapter, contractNetworks })

    return safeFactory
}