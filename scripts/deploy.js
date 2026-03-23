import hre from "hardhat";

async function main() {
    console.log("Deploying contracts...");

    const InvoiceNFT = await hre.ethers.getContractFactory("InvoiceNFT");
    const nft = await InvoiceNFT.deploy();
    await nft.waitForDeployment();
    const nftAddress = await nft.getAddress();
    console.log("✅ InvoiceNFT deployed to:", nftAddress);

    const Auction = await hre.ethers.getContractFactory("Auction");
    const auction = await Auction.deploy(nftAddress);
    await auction.waitForDeployment();
    const auctionAddress = await auction.getAddress();
    console.log("✅ Auction deployed to:", auctionAddress);

    console.log("\n--- SAVE THESE ADDRESSES ---");
    console.log("NFT_ADDRESS =", nftAddress);
    console.log("AUCTION_ADDRESS =", auctionAddress);
}

main().catch(console.error);