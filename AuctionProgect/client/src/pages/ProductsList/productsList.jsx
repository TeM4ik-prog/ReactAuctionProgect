import axios from "axios"
import { useEffect, useState } from "react"
import { useLocation, useParams, useSearchParams } from "react-router-dom"
import FilterField from "../../components/filterField/filterField"
import Header from "../../components/particals/header/header"
import ProductsListComponent from "../../components/product/productList/productList"
import "./productsList.css"
import localSitePath from "../../../localSitePath"


export default function ProductsList() {
    const [productsListData, setProductsListData] = useState([])
    const [isOpenUserFilter, SetIsOpenUserFilter] = useState(false)

    const [paramsMapFilter, setParamsMapFilter] = useState({})

    const location = useLocation();

    const [searchParams] = useSearchParams();
    let { category } = useParams()



    useEffect(() => {



        const paramsMap = {
            nameFind: searchParams.get("nameFind") || '',
            minPrice: searchParams.get("minPrice") || 0,
            maxPrice: searchParams.get("maxPrice") || 99999999,

            showActive: (searchParams.get("showActive")) || undefined,

            excludeMyProds: searchParams.get("excludeMyProds") == 'true' ? false : true,
        };
        console.log(paramsMap)

        axios.post(
            `${localSitePath}/data/getProducts`,
            {
                categoryId: category,
                paramsMap
            },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            })
            .then((response) => {

                console.log("Resp data", response.data)
                setProductsListData(response.data)
            })
            .catch((error) => {
                console.log(error)
            });
    }, [category, searchParams, location.search])


    return (
        <>
            <Header></Header>

            {/* { ? ( */}
            <div className="filter-flow-field" style={{ display: isOpenUserFilter ? "inline-flex" : "none" }}>
                <FilterField />

                <img className="close-image-flow-filter" src="../../imgs/icons/close.png"
                    onClick={() => (SetIsOpenUserFilter(false))}>
                </img>


            </div>
            {/* ) : null} */}


            <div className="container-info-category">
                <p>{productsListData.categoryName}</p>

                <button className="filter-button" onClick={() => (SetIsOpenUserFilter(true))}>Фильтры</button>
            </div>


            <div className="container-data-interact">
                <div className="canHide">
                    <FilterField />
                </div>


                <div className="cut-width-class">
                    <ProductsListComponent className prods_data={productsListData.products} />

                </div>
            </div>

        </>
    )
}