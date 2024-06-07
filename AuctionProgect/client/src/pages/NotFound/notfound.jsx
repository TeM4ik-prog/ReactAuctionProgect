
import { Link } from "react-router-dom"
import "./notfound.css"

export default function () {



    return (


        <div className="error-page-container">
            <div className="imageError">
                <img src='../imgs/404page.png'></img>

            </div>
            <p className="text-err">Похоже, такой страницы нет</p>

            <Link className="to-main-link" to={'/'}>
                <p>перейти на главную</p>
            </Link>

        </div>
    )
}