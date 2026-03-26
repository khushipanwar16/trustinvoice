import { connectWallet } from "../utils/contract";

export default function Home({ handleConnect }) {

    return (

        <div className="hero">

            <div className="hero-content">

                <h1 className="hero-title">
                    Trust the Invoice.
                    <br />
                    Fund the Future.
                </h1>

                <p className="hero-sub">
                    Convert invoices into blockchain-backed assets
                    and unlock instant liquidity without banks.
                </p>

                <button
                    className="btn-accent hero-btn"
                    onClick={handleConnect}
                >
                    Connect Wallet
                </button>

            </div>


            <div className="hero-cards">

                <div className="feature-card">
                    ⚡
                    <h3>Instant Funding</h3>
                    <p>Get liquidity in minutes</p>
                </div>

                <div className="feature-card">
                    🔐
                    <h3>Blockchain Proof</h3>
                    <p>Immutable invoices</p>
                </div>

                <div className="feature-card">
                    ⭐
                    <h3>Trust Score</h3>
                    <p>On-chain reputation</p>
                </div>

            </div>

        </div>

    );
}