const admin = require("firebase-admin");
const functions = require('firebase-functions');
const express = require('express');
const Order = require('./Order');
const OrderProcessor = require('./OrderProcessor');
const GroceryStoreService = require('./GroceryStoreService');

var groceryStores = {};
var processor = new OrderProcessor();
var groceryStoreServ = new GroceryStoreService(groceryStores);


// Initialize App
admin.initializeApp(functions.config().firebase);
var gsDB = admin.firestore();


/*******************Food Bank EndPoint *************************/


// General request handler
var foodBankFunctions = express();

// Adds a handler for POST requests to '/foodBank/placeOrder'
foodBankFunctions.post('/placeOrder', (request, response) => {

    var body = request.body;

    //Create a new Order object
    const order = new Order(body);


    if (processor.processOrder(order, groceryStoreServ)) {
        response.status(200).send("Order Received");
    }
});

// Handles requests on '/foodBank'
exports.foodBank = functions.https.onRequest(foodBankFunctions);



/*****************Grocery Store EndPoint **********************/
var groceryStoreFunctions = express();

groceryStoreFunctions.post('/sendUser', (request, response) => {
    
    var userInfo = request.body;

    // TODO parse userInfo and register grocery store
    groceryStores[userInfo.storeId] = userInfo;
    
    //status check works
    response.status(200).send("Grocery Store Registered");
});

// Handles requests on '/grocerystore'
exports.groceryStore = functions.https.onRequest(groceryStoreFunctions)




/************************ Methods*************************************/

function writeGroceryStoreData(storeId, companyName, location, storeNumber) {
    gsDB.ref('groceryStore/' + storeId).set({
    companyName: companyName,
    location: location,
    storeNumber: storeNumber
    });
}

function updateGroceryStoreData(storeId, companyName, location, storeNumber) {
    var update = {};
    var updatedInfo = {
        companyName: companyName,
        location: location,
        storeNumber: storeNumber
    }

    update['groceryStore/' + storeId] = updatedInfo;

    gsDB.ref().update(update);
}