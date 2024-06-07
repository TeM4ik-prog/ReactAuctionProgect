let express = require("express")
const bodyParser = require("body-parser");
const path = require("path");


const { Auth_session } = require("./All_middleware/auth_middleware");
const { OnCreateCategories, CreateOrFindUncategorized, addProducts, updateProductStatus } = require("./sequelize/FnsSquelize/functions");
const { privateRouter } = require("./routes/Auth/privateRout");
const { UserEntryRoute } = require("./routes/Auth/UserEntry");
const { sequelize } = require("./sequelize/config/SequelizeConfig");
const cron = require('node-cron');
const { GetPublicDataRout } = require("./routes/GetData/getPublicData");

const port = process.env.PORT || 5000;
let app = express()

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "./public")))
app.use(express.static(path.join(__dirname, "../client/dist")));


//без этого не работает, только если переходить через Link 
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/dist", "index.html"));
});



app.use(Auth_session())

app.use(UserEntryRoute)
app.use("/data", GetPublicDataRout)
app.use("/auth", privateRouter)


cron.schedule('*/1 * * * *', () => {
    console.log("обновление статуса!!!")
    updateProductStatus();
});

async function startServer() {
    try {
        await sequelize.authenticate();

        // await sequelize.sync(); 
        // await sequelize.sync({ force: true });//удаление всех бд

        console.log('Соединение с базой данных установлено');

        await CreateOrFindUncategorized()
        await OnCreateCategories();




        app.listen(port, () => {
            console.log(`Сервер запущен на порту ${port}`);
        });
    } catch (error) {
        console.error('Ошибка при запуске сервера:', error);
    }
}

startServer();


