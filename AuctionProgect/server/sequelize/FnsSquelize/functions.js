const { Op, where } = require("sequelize");
const { importantCategories } = require("../config/Categories.js");
const { User, Category, Product, Basket, Image, UserParticipation } = require("../models/models.js");
const { sequelize } = require("../config/SequelizeConfig.js");

const getOneImageConfig = {
    include: [{
        model: Image,
        attributes: ['url'],
        required: false,
        limit: 1,
        separate: true,
        order: [['id', 'ASC']]
    }]
}

const getAllImagesConfig = {
    include: [{
        model: Image,
        attributes: ['url'],
        required: false
    }]

}


async function OnCreateCategories() {
    for (const categoryName of importantCategories) {
        await Category.findOrCreate({ where: { name: categoryName } });
    }
}


async function CreateOrFindUncategorized() {
    let [uncategorized, created] = await Category.findOrCreate({ where: { name: "uncategorized" } })
    return uncategorized
}


async function FindUserByName({ username, getPassword = false }) {

    if (getPassword) {
        return await User.findOne({
            where: { username: String(username) }
        });
    }

    return await User.findOne({
        where: { username: String(username) },
        attributes: { exclude: ['password'] }
    });
}


async function CreateUser({ username, password, avatar }) {
    return await User.create({ username, password, avatar });
}



const updateProductStatus = async () => {
    try {
        const products = await Product.findAll({
            where: {
                dateEnd: { [Op.lte]: new Date() },//меньше или равно
                isActive: true
            }
        });

        for (const product of products) {
            let [filterResultFirstObjUsersIds, filterResultSecondObjUsersParticipation] = FilterUsersByParams({ productId: product.productId, objParams: { limit: 1, filterByBidPrice: true } })

            const productUserWin = await UserParticipation.findOne(filterResultFirstObjUsersIds);

            if (productUserWin) {
                let userWinner = await User.findByPk(productUserWin.UserId)
                await product.update({ winnerName: userWinner.username, isActive: false })
            }
            else {
                await product.update({ isActive: false })
            }
        }

        console.log('Статусы продуктов успешно обновлены');
    } catch (error) {
        console.error('Ошибка при обновлении статусов продуктов:', error);
    }
};


async function FilterProdsByParams(objParams, user_data) {
    let filterResultObj = { where: {}, ...getOneImageConfig }
    // if (objParams.nameFind) { }

    console.log(objParams)

    filterResultObj.where = {
        name: {
            [Op.like]: `%${objParams.nameFind}%`
        },
        price: {
            [Op.gte]: objParams.minPrice,
            [Op.lte]: objParams.maxPrice
        },
    }

    if (objParams.showActive) {
        filterResultObj.where.isActive = objParams.showActive
    }


    if (user_data && objParams.excludeMyProds) {
        console.log("delete user prods from all")
        const subQuery = await user_data.getUserProds();

        let arProdIds = subQuery.map(el => el.productId)

        filterResultObj.where.productId = {
            [Op.notIn]: arProdIds
        };
    }


    return filterResultObj
}



function FilterUsersByParams({ productId, objParams }) {

    let filterResultFirstObjUsersIds = {
        where: { ProductProductId: productId }
    }

    let filterResultSecondObjUsersParticipation = {
        where: { productId: productId },
        include: [{
            model: User,
            as: 'UserPart',
            attributes: { exclude: ['password'] },
            // where: { id: userIds }
        }],
    }

    if (objParams) {
        if (objParams.filterByBidPrice) {
            filterResultFirstObjUsersIds.order = [['userBidPrice', 'DESC']]
            filterResultSecondObjUsersParticipation.order = [[{ model: User, as: 'UserPart' }, UserParticipation, 'userBidPrice', 'DESC']]
        }
        if (objParams.limit) {
            filterResultFirstObjUsersIds.limit = objParams.limit
        }
    }

    // ______________

    let FunctionGetUserParticipation = ({ userIds }) => {


        filterResultSecondObjUsersParticipation.include[0].where = { id: userIds }
        // .push({ where: { id: userIds } })

        // console.log(filterResultSecondObjUsersParticipation)
        return filterResultSecondObjUsersParticipation
    }
    return [filterResultFirstObjUsersIds, FunctionGetUserParticipation]
}



async function canSellerUserChangeProdPrice(productId) {
    let participations = await UserParticipation.findAll({ where: { ProductProductId: productId } })
    console.log(participations.length)

    return participations.length > 0 ? false : true
}







module.exports = {
    OnCreateCategories,
    FindUserByName,
    CreateUser,
    CreateOrFindUncategorized,
    updateProductStatus,
    FilterProdsByParams,

    FilterUsersByParams,
    canSellerUserChangeProdPrice,

    getOneImageConfig,
    getAllImagesConfig
}