import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import localSitePath from "../../../../localSitePath";
import { userDataContext } from "../../../App";
import "./header.css";

// { onCategories }
export default function Header() {
    let { userData } = useContext(userDataContext)

    const [categories, setCategories] = useState(null)
    const [userSearch, setUserSearch] = useState('')


    // let onSearchByName = () => {
    //     const params = new URLSearchParams();
    //     params.append('nameFind', userSearch);
    //     window.location = `/products?${params.toString()}`
    // }








    useEffect(() => {
        axios.post(
            `${localSitePath}/data/getCategories`,
            {},
            {
                headers: {
                    "Content-Type": "application/json",
                },
            })
            .then((response) => {
                // console.log(response.data)
                setCategories(response.data)
            })
            .catch((error) => {
                console.log(error)
            });
    }, [])



    return (

        <div className="header-container">
            <div className="top-block">

                {userData ?
                    (<Link to={`/profile`}>
                        <p>Профиль {userData.username}</p>
                    </Link>)
                    :
                    <Link to={'/userentry'}>
                        <p>Войти</p>
                    </Link>
                }

                <div className="other-info">
                    <p>магазины </p>
                    <p>помощь</p>
                    <p>доставка и оплата</p>
                </div>

                <Link to={'/profile/basket'}>
                    <p>корзина</p>
                </Link>
            </div>


            <div className="main-body-block">
                <div className="logo">
                    <img src="../imgs/MainIco.png"></img>
                </div>

                <div className="search-container">
                    <input className="search-input" placeholder="поиск" name="nameFind" value={userSearch} onChange={(e) => (setUserSearch(e.target.value))}></input>

                    <button className="button-search">
                        <Link className="link-butt-search" to={`/products?nameFind=${userSearch}`}>
                            поиск
                        </Link>
                    </button>



                </div>

            </div>

            <div className="categories">
                <>
                    {
                        categories ? (
                            <>
                                {
                                    categories.map((item, index) => (
                                        <Link to={`/products/${item.categoryId}`}>
                                            <p className="category-text" key={index}>{item.name}</p>
                                        </Link>
                                    ))
                                }
                            </>
                        ) : <p className="category-text">загрузка категорий...</p>}
                </>

                {/* <p>Электроника</p>
                <p>Электроника</p>
                <p>Мода</p>
                <p>Здоровье и Красота</p>
                <p>Дом и Сад</p>
                <p>Виды спорта</p>
                <p>Коллекционные товары</p>
                <p>Товары для бизнеса</p>
                <p>Авто и мото</p> */}
            </div>

        </div >
    )


}