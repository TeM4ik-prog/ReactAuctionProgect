import { Link, Route, Routes } from "react-router-dom"

import axios from "axios"
import { useContext } from "react"
import localSitePath from "../../../localSitePath"
import { ProdStatusContext, userDataContext } from "../../App"
import Basket from "./components/basket/basket"
import MyProds from "./components/myprods/myprods"
import MyParticipation from "./components/participation/participation"
import Sell from "./components/sell/sell"
import Wallet from "./components/wallet/wallet"
import "./userProfile.css"


export default function UserProfile() {
    let { userData } = useContext(userDataContext)

    let onLogout = () => {
        axios.post(
            `${localSitePath}/auth/logout`,
            {},
            {
                headers: {
                    "Content-Type": "application/json",
                },
            })
            .then(() => { window.location = "/" })
            .catch(error => ('Ошибка:' + error))
    }

    console.log(userData)

    return (
        <>
            {
                userData ? (
                    <>
                        <div className="profile-container">
                            <div className="header-user-menu">
                                <div className="user-info">
                                    <img className="user-image" src={userData.avatar}></img>
                                    {/* https://img.freepik.com/free-photo/bright-petals-gift-love-in-a-bouquet-generated-by-ai_188544-13370.jpg" */}

                                    <div className="title-data-user">
                                        <p className="username">{userData.username}</p>

                                        <Link to={"/profile/wallet/add"} replace>
                                            <div className="user-balance">
                                                <img src="../../imgs/WalletMoney.png"></img>
                                                <p>Баланс: {userData.money}</p>
                                            </div>
                                        </Link>

                                    </div>


                                    <p onClick={onLogout} className="logout-text">Выйти</p>
                                </div>

                                <div className="user-interact">
                                    <Link to={`/profile/basket`} replace>
                                        <p>Корзина</p>
                                    </Link>

                                    <Link to={`/profile/myprods`} replace>
                                        <p>Мои товары</p>
                                    </Link>

                                    <Link to={`/profile/participation`} replace>
                                        <p>Мои участия</p>
                                    </Link>

                                    <Link to={`/profile/sell`} replace>
                                        <p>Выставить на продажу</p>
                                    </Link>
                                </div>

                            </div>
                        </div>


                        <Routes>
                            <Route exact path="/basket" element={
                                <ProdStatusContext.Provider value={"basket"}>
                                    <Basket />
                                </ProdStatusContext.Provider>
                            } />


                            <Route exact path="/myprods" element={
                                <ProdStatusContext.Provider value={"myprods"}>
                                    <MyProds />
                                </ProdStatusContext.Provider>
                            } />



                            <Route exact path="/participation" element={
                                <ProdStatusContext.Provider value={""}>
                                    <MyParticipation />
                                </ProdStatusContext.Provider>
                            } />





                            <Route exact path="/sell" element={<Sell />} />



                            <Route exact path="/wallet/add" element={<Wallet />} />
                        </Routes>
                    </ >
                ) :

                    <Link to={"/userentry"}>
                        <h1>Войти</h1>
                    </Link>
            }



        </>
    )
}