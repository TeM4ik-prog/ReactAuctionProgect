import { Link } from "react-router-dom";

import "./user.css"

export default function User({ info }) {

    // console.log(info)


    return (
        <div className="block-trader">
            <img className="trader-avatar" src={info.avatar}></img>

            <div className="trader-info">
                <p className="trader-name">{info.username}</p>

                <div>
                    {info.UserParticipation ? (
                        <p className="userBidPrice-text-user">Ставка: {info.UserParticipation.userBidPrice}</p>
                    ) : null}
                </div>


                <div className="bottom-trader-links">
                    <Link to={`/visit/${info.username}`}>
                        <p>перейти на страницу пользователя</p>

                        {/* другие товары этого пользователя */}
                    </Link>
                </div>
            </div>



        </div>

    )
}