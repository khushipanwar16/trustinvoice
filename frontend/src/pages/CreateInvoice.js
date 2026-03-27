import { useState } from "react";
import { ethers } from "ethers";
import { getContracts, connectWallet } from "../utils/contract";

export default function CreateInvoice() {

    const [buyer, setBuyer] = useState("");
    const [amount, setAmount] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [minBid, setMinBid] = useState("");
    const [loading, setLoading] = useState(false);

    async function createInvoice() {

        try {

                console.log("Creating invoice...");

                // validation first
                if (!buyer || !amount || !minBid || !dueDate) {
                    alert("Fill all fields");
                    return;
                }

                setLoading(true);

                // connect wallet once
                await connectWallet();

                console.log("Wallet connected");

                const {
                    nftContract,
                    auctionContract
                } = await getContracts();

                console.log("Contracts loaded");


            // mint invoice NFT
            const tx = await nftContract.mintInvoice(

                buyer,

                ethers.parseEther(amount),

                Math.floor(
                    new Date(dueDate).getTime() / 1000
                ),

                "ipfs://placeholder"
            );

            console.log("Mint tx sent");

            const receipt = await tx.wait();

            console.log("Mint confirmed");


            // safer token id extraction
            let tokenId;

            try {
                const event = receipt.logs.find(
                    log => log.fragment?.name === "Transfer"
                );

                tokenId = Number(event.args.tokenId);

            } catch {

                // fallback
                tokenId = receipt.logs[0].topics[3];
                tokenId = parseInt(tokenId, 16);

            }

            console.log("Token ID:", tokenId);


            // approve auction contract
            const approveTx =
                await nftContract.approve(
                    auctionContract.target,
                    tokenId
                );

            await approveTx.wait();

            console.log("Approved");


            // list auction
            const listTx =
                await auctionContract.listInvoice(
                    tokenId,
                    ethers.parseEther(minBid)
                );

            await listTx.wait();

            console.log("Listed");


            alert("✅ Invoice Created & Listed!");

            setBuyer("");
            setAmount("");
            setDueDate("");
            setMinBid("");

        } catch (err) {

            console.error("Create invoice error:", err);

            alert(err?.reason || err?.message || "Error creating invoice");

        }  finally {
   setLoading(false);
}

        
    }

 return (

<div className="page-container">

{/* <h1 className="page-title">
Create Invoice
</h1> */}

<div className="create-wrapper">

<div className="create-card">

{/* <h2>Create Invoice</h2> */}


<div className="form-group">
<label>Buyer Address</label>

<input
className="form-input"
placeholder="0x..."
value={buyer}
onChange={(e)=>setBuyer(e.target.value)}
/>
</div>


<div className="form-group">
<label>Amount (ETH)</label>

<input
className="form-input"
placeholder="0.5"
value={amount}
onChange={(e)=>setAmount(e.target.value)}
/>
</div>


<div className="form-group">
<label>Minimum Bid</label>

<input
className="form-input"
placeholder="0.4"
value={minBid}
onChange={(e)=>setMinBid(e.target.value)}
/>
</div>


<div className="form-group">
<label>Due Date</label>

<input
type="date"
className="form-input"
value={dueDate}
onChange={(e)=>setDueDate(e.target.value)}
/>
</div>


<button
className="btn-accent create-btn"
onClick={createInvoice}
>
{loading ? "Creating..." : "Create & List"}
</button>

</div>

</div>

</div>

);
    

}