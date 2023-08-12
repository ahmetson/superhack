import Avatar from '@mui/material/Avatar';
import {Account} from "../lib/account";
import {Chip, Divider, Paper} from "@mui/material";

export default function AppBar(){
    return <>
        <Chip
            avatar={<Avatar alt={"Random picture"} src={"https://i.pravatar.cc/128"} sx={{ width: 56, height: 56 }}></Avatar>}
            label={Account.swtAddr}
            variant="outlined"
        />
        <Divider sx={{"margin-bottom": "2em", "margin-top": "1em"}} />
    </>
}