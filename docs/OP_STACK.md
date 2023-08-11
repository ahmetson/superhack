## Using Op Stack

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

Deployed chains:
- [Zora bridge](https://bridgetozora.world/) get testnet eth on zora by bridging eth from goerli.
- [Zora testnet explorer](https://testnet.explorer.zora.energy/)
- [Blank page (joking)](https://testnet.zora.co/) &ndash; yeah, I am joking. It's a testnet page from zora to create
- [Zora doc](https://docs.zora.co/docs/zora-network/network#zora-network-goerli-testnet) &ndash; opposite of the main site, it's in dark, like my eyes in the dark cave.

> note, zora testnet is not available on **chainlist**.


# Running SupperWallet

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
 --rollup.sequencerhttp=http://localhost:8547
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
