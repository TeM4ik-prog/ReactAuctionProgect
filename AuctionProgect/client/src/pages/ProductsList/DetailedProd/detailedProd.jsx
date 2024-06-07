import "./detailedProduct.css";

import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import localSitePath from "../../../../localSitePath";
import { PopupContext } from "../../../App";
import CheckUser from "../../../components/checkUser/checkUser";
import User from "../../../components/userInfo/user/user";

export default function DetailedProduct() {
    let { showMessage } = useContext(PopupContext)

    const [detailedInfo, setDetailedInfo] = useState(null)
    const [bigImage, setBigImage] = useState()

    const [isPasswordConfirmed, setIsPasswordConfirmed] = useState(false)
    const [showDialog, setShowDialog] = useState(false)
    const [valueChangeAuction, setValueChangeAuction] = useState("")

    const [trigger, setTrigger] = useState(false);

    let { productId } = useParams()



    let onChangeAuctionPrice = (e) => {
        e.preventDefault()

        axios.post(
            `${localSitePath}/auth/RaiseProdPrice`,
            {
                valueChangeAuction: valueChangeAuction,
                productId: detailedInfo.product.productId
            },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            })
            .then((response) => {
                showMessage({ message: response.data.message, bad: false })

                setTrigger(prev => !prev);
            })
            .catch((error) => {
                showMessage({ message: error.response.data.message, bad: true })
            });
    }


    useEffect(() => {
        axios.post(
            `${localSitePath}/data/getDetailedProduct`,
            { productId },

            {
                headers: {
                    "Content-Type": "application/json",
                },
            })
            .then((response) => {
                console.log("Resp data", response.data)
                setDetailedInfo(response.data)

                setBigImage(response.data.product.Images[0].url)
            })
            .catch((error) => {
                console.log(error)
            });

    }, [productId, trigger])


    return (

        <>
            {detailedInfo ? (
                <>
                    <div className="header-product-title">
                        <p className="product-name">{detailedInfo.product.name}</p>
                        <Link to={`/products/${detailedInfo.product.CategoryCategoryId}`} style={{ height: "min-content" }} >
                            <p className="text-link-category"> , из категории</p>
                        </Link>
                    </div>
                    {/*  */}
                    <div className="detailedInfo-container">
                        <div className="preview-container">

                            <div className="images-preview">
                                {(detailedInfo.product.Images).map((item, index) => (
                                    <div className="mini-image-preview">
                                        <img key={index} src={item.url}
                                            onClick={() => (setBigImage(item.url))}></img>

                                    </div>
                                ))}
                            </div>

                            <div className="big-image">
                                <img src={bigImage}></img>
                            </div>
                        </div>


                        <div className="auction-other-info">

                            {detailedInfo.product.UserProds ? (
                                <User info={detailedInfo.product.UserProds[0]} />
                            ) : null}


                            {detailedInfo.product.isActive ? (
                                <div className="auction-price-end-container">
                                    <p className="auction-price">{detailedInfo.product.price}</p>

                                    <div className="time-to-end-product">
                                        <p>Завершается {`${new Date(detailedInfo.product.dateEnd).toLocaleDateString()} в ${new Date(detailedInfo.product.dateEnd).toLocaleTimeString()}`}</p>
                                    </div>

                                </div>
                            ) : null}



                            <div className="allUser-link-container">
                                <Link to={`/participants/${detailedInfo.product.productId}`}>
                                    <p>Участники аукциона</p>
                                </Link>


                            </div>

                            <div className="detailed-text-container">
                                <p className="detailed-info-text-prod">{detailedInfo.product.detailedInfo}</p>
                            </div>

                            {detailedInfo.product.isActive ? (
                                <form className="form-rise-price" onSubmit={isPasswordConfirmed ? (e) => onChangeAuctionPrice(e)
                                    : (e) => {
                                        e.preventDefault()
                                        setShowDialog(true)
                                    }}>

                                    <input className="raise-price-auction-input" placeholder="поднять цену" type="number" min={detailedInfo.product.price + 1} onChange={(e) => setValueChangeAuction(e.target.value)} required></input>
                                    <button>поднять цену</button>
                                </form>





                            ) : <h1 className="end-info-text">Завершено</h1>}



                            {showDialog ? (
                                <CheckUser
                                    onSetShowDialog={setShowDialog}
                                    showDialog={showDialog}
                                    setIsPasswordConfirmed={setIsPasswordConfirmed} />
                            ) : null}

                        </div>


                    </div>
                </>
            ) : <h1>Загрузка...</h1>
            }

        </>

    )
}