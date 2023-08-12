export const getMailbox = (network: string): string => {
    if (network == "goerli") {
        return "0xCC737a94FecaeC165AbCf12dED095BB13F037685";
    } else if (network == "baseTestnet") {
        return "0x9d4Bdf4c343D4741E29362908f4FAB32b7a3fD83";
    }
}