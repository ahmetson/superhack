import Avatar from '@mui/material/Avatar';
import {Account} from "../lib/account";
import {IconButton, List, ListItem, ListItemAvatar, ListItemText, Typography} from "@mui/material";

import {Tokens} from '../lib/token';
import {Container} from "@mui/system";

export default function Balances(){
    return  <Container>
            <Typography variant="h4" component="h6">
                Balances:
            </Typography>
             <List>
                <ListItem
                  secondaryAction={
                    <IconButton edge="end" aria-label="send">Send</IconButton>
                  }
                >
                    <ListItemAvatar>
                    <Avatar>
                        {Tokens[0].symbol}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="0.0"
                  />
                </ListItem>
                 <ListItem
                     secondaryAction={
                         <IconButton edge="end" aria-label="send">Send</IconButton>
                     }
                 >
                     <ListItemAvatar>
                         <Avatar>{Tokens[1].symbol}</Avatar>
                     </ListItemAvatar>
                     <ListItemText
                         primary="0.0"
                     />
                 </ListItem>
             </List>
        </Container>
}