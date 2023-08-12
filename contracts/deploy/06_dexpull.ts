import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';

// https://docs.hyperlane.xyz/docs/resources/addresses
const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const {deployments, getNamedAccounts} = hre;
    const {deploy} = deployments;

    const {deployer} = await getNamedAccounts();

    console.log(`Deployer: ${deployer}`);

    // Sepolia DexPush parameters
    const pushDomain = 11155111;
    const pushAddr = "0xB1A9a37543fB8919B17f0707d00857c6855BBDBf";
    // mailbox in base.
    const mailbox = "0x9d4Bdf4c343D4741E29362908f4FAB32b7a3fD83";
    // mailbox in goerli
    // const mailbox = "";

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