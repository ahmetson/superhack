import {ethers} from "hardhat";

const l1Url = process.env.L1_RPC
const l2Url = process.env.L2_RPC
const privateKey = process.env.PRIV_KEY
let l2Provider = new ethers.providers.JsonRpcProvider(l2Url)
let l1Provider = new ethers.providers.JsonRpcProvider(l1Url)
let l1Signer = new ethers.Wallet(privateKey).connect(l1Provider)
let l2Signer = new ethers.Wallet(privateKey).connect(l2Provider)

export function getType(chainId: number): string {
    if (chainId == 11155111) return "L1";
    if (chainId == 535754) return "L2";

    throw `chain id ${chainId} unsupported\n`;
}

export function getOpposite(chainId: number): number {
    if (chainId == 11155111) return 535754;
    if (chainId == 535754) return 11155111;

    throw `chain id ${chainId} unsupported\n`;
}

export function getDeployTx(chainId: number): string {
    if (chainId == 11155111) return "0x486c110bf2e111ce30b6585c3c74665bc86559b1f48d03f3a6ce923b95771017";
    if (chainId == 535754) return "0xb7e000f8e9c5ed940ee970fa17901fb242e45b8349faad0583cd8c2201ccd420";

    throw `chain id ${chainId} unsupported\n`;
}

export function getController(chainId: number): string {
    if (chainId == 11155111) return "0x0B7d8512a29BAd68d0df9805DC7Af6B74F54117B";
    if (chainId == 535754) return "0x0564C3e8Fe23c5A6220A300c303f41e43D9be9e2";

    throw `chain id ${chainId} unsupported\n`;
}

export function greeterAddress(chainId: number): string {
    if (chainId == 11155111) return "0x14eEF697c9b0cE96ed0C06d20EcB338cd7BEA11a";
    if (chainId == 535754) return "0xe40c7856B6D0e1B01dECBF9976BB706B9Cd1229f";

    throw `chain id ${chainId} unsupported\n`;
}

export function getSigner(chainId: number) {
    if (chainId == 11155111) return l1Signer;
    if (chainId == 535754) return l2Signer;

    throw `chain id ${chainId} unsupported\n`;
}