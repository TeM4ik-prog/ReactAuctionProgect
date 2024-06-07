import Product from "../productOne/product"

import "./productList.css"

export default function ProductsListComponent({ prods_data }) {

    return (
        <div className="productsList-container">
            {
                prods_data && prods_data.length > 0 ? (
                    <>
                        {
                            prods_data.map((item, index) => (
                                <Product key={index} info={item} />
                            ))
                        }
                    </>
                ) : <h1>Продукты не найдены</h1>
            }

        </div>
    )
}