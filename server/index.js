const admin = require("firebase-admin");
const functions = require('firebase-functions');
const express = require('express');
const Order = require('./Order');
const OrderProcessor = require('./OrderProcessor');
const GroceryStoreService = require('./GroceryStoreService');
const EdiOrder = require('./EdiOrder');
const GroceryStoreDao = require('./GroceryStoreDao');

// Initialize App
admin.initializeApp(functions.config().firebase);
var gsDB = admin.firestore();
var groceryStores = {};
var processor = new OrderProcessor();
var  groceryStoreService = new GroceryStoreService(groceryStores);
var groceryStoreDao = new GroceryStoreDao(gsDB)

/*******************Food Bank EndPoint *************************/

// General request handler
const foodBankFunctions = express();

foodBankFunctions.post('/placeOrder', (request, response) => {
    var body = request.body;
    order = new Order(body);
    if (processor.processOrder(order,  groceryStoreService)) {
        response.status(200).send("Order Received");
    }
    //write to firestore database
});
exports.foodBank = functions.https.onRequest(foodBankFunctions);

/*****************Grocery Store EndPoint **********************/
var groceryStoreFunctions = express();

groceryStoreFunctions.post('/sendUser', (request, response) => {
    var userInfo = request.body;
    //TODO parse userInfo and register grocery store
    groceryStores[userInfo.storeId] = userInfo; 
    response.status(200).send("Grocery Store Registered");
});


//Update inventory of a store
groceryStoreFunctions.post('/inventoryUpdate',(request, response) =>{
    //receive data body that is an inventory from single grocery store
    var jsonBody = request.body; 
    var newDict = new EdiOrder(jsonBody);
    groceryStoreDao.newInventoryToGroceryStoreData(newDict);
    response.status(200).send("Inventory updated in Firestore");
});


//verify order has been picked up 
groceryStoreFunctions.post('/orderPickedUp/:orderId', (request, response) =>{
    var tempOrder = processor.getOrder(request.orderId);
    //New function here: query active order with specific id in the database
    groceryStoreDao.decrementInventoryFromGroceryStoreData();
});

exports.groceryStore = functions.https.onRequest(groceryStoreFunctions);