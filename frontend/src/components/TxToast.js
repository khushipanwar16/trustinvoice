export default function TxToast({
    show,
    message
}) {

    if (!show) return null;

    return (

        <div className="tx-toast show">

            <div className="tx-spinner" />

            <div>
                {message}
            </div>

        </div>

    );

}