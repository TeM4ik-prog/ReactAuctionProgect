let express = require("express")
let fs = require("fs")
let path = require("path")
let multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage//временное хранилище
});
const destinationUploads = "public/uploads"

let { checkAuth } = require("../../All_middleware/auth_middleware")
const { FindUserByName, CreateOrFindUncategorized, getOneImageConfig, getAllImagesConfig, canSellerUserChangeProdPrice } = require("../../sequelize/FnsSquelize/functions")
const { Product, Category, User, Image, Basket, UserProducts, UserParticipation } = require("../../sequelize/models/models")


let privateRouter = express.Router()
// privateRouter.use(express.static(path.join(__dirname, "../private")))



// replace after
//////

{
    let ArImages = ["https://cspromogame.ru//storage/upload_images/avatars/658.jpg",
        "https://cspromogame.ru//storage/upload_images/avatars/714.jpg",
        "https://cspromogame.ru//storage/upload_images/avatars/716.jpg",
        "https://cspromogame.ru//storage/upload_images/avatars/604.jpg",
        "https://cspromogame.ru//storage/upload_images/avatars/678.jpg",
        "https://cspromogame.ru//storage/upload_images/avatars/562.jpg",
        "https://cspromogame.ru//storage/upload_images/avatars/676.jpg",
        "https://cspromogame.ru//storage/upload_images/avatars/654.jpg",
        "https://cspromogame.ru//storage/upload_images/avatars/646.jpg",
        "https://cspromogame.ru//storage/upload_images/avatars/718.jpg",
        "https://cspromogame.ru//storage/upload_images/avatars/688.jpg",
        "https://cspromogame.ru//storage/upload_images/avatars/655.jpg",
        "https://cspromogame.ru//storage/upload_images/avatars/548.jpg",
        "https://cspromogame.ru//storage/upload_images/avatars/677.jpg",
        "https://cspromogame.ru//storage/upload_images/avatars/721.jpg",
        "https://cspromogame.ru//storage/upload_images/avatars/708.jpg",
        "https://cspromogame.ru//storage/upload_images/avatars/652.jpg",
        "https://cspromogame.ru//storage/upload_images/avatars/567.jpg",
        "https://cspromogame.ru//storage/upload_images/avatars/547.jpg",
        "https://cspromogame.ru//storage/upload_images/avatars/704.jpg",
        "https://cspromogame.ru//storage/upload_images/avatars/557.jpg",
        "https://cspromogame.ru//storage/upload_images/avatars/697.jpg",
        "https://cspromogame.ru//storage/upload_images/avatars/612.jpg"]


    function RandInt(min, max) {
        return Math.floor(min + Math.random() * (max - min + 1))
    }

    function RandElemFromAr(array) {
        return array[RandInt(0, array.length - 1)]
    }
}

//////

privateRouter.post("/getUserData", async (req, res) => {
    let username = req.session.username

    if (username) {
        let user_data = await FindUserByName({ username })
        if (!user_data) return res.end()

        res.status(200).json(user_data)
    }
    res.end()
})


//replace after
privateRouter.post("/getUserBasket", async (req, res) => {
    let username = req.session.username
    if (username) {
        let user_data = await FindUserByName({ username })
        if (!user_data) return res.end()

        let user_basket = await user_data.getFavorites(getOneImageConfig)

        res.status(200).json(user_basket)
    }
    res.end()
})

privateRouter.post("/getUserProds", async (req, res) => {
    let username = req.session.username
    if (username) {
        let user_data = await FindUserByName({ username })
        if (!user_data) return res.end()

        let products = await user_data.getUserProds(getOneImageConfig);

        res.status(200).json(products)
    }
    res.end()
})

privateRouter.post("/getUserParticipation", async (req, res) => {
    let username = req.session.username
    if (username) {
        let user_data = await FindUserByName({ username })
        if (!user_data) return res.end()

        let products = await user_data.getUserPart(getOneImageConfig);

        // console.log(products)
        res.status(200).json(products)
    }
    res.end()
})




privateRouter.post("/AddBalance", async (req, res) => {
    let { valueMoney } = req.body
    let username = req.session.username
    try {
        if (username) {
            let user_data = await FindUserByName({ username })
            if (!user_data) return res.end()

            await user_data.increment({ money: valueMoney })
            res.status(200).json({ message: `Ваш баланс пополнен на ${valueMoney}` })
        }
    } catch (error) {
        res.status(400).json({ message: 'Ошибка при обновлении количества денег пользователя' })
    }
})

privateRouter.post("/RaiseProdPrice", async (req, res) => {
    let { valueChangeAuction, productId } = req.body
    let username = req.session.username

    // console.log(valueChangeAuction, productId)
    try {

        let user_data = await FindUserByName({ username })
        if (!user_data) return res.status(400).json({ message: 'Войдите' })

        if (await user_data.hasUserProds(productId)) return res.status(400).json({ message: 'Нельзя поднять цену для своего товара' })


        if (user_data.money < valueChangeAuction) return res.status(400).json({ message: 'Недостаточно баланса для повышения цены' })


        let product = await Product.findByPk(productId)
        if (product.price >= valueChangeAuction) return res.status(400).json({ message: 'Неправильная цена' })
        await product.update({ price: valueChangeAuction })

        // await user_data.addUserPart(product, { amount: valueChangeAuction })

        await UserParticipation.upsert({
            UserId: user_data.id,
            ProductProductId: productId,
            userBidPrice: valueChangeAuction
        });



        res.status(200).json({ message: `Цена обновлена, Вы теперь участник аукциона` })

    } catch (error) {
        console.log(error)
        res.status(400).json({ message: 'Ошибка при обновлении цены аукциона' })
    }
})

privateRouter.post("/ConfirmPassword", async (req, res) => {
    let { passwordConfirm } = req.body
    let username = req.session.username

    try {
        let user_data = await FindUserByName({ username, getPassword: true });
        if (!user_data) return res.status(400).json({ message: 'Войдите' })


        if (passwordConfirm && user_data.password == passwordConfirm) {
            return res.status(200).json({ message: `верный пароль` })
        }
        else {
            return res.status(400).json({ message: "Неправильный пароль" })
        }

    } catch (error) {
        res.status(400).json({ message: 'Ошибка при подтверждении пароля' })
    }

})




privateRouter.post("/addProd", upload.array('images', 5), async (req, res) => {
    let username = req.session.username
    if (!username) return res.end()
    const user = await FindUserByName({ username })


    try {
        let imgs_ar = req.files
        let Ar_paths_names = []

        let { categoryId, name, price, dateEnd, detailedInfo } = Object.assign({}, req.body)//убирает ключ null prototype 
        // console.log(categoryId, name, price, dateEnd, detailedInfo)

        for (let i = 0; i < imgs_ar.length; i++) {
            let file = imgs_ar[i]
            let file_destination = path.join(destinationUploads, (file.originalname))
            Ar_paths_names.push({ url: `../../uploads/${file.originalname} ` })

            fs.writeFileSync(file_destination, file.buffer)
        }


        let product = await Product.create({ name, price, dateEnd, detailedInfo }); //sellerName: user.username,

        let category = false
        if (categoryId) {
            categoryId = parseInt(categoryId);
            if (!isNaN(categoryId)) {
                category = await Category.findByPk(categoryId);
            }
        }
        if (!category) {
            category = await CreateOrFindUncategorized();
        }

        const createdImages = await Image.bulkCreate(Ar_paths_names);
        await product.addImages(createdImages);
        await product.setCategory(category);

        await user.addUserProds(product)

        res.status(200).json(`продукт ${name} добавлен в категорию ${category.name} пользователя ${username}`);
    } catch (error) {
        console.log(error)
        res.status(500).json(`Ошибка при создании аукциона`);
    }
});


privateRouter.post("/addProdToBasket", async (req, res) => {
    let { productId } = req.body;
    let username = req.session.username
    try {
        const user = await FindUserByName({ username })

        if (!user) return res.status(500).json({ message: "Войдите" })
        if (await user.hasUserProds(productId)) return res.status(500).json({ message: `продукт Ваш` });
        if (await user.hasFavorites(productId)) return res.status(500).json({ message: `продукт уже есть в корзине` });

        const product = await Product.findByPk(productId);
        await user.addFavorites(product)

        res.status(200).json({ message: `продукт добавлен в корзину` });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Ошибка при добавлении' })
    }
});

privateRouter.post("/deleteProdFromBasket", async (req, res) => {
    let { productId } = req.body;
    let username = req.session.username

    try {
        if (!username) return res.json({ location: "/userentry" })

        const user = await FindUserByName({ username })
        const product = await Product.findByPk(productId);

        await user.removeFavorites(product)

        res.status(200).json({ massage: `продукт удален из корзины` });
    } catch (error) {
        res.status(500).json({ massage: `ошибка при удалении из корзины` })
    }
});



privateRouter.post("/checkIsProductBelongsToUser", async (req, res) => {
    let { productId } = req.body

    productId = parseInt(productId)
    let username = req.session.username


    // canUserChangePrice
    try {
        const user = await FindUserByName({ username });
        if (!user) return res.status(400).json({ message: 'Войдите' })

        let product = await Product.findByPk(productId, getAllImagesConfig)


        if (!product.isActive) {
            return res.status(400).json({ message: `Этот продукт НЕактивен` })
        }
        else if (await user.hasUserProds(productId)) {
            return res.status(200).json({ canUserChangePrice: await canSellerUserChangeProdPrice(productId), message: `Этот продукт Ваш, можете изменить его`, product })
        }
        else {
            return res.status(400).json({ message: "Этот продукт НЕ Ваш, НЕЛЬЗЯ изменить его" })
        }

    } catch (error) {
        res.status(400).json({ message: 'Ошибка при загрузке' })
    }

})


privateRouter.put("/changeProductInfo", upload.array('images', 5), async (req, res) => {
    let username = req.session.username


    try {
        const user = await FindUserByName({ username })
        if (!user) return res.status(400).json({ message: 'Войдите' })

        let { categoryId, name, price, dateEnd, detailedInfo, productId } = Object.assign({}, req.body)//убирает ключ null prototype 
        console.log(categoryId, name, price, dateEnd, detailedInfo, productId)

        const product = await Product.findByPk(productId);

        let objChange = { name, detailedInfo }
        if (await canSellerUserChangeProdPrice(productId)) {

            // && Number(price) == product.price
            objChange.price = price
        }
        // else {
        //     return res.status(400).json({ massage: `Нельзя изменить старновую цену, т.к в аукционе учавствуют пользователи"` });
        // }

        await product.update(objChange)
        res.status(200).json({ massage: `продукт изменен` });
    } catch (error) {
        console.log(error)
        res.status(500).json({ massage: `ошибка при изменении` })
    }
});









privateRouter.use(checkAuth)



privateRouter.post("/logout", (req, res) => {
    req.session.destroy()

    res.end()
})



module.exports = {
    privateRouter
}





