import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';

// https://docs.hyperlane.xyz/docs/resources/addresses
const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const {deployments, getNamedAccounts} = hre;
    const {deploy} = deployments;

    const {deployer} = await getNamedAccounts();

    console.log(`Deployer: ${deployer}`);

    // opGoerli
    const mailbox = "0xCC737a94FecaeC165AbCf12dED095BB13F037685";
    const paymaster = "0x8f9C3888bFC8a5B25AED115A82eCbb788b196d2a";

    await deploy('DexPush', {
        from: deployer,
        args: [mailbox, paymaster],
        log: true,
        autoMine: true, // speed up deployment on local network (ganache, hardhat), no effect on live networks
    });
};
export default func;
func.tags = ['DexPush'];