import "./popup.css"

export default function Popup({ messages }) {


    return (
        <>
            {messages ? (
                <div className="popups-container">
                    {messages.map((item, index) => (
                        <div className="popup" style={{
                            backgroundColor: item.bad ? "red" : "green"
                        }}>
                            {item.message}
                        </div >
                    ))}
                </div>

            ) : null}







            {/* {
                message ? (
                    <div className="popup" style={{
                        backgroundColor: message.bad ? "red" : "green"
                    }}>
                        {message.message}
                    </div >
                ) : null */}
            {/* } */}
        </>
    )
}