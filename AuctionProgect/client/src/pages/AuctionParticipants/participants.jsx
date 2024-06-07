import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import UsersList from "../../components/userInfo/userList/userList";



import User from "../../components/userInfo/user/user";
import "./participants.css";
import localSitePath from "../../../localSitePath";

export default function AuctionParticipantsPage() {
    let { productId } = useParams()

    const [users, setUsers] = useState([])
    let [userWinner, setUserWinner] = useState([])


    const [limitTimes, setLimitTimes] = useState(1 * 10)
    const [isFilterByBidPrice, setIsFilterByBidPrice] = useState(false)
    // console.log(productId)


    let showMoreUserPart = () => {
        setLimitTimes((limit) => limit + 1 * 10)
        console.log("ShowedMore")
    }

    useEffect(() => {
        axios.post(
            `${localSitePath}/data/getAuctionParticipants`,
            {
                productId,
                objParams: {
                    limit: limitTimes,
                    filterByBidPrice: isFilterByBidPrice
                }
            },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            })
            .then((response) => {
                console.log("Resp data", response.data)

                setUsers(response.data.users)
                setUserWinner(response.data.userWinner)
            })
            .catch((error) => {
                console.log(error)
            });
    }, [productId, limitTimes, isFilterByBidPrice])




    return (
        <>
            {userWinner ? (
                <div className="winner-user-container">
                    <p className="top-info-text-winner">Победитель</p>
                    <div className="user-winner">
                        <User info={userWinner} />
                    </div>
                </div>
            ) : null}



            <div className="header-text-info">
                <p style={{ marginRight: '0.5rem' }}>Участники</p>

                <Link to={`/products/detailed/${productId}`}>
                    <p>аукциона</p>
                </Link>
            </div>





            <div className="UserPart-filter-container">
                <fieldset>
                    <legend>Фильтрация:</legend>
                    <div>
                        <input type="radio" name="showActive" value={''} onClick={() => (setIsFilterByBidPrice(null))} ></input>
                        <label htmlFor="showActive">По времени сделки</label>
                    </div>

                    <div>
                        <input type="radio" id="showInactive" value={false} onClick={() => (setIsFilterByBidPrice(true))} name="showActive"></input>

                        <label htmlFor="showInactive">По ставке</label>
                    </div>


                    {/* <div>
                        <input type="radio" value={true} id="showActive" name="showActive"></input>
                        <label htmlFor="showActive"></label>
                    </div> */}



                </fieldset>




            </div>


            <div>

                <UsersList users_data={users} />

                <button onClick={showMoreUserPart}>Show more</button>
            </div>


            {/* <DetailedProduct /> */}
        </>
    )
}