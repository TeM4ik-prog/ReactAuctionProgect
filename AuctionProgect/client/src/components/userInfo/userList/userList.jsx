import User from "../user/user";

export default function UsersList({ users_data }) {

    console.log(users_data)


    return (
        <div className="usersList-container">
            {
                users_data && users_data.length > 0 ? (
                    <>
                        {
                            users_data.map((item, index) => (
                                <User key={index} info={item} />
                            ))
                        }
                    </>
                ) : <h1>Пользователи не найдены</h1>
            }
        </div>

        
    )

}