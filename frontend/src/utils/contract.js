import { ethers } from "ethers";
import InvoiceNFT from "../contracts/InvoiceNFT.json";
import Auction from "../contracts/Auction.json";

// Local Hardhat addresses (update after deployment)
const NFT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const AUCTION_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

let provider;
let signer;
let nftContract;
let auctionContract;


// Connect Wallet
export async function connectWallet() {

    if (!window.ethereum) {
        alert("Please install MetaMask!");
        return null;
    }

    try {

        // Switch to Hardhat network
        await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "0x7A69" }] // 31337
        });

    } catch (error) {

        // Add Hardhat network if not exists
        await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [{
                chainId: "0x7A69",
                chainName: "Hardhat Local",
                rpcUrls: ["http://127.0.0.1:8545"],
                nativeCurrency: {
                    name: "ETH",
                    symbol: "ETH",
                    decimals: 18
                }
            }]
        });
    }

    const accounts = await window.ethereum.request({
        method: "eth_requestAccounts"
    });

    provider = new ethers.BrowserProvider(window.ethereum);
    signer = await provider.getSigner();

    return accounts[0];
}



// Get Contracts
export async function getContracts() {

    if (!signer) {
        await connectWallet();
    }

    nftContract = new ethers.Contract(
        NFT_ADDRESS,
        InvoiceNFT.abi,
        signer
    );

    auctionContract = new ethers.Contract(
        AUCTION_ADDRESS,
        Auction.abi,
        signer
    );

    return {
        provider,
        signer,
        nftContract,
        auctionContract
    };
}



// Get Wallet Address
export async function getWalletAddress() {

    if (!signer) {
        await connectWallet();
    }

    return await signer.getAddress();
}



// Format ETH
export function formatEther(value) {
    return ethers.formatEther(value);
}



// Parse ETH
export function parseEther(value) {
    return ethers.parseEther(value);
}