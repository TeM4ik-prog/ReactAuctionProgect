import { useContext, useEffect, useState } from "react";
import 'react-datepicker/dist/react-datepicker.css';
import "./sell.css";

import axios from "axios";
import DatePicker from 'react-datepicker';
import localSitePath from "../../../../../localSitePath";
import { PopupContext } from "../../../../App";


export default function Sell() {
    let { showMessage } = useContext(PopupContext)

    //
    const minDate = new Date();
    minDate.setDate(minDate.getDate());

    const [endTime, setEndTime] = useState();
    const [categories, setCategories] = useState()


    const handleEndTimeChange = (date) => {
        setEndTime(date);
    };

    const onSubmitFrom = async (e) => {
        e.preventDefault()

        const formProductData = new FormData(e.target);

        axios.post(
            `${localSitePath}/auth/addProd`,
            formProductData,
            {
                headers: {
                    "Content-Type": "multipart/form-data"
                },
            })
            .then((response) => {
                console.log(response.data)
                showMessage({ message: response.data, bad: false })
            })
            .catch((error) => {
                showMessage({ message: error.response.data, bad: true })
                console.log(error)
            });

        // e.target.reset()//обнуление формы
    }


    useEffect(() => {
        setTimeout(() => {
            axios.post(
                `${localSitePath}/data/getCategories`,
                {},
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                })
                .then((response) => {
                    console.log(response.data)
                    setCategories(response.data)
                })
                .catch((error) => {
                    console.log(error)
                });
        }, 500);
    }, [])



    return (
        <>

            <form className="sell-container" onSubmit={onSubmitFrom} encType="multipart/form-data">
                <p className="title">Выставить на продажу</p>

                <div className="inputs-container">
                    <select className="input-parament" name="categoryId" required>
                        {categories ? (
                            <>
                                <option value="" disabled selected>↓ Выберите категорию ↓</option>
                                {
                                    categories.map((item, index) => (
                                        <option key={index} value={item.categoryId}>{item.name}</option>
                                    ))
                                }
                            </>
                        ) : <option value="" disabled selected>Загрузка категорий...</option>}
                    </select>

                    <input className="input-parament" placeholder="название" name="name" required></input>

                    <textarea
                        className="input-parament textarea-container"
                        rows="4"
                        cols="50"
                        placeholder="подробная информация"
                        name="detailedInfo"
                        required
                    ></textarea>

                    <input className="input-parament" placeholder="стартовая цена" type="number" name="price" required></input>

                    <div className="input-parament">
                        <label htmlFor="endTime">Дата окончания аукциона:</label>
                        <DatePicker
                            name="dateEnd"
                            className="date-picker"
                            selected={endTime}
                            onChange={handleEndTimeChange}
                            minDate={minDate}
                            showTimeSelect={true}
                            showIcon
                            dateFormat="Pp"
                            required
                        />
                    </div>

                    <input className="input-parament" type="file" name="images" accept="image/*" required multiple></input>
                </div>
                <button className="button-submit-sell">Выставить</button>
            </form>

        </>
    )
}