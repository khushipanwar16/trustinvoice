import { connectWallet } from "../utils/contract";
import { useState } from "react";

export default function Home() {

    const [wallet, setWallet] = useState("");

    async function handleConnect() {
        const address = await connectWallet();
        setWallet(address);
    }

    return (

        <div style={{
            textAlign: "center",
            padding: "100px 20px",
            background: "linear-gradient(180deg,#f8fafc,#ffffff)",
            minHeight: "80vh"
        }}>

            <h1 style={{
                fontSize: "3.5rem",
                fontWeight: "bold"
            }}>
                TrustInvoice
            </h1>

            <p style={{
                fontSize: "1.2rem",
                color: "#64748b",
                marginTop: "10px"
            }}>
                Convert invoices into NFTs & get funded instantly
            </p>


            <button
                onClick={handleConnect}
                style={{
                    marginTop: "30px",
                    background: "#2563eb",
                    color: "white",
                    padding: "14px 28px",
                    borderRadius: "12px",
                    border: "none",
                    fontWeight: "600",
                    cursor: "pointer",
                    boxShadow: "0 8px 20px rgba(0,0,0,0.08)"
                }}
            >
                Connect Wallet
            </button>


            <div style={{
                marginTop: "80px",
                display: "flex",
                justifyContent: "center",
                gap: "20px",
                flexWrap: "wrap"
            }}>

                <Card title="Instant Funding" icon="⚡"/>
                <Card title="Blockchain Proof" icon="🔒"/>
                <Card title="Reputation Score" icon="⭐"/>

            </div>

        </div>

    );

}


function Card({ title, icon }) {

    return (

        <div style={{
            padding: "30px",
            borderRadius: "16px",
            background: "white",
            boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
            width: "220px"
        }}>

            <div style={{ fontSize: "2rem" }}>
                {icon}
            </div>

            <h3>{title}</h3>

        </div>

    );

}