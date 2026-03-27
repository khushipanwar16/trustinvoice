import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { getContracts } from "../utils/contract";
import { Gavel, TrendingUp } from "lucide-react";

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
                            seller: listing.seller,
                            highestBid: listing.highestBid
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

            const { auctionContract } = await getContracts();

            const amount = bidAmount[id];

            if (!amount) {
                alert("Enter bid amount");
                return;
            }

            const tx = await auctionContract.placeBid(
                id,
                {
                    value: ethers.parseEther(amount)
                }
            );

            await tx.wait();

            alert("✅ Bid placed!");

            loadListings();

        } catch (err) {

            console.error(err);
            alert("Error placing bid");

        }

    }


    if (loading) {
        return (
            <div className="page-container">
                Loading marketplace...
            </div>
        );
    }


    return (

        <div className="page-container">

            {/* <h1 className="page-title">
                Marketplace
            </h1> */}


            <div className="marketplace-grid">

                {listings.length === 0 && (

                    <div className="card">
                        No listings yet
                    </div>

                )}


                {listings.map(item => (

                    <div className="market-card" key={item.id}>

                        <div className="market-header">

                            <div>

                                <div className="market-title">
                                    <Gavel size={16} />
                                    Invoice #{item.id}
                                </div>

                                <div className="market-sub">
                                    Seller: {item.seller.slice(0,6)}...
                                </div>

                            </div>


                            <div className="market-amount">
                                {ethers.formatEther(item.amount)} ETH
                            </div>

                        </div>


                        <div className="market-stats">

                            <div className="market-stat">

                                <TrendingUp size={14} />

                                Highest Bid:

                                {item.highestBid
                                    ? ethers.formatEther(item.highestBid)
                                    : "None"}

                            </div>

                        </div>


                        <div className="market-bid">

                            <input
                                className="market-input"
                                placeholder="Enter bid amount (ETH)"
                                value={bidAmount[item.id] || ""}
                                onChange={(e) =>
                                    setBidAmount({
                                        ...bidAmount,
                                        [item.id]: e.target.value
                                    })
                                }
                            />

                            <button
                                className="btn-accent"
                                onClick={() =>
                                    handleBid(item.id)
                                }
                            >
                                Place Bid
                            </button>

                        </div>

                    </div>

                ))}

            </div>

        </div>

    );

}