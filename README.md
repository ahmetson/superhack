# SuperHack

A mono-repo of the multiple projects for the super hack.

> **Windows OS users**
> 
> Requires to run on WSL 2.0. It wasn't tested on windows directly.

* [Hello](./hello) &ndash; contains the sample files to get familiar with rollups.
* [_datadir](./_datadir) &ndash; blockchain files

## Using Op SDK

Resources:

Official SDK
- [Op Stack with SDK](https://stack.optimism.io/docs/build/sdk/#) &ndash; example on how to use SDK
- [Official docs](https://sdk.optimism.io/) &ndash; raw generated documentation. It's not beginner-friendly. Recommending *Op Stack:SDK*
- [Source Code](https://github.com/ethereum-optimism/optimism/tree/develop/packages/sdk) &ndash; source code
- [Tutorials](https://community.optimism.io/docs/sdk/js-client/) &ndash; code samples
- [Tutorials hub](https://github.com/ethereum-optimism/optimism-tutorial/tree/main) &ndash; code samples with explanations

Op Stack
- [Official docs](https://stack.optimism.io/#the-op-stack-powers-optimism)
- [Getting Started](https://stack.optimism.io/docs/build/getting-started/) &ndash; great place to run your own blockchain
- [Difference between OP EVM and Eth EVm](https://community.optimism.io/docs/developers/build/differences/#opcode-differences)
- [Rollup Operations](https://stack.optimism.io/docs/build/operations) &ndash; how to stop your blockchain, how to start it.

---

# Running

In `/mnt/d/repo/op-geth`
```shell
 ./build/bin/geth \
 --datadir /mnt/d/ahmetson/superhack/_datadir \
 --http \
 --http.corsdomain="*" \
 --http.vhosts="*" \
 --http.addr=0.0.0.0 \
 --http.api=web3,debug,eth,txpool,net,engine \
 --ws \
 --ws.addr=0.0.0.0 \
 --ws.port=8546 \
 --ws.origins="*" \
 --ws.api=debug,eth,txpool,net,engine \
 --syncmode=full \
 --gcmode=archive \
 --nodiscover \
 --maxpeers=0 \
 --networkid=535754 \
 --authrpc.vhosts="*" \
 --authrpc.addr=0.0.0.0 \
 --authrpc.port=8551 \
 --authrpc.jwtsecret=/mnt/d/ahmetson/superhack/superwallet-testnet-jwt.txt \
 --rollup.disabletxpoolgossip=true \
 --ipcdisable
```

In `/mnt/d/repo/optimism/op-node`

> Requieres the `RPC_KIND` and `L1_RPC`

```bash
./bin/op-node \
--l2=http://localhost:8551 \
--l2.jwt-secret=/mnt/d/ahmetson/superhack/superwallet-testnet-jwt.txt \
--sequencer.enabled \
--sequencer.l1-confs=1 \
--verifier.l1-confs=1 \
--rollup.config=superwallet-testnet-rollup.json \
--rpc.addr=0.0.0.0 \
--rpc.port=8547 \
--rpc.enable-admin \
--p2p.sequencer.key=$SEQUENCER_PRIVATE_KEY \
--l1.rpckind=$RPC_KIND \
--l1=$L1_RPC
```

In `/mnt/d/repo/optimism/op-batcher`

```shell
./bin/op-batcher \
--l2-eth-rpc=http://localhost:8545 \
--rollup-rpc=http://localhost:8547 \
--poll-interval=1s \
--sub-safety-margin=6 \
--num-confirmations=1 \
--safe-abort-nonce-too-low-count=3 \
--resubmission-timeout=30s \
--rpc.addr=0.0.0.0 \
--rpc.port=8548 \
--rpc.enable-admin \
--max-channel-duration=1 \
--l1-eth-rpc=$L1_RPC \
--private-key=$BATCHER_PRIVATE_KEY
```

In `/mnt/d/repo/optimism/op-proposer`

```bash
./bin/op-proposer \
--poll-interval=12s \
--rpc.port=8560 \
--rollup-rpc=http://localhost:8547 \
--l2oo-address=$L2OO_ADDR \
--private-key=$PROPOSER_PRIVATE_KEY \
--l1-eth-rpc=$L1_RPC
```

# Using HyperLane

* [Supported Chains](https://github.com/hyperlane-xyz/hyperlane-monorepo/blob/main/typescript/sdk/src/consts/chainMetadata.ts) &ndash; list of supported networks

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

# Safe wallet

Before going to run the safe wallet, we need a transaction
service. Simply think about it as a UI.

* [Install locally](https://github.com/safe-global/safe-infrastructure/blob/main/docs/running_locally.md) &ndash; install Safe Services locally using docker.
* [Getting Started](https://github.com/safe-global/safe-core-sdk/blob/main/guides/integrating-the-safe-core-sdk.md) &ndash; start to work with Safe SDK.