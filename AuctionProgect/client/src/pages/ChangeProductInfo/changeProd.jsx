import { useContext, useEffect, useState } from "react"
import { PopupContext } from "../../App"
import { useParams } from "react-router-dom"
import axios from "axios"
import "./changeProd.css"
import DetailedProduct from "../ProductsList/DetailedProd/detailedProd"
import localSitePath from "../../../localSitePath"



export default function ChangeProductInfo() {
    let { showMessage } = useContext(PopupContext)

    const [changeProdInfo, setChangeProdInfo] = useState(null)
    const [isProductBelongsToUser, setIsProductBelongsToUser] = useState(false)

    const [canUserChangePrice, setCanUserChangePrice] = useState(false)

    const [dataChange, setDataChange] = useState({
        // name: '',
        // detailedInfo: ''
    });


    let { productId } = useParams()


    useEffect(() => {

        axios.post(
            `${localSitePath}/auth/checkIsProductBelongsToUser`,
            { productId },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            })
            .then((response) => {
                showMessage({ message: response.data.message, bad: false })
                console.log(response.data)

                setChangeProdInfo(response.data.product)
                setIsProductBelongsToUser(true)
                setCanUserChangePrice(response.data.canUserChangePrice)
            })
            .catch((error) => {
                showMessage({ message: error.response.data.message, bad: true })
            });

    }, [productId])


    const handleBlur = (e) => {
        const { name, textContent } = e.target;
        setDataChange(prev => ({ ...prev, [name]: textContent }));
        console.log(changeProdInfo)
    };


    const OnChangeProductInfo = (e) => {
        e.preventDefault()
        console.log("Сохранение данных...")

        const formProductData = new FormData(e.target);

        formProductData.append('productId', productId)

        console.log(formProductData)

        axios.put(
            `${localSitePath}/auth/changeProductInfo`,
            formProductData,
            {
                headers: {
                    "Content-Type": "multipart/form-data"
                },
            })
            .then((response) => {
                console.log(response.data)
                showMessage({ message: response.data.massage, bad: false })
            })
            .catch((error) => {
                showMessage({ message: error.response.data.massage, bad: true })
                console.log(error)
            });
    }

    return (
        <>
            {isProductBelongsToUser ? (
                <>
                    {changeProdInfo ? (

                        <div className="change-info-container">
                            <p className="top-text">Изменение данных продукта</p>

                            <form onSubmit={OnChangeProductInfo} className="form-change-prod" encType="multipart/form-data" >
                                <input type="hidden" name="name" value={changeProdInfo.name} />
                                <input type="hidden" name="detailedInfo" value={changeProdInfo.detailedInfo} />

                                <fieldset className="change-info-block">
                                    <legend>Название</legend>
                                    <p className="edit-info-text" contentEditable='true' onBlur={(e) => setChangeProdInfo(prev => ({ ...prev, name: e.target.textContent }))}>
                                        {changeProdInfo.name}
                                    </p>
                                </fieldset>

                                <fieldset className="change-info-block">
                                    <legend>Подробная информация</legend>
                                    <p className="edit-info-text" contentEditable='true' onBlur={(e) => setChangeProdInfo(prev => ({ ...prev, detailedInfo: e.target.textContent }))}>
                                        {changeProdInfo.detailedInfo}
                                    </p>
                                </fieldset>


                                <fieldset className="change-info-block" style={{ backgroundColor: !canUserChangePrice ? "rgba(255, 0, 0, 0.266)" : null }} >
                                    <legend>Стартовая цена</legend>
                                    <input className="edit-info-text" name='price' value={changeProdInfo.price} type="number" onChange={(e) => {
                                        if (canUserChangePrice) {
                                            setChangeProdInfo(prev => ({ ...prev, price: e.target.value }))
                                        }
                                        else {
                                            showMessage({ message: "Нельзя изменить старновую цену, т.к в аукционе учавствуют пользователи", bad: true })
                                        }
                                    }}></input>


                                </fieldset>


                                <button className="button-submit-change" type="submit">Сохранить изменения</button>
                            </form>





                        </div>
                    ) : <h1>Данные не обнаружены</h1>}
                </>
            ) : <p>Отказано в доступе</p>
            }

        </>

    )
}