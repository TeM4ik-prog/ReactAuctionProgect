import axios from "axios"
import { useContext, useState } from "react"
import { PopupContext } from "../../App"

import localSitePath from "../../../localSitePath"
import "./checkUser.css"

export default function CheckUser({ onSetShowDialog, showDialog, setIsPasswordConfirmed }) {
    let { showMessage } = useContext(PopupContext)
    const [passwordConfirm, setPasswordConfirm] = useState('')

    // const [isPasswordConfirmed, setIsPasswordConfirmed] = useState(false)

    onSetShowDialog(true)

    let ConfirmUserByPassword = (passwordConfirm) => {
        axios.post(
            `${localSitePath}/auth/ConfirmPassword`,
            { passwordConfirm: passwordConfirm },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            })
            .then((response) => {
                showMessage({ message: response.data.message, bad: false })
                setTimeout(() => {
                    setIsPasswordConfirmed(true)
                    onSetShowDialog(false)
                }, 500);
            })
            .catch((error) => {
                showMessage({ message: error.response.data.message, bad: true })
            });
    }

    return (
        <>
            {showDialog ? (
                <>
                    <div className="filter-block"></div>
                    <dialog className="dialog-confirm-password" style={{ filter: "none !important" }} open>
                        <div className="header-info-dialog">
                            <p></p>
                            <p className="text-title-dialog">Подтвердите пароль</p>
                            <img className="close-image" src="../../imgs/icons/close.png"
                                onClick={() => (onSetShowDialog(false))}>
                            </img>
                        </div>

                        <div className="password-confirm-container">
                            <input className="input-password" placeholder="password" value={passwordConfirm}
                                onChange={(e) => (setPasswordConfirm(e.target.value))}></input>

                            <div className="image-coin-container">
                                <img src="../../imgs/addBalance/Coins.png"></img>
                            </div>

                            <button className="butt-confirm" onClick={() => (ConfirmUserByPassword(passwordConfirm))}>Подтвертить пароль</button>
                        </div>

                    </dialog >
                </>
            ) : null}





        </>
    )
}