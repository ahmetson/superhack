
# Using HyperLane

* [Supported Chains](https://github.com/hyperlane-xyz/hyperlane-monorepo/blob/main/typescript/sdk/src/consts/chainMetadata.ts) &ndash; list of supported networks
* [Addresses](https://github.com/hyperlane-xyz/hyperlane-monorepo/blob/main/rust/config/testnet_config.json)

Build the hyperlane from mono-repo.

Then, let's run the validator and relayer.
I followed the [local setup](https://docs.hyperlane.xyz/docs/operators/validators/setup#local-setup).

Requires to set up two environment variables.

> Issues
> Hyperlane should be running in `hyperlane/rust`.
> The generated config should be moved to `hyperlane/rust/config/last_config.json`
>
> Otherwise, the validator won't see it. Even when we set it in `CONFIG_FILES`

Run the validator
```shell
./target/release/validator \
--reorgPeriod 2 \
--originChainName swt \
--chains.swt.connection.url $L2_RPC \
--db $VALIDATOR_SIGNATURES_DIRECTORY \
--validator.key $VALIDATOR_PRIVATE_KEY_0 \
--chains.swt.signer.key $ADMIN_PRIVATE_KEY \
--checkpointSyncer.type localStorage \
--checkpointSyncer.path $VALIDATOR_DB_DIRECTORY 
```

Note, that the validator key should have some fund inside.
Even though documentation says that validators are not necessary to be fund
ed.


The relayer starts to sync since the beginning.
To avoid it, go to the scanner.

https://sepolia.etherscan.io/

Get the recent number and set it as the recent block number.

Run the relayer from the most recent block number:

```shel
./target/release/relayer \
--relayChains swt,sepolia \
--chains.sepolia.connection.url $L1_RPC \
--chains.swt.connection.url $L2_RPC \
--db $RELAYER_DB_DIRECTORY \
--allowLocalCheckpointSyncers true \
--defaultSigner.key $RELAYER_PRIVATE_KEY \
--chains.sepolia.index.from 4050271
```

---

# Knowing the Domain ID

[Instructions about how to know domain id](https://docs.hyperlane.xyz/docs/build-with-hyperlane/explorer/configuring-pi-chains)

Or if you deployed them using `hyperlane-deploy`,
then the domains will be available in 
`hyperlane-deploy/artifacts/agent_config.json`.