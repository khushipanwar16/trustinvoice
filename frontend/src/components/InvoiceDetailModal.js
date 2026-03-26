import { ethers } from "ethers";
import { getContracts } from "../utils/contract";
import { useState } from "react";
import TxToast from "./TxToast";

export default function InvoiceDetailModal({
    open,
    invoice,
    onClose,
    onSuccess
}) {

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    if (!open || !invoice) return null;


    async function payInvoice() {

        try {

            setLoading(true);
            setMessage("Processing Payment...");

            const { nftContract } = await getContracts();

            const tx = await nftContract.payInvoice(
                invoice.id,
                {
                    value: ethers.parseEther(
                        invoice.amount
                    )
                }
            );

            await tx.wait();

            setMessage("✅ Invoice Paid");

            setTimeout(() => {
    setLoading(false);
    onClose();
    onSuccess && onSuccess();
}, 1200);

        } catch (err) {

            setMessage("❌ Transaction Failed");

            setTimeout(() => {
                setLoading(false);
            }, 1500);

        }

    }



    async function disputeInvoice() {

        try {

            setLoading(true);
            setMessage("Raising Dispute...");

            const { nftContract } = await getContracts();

            const tx =
                await nftContract.disputeInvoice(
                    invoice.id
                );

            await tx.wait();

            setMessage("⚠️ Dispute Raised");

            setTimeout(() => {
    setLoading(false);
    onClose();
    onSuccess && onSuccess();
}, 1200);

        } catch (err) {

            setMessage("❌ Transaction Failed");

            setTimeout(() => {
                setLoading(false);
            }, 1500);

        }

    }



    return (

        <div
            className="modal-overlay open"
            onClick={onClose}
        >

            <div
                className="invoice-detail"
                onClick={(e) => e.stopPropagation()}
            >

                <div className="detail-header">

                    <div className="detail-invoice-id">
                        INVOICE #{invoice.id}
                    </div>

                    <div className="detail-title">
                        Invoice Details
                    </div>

                </div>



                <div className="detail-meta">

                    <div className="detail-meta-item">

                        <div className="detail-meta-label">
                            Buyer
                        </div>

                        <div className="detail-meta-value mono">
                            {invoice.buyer}
                        </div>

                    </div>



                    <div className="detail-meta-item">

                        <div className="detail-meta-label">
                            Due Date
                        </div>

                        <div className="detail-meta-value">
                            {invoice.dueDate}
                        </div>

                    </div>

                </div>



                <div className="detail-amount-block">

                    <div className="detail-amount-label">
                        Amount
                    </div>

                    <div className="detail-amount-value">
                        {invoice.amount}
                    </div>

                    <div className="detail-amount-eth">
                        ETH
                    </div>

                </div>



                <div className="detail-actions">

                    <button
                        className="btn-pay"
                        onClick={payInvoice}
                        disabled={loading}
                    >
                        Pay Invoice
                    </button>


                    <button
                        className="btn-dispute"
                        onClick={disputeInvoice}
                        disabled={loading}
                    >
                        Dispute
                    </button>

                </div>


                <TxToast
                    show={loading}
                    message={message}
                />

            </div>

        </div>

    );

}