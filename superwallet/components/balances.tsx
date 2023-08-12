import Avatar from '@mui/material/Avatar';
import {Account} from "../lib/account";
import {Fade, IconButton, List, ListItem, ListItemAvatar, ListItemText, Typography} from "@mui/material";

import {Tokens} from '../lib/token';
import {Container} from "@mui/system";
import {useEffect, useState} from "react";
import {SupportedNetworks, getContractInfo, getContracts} from "../lib/deployments/index";
import {ethers} from "ethers";
import SendLayout from "./send_layout";

export default function Balances(){
    const [balance0, setBalance0] = useState(0.0);
    const [balance1, setBalance1] = useState(0.0);
    const [sendingToken, setSendingToken] = useState("");

    let token0 = "SuperWalletTest";
    let token1 = "TestToken";

    useEffect(() => {
        console.log(`Loading the balances`);

        let asyncFunc = async () => {
            console.log(`Async state entered`);
            const networks = await SupportedNetworks();

            console.log("network parameters loaded");

            for (let i in Tokens) {
                let contractInfo = getContractInfo(Tokens[i].name);
                Tokens[i].contracts = getContracts(contractInfo, networks);
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

                    if (token.name == token0) {
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
    }, []);

    function handleSend(tokenSymbol: string) {
        setSendingToken(tokenSymbol);
    }

    return  <Container>
            <Typography variant="h4" component="h6">
                Balances:
            </Typography>
             <List>
                <ListItem
                  secondaryAction={
                    <IconButton edge="end" aria-label="send" onClick={() => handleSend(Tokens[0].symbol)}>Send</IconButton>
                  }
                >
                    <ListItemAvatar>
                    <Avatar>
                        {Tokens[0].symbol}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={balance0}
                  />
                </ListItem>
                 <ListItem
                     secondaryAction={
                         <IconButton edge="end" aria-label="send" onClick={() => handleSend(Tokens[1].symbol)}>Send</IconButton>
                     }
                 >
                     <ListItemAvatar>
                         <Avatar>{Tokens[1].symbol}</Avatar>
                     </ListItemAvatar>
                     <ListItemText
                         primary={balance1}
                     />
                 </ListItem>
             </List>
            <Fade in={sendingToken.length > 0}>{SendLayout({symbol: sendingToken, handleClose: handleSend})}</Fade>
        </Container>
}