import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { getContracts } from "../utils/contract";
import StatCard from "../components/StatCard";
import CreateInvoiceModal from "../components/CreateInvoiceModal";
import InvoiceDetailModal from "../components/InvoiceDetailModal";
import Skeleton from "../components/Skeleton";

export default function Dashboard() {

    const [wallet, setWallet] = useState("");
    const [reputation, setReputation] = useState(0);
    const [myInvoices, setMyInvoices] = useState([]);
    const [myListings, setMyListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState(null);


    useEffect(() => {
        loadDashboard();
    }, []);


    async function loadDashboard() {

        setLoading(true);

        try {

            const {
                nftContract,
                auctionContract,
                signer
            } = await getContracts();

            const address = await signer.getAddress();
            setWallet(address);

            const rep = await nftContract.reputationScore(address);
            setReputation(Number(rep));

            let total = 0;

            try {
                total = Number(await nftContract.totalMinted());
            } catch {
                total = 50;
            }

            const invoices = [];
            const listings = [];

            for (let i = 1; i <= total; i++) {

                try {

                    const inv = await nftContract.getInvoice(i);

                    if (
                        inv.seller.toLowerCase()
                        === address.toLowerCase()
                    ) {

                        invoices.push({
                            id: i,
                            amount: ethers.formatEther(inv.amount),
                            isPaid: inv.isPaid,
                            buyer: inv.buyer,
                            dueDate: new Date(
                                Number(inv.dueDate) * 1000
                            ).toLocaleDateString()
                        });


                        try {

                            const listing =
                                await auctionContract.getListing(i);

                            if (listing.isActive) {

                                listings.push({
                                    nftId: i,
                                    minBid:
                                        ethers.formatEther(
                                            listing.minBid
                                        ),
                                    highestBid:
                                        listing.highestBid,
                                    highestBidder:
                                        listing.highestBidder,
                                    hasActiveBid:
                                        Number(listing.highestBid) > 0
                                });

                            }

                        } catch {}

                    }

                } catch {}

            }

            setMyInvoices(invoices);
            setMyListings(listings);

        } catch (err) {

            console.error(err);

        }

        setLoading(false);

    }



    async function acceptBid(nftId) {

        try {

            const { auctionContract } =
                await getContracts();

            const tx =
                await auctionContract.acceptBid(nftId);

            await tx.wait();

            alert("✅ Bid accepted!");

            loadDashboard();

        } catch (err) {

            alert("Error: " + err.message);

        }

    }



   if (loading) return (

    <div className="stats-grid">

        <Skeleton />
        <Skeleton />
        <Skeleton />
        <Skeleton />

    </div>

);  


    return (

        <div>

            <div style={{ marginBottom: "20px" }}>
                <button
                    className="btn-accent"
                    onClick={() => setShowModal(true)}
                >
                    + Create Invoice
                </button>
            </div>


            <div className="stats-grid">

                <StatCard
                    label="Wallet"
                    value={`${wallet.slice(0,6)}...${wallet.slice(-4)}`}
                    sub="Connected"
                    icon="👛"
                />

                <StatCard
                    label="Reputation"
                    value={reputation}
                    sub="Trust score"
                    icon="⭐"
                />

                <StatCard
                    label="Invoices"
                    value={myInvoices.length}
                    sub="Created"
                    icon="🧾"
                />

                <StatCard
                    label="Active Auctions"
                    value={myListings.length}
                    sub="Live"
                    icon="📊"
                />

            </div>



            <h2>Active Auctions</h2>

            {myListings.length === 0 && (
                <div className="empty-state">
                    No active auctions
                </div>
            )}

            {myListings.map(item => (

                <div className="stat-card" key={item.nftId}>

                    <h4>
                        Invoice #{item.nftId}
                    </h4>

                    <p>
                        Highest Bid:

                        {Number(item.highestBid) === 0
                            ? "None"
                            : ethers.formatEther(item.highestBid) + " ETH"}
                    </p>

                    {item.hasActiveBid && (

                        <button
                            className="btn-accent"
                            onClick={() =>
                                acceptBid(item.nftId)
                            }
                        >
                            Accept Bid
                        </button>

                    )}

                </div>

            ))}



            <h2 style={{ marginTop: "30px" }}>
                My Invoices
            </h2>


            <div className="invoice-table">

                <div className="table-head">
                    <div>ID</div>
                    <div>Buyer</div>
                    <div>Amount</div>
                    <div>Status</div>
                    <div>Due</div>
                    <div></div>
                </div>


                {myInvoices.map(inv => (

                    <div
                        className="invoice-row"
                        key={inv.id}
                    >

                        <div className="invoice-id">
                            #{inv.id}
                        </div>


                        <div className="invoice-party">
                            <div className="invoice-avatar">
                                {inv.buyer.slice(2,4)}
                            </div>

                            <div>

                                <div className="invoice-name">
                                    Client
                                </div>

                                <div className="invoice-addr">
                                    {inv.buyer.slice(0,6)}...
                                </div>

                            </div>

                        </div>


                        <div className="invoice-amount">
                            {inv.amount} ETH
                        </div>


                        <div>

                            <span className={
                                inv.isPaid
                                    ? "status-badge status-paid"
                                    : "status-badge status-pending"
                            }>
                                {inv.isPaid
                                    ? "Paid"
                                    : "Pending"}
                            </span>

                        </div>


                        <div className="invoice-date">
                            {inv.dueDate}
                        </div>


                        <div className="row-action">

                            <button
    className="row-btn"
    onClick={() => setSelectedInvoice(inv)}
>
    View
</button>

                        </div>

                    </div>

                ))}

            </div>



            <div className="activity-grid">

                <div className="activity-feed">

                    <div className="activity-header">
                        <div className="activity-title">
                            Recent Activity
                        </div>
                    </div>


                    {myInvoices.slice(0,5).map(inv => (

                        <div className="activity-item" key={inv.id}>

                            <div className="activity-icon-wrap">
                                🧾
                            </div>

                            <div>

                                <div className="activity-event">
                                    Invoice #{inv.id} created
                                </div>

                                <div className="activity-meta">
                                    {inv.amount} ETH
                                </div>

                            </div>


                            <div className="activity-time">
                                recent
                            </div>

                        </div>

                    ))}

                </div>



                <div className="chain-card">

                    <div className="chain-title">
                        Contract Stats
                    </div>


                    <div className="chain-stat">

                        <div className="chain-stat-row">
                            <span className="chain-stat-label">
                                Total Invoices
                            </span>

                            <span className="chain-stat-value">
                                {myInvoices.length}
                            </span>

                        </div>

                        <div className="chain-stat-bar">
                            <div
                                className="chain-stat-fill"
                                style={{ width: "80%" }}
                            />
                        </div>

                    </div>



                    <div className="chain-stat">

                        <div className="chain-stat-row">

                            <span className="chain-stat-label">
                                Active Auctions
                            </span>

                            <span className="chain-stat-value">
                                {myListings.length}
                            </span>

                        </div>

                        <div className="chain-stat-bar">
                            <div
                                className="chain-stat-fill"
                                style={{ width: "50%" }}
                            />
                        </div>

                    </div>


                    <div className="contract-info">

                        <div className="contract-info-label">
                            Network
                        </div>

                        <div className="contract-info-addr">
                            Hardhat Local
                        </div>

                    </div>

                </div>

            </div>



            <CreateInvoiceModal
                open={showModal}
                onClose={() => setShowModal(false)}
                onCreate={(data) => {
                    console.log(data);
                    setShowModal(false);
                }}
            />

            <CreateInvoiceModal
    open={showModal}
    onClose={() => setShowModal(false)}
    onCreate={(data) => {
        console.log(data);
        setShowModal(false);
    }}
/>

<InvoiceDetailModal
    open={!!selectedInvoice}
    invoice={selectedInvoice}
    onClose={() => setSelectedInvoice(null)}
    onSuccess={loadDashboard}
/>


        </div>

    );

}