import axios from "axios";
import { useContext } from "react";
import { Link } from "react-router-dom";
import localSitePath from "../../../../localSitePath";
import { PopupContext, ProdStatusContext } from "../../../App";
import "./product.css";

export default function Product({ info }) {
    let status = useContext(ProdStatusContext)

    let { showMessage } = useContext(PopupContext)

    // console.log(info)

    let OnAddProdToBasket = () => {
        axios.post(
            `${localSitePath}/auth/addProdToBasket`,
            { productId: info.productId },

            {
                headers: {
                    "Content-Type": "application/json",
                },
            })
            .then((response) => {
                showMessage({ message: response.data.message, bad: false });
            })
            .catch((error) => {
                showMessage({ message: error.response.data.message, bad: true });
            });
    }

    let OnDeleteProdFromBasket = () => {
        axios.post(
            `${localSitePath}/auth/deleteProdFromBasket`,
            { productId: info.productId },

            {
                headers: {
                    "Content-Type": "application/json",
                },
            })
            .then((response) => {
                console.log(response.data.massage)
                window.location.reload()
            })
            .catch((error) => {

                console.log(error)
            });


    }

    return (
        <div className="product-container" style={{ backgroundColor: !info.isActive ? "rgba(255, 0, 0, 0.266)" : null }}>
            <div className="image-main-prod">
                {info.Images ? (
                    <img src={info.Images[0].url}></img>
                ) : <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZ40trFX91lyL64uOy7r3fWv6cOdiRMEGr1BO2P-DfyQ&s"></img>}
            </div>

            <div className="info-product-container">
                <Link to={`/products/detailed/${info.productId}`}>
                    <p className="name-text">{info.name}</p>
                </Link>


                <div className="time-to-end-product">
                    {info.isActive ? (
                        <p >Завершается {`${new Date(info.dateEnd).toLocaleDateString()} в ${new Date(info.dateEnd).toLocaleTimeString()}`}</p>
                    ) : <p>Завершено</p>}
                </div>


                <div>

                    {/* <p>Рейтинг продавца</p>
                    <img src="../svg/rating.xml"></img> */}


                </div>

                <p className="detailed-info-text">{info.detailedInfo}</p>
            </div>




            <div className="container-right-info">

                <p className="price-info-text">{info.price}</p>


                {info.UserParticipation && info.UserParticipation.userBidPrice ? (
                    <p className="userBidPrice-text">Ваша ставка: {info.UserParticipation.userBidPrice}</p>
                ) : null}

                {status === "basket" ? (
                    <div className="butt-interact-container" onClick={OnDeleteProdFromBasket}>
                        <div className="butt-addToBasket" >
                            <p>Удалить из корзины</p>
                        </div>
                        <img className="image-basket" src="../imgs/icons/close.png"></img>
                    </div>

                ) : status === "myprods" ? (
                    <Link to={`/products/change/${info.productId}`}>
                        <div className="butt-interact-container">
                            <div className="butt-addToBasket" >
                                <p>Изменить</p>
                            </div>
                            <img className="image-basket" src="../imgs/icons/pencil.png"></img>
                        </div>

                    </Link>

                ) : status === "main" ? (
                    <div className="butt-interact-container" onClick={OnAddProdToBasket}>
                        <div className="butt-addToBasket" >
                            <p>В корзину</p>
                        </div>
                        <img className="image-basket" src="../imgs/icons/basket.png"></img>
                    </div>

                ) : null}

            </div>









        </div >


    )
}