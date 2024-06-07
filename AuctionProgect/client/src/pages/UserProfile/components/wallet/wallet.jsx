import axios from "axios";
import { useContext, useState } from "react";
import localSitePath from "../../../../../localSitePath";
import { PopupContext } from "../../../../App";
import CheckUser from "../../../../components/checkUser/checkUser";
import "./wallet.css";

export default function Wallet() {
    let { showMessage } = useContext(PopupContext)
    const [isPasswordConfirmed, setIsPasswordConfirmed] = useState(false)
    const [showDialog, setShowDialog] = useState(false)

    const [valueMoneyToAdd, setValueMoneyToAdd] = useState("")




    let onAddBalance = (e) => {
        e.preventDefault()
        axios.post(
            `${localSitePath}/auth/AddBalance`,
            { valueMoney: valueMoneyToAdd },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            })
            .then((response) => {
                showMessage({ message: response.data.message, bad: false })

                setTimeout(() => {
                    window.location.reload()
                }, 500);
                // setBasket(response.data)
            })
            .catch((error) => {
                console.log(error)
            });

    }


    return (
        <>


            <form className="wallet-container" onSubmit={isPasswordConfirmed ?
                (e) => onAddBalance(e) :
                (e) => {
                    e.preventDefault()
                    setShowDialog(true)
                }}>


                <div className="wallet-header">
                    <h1>Wallet</h1>
                    <div className="current-balance"></div>
                </div>


                <div class="input-group">
                    <span className="icon">💰</span>

                    <input type="number" placeholder="money to add" value={valueMoneyToAdd}
                        onChange={(e) => setValueMoneyToAdd(e.target.value)}
                        disabled={showDialog ? true : false} min={1} required></input>

                </div>
                <button className={`btn-add ${isPasswordConfirmed ? "active" : null}`} >Пополнить баланс</button>
            </form >


            {/* <h1>Wallet</h1>
            <div>
                <input type="number" placeholder="money to add" value={valueMoneyToAdd}
                    onChange={(e) => setValueMoneyToAdd(e.target.value)}
                    disabled={showDialog ? true : false} ></input>

                <button onClick={isPasswordConfirmed ? onAddBalance : () => setShowDialog(true)}>Add Balance</button>
            </div> */}

            {
                showDialog ? (
                    <CheckUser
                        onSetShowDialog={setShowDialog}
                        showDialog={showDialog}
                        setIsPasswordConfirmed={setIsPasswordConfirmed} />
                ) : null
            }
        </>
    )
}















