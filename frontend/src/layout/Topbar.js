import React from "react";

export default function Topbar({ page, setPage }) {

    const titles = {
        dashboard: "Dashboard",
        create: "Create Invoice",
        marketplace: "Marketplace",
        home: "TrustInvoice"
    };

    return (

        <div className="topbar">

            <div className="topbar-title">
                {titles[page]}
            </div>


            <div className="topbar-actions">

                <button
                    className="btn-ghost"
                    onClick={() => window.location.reload()}
                >
                    Refresh
                </button>


                <button
                    className="btn-accent"
                    onClick={() => setPage("create")}
                >
                    + New Invoice
                </button>

            </div>

        </div>

    );

}