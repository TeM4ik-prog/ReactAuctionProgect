const { DataTypes, STRING } = require("sequelize");
let { sequelize } = require("../config/SequelizeConfig");



const Basket = sequelize.define('Basket', {}, {
    tableName: 'Basket',

    onDelete: 'CASCADE'
});

const UserProducts = sequelize.define('UserProducts', {}, {
    tableName: 'UserProducts',

    onDelete: 'CASCADE'
});





// __________
const User = sequelize.define('User', {
    username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    password: DataTypes.STRING,
    money: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    avatar: DataTypes.STRING
});

const Category = sequelize.define('Category', {
    categoryId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
});

const Product = sequelize.define('Product', {
    productId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: DataTypes.STRING,
    price: DataTypes.INTEGER,

    detailedInfo: STRING,

    dateEnd: {
        type: DataTypes.DATE,
        allowNull: false
    },

    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },

    winnerName: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: false
    }

}, {
    // hooks: {
    //     beforeSave: async (product, options) => {
    //         if (product.winnerName) {
    //             product.isActive = false;
    //         }
    //     }
    // }


});

const Image = sequelize.define('Image', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    url: {
        type: DataTypes.STRING,
        allowNull: false
    },
    tableName: 'Image',
});


const UserParticipation = sequelize.define('UserParticipation', {
    //кол-во денег которые внес пользователь для повышения цены аукциона
    userBidPrice: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    tableName: 'UserParticipation',
    onDelete: 'CASCADE',
});


//для корзины
User.belongsToMany(Product, { through: Basket, as: "Favorites", onDelete: 'CASCADE' });
Product.belongsToMany(User, { through: Basket, as: "Favorites", onDelete: 'CASCADE' });

// для товаров пользователя(incorrect)
User.belongsToMany(Product, { through: UserProducts, as: "UserProds", onDelete: 'CASCADE' });
Product.belongsToMany(User, { through: UserProducts, as: "UserProds", onDelete: 'CASCADE' });

// для аукционов, в которых пользователь учавствует
User.belongsToMany(Product, { through: UserParticipation, as: "UserPart", onDelete: 'CASCADE' });
Product.belongsToMany(User, { through: UserParticipation, as: "UserPart", onDelete: 'CASCADE' });


// для категорий товаров
Category.hasMany(Product, { onDelete: 'CASCADE' });
Product.belongsTo(Category, { onDelete: 'CASCADE' });

// для картинок товаров
Product.hasMany(Image, { onDelete: 'CASCADE' });
Image.belongsTo(Product, { onDelete: 'CASCADE' });





// UserParticipation.belongsTo(User)


// Basket.belongsTo(User)
// UserProducts.belongsTo(User)



module.exports = {
    User,
    Category,
    Product,
    Basket,
    UserProducts,
    UserParticipation,
    Image
}





