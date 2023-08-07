# Hello Optimism

## Requirements
Create `.env` in the root directory from `.env.example`.

```dotenv
L1_RPC=<https url to the ethereum blockchain>
L2_RPC=<url to the rollup>
PRIV_KEY=<private key with some eth without `0x` prefix>

# AddressManager.json
L1_ADDRESS_MANAGER=
# L1CrossDomainMessenger.json
L1_CROSS_DOMAIN_MESSENGER=
# L1StandardBridge.json
L1_STANDARD_BRIDGE=
# OptimismPortal.json
L2_OPTIMISM_PORTAL=
# L2OutputOracle.json
L2_OUTPUT_ORACLE=
```

If you are running Rollup in the same computer, then leave the default values.

The variables prefixed as `L1` or `L2` are the smartcontract addressed for your rollup.
If you are running Rollup in the same computer, then they are
defined in the ABIs:
`~/optimism/packages/contracts-bedrock/deployments/ahmetson-testnet`.


---

## Run
Check your balance on both networks
```
npx hardhat run scripts/index.ts
```

### Hello World
As a hello world, we use `Counter.`

```shell
npx hardhat deploy --network l2
```

Open the `scripts/counter.ts` and 
change the counter address.
Then run the following:

```shell
npx hardhat run scripts/counter.ts --network l2
```