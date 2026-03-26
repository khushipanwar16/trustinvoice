import { useState } from "react";
import { ethers } from "ethers";
import { getContracts } from "../utils/contract";

export default function CreateInvoice() {

    const [form, setForm] = useState({
        buyerAddress: "",
        amount: "",
        dueDate: ""
    });

    const [loading, setLoading] = useState(false);
    const [mintedId, setMintedId] = useState(null);
    const [minBid, setMinBid] = useState("");
    const [listing, setListing] = useState(false);


    async function handleMint() {

        if (!form.buyerAddress || !form.amount || !form.dueDate) {
            alert("Please fill all fields!");
            return;
        }

        setLoading(true);

        try {

            const { nftContract } = await getContracts();

            const amountWei = ethers.parseEther(form.amount);

            const dueDateUnix = Math.floor(
                new Date(form.dueDate).getTime() / 1000
            );

            const tx = await nftContract.mintInvoice(
                form.buyerAddress,
                amountWei,
                dueDateUnix,
                "ipfs://proof"
            );

            const receipt = await tx.wait();

            const event = receipt.logs[0];
            const tokenId = parseInt(event.topics[3], 16);

            setMintedId(tokenId);

            alert("✅ Invoice NFT Minted!");

        } catch (err) {

            console.error(err);
            alert("Error: " + err.message);

        }

        setLoading(false);
    }



    async function handleList() {

        if (!minBid) {
            alert("Enter minimum bid!");
            return;
        }

        setListing(true);

        try {

            const { nftContract, auctionContract } = await getContracts();

            const approveTx = await nftContract.approve(
                auctionContract.target,
                mintedId
            );

            await approveTx.wait();

            const listTx = await auctionContract.listInvoice(
                mintedId,
                ethers.parseEther(minBid)
            );

            await listTx.wait();

            alert("✅ Listed for Auction!");

            setMintedId(null);

            setForm({
                buyerAddress: "",
                amount: "",
                dueDate: ""
            });

        } catch (err) {

            console.error(err);
            alert("Error: " + err.message);

        }

        setListing(false);
    }



    return (

        <div style={{
            maxWidth: "600px",
            margin: "60px auto",
            padding: "30px",
            background: "white",
            borderRadius: "16px",
            boxShadow: "0 10px 40px rgba(0,0,0,0.05)"
        }}>

            <h1 style={{
                marginBottom: "20px",
                textAlign: "center"
            }}>
                Create Invoice NFT
            </h1>


            <Input
                label="Buyer Address"
                value={form.buyerAddress}
                onChange={e =>
                    setForm({
                        ...form,
                        buyerAddress: e.target.value
                    })
                }
            />


            <Input
                label="Amount (ETH)"
                type="number"
                value={form.amount}
                onChange={e =>
                    setForm({
                        ...form,
                        amount: e.target.value
                    })
                }
            />


            <Input
                label="Due Date"
                type="date"
                value={form.dueDate}
                onChange={e =>
                    setForm({
                        ...form,
                        dueDate: e.target.value
                    })
                }
            />


            <button
                onClick={handleMint}
                disabled={loading || mintedId}
                style={{
                    width: "100%",
                    marginTop: "20px",
                    padding: "14px",
                    background: "#2563eb",
                    color: "white",
                    borderRadius: "10px",
                    border: "none",
                    fontWeight: "600",
                    cursor: "pointer"
                }}
            >
                {loading
                    ? "Minting..."
                    : mintedId
                        ? `Minted #${mintedId}`
                        : "Mint Invoice"}
            </button>



            {mintedId && (

                <div style={{
                    marginTop: "30px",
                    padding: "20px",
                    background: "#f8fafc",
                    borderRadius: "12px"
                }}>

                    <Input
                        label="Minimum Bid (ETH)"
                        type="number"
                        onChange={e => setMinBid(e.target.value)}
                    />

                    <button
                        onClick={handleList}
                        disabled={listing}
                        style={{
                            width: "100%",
                            marginTop: "12px",
                            padding: "12px",
                            background: "#16a34a",
                            color: "white",
                            border: "none",
                            borderRadius: "8px",
                            fontWeight: "600",
                            cursor: "pointer"
                        }}
                    >
                        {listing
                            ? "Listing..."
                            : "List for Auction"}
                    </button>

                </div>

            )}

        </div>

    );

}



function Input({ label, ...props }) {

    return (

        <div style={{
            marginBottom: "16px"
        }}>

            <label style={{
                display: "block",
                marginBottom: "6px",
                fontWeight: "500"
            }}>
                {label}
            </label>

            <input
                {...props}
                style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "8px",
                    border: "1px solid #e5e7eb"
                }}
            />

        </div>

    );

}