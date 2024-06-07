import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import localSitePath from "../../../localSitePath";
import ProductsListComponent from "../../components/product/productList/productList";

export default function VisitUserProfile() {
    const [visitUserInfo, setVisitUserInfo] = useState([])
    let { username } = useParams()

    console.log(username)

    useEffect(() => {
        console.log(username)
        setTimeout(() => {
            axios.post(
                `${localSitePath}/data/getVisitUserData`,
                { username },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                })
                .then((response) => {
                    console.log(response.data)
                    setVisitUserInfo(response.data)
                })
                .catch((error) => {
                    console.log(error)
                });
        }, 10);
    }, [username])


    return (
        <div>

            <ProductsListComponent prods_data={visitUserInfo.userProds} />
        </div>
    )
}