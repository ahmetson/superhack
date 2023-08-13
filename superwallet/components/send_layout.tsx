// import {
//     Fab,
//     Grid,
//     TextField,
//     Typography
// } from "@mui/material";
//
// import {Box, Container} from "@mui/system";
// import {useState} from "react";
// import {Button, MenuItem, Modal} from "@mui/material";
// import CloseIcon from '@mui/icons-material/Close';
// import {PushChain} from "../lib/deployments";
// import {ethers} from "ethers";
//
//
//
// // Reference to encode transactions:
// //
// // https://github.com/ethers-io/ethers.js/issues/826
// // safe sdk requires etherjs v5.
// //
// // https://ethereum.stackexchange.com/questions/116761/how-to-send-erc20-erc721-tokens-using-safe-core-sdk
// // const createTx = async(desNetwork: string, sourceNetwork: string, to: string, totalAmount: number, token, networks) => {
// //     let destSafe = networks[desNetwork].safeAccount;
// //     let tokenInterface = token.contracts[desNetwork].interface as ethers.utils.Interface;
// //     let dexPush = networks[PushChain].dex;
// //     let dest = networks[desNetwork];
// //     let source = networks[sourceNetwork];
// //     let sourceDexPull = source.dex;
// //
// //     ////////////////////////////////////////////////////////////////////
// //     //
// //     // initialize transaction parameters
// //     //
// //     ////////////////////////////////////////////////////////////////////
// //     let totalAmountWei = ethers.utils.parseEther(totalAmount.toString()).toHexString();
// //     let sourceAmount = totalAmount - 2;
// //     if (sourceAmount <= 0) {
// //         alert("set 3 or more as amount and make sure destination safe has 2 tokens")
// //         return;
// //     }
// //     let sourceAmountWei = ethers.utils.parseEther(sourceAmount.toString()).toHexString();
// //
// //     let data = tokenInterface.encodeFunctionData("transfer", [to, totalAmountWei]);
// //
// //     console.log(`send ${totalAmountWei} ${token.address} to ${to}`);
// //
// //     ////////////////////////////////////////////////////////////////////
// //     //
// //     // if you uncommented code below, this piece should be executed after.
// //     //
// //     ////////////////////////////////////////////////////////////////////
// //     // @ts-ignore
// //     let txParams: SafeTransactionDataPartial = {
// //         to: token.address,
// //         value: "0",
// //         data: data,
// //         operation: OperationType.Call,
// //     }
// //     let destSafeTx = await destSafe.createTransaction({safeTransactionData: txParams})
// //     let destSafeSigs = destSafeTx.encodedSignatures();
// //
// //     console.log(`Creating a transaction to ${totalAmount}`, txParams);
// //
// //     /**
// //      *  uint32 source,              // we should receive message from this blockchain about token deduction
// //      *         uint32 tokenId,          // of the tokens from the user in this blockchain.
// //      *         uint32 destination,         // we should send message to here about token transfer
// //      *         uint256 amount,
// //      *         address safeParamTo,             // safe sdk part to which smartcontract it needs to be send
// //      *         bytes calldata safeParamData,     // safe sdk the transaction parameters
// //      *         bytes calldata safeSignatures
// //      */
// //
// //     console.log(`Sending a transaction to the SuperWallet...`);
// //     let tx = await dexPush.functions.transferToken(
// //         source.chainId,
// //         token.id,
// //         dest.chainId,
// //         sourceAmountWei,
// //         txParams.to,
// //         data,
// //         destSafeSigs,
// //     )
// //     console.log(`waiting for the confirmation`);
// //     await tx.wait();
// //     console.log(`dex push received the message`);
// //
// //
// //     let sourceToken = token.contracts[sourceNetwork];
// //     let apprTx = await sourceToken.approve(sourceDexPull.address, totalAmountWei);
// //     console.log(`waiting for confirmation of approval`);
// //     await apprTx.wait();
// //     console.log(`dexpull approved to take tokens`);
// //
// //     let sourceTx = await sourceDexPull.transferToken(sourceAmountWei, sourceToken.address);
// //     console.log(`waiting confirmation in the source...`);
// //     await sourceTx.wait();
// //     console.log(`source confirmed`);
// //
// //     ////////////////////////////////////////////////////////////////////
// //     //
// //     // when a threshold set to 2, enable the code below
// //     //
// //     ////////////////////////////////////////////////////////////////////
// //     /*const txHash = await destSafe.getTransactionHash(destSafeTx)
// //     console.log(`sign the transaction (${txHash}): `, destSafeTx);
// //     const signedSafeTx = await destSafe.signTransactionHash(txHash)
// //     console.log(`signed tx: `, signedSafeTx.data);
// //
// //     console.log(`approving the submitted transaction: ${txHash}`);
// //     const txResponse = await destSafe.approveTransactionHash(txHash);
// //     console.log(`pushed to the network, waiting for the confirmation`);
// //     await txResponse.transactionResponse?.wait()
// //     console.log(`transaction was approved on block #`, txResponse.transactionResponse.blockNumber)
// //     console.log(`execute the tx`);
// //
// //     // it's done by the dexpush.
// //     const execResponse = await destSafe.executeTransaction(destSafeTx)
// //     console.log(`waiting for finishing`);
// //     const contractReceipt = await execResponse.transactionResponse.wait()
// //
// //     console.log('Transaction executed.')
// //     console.log('- Transaction hash:', contractReceipt?.transactionHash)
// //
// //     return txHash;*/
// // }
//
// export default function SendLayout({token, handleClose, networks}){
//     const [sendNetwork, _setSendNetwork] = useState("baseNetwork");
//     const [sendReceipt, setSendReceipt] = useState("");
//     const [sendAmount, setSendAmount] = useState(0.0);
//     const [open, setOpen] = useState(true);
//     const handleOpen = () => setOpen(true);
//
//     let handleSend = () => {
//         if (sendReceipt.length == 0) {
//             alert(`Receipt is empty`);
//             return;
//         }
//         if (sendAmount == 0) {
//             alert(`Amount is empty`);
//             return;
//         }
//
//         // createTx(sendNetwork, "goerli", sendReceipt, sendAmount, token, networks).then(() => {
//         //     console.log(`Finished`);
//         // }).catch((e) => {
//         //     alert(e.toString());
//         // })
//     }
//
//     return (
//
//             <Box sx={{position: "fixed", left: 0, right: 0, top: 0, bottom: 0}}>
//                 <Fab color="secondary" aria-label="close" onClick={() => handleClose("")}
//                      sx={{ position: "fixed", top: "1em", right: "1em", zIndex: 2000 }}><CloseIcon /></Fab>
//                 <Typography variant="h4" component="h6">
//                     Send: <strong>{token.symbol}</strong>
//                 </Typography>
//                 <Grid container spacing={2}>
//                     <Grid item xs={12}>
//                         <TextField
//                             id="send-network-label"
//                             select
//                             label="Network"
//                             defaultValue={sendNetwork}
//                             helperText="Please select destination network"
//                             disabled={true}
//                         >
//                             <MenuItem key={"baseNetwork"} value={"baseNetwork"}>Base Network</MenuItem>
//                             <MenuItem key={"goerli"} value={"goerli"}>Goerli</MenuItem>
//                         </TextField>
//                     </Grid>
//                     <Grid item xs={12}>
//                         <TextField id="send-receipt" value={sendReceipt} onChange={(e) => setSendReceipt(e.target.value)} label="Receipt" variant="filled" />
//                     </Grid>
//                     <Grid item xs={12}>
//                         <TextField id="send-amount" type={"number"} value={sendAmount}  onChange={(e) => setSendAmount(parseFloat(e.target.value))}  label="Amount" variant="filled" />
//                     </Grid>
//                     <Grid item xs={12}>
//                         <Button onClick={handleSend}>Send</Button>
//                     </Grid>
//                 </Grid>
//             </Box>
//     )
// }