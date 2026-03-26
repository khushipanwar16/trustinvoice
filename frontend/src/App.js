import { useState, useEffect } from "react";
import { connectWallet } from "./utils/contract";

import Home from "./pages/Home";
import CreateInvoice from "./pages/CreateInvoice";
import Marketplace from "./pages/Marketplace";
import Dashboard from "./pages/Dashboard";

import Sidebar from "./layout/Sidebar";
import Topbar from "./layout/Topbar";

import "./styles/trustinvoice.css";

export default function App() {

    const [wallet, setWallet] = useState("");
    const [page, setPage] = useState("dashboard");


    useEffect(() => {

        if (window.ethereum) {

            window.ethereum
                .request({ method: "eth_accounts" })
                .then(accounts => {

                    if (accounts.length > 0) {
                        setWallet(accounts[0]);
                    }

                });

        }

    }, []);



    async function handleConnect() {

        const address = await connectWallet();

        if (address) {
            setWallet(address);
        }

    }



    return (

        <div className="shell">

            <Sidebar
                page={page}
                setPage={setPage}
                wallet={wallet}
            />


            <div className="main">

                <Topbar
                    page={page}
                    setPage={setPage}
                />

                {page === "home" && <Home />}

                {page === "create" && <CreateInvoice />}

                {page === "marketplace" && <Marketplace />}

                {page === "dashboard" && <Dashboard />}

            </div>

        </div>

    );

}