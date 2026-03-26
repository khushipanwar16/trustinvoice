import { useState } from "react";
import { ethers } from "ethers";
import { getContracts } from "../utils/contract";

export default function CreateInvoice() {

    const [buyer, setBuyer] = useState("");
    const [amount, setAmount] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [minBid, setMinBid] = useState("");
    const [loading, setLoading] = useState(false);

    async function createInvoice() {

        try {

            setLoading(true);

            const {
                nftContract,
                auctionContract
            } = await getContracts();

            // mint invoice NFT
            const tx = await nftContract.mintInvoice(

                buyer,

                ethers.parseEther(amount),

                Math.floor(
                    new Date(dueDate).getTime() / 1000
                ),

                "ipfs://placeholder"
            );

            const receipt = await tx.wait();

            // get token id
            const tokenId =
                receipt.logs[0].topics[3];

            const id =
                parseInt(tokenId, 16);

            // approve auction contract
            const approveTx =
                await nftContract.approve(

                    auctionContract.target,

                    id

                );

            await approveTx.wait();


            // list auction
            const listTx =
                await auctionContract.listInvoice(

                    id,

                    ethers.parseEther(minBid)

                );

            await listTx.wait();

            alert("Invoice Created & Listed!");

            setBuyer("");
            setAmount("");
            setDueDate("");
            setMinBid("");

        } catch (err) {

            console.error(err);

            alert("Error creating invoice");

        }

        setLoading(false);

    }


    return (

        <div className="page-container form-container">
    <div className="card"></div>

            <h2>Create Invoice</h2>


            <div className="form-group">

                <label>Buyer Address</label>

                <input
                    className="form-input"
                    placeholder="0x..."
                    value={buyer}
                    onChange={(e) =>
                        setBuyer(e.target.value)
                    }
                />

            </div>


            <div className="form-group">

                <label>Amount (ETH)</label>

                <input
                    className="form-input"
                    placeholder="0.5"
                    value={amount}
                    onChange={(e) =>
                        setAmount(e.target.value)
                    }
                />

            </div>


            <div className="form-group">

                <label>Minimum Bid</label>

                <input
                    className="form-input"
                    placeholder="0.4"
                    value={minBid}
                    onChange={(e) =>
                        setMinBid(e.target.value)
                    }
                />

            </div>


            <div className="form-group">

                <label>Due Date</label>

                <input
                    className="form-input"
                    type="date"
                    value={dueDate}
                    onChange={(e) =>
                        setDueDate(e.target.value)
                    }
                />

            </div>


            <button
                className="btn-accent"
                onClick={createInvoice}
            >

                {loading
                    ? "Creating..."
                    : "Create & List"}

            </button>

        </div>

    );

}