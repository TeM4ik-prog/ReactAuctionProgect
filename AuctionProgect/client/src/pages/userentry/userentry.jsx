import axios from "axios";
import { useContext, useState } from "react";
import localSitePath from "../../../localSitePath";
import { PopupContext } from "../../App";
import { RandElemFromAr, RandPassword } from "../../utils/FnsUtilts";
import { ArImages } from "../../utils/RandData";
import "./userentry.css";


let NotSeePath = "./imgs/userentry/notsee_password.png"
let SeePath = "./imgs/userentry/see_password.png"


export default function UserEntry() {
    const [isRegisterMode, setIsRegisterMode] = useState(true)
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const [avatar, setAvatar] = useState(RandElemFromAr(ArImages))


    const [currentImg, setCurrentImg] = useState(NotSeePath)
    const [passwordType, setPasswordType] = useState('password')

    let { showMessage } = useContext(PopupContext)

    let changeVisible = () => {
        setCurrentImg(currentImg == NotSeePath ? SeePath : NotSeePath)
        setPasswordType(passwordType == "text" ? "password" : "text")
    }

    let IsValidForm = () => {
        if (name != '' && password != '') {
            return true
        }
        return false
    }

    let UserEntry = () => {
        if (isRegisterMode) {
            axios.post(
                `${localSitePath}/register`,
                { username: name, password: password, avatar: avatar },

                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                })
                .then((response) => {
                    showMessage({ message: response.data.massage, bad: false });
                    if (response.status === 200) {
                        setTimeout(() => {
                            window.location = "/"
                        }, 1500);
                    }
                })
                .catch((error) => {
                    showMessage({ message: error.response.data.errText, bad: true });
                });
        }

        else {
            axios.post(
                `${localSitePath}/login`,
                { username: name, password: password },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                })
                .then((response) => {
                    showMessage({ message: response.data.massage, bad: false });

                    if (response.status === 200) {
                        window.location = "/"
                    }
                })
                .catch((error) => {
                    showMessage({ message: error.response.data.errText, bad: true });
                });

        }





    }


    let RandAvatar = () => {
        setAvatar(RandElemFromAr(ArImages))
    }




    return (

        <div className="container">
            <div className="info-container">
                <h1 className="title-entry">
                    {isRegisterMode ? 'Регистрация' : 'Авторизация'}
                </h1>


                <div className="block">
                    <input className="input-in-after" type="text" placeholder="Ваше имя"
                        onChange={(e) => setName(e.target.value)} value={name} />
                </div>

                <div className="block" style={{ flexDirection: "row" }}>
                    <input className="input-in-after" placeholder="Пароль" onChange={(e) => setPassword(e.target.value)} type={passwordType} value={password}></input>
                    <img onClick={changeVisible} src={currentImg}></img>
                    {isRegisterMode ? (<img onClick={() => setPassword(RandPassword())} src="./imgs/userentry/152068.png"></img>) : null}
                </div>


                {isRegisterMode ? (
                    <div className="avatar-container">
                        {/* https://i.pinimg.com/236x/2a/f5/3d/2af53d8f1be483dd0e05b7b18142c33c.jpg */}
                        <img class="UserAva" src={avatar}></img>
                        <img onClick={() => (RandAvatar())} class="mini_img" src="./imgs/userentry/152068.png"></img>
                    </div>
                ) : null}


                <button className={`button-submit-entry ${IsValidForm() ? 'CanUserSubmit' : ''}`} onClick={() => {
                    if (IsValidForm()) {
                        UserEntry()
                    }
                }
                }>{isRegisterMode ? 'Зарегистрироваться' : 'Авторизироваться'}</button>

                <div className="bottom-change-entry">
                    {isRegisterMode ? (
                        <>
                            <p>Уже есть аккаунт?</p>
                            <p className="change-text" onClick={() => setIsRegisterMode(false)}>Войти</p>
                        </>
                    ) :
                        <>
                            <p>Еще нет аккаунта?</p>
                            <p className="change-text" onClick={() => setIsRegisterMode(true)}>Регистрация</p>
                        </>

                    }
                </div>

            </div>
        </div >



    )
}

