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
    if (chainId == 42069) return "L2";

    throw `chain id ${chainId} unsupported\n`;
}

export function getOpposite(chainId: number): number {
    if (chainId == 11155111) return 42069;
    if (chainId == 42069) return 11155111;

    throw `chain id ${chainId} unsupported\n`;
}

export function getDeployTx(chainId: number): string {
    if (chainId == 11155111) return "0x486c110bf2e111ce30b6585c3c74665bc86559b1f48d03f3a6ce923b95771017";
    if (chainId == 42069) return "0x0befb627bc4f23911d0e7c0be542e076a1fddd4eb6f8f89ceeb0236387035427";

    throw `chain id ${chainId} unsupported\n`;
}

export function getController(chainId: number): string {
    if (chainId == 11155111) return "0x0B7d8512a29BAd68d0df9805DC7Af6B74F54117B";
    if (chainId == 42069) return "0xA4006F2f40341C7933591c959E724b9147A2f6C2";

    throw `chain id ${chainId} unsupported\n`;
}

export function greeterAddress(chainId: number): string {
    if (chainId == 11155111) return "0x3bD4aBCdC3e46205666C152e32B821370cE37EAD";
    if (chainId == 42069) return "0xFe82ced1b9fDD79a07960503c832C6E534A3389E";

    throw `chain id ${chainId} unsupported\n`;
}

export function getSigner(chainId: number) {
    if (chainId == 11155111) return l1Signer;
    if (chainId == 42069) return l2Signer;

    throw `chain id ${chainId} unsupported\n`;
}