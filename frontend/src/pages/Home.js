import { useEffect, useState } from "react";
import { getContracts } from "../utils/contract";
import { ethers } from "ethers";

export default function Home({ handleConnect, wallet }) {

    const [latestInvoice, setLatestInvoice] = useState("0");
    const [trustScore, setTrustScore] = useState(0);
    const [activeFunding, setActiveFunding] = useState(0);


    useEffect(() => {

    async function loadStats() {

        if (!wallet) return;

        try {

            const { nftContract, auctionContract } =
                await getContracts();

            let latest = "0";
            let trust = 50; // base trust
            let active = 0;

            let created = 0;
            let funded = 0;
            let paid = 0;
            let overdue = 0;
            let defaults = 0;

            // Load invoices
            for (let i = 1; i <= 50; i++) {

                try {

                    const invoice =
                        await nftContract.getInvoice(i);

                    if (
                        invoice.seller
                        .toLowerCase() ===
                        wallet.toLowerCase()
                    ) {

                        created++;

                        latest =
                            ethers.formatEther(
                                invoice.amount
                            );

                        // example status logic
                        if (invoice.paid) {
                            paid++;
                        }

                        if (invoice.defaulted) {
                            defaults++;
                        }

                        if (invoice.overdue) {
                            overdue++;
                        }

                    }

                } catch {}

            }


            // Count funding
            for (let i = 1; i <= 50; i++) {

                try {

                    const listing =
                        await auctionContract
                            .getListing(i);

                    if (listing.isActive)
                        active++;

                    if (listing.funded)
                        funded++;

                } catch {}

            }


            // Trust formula

            trust += created * 2;
            trust += funded * 10;
            trust += paid * 5;

            trust -= defaults * 15;
            trust -= overdue * 10;

            trust = Math.max(0, Math.min(trust, 100));

            setLatestInvoice(latest);
            setTrustScore(trust);
            setActiveFunding(active);

        } catch (err) {

            console.log(err);

        }

    }

    loadStats();

}, [wallet]);



    return (

        <div className="page-container">

            <div className="hero-grid">

                <div className="hero-left">

                    <div className="hero-eyebrow">
                        <span></span>
                        Decentralized Invoice Financing
                    </div>

                    <h1 className="hero-title">
                        Trust the Invoice.
                        <br />
                        <span>Fund the Future.</span>
                    </h1>

                    <p className="hero-sub">
                        Convert invoices into blockchain-backed assets and
                        unlock liquidity instantly. No banks. No paperwork.
                    </p>

                    <div className="hero-actions">

                        <button
                            className="btn-accent hero-btn"
                            onClick={handleConnect}
                        >
                            Connect Wallet
                        </button>

                    </div>

                </div>


                <div className="hero-right">

                    <div className="floating-card card-1">
                        <div>Latest Invoice</div>
                        <strong>{latestInvoice} ETH</strong>
                    </div>

                    <div className="floating-card card-2">
    <div>Trust Score</div>
    <strong>
        {trustScore === 50 ? "New" : trustScore}
    </strong>
</div>

                    <div className="floating-card card-3">
                        <div>Active Auctions</div>
                        <strong>{activeFunding}</strong>
                    </div>

                </div>

            </div>


            <div className="hero-cards">

                <div className="feature-card">
                    
                    <h3>Instant Funding</h3>
                    <p>Get liquidity in minutes</p>
                </div>

                <div className="feature-card">
                    
                    <h3>Blockchain Proof</h3>
                    <p>Immutable invoices</p>
                </div>

                <div className="feature-card">
                    
                    <h3>Trust Score</h3>
                    <p>On-chain reputation</p>
                </div>

            </div>

        </div>

    );

}