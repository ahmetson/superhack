import {
    Fab,
    Grid,
    TextField,
    Typography
} from "@mui/material";

import {Container} from "@mui/system";
import {ReactNode, useEffect, useState} from "react";
import {Button, MenuItem} from "@mui/base";

export default function SendLayout({symbol, handleClose}){
    return  <Container sx={{position: "fixed", width: "100%", height: "100%"}}>
        <Fab color="secondary" aria-label="close" onClick={() => handleClose("")}
             sx={{ position: "fixed", top: "1em", right: "1em", zIndex: 2000 }}>Close</Fab>
        <Typography variant="h4" component="h6">
            Send: <strong>{symbol}</strong>
        </Typography>
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <TextField
                    id="send-network-label"
                    select
                    label="Network"
                    defaultValue="baseNetwork"
                    helperText="Please select destination network"
                    disabled={true}
                >
                    <MenuItem key={"baseNetwork"} value={"baseNetwork"}>Base Network</MenuItem>
                    <MenuItem key={"goerli"} value={"goerli"}>Goerli</MenuItem>
                </TextField>
            </Grid>
            <Grid item xs={12}>
                <TextField id="send-receipt" label="Receipt" variant="filled" />
            </Grid>
            <Grid item xs={12}>
                <TextField id="send-amount" type={"number"} label="Amount" variant="filled" />
            </Grid>
            <Grid item xs={12}>
                <Button>Send</Button>
            </Grid>
        </Grid>
    </Container>
}