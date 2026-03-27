import { useState } from "react";
import { FilePlus } from "lucide-react";

export default function CreateInvoiceModal({
    open,
    onClose,
    onCreate
}) {

    const [form, setForm] = useState({
        buyer: "",
        amount: "",
        minBid: "",
        dueDate: ""
    });

    if (!open) return null;

    return (

        <div
            className="modal-overlay open"
            onClick={onClose}
        >

            <div
                className="modal premium-modal"
                onClick={e => e.stopPropagation()}
            >

                <div className="modal-header">

                    <div>

                        <div className="modal-title">
                            <FilePlus size={18}/>
                            Create Invoice
                        </div>

                        <div className="modal-sub">
                            Mint invoice NFT & list for auction
                        </div>

                    </div>

                    <button
                        className="modal-close"
                        onClick={onClose}
                    >
                        ×
                    </button>

                </div>


                <div className="form-group">

                    <label className="form-label">
                        Buyer Address
                    </label>

                    <input
                        className="form-input"
                        placeholder="0x..."
                        onChange={e =>
                            setForm({
                                ...form,
                                buyer: e.target.value
                            })
                        }
                    />

                </div>



                <div className="form-row">

                    <div className="form-group">

                        <label className="form-label">
                            Amount (ETH)
                        </label>

                        <input
                            className="form-input"
                            placeholder="0.5"
                            onChange={e =>
                                setForm({
                                    ...form,
                                    amount: e.target.value
                                })
                            }
                        />

                    </div>


                    <div className="form-group">

                        <label className="form-label">
                            Minimum Bid
                        </label>

                        <input
                            className="form-input"
                            placeholder="0.3"
                            onChange={e =>
                                setForm({
                                    ...form,
                                    minBid: e.target.value
                                })
                            }
                        />

                    </div>

                </div>



                <div className="form-group">

                    <label className="form-label">
                        Due Date
                    </label>

                    <input
                        type="date"
                        className="form-input"
                        onChange={e =>
                            setForm({
                                ...form,
                                dueDate: e.target.value
                            })
                        }
                    />

                </div>



                <div className="modal-footer">

                    <button
                        className="btn-ghost"
                        onClick={onClose}
                    >
                        Cancel
                    </button>

                    <button
                        className="btn-accent"
                        onClick={() => onCreate(form)}
                    >
                        Create & List
                    </button>

                </div>

            </div>

        </div>

    );

}