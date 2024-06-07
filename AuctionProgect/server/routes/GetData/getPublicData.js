let express = require("express");
const { Category, Product, Image, User, UserParticipation } = require("../../sequelize/models/models");
const { FindUserByName, FilterProdsByParams, getOneImageConfig, getAllImagesConfig, FilterUsersByParams } = require("../../sequelize/FnsSquelize/functions");
const { Op, where } = require("sequelize");
const { sequelize } = require("../../sequelize/config/SequelizeConfig");


let GetPublicDataRout = express.Router()


console.log("test")


GetPublicDataRout.post("/getCategories", async (req, res) => {
    const categories = await Category.findAll()

    res.json(categories)
})





GetPublicDataRout.post("/getProducts", async (req, res) => {
    let { categoryId, paramsMap } = req.body

    let username = req.session.username
    let user_data = await FindUserByName({ username })

    console.log(categoryId, paramsMap)

    try {
        let products = []
        let categoryName = null
        if (categoryId) {
            let category = await Category.findByPk(categoryId);
            categoryName = category.name

            products = await category.getProducts(await FilterProdsByParams(paramsMap, user_data));
        } else {
            products = await Product.findAll(await FilterProdsByParams(paramsMap, user_data));
        }



        res.json({ products, categoryName });
    } catch (error) {
        console.error('Ошибка при получении продуктов:', error);
        res.status(500).json({ error: 'Ошибка при получении продуктов' });
    }
})



GetPublicDataRout.post("/getDetailedProduct", async (req, res) => {
    let { productId } = req.body
    console.log(productId)

    try {
        let product = await Product.findOne({
            where: { productId: productId },
            include: [
                ...getAllImagesConfig.include,
                {
                    model: User,
                    as: 'UserProds',
                    through: { attributes: { exclude: ['password'] } } // Исключить атрибуты промежуточной таблицы
                }
            ]
        })

        res.json({ product });
    } catch (error) {
        res.status(500).json({ error: 'Ошибка при получении продуктов' });
    }
})


GetPublicDataRout.post("/getVisitUserData", async (req, res) => {
    let { username } = req.body

    try {
        let user_data = await FindUserByName({ username })
        if (!user_data) return res.end()

        let userProds = await user_data.getUserProds(getOneImageConfig, { where: { sellerName: username } });

        res.json({ user_data, userProds });
    } catch (error) {
        res.status(500).json({ error: 'Ошибка при получении продуктов' });
    }
})




GetPublicDataRout.post("/getAuctionParticipants", async (req, res) => {
    let { productId, objParams = {} } = req.body

    console.log(productId, objParams)

    // objParams.limit = 10

    // objParams.filterByBidPrice = false

    try {
        let [filterResultFirstObjUsersIds, filterResultSecondObjUsersParticipation] = FilterUsersByParams({ productId, objParams })
        let userParticipations = await UserParticipation.findAll(filterResultFirstObjUsersIds);

        if (userParticipations.length > 0) {
            let userIds = userParticipations.map(up => up.UserId);
            let AuctionPart = await Product.findOne(filterResultSecondObjUsersParticipation({ userIds: userIds }));
            let userWinner = await FindUserByName({ username: AuctionPart.winnerName })

            return res.json({ users: AuctionPart.UserPart, userWinner: userWinner });
        }
        else {
            return res.json({ users: [], userWinner: null });
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Ошибка при получении продуктов' });
    }
})








module.exports = {
    GetPublicDataRout,
    // getOneImageConfig
}
