const { Sequelize } = require("sequelize");
// const { Image } = require("../models/models");
// const { Image } = require("../models/models");

// const sequelize = new Sequelize('nodejs', 'artem', 'artem', {
//     host: 'localhost',
//     dialect: 'sqlite',
//     logging: false
// });


const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "database.sqlite",
  logging: false
});






module.exports = {
    sequelize,
    // getOneImageConfig,
    // getAllImagesConfig
}



