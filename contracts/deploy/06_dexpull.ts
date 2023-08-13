import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';
import {contractNetworks, PushChain} from "../../superwallet/lib/deployments";
import {getMailbox} from "../scripts/mailbox";

// https://docs.hyperlane.xyz/docs/resources/addresses
const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const {deployments, getNamedAccounts, network} = hre;
    const {deploy} = deployments;

    const {deployer} = await getNamedAccounts();

    // Sepolia DexPush parameters
    const pushDomain = parseInt(contractNetworks[PushChain].chainId);
    const pushAddr = contractNetworks[PushChain].contracts.DexPush.address as string;
    const mailbox = getMailbox(network.name);

    console.log(`Deployer: ${deployer}, Mailbox: ${mailbox}, PushDex: ${pushDomain}, ${pushAddr}`);

    await deploy('DexPull', {
        from: deployer,
        args: [mailbox, pushAddr, pushDomain],
        log: true,
        // gasPrice and gasLimit are required by base network.
        gasPrice: "2000000000", //https://eth-converter.com/ use it to convert Gwei to Wei
        autoMine: true, // speed up deployment on local network (ganache, hardhat), no effect on live networks
    });
};
export default func;
func.tags = ['DexPull'];