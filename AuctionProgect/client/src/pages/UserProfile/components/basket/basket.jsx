import axios from "axios"
import { useEffect, useState } from "react"
import localSitePath from "../../../../../localSitePath"
import ProductsListComponent from "../../../../components/product/productList/productList"

export default function Basket() {
    const [basket, setBasket] = useState([])

    useEffect(() => {
        axios.post(
            `${localSitePath}/auth/getUserBasket`,
            {},
            {
                headers: {
                    "Content-Type": "application/json",
                },
            })
            .then((response) => {
                console.log("Resp data", response.data)
                setBasket(response.data)
            })
            .catch((error) => {
                console.log(error)
            });

    }, [])


    return (
        <>
            <h1>Basket</h1>


            <ProductsListComponent prods_data={basket} />

            {/* <h1>{userData.data.password}</h1> */}
        </>
    )
}