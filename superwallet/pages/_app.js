import '../styles/globals.css'
import {useEffect, useState} from "react";
import {getContractInfo, getContracts, SupportedNetworks} from "../lib/deployments";
import {Tokens} from "../lib/token";
import {Account} from "../lib/account";
import {ethers} from "ethers";

function MyApp({ Component, pageProps }) {
  const [networks, setNetworks] = useState(undefined);
  const [balance0, setBalance0] = useState(0.0);
  const [balance1, setBalance1] = useState(0.0);

  let token0 = "SuperWalletTest";
  let token1 = "TestToken";

  useEffect(() => {
    console.log(`Loading the balances`);

    let asyncFunc = async () => {
      let oldNetworks = networks;

      console.log(`Async state entered`);
      if (oldNetworks === undefined) {
        oldNetworks = SupportedNetworks();
        setNetworks(oldNetworks);
      }

      console.log("network parameters loaded");

      for (let i in Tokens) {
        let contractInfo = getContractInfo(Tokens[i].name);
        Tokens[i].contracts = getContracts(contractInfo, oldNetworks);
      }

      console.log(`Contract instances were loaded`);

      let totalBalance0 = 0;
      let totalBalance1 = 0;
      for (let i in Tokens) {
        let token = Tokens[i];
        console.log(`Get the balance of: '${token.symbol}', amount of token instances: `, Object.keys(token.contracts).length);

        for (let networkName in token.contracts) {
          console.log(`Get Token ${token.symbol} balance in ${networkName}`);
          let contract = token.contracts[networkName];

          let addr = Account[networkName];

          console.log(`user account: ${addr}`);

          let wei = await contract.balanceOf(addr);
          let eth = parseFloat(ethers.utils.formatEther(wei))

          if (token.name === token0) {
            totalBalance0 += eth;
          } else {
            totalBalance1 += eth;
          }

          console.log(`Token balances: 0=${totalBalance0}, 1=${totalBalance1}`);
        }
      }

      console.log(`Update the state: 0=${totalBalance0}, 1=${totalBalance1}`);

      if (totalBalance1 > 0) {
        setBalance1(totalBalance1);
      }
      if (totalBalance0 > 0) {
        setBalance0(totalBalance0);
      }
    }

    asyncFunc().then(() => {
      console.log(`Loading the balance finished`);
    }).catch(console.error);
  });

  return <Component {...pageProps} balance0={balance0} balance1={balance1} />
}

export default MyApp
