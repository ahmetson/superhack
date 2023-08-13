import Avatar from '@mui/material/Avatar';
import {IconButton, List, ListItem, ListItemAvatar, ListItemText, Modal, Typography} from "@mui/material";

import {Tokens} from '../lib/token';
import {Container} from "@mui/system";
import {useState} from "react";
// import SendLayout from "./send_layout";

export default function Balances({balance0, balance1}){

    const [sendingToken, setSendingToken] = useState("");

    function handleSend(tokenSymbol: string) {
        setSendingToken(tokenSymbol);
    }

    return (<Container>
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
                      <ListItemText primary={balance1} />
           </ListItem>
              </List>
        {/*<Modal*/}
        {/*    open={sendingToken.length > 0}*/}
        {/*    onClose={() => { handleSend(""); }}*/}
        {/*>{*/}
        {/*        SendLayout({*/}
        {/*            token: (sendingToken == Tokens[0].symbol ? Tokens[0] : Tokens[1]),*/}
        {/*            handleClose: handleSend,*/}
        {/*            networks: networks})}</Modal>*/}
    </Container>)
}