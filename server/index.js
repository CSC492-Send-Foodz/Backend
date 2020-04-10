/* eslint-disable promise/always-return */
// Firebase Imports
const admin = require("firebase-admin");
const functions = require("firebase-functions");
// Endpoint Imports
const express = require("express")
const cors = require('cors');
const cookieParser = require("cookie-parser");
const app = express();
app.use(cors());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Services Imports
const UniqueIdService = require("./Services/UniqueIdService");
const OrderProcessor = require("./Services/OrderProcessor");
const FoodBankService = require("./Services/FoodBankService");
const DriverService = require("./Services/DriverService");
const GroceryStoreService = require("./Services/GroceryStoreService");
const AuthenticationService = require("./Services/AuthenticationService")

//Daos Imports
const FoodBankDao = require('./DataAccessObjects/FoodBankDao');
const DriverDao = require("./DataAccessObjects/DriverDao");
const GroceryStoreDao = require("./DataAccessObjects/GroceryStoreDao");
const OrderDao = require("./DataAccessObjects/OrderDao");

// Initialize App
admin.initializeApp(functions.config().firebase);
var DB = admin.firestore();

//Initialize Daos
var orderDao = new OrderDao.OrderDao(DB);
var groceryStoreDao = new GroceryStoreDao.GroceryStoreDao(DB, admin);
var driverDao = new DriverDao.DriverDao(DB);
var foodBankDao = new FoodBankDao.FoodBankDao(DB);

//Initialize Services
var uniqueIdService = new UniqueIdService.UniqueIdService(DB);
var foodBankService = new FoodBankService.FoodBankService(foodBankDao);
var driverService = new DriverService.DriverService(DB, driverDao, orderDao);
var groceryStoreService = new GroceryStoreService.GroceryStoreService(DB, groceryStoreDao);
var orderProcessor = new OrderProcessor.OrderProcessor(DB, orderDao, groceryStoreDao, driverDao, foodBankDao, uniqueIdService);

const validateFirebaseIdToken = async (req, res, next) => {
    AuthenticationService.checkRequestAuth(admin, req, res, next);
}
app.use(validateFirebaseIdToken);

// exports.pruneDaily = functions.pubsub.schedule('0 0 * * *').onRun((context) => {
//     groceryStoreDao.pruneInventory();
//     return null;
// });

/*******************Order EndPoint *************************/
app.post("/order/statusUpdate", async (request, response) => {
    try {
        await orderProcessor.updateActiveOrderStatus(request.body.id, request.body.status);
    }
    catch (e) {
        response.status(202).send(e.message)
        return
    }
    response.status(200).send(
        {
            id: request.body.id,
            status: request.body.status
        }
    );

});



/*******************Food Bank EndPoint *************************/
app.post("/foodBank/placeOrder", async (request, response) => {
    try {
        var order = await orderProcessor.createOrder(request.body);
        await orderProcessor.processOrder(order);
    }
    catch (e) {
        response.status(202).send(e.message)
        return
    }
    response.status(200).send(
        {
            id: order.getId(),
            status: order.getStatus()
        }
    );
});

app.post('/foodBank/updateUserAccount', async (request, response) => {
    try {
        var foodBank = await foodBankService.createFoodBank(request.body);
        foodBankService.updateFoodBankAccount(foodBank);
    }
    catch (e) {
        response.status(400).send(e.message)
        return
    }
    response.status(200).send(
        {
            id: foodBank.getId()
        }
    );
});

/*****************Grocery Store EndPoint **********************/
app.post("/groceryStore/updateUserAccount", async (request, response) => {
    try {
        var groceryStore = await groceryStoreService.createGroceryStore(request.body);
        groceryStoreService.updateGroceryStoreAccount(groceryStore);
    }
    catch (e) {
        response.status(400).send(e.message)
        return
    }
    response.status(200).send(
        {
            id: groceryStore.getId()
        }
    );
});

app.post("/groceryStore/updateInventory", async (request, response) => {
    try {
        var ediOrder = await groceryStoreService.createEDIOrder(request.body);
        groceryStoreService.updateInventory(ediOrder);
    }
    catch (e) {
        response.status(202).send(e.message)
        return
    }
    response.status(200).send(
        {
            id: ediOrder.getGroceryStoreId()
        }
    );
});

app.post("/groceryStore/removeInventoryItem", async (request, response) => {
    try {
        groceryStoreService.deleteInventoryItem(request.body.id, request.body.groceryStoreId);
    }
    catch (e) {
        response.status(202).send(e.message)
        return
    }
    response.status(200).send(
        {
            id: request.body.id
        }
    );
});

/*****************Driver EndPoint **********************/

app.post("/driver/statusUpdate", async (request, response) => {
    try {
        await driverService.updateDriverStatus(request.body.id, request.body.status);
    }
    catch (e) {
        response.status(202).send(e.message)
        return
    }
    response.status(200).send(
        {
            id: request.body.id,
            status: request.body.status
        }
    );
});

app.post("/driver/updateUserAccount", async (request, response) => {
    try {
        var driver = await driverService.createDriver(request.body, false);
        driverService.updateDriverAccount(driver);
    }
    catch (e) {
        response.status(202).send(e.message)
        return
    }
    response.status(200).send(
        {
            id: driver.getId()
        }
    );
});

/***************** Auth Endpoint **********************/

app.post("/auth/checkUserType", async (request, response) => {
    try {
        var type = request.body.type;
        var altType = type === "GroceryStores" ? "Foodbanks" : "GroceryStores";
        var res = await AuthenticationService.checkUserType(DB, request.body.id, type);
        response.status(200).send(res ? type : altType);
    }
    catch (e) {
        response.status(400).send(e.message);
    }
})

exports.app = functions.https.onRequest(app);