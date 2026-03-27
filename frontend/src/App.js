import { useState, useEffect } from "react";
import { connectWallet } from "./utils/contract";

import Home from "./pages/Home";
import Marketplace from "./pages/Marketplace";
import Dashboard from "./pages/Dashboard";
import CreateInvoice from "./pages/CreateInvoice";

import Sidebar from "./layout/Sidebar";
import Topbar from "./layout/Topbar";

import "./styles/trustinvoice.css";


export default function App() {

    const [wallet, setWallet] = useState("");
    const [page, setPage] = useState("home");


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
                    handleConnect={handleConnect}
                    wallet={wallet}
                />

                {page === "home" && (
                    <Home
                        handleConnect={handleConnect}
                        wallet={wallet}
                    />
                )}

                {page === "dashboard" && (
                    <Dashboard 
  wallet={wallet}
  setPage={setPage}
/>
                )}

                {page === "marketplace" && (
                    <Marketplace wallet={wallet} />
                )}

                {page === "create" && (
                    <CreateInvoice wallet={wallet} />
                )}

            </div>

        </div>

    );

}