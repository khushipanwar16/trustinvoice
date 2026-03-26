import React from "react";

export default function Sidebar({ page, setPage, wallet }) {

    const Item = ({ label, value, icon }) => (

        <div
            className={`nav-item ${page === value ? "active" : ""}`}
            onClick={() => setPage(value)}
        >
            <span style={{ marginRight: "8px" }}>{icon}</span>
            {label}
        </div>

    );


    return (

        <div className="sidebar">

            <div className="sidebar-logo">

                <div className="sidebar-logo-icon">
                    🔗
                </div>

               <div className="sidebar-logo-text brand">
TrustInvoice
</div>

            </div>



            <div className="nav-label">
                MAIN
            </div>


            <Item
                label="Home"
                value="home"
                icon="🏠"
            />

            <Item
                label="Dashboard"
                value="dashboard"
                icon="📊"
            />


            <Item
                label="Marketplace"
                value="marketplace"
                icon="🏪"
            />


            <div className="nav-label">
                ACTIONS
            </div>


            <Item
                label="Create Invoice"
                value="create"
                icon="➕"
            />



            <div className="sidebar-wallet">

                <div className="wallet-indicator">

                    <div className="wallet-dot" />

                    <div className="wallet-label">
                        {wallet ? "Connected" : "Disconnected"}
                    </div>

                </div>


                <div className="wallet-addr">
                    {wallet
                        ? `${wallet.slice(0,6)}...${wallet.slice(-4)}`
                        : "Not connected"}
                </div>

            </div>

        </div>

    );

}