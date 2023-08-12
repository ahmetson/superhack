import Avatar from '@mui/material/Avatar';
import {Account} from "../lib/account";
import {PushChain} from "../lib/deployments/index";
import {Chip, Divider} from "@mui/material";

export default function AppBar(){
    let swtAddr = Account[PushChain];

    return <>
        <Chip
            avatar={<Avatar alt={"Random picture"} src={"https://i.pravatar.cc/128"} sx={{ width: 56, height: 56 }}></Avatar>}
            label={swtAddr}
            variant="outlined"
        />
        <Divider sx={{"margin-bottom": "2em", "margin-top": "1em"}} />
    </>
}