import axios from "axios";
import { useEffect, useState } from "react";
import localSitePath from "../../../../../localSitePath";
import ProductsListComponent from "../../../../components/product/productList/productList";

export default function MyParticipation() {

    const [prodsParticipation, setProdsParticipation] = useState([])


    useEffect(() => {
        axios.post(
            `${localSitePath}/auth/getUserParticipation`,
            {},
            {
                headers: {
                    "Content-Type": "application/json",
                },
            })
            .then((response) => {
                console.log("Resp data", response.data)
                setProdsParticipation(response.data)
            })
            .catch((error) => {
                console.log(error)
            });

    }, [])


    return (
        <>
            <h1>Prods Participation</h1>

            <ProductsListComponent prods_data={prodsParticipation} />
        </>
    )
}