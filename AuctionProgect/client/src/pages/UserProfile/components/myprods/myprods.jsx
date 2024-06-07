import axios from "axios";
import { useEffect, useState } from "react";
import localSitePath from "../../../../../localSitePath";
import ProductsListComponent from "../../../../components/product/productList/productList";

export default function MyProds() {
    const [userProds, setUserProds] = useState([])


    useEffect(() => {
        axios.post(
            `${localSitePath}/auth/getUserProds`,
            {},
            {
                headers: {
                    "Content-Type": "application/json",
                },
            })
            .then((response) => {
                console.log("Resp data", response.data)
                setUserProds(response.data)
            })
            .catch((error) => {
                console.log(error)
            });

    }, [])


    return (
        <>
            <h1>My Products</h1>

            <ProductsListComponent prods_data={userProds} />

        </>
    )
}