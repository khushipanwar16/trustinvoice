import { useState } from "react";
import {
  Home,
  LayoutDashboard,
  Store,
  PlusCircle,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

export default function Sidebar({ page, setPage, wallet }) {

    const [collapsed, setCollapsed] = useState(false);

    const Item = ({ label, value, icon }) => (

        <div
            className={`sidebar-item ${page === value ? "active" : ""}`}
            onClick={() => setPage(value)}
        >
            <div className="sidebar-icon">{icon}</div>

            {!collapsed && (
                <div className="sidebar-text">
                    {label}
                </div>
            )}
        </div>

    );

    return (

        <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>

            <div className="sidebar-header">

                <div className="sidebar-logo">
                    🔗
                </div>

                {!collapsed && (
                    <div className="sidebar-title">
                        TrustInvoice
                    </div>
                )}

            </div>


            <div className="sidebar-nav">

                <Item
  label="Home"
  value="home"
  icon={<Home size={20} />}
/>

<Item
  label="Dashboard"
  value="dashboard"
  icon={<LayoutDashboard size={20} />}
/>

<Item
  label="Marketplace"
  value="marketplace"
  icon={<Store size={20} />}
/>

<Item
  label="Create Invoice"
  value="create"
  icon={<PlusCircle size={20} />}
/>

            </div>


            <div className="sidebar-footer">

                <button
                    className="toggle-btn"
                    onClick={() => setCollapsed(!collapsed)}
                >
                    {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                </button>


                {!collapsed && (

                    <div className="wallet-box">

                        <div className="wallet-status">
                            {wallet ? "Connected" : "Disconnected"}
                        </div>

                        <div className="wallet-address">
                            {wallet
                                ? `${wallet.slice(0,6)}...${wallet.slice(-4)}`
                                : "Not Connected"}
                        </div>

                    </div>

                )}

            </div>

        </div>

    );

}