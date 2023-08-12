# SuperHack

A SuperHack from [Medet Ahmetson](https://www.linkedin.com/in/ahmetson/).
It's a SuperWallet that flattens the Ethereum's layer 2. 
For the users, all the operations are done without switching the networks.

Presentation slides about the product is on [Canva](https://www.canva.com/design/DAFrIKaBNqA/3YBWt25S90rVpRCfwxWgCg/edit?utm_content=DAFrIKaBNqA&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton).
The flow diagrams on [Miro](https://miro.com/app/board/uXjVMugclZ8=/?share_link_id=575149552666).

### Used technologies:

| Name                                                                          | Description                                                          | References                                        |
|-------------------------------------------------------------------------------|----------------------------------------------------------------------|---------------------------------------------------|
| [OpStack](https://stack.optimism.io/)                                         | A modular set of tools to create your own L2                         | [OP_STACK](./docs/OP_STACK.md)                    |
| [Hyperlane](https://www.hyperlane.xyz/)                                       | An open-source tool to make two chains to exchange with the messages | [HYPERLANE](./docs/HYPERLANE.md)                  |
| [Safe{Core}](https://safe.global/core)                                        | A framework to create secure wallets. *Previously **Gnosis Safe***   | [SAFE_CORE](./docs/SAFE_CORE.md)                 |
| [safe-infrastructure](https://github.com/safe-global/safe-infrastructure.git) | A services to track the transactions                                 | [SAFE_INFRASTRUCTURE](.docs/SAFE_INFRASTRUCTURE.md) |

*Note, that SDKs are not listed here.*

---
### The SuperWallet supports the following networks

| Network name | Chain Id |
|--------------|----------|
| Sepolia      | 1115511  |
| Op Testnet   | 420      |
| Zora         | 999      | 
| Base         | 84531    |

**Sepolia** Is the L1. It's for prooves.
Note, that all networks are using their own
Testnet l1 for proofs, or **Goerli**.
 
For development, we won't check the security of the L2 networks.
We assume, that the runners are honest.

The ChainId of SuperWallet: **535754**

---
### File structures:
* [Contracts](./contracts) &ndash; contains the smartcontracts.
* [superwallet](./superwallet) &ndash; a browser extension


---

Bridges:
* https://testnetbridge.com/
* https://app.optimism.io/bridge/deposit
* https://bridgetozora.world/
* https://goerli-bridge.base.org/
* https://bridge.mode.network/

Explorers:
* https://base-goerli.blockscout.com/

---
# Deployment
In order to run the code, you would need:
* Run the SuperWallet network
* Run the Hyperlane. We need it to message between SuperWallet and others.
* Run the Safe Infrastructure, so the SuperWallet can read the transaction pools in the contracts.

> **Windows OS users**
>
> Requires to run on WSL 2.0. It wasn't tested on windows directly.

You may need to deploy the contracts:
* Hyperlane
* Safe (if it's not existing)
* SuperWallet (available on [contracts directory](./contracts))
