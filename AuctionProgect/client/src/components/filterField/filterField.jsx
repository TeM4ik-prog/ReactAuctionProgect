import axios from "axios";
import "./filterField.css"

import { BrowserRouter as useHistory, useLocation, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react";

export default function FilterField() {
    const [formValues, setFormValues] = useState({});
    const [isExcludeMyProds, setIsExcludeMyProds] = useState(true)
    const navigate = useNavigate();


    // useEffect(() => {
    //     if (localStorage.getItem("path")) {
    //         console.log(JSON.parse(localStorage.getItem("path")))
    //         setFormValues(JSON.parse(localStorage.getItem("path")))

    //     }
    // }, [])

    useEffect(() => {

        let searchParams = new URLSearchParams();

        Object.keys(formValues).forEach(key => {
            if (formValues[key]) {
                searchParams.set(key, formValues[key]);
            }
        });

        navigate(`?${searchParams.toString()}`, { replace: true });


    }, [formValues])


    let onFilterProds = (e) => {
        const { name, value } = e.target;

        setFormValues(prevValues => ({
            ...prevValues,
            [name]: value
        }));
        // console.log(formValues)
        // localStorage.setItem("path", JSON.stringify(formValues))
    }

    let onExcludeMyProds = (e) => {

        setIsExcludeMyProds(!isExcludeMyProds)
    }



    return (
        <>
            <form className="filter-container" onChange={onFilterProds} >
                <h2>Фильтры</h2>

                <div className="input-filters-container">

                    <div class="input-block">
                        <label>Найти по названию</label>

                        <input className="input-block-filter" type=" text" placeholder="поиск" name="nameFind"></input>
                    </div>

                    <div class="input-block">

                        <label>Цена аукциона</label>
                        <div className="range-inputs-container">
                            <input className="input-block-filter" type="number" min={0} name="minPrice" placeholder="min"></input>
                            <input className="input-block-filter" type="number" min={0} name="maxPrice" placeholder="max"></input>
                        </div>
                    </div>

                    <div class="input-block">
                        <label>Рейтинг продавца</label>
                        <input step={1} min={1} max={5} type="range" name="seller_rating"></input>
                    </div>

                    <fieldset class="input-block">
                        <legend>Выбрать:</legend>

                        <div>
                            <input type="radio" name="showActive" value={''} ></input>
                            <label htmlFor="showActive">Все</label>
                        </div>

                        <div>
                            <input type="radio" id="showInactive" value={false} name="showActive"></input>

                            <label htmlFor="showInactive">Только завершенные</label>
                        </div>


                        <div>
                            <input type="radio" value={true} id="showActive" name="showActive"></input>
                            <label htmlFor="showActive">Только НЕзавершенные</label>
                        </div>


                        {/* <div>
                            <input type="checkbox" value={true} id="excludeMyProds" name="excludeMyProds"></input>
                            <label htmlFor="excludeMyProds">Только мои товары</label>
                        </div> */}


                    </fieldset>


                    <div>
                        <input type="checkbox" value={isExcludeMyProds} id="excludeMyProds" name="excludeMyProds" onClick={onExcludeMyProds} checked={isExcludeMyProds}></input>
                        <label htmlFor="excludeMyProds">Исключить мои товары</label>
                    </div>
                </div>
            </form >
        </>
    )
}