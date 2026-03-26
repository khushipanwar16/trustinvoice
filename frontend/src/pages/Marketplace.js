import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { getContracts } from "../utils/contract";

export default function Marketplace() {

    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [bidAmount, setBidAmount] = useState({});


    useEffect(() => {
        loadListings();
    }, []);


    async function loadListings() {

        try {

            const { auctionContract, nftContract } = await getContracts();

            const items = [];

            for (let i = 1; i <= 20; i++) {

                try {

                    const listing = await auctionContract.getListing(i);

                    if (listing.isActive) {

                        const invoice = await nftContract.getInvoice(i);

                        items.push({
                            id: i,
                            amount: invoice.amount,
                            seller: listing.seller
                        });

                    }

                } catch {}

            }

            setListings(items);

        } catch (err) {

            console.error(err);

        }

        setLoading(false);

    }

    async function handleBid(id) {

    try {

        const { auctionContract } =
            await getContracts();

        const amount =
            bidAmount[id];

        const tx =
            await auctionContract.placeBid(

                id,

                {
                    value:
                        ethers.parseEther(
                            amount
                        )
                }

            );

        await tx.wait();

        alert("Bid placed!");

    } catch (err) {

        console.error(err);
        alert("Error placing bid");

    }

}

    if (loading) return <div>Loading...</div>;


    return (

     <div className="page-container marketplace-grid">

        <h2>Marketplace</h2>

        {listings.length === 0 && (

            <div className="card">
                No listings yet
            </div>

        )}

        {listings.map(item => (

            <div className="card" key={item.id}>

                <h3>Invoice #{item.id}</h3>

                <div>
                    Amount:
                    {ethers.formatEther(item.amount)} ETH
                </div>

                <br />

                <input
                    className="form-input"
                    placeholder="Bid Amount (ETH)"
                    onChange={(e) =>
                        setBidAmount({
                            ...bidAmount,
                            [item.id]: e.target.value
                        })
                    }
                />

                <br />

                <button
                    className="btn-accent"
                    onClick={() =>
                        handleBid(item.id)
                    }
                >
                    Place Bid
                </button>

            </div>

        ))}

    </div>

);
}