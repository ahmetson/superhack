//
// It's intended to be called from parent scripts that loads .env
//

let zeroAddr = "0x".padEnd(42, "0")
export const l1Contracts = {
    StateCommitmentChain: zeroAddr,
    CanonicalTransactionChain: zeroAddr,
    BondManager: zeroAddr,
    // These contracts have the addresses you found out earlier.
    AddressManager: process.env.L1_ADDRESS_MANAGER,   // Lib_AddressManager.json
    L1CrossDomainMessenger: process.env.L1_CROSS_DOMAIN_MESSENGER,   // Proxy__OVM_L1CrossDomainMessenger.json
    L1StandardBridge: process.env.L1_STANDARD_BRIDGE,   // Proxy__OVM_L1StandardBridge.json
    OptimismPortal: process.env.L1_OPTIMISM_PORTAL,   // OptimismPortalProxy.json
    L2OutputOracle: process.env.L1_OUTPUT_ORACLE,   // L2OutputOracleProxy.json
}

export default l1Contracts