import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { getContracts } from "../utils/contract";

export default function Marketplace() {

    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [bidAmount, setBidAmount] = useState({});
    const [bidLoading, setBidLoading] = useState({});
    const [error, setError] = useState("");


    useEffect(() => {
        loadListings();
    }, []);


    async function loadListings() {

        setLoading(true);
        setError("");

        try {

            const {
                auctionContract,
                nftContract
            } = await getContracts();


            let total = 0;

            try {
                total = Number(
                    await nftContract.totalMinted()
                );
            } catch {
                total = 50;
            }


            const found = [];

            for (let i = 1; i <= total; i++) {

                try {

                    const listing =
                        await auctionContract.getListing(i);

                    if (listing.isActive) {

                        const invoice =
                            await nftContract.getInvoice(i);

                        found.push({

                            nftId: i,
                            seller: listing.seller,
                            minBid: listing.minBid,
                            highestBid: listing.highestBid,
                            highestBidder: listing.highestBidder,
                            invoice

                        });

                    }

                } catch {}

            }

            setListings(found);

        } catch (err) {

            console.error(err);
            setError("Failed to load marketplace");

        }

        setLoading(false);

    }



    async function handleBid(nftId) {

        try {

            const amount = bidAmount[nftId];

            if (!amount) {
                alert("Enter bid amount");
                return;
            }

            setBidLoading({
                ...bidLoading,
                [nftId]: true
            });


            const { auctionContract } =
                await getContracts();

            const tx =
                await auctionContract.placeBid(
                    nftId,
                    {
                        value:
                            ethers.parseEther(
                                amount
                            )
                    }
                );

            await tx.wait();

            alert("✅ Bid placed");

            loadListings();

        } catch (err) {

            alert(err.message);

        }

        setBidLoading({
            ...bidLoading,
            [nftId]: false
        });

    }



    if (loading) return (
        <div style={{ textAlign:"center", marginTop:"60px" }}>
            Loading marketplace...
        </div>
    );



    return (

        <div style={{
            maxWidth: "1000px",
            margin: "40px auto",
            padding: "0 20px"
        }}>

            <h1 style={{
                marginBottom: "20px"
            }}>
                Marketplace
            </h1>


            {error && (
                <div>{error}</div>
            )}


            {listings.length === 0 && (
                <p>No listings yet</p>
            )}


            <div style={{
                display: "grid",
                gridTemplateColumns:
                    "repeat(auto-fit,minmax(280px,1fr))",
                gap: "20px"
            }}>

                {listings.map(item => (

                    <Card key={item.nftId}>

                        <h3>
                            Invoice #{item.nftId}
                        </h3>


                        <p>
                            Amount:
                            {ethers.formatEther(
                                item.invoice.amount
                            )} ETH
                        </p>


                        <p>
                            Min Bid:
                            {ethers.formatEther(
                                item.minBid
                            )} ETH
                        </p>


                        <p>

                            Highest Bid:

                            {Number(item.highestBid) === 0
                                ? "None"
                                : ethers.formatEther(
                                    item.highestBid
                                ) + " ETH"}

                        </p>


                        <input
                            placeholder="Bid amount"
                            type="number"
                            onChange={e =>
                                setBidAmount({
                                    ...bidAmount,
                                    [item.nftId]:
                                        e.target.value
                                })
                            }
                        />


                        <button
                            disabled={
                                bidLoading[item.nftId]
                            }
                            onClick={() =>
                                handleBid(item.nftId)
                            }
                        >
                            {bidLoading[item.nftId]
                                ? "Bidding..."
                                : "Place Bid"}
                        </button>


                    </Card>

                ))}

            </div>


            <button
                onClick={loadListings}
                style={{
                    marginTop: "20px"
                }}
            >
                Refresh
            </button>


        </div>

    );

}



function Card({ children }) {

    return (

        <div style={{
            padding: "20px",
            background: "white",
            borderRadius: "14px",
            boxShadow:
                "0 4px 20px rgba(0,0,0,0.05)"
        }}>

            {children}

        </div>

    );

}