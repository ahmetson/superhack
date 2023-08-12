import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';

// https://docs.hyperlane.xyz/docs/resources/addresses
const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const {deployments, getNamedAccounts} = hre;
    const {deploy} = deployments;

    const {deployer} = await getNamedAccounts();

    console.log(`Deployer: ${deployer}`);

    // goerli
    const mailbox = "0xCC737a94FecaeC165AbCf12dED095BB13F037685";
    // base testnet
    // const mailbox = "0x9d4Bdf4c343D4741E29362908f4FAB32b7a3fD83";
    // base is where our DexPush is sitting
    const pushDomain = 84531;
    const pushAddr = "0xE1EA187d652A4496285A971d40bfc346BDf9b854";
    // sepolia
    // const mailbox = "0xCC737a94FecaeC165AbCf12dED095BB13F037685";

    await deploy('DexPull', {
        from: deployer,
        args: [mailbox, pushAddr, pushDomain],
        log: true,
        autoMine: true, // speed up deployment on local network (ganache, hardhat), no effect on live networks
    });
};
export default func;
func.tags = ['DexPull'];