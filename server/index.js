const admin = require("firebase-admin");
const functions = require('firebase-functions');
const express = require('express');
const Order = require('./Order');
const OrderProcessor = require('./OrderProcessor');
const GroceryStoreService = require('./GroceryStoreService');
const EdiOrder = require('./EdiOrder');

var groceryStores = {};
var processor = new OrderProcessor();
var groceryStoreServ = new GroceryStoreService(groceryStores);

// Initialize App
admin.initializeApp(functions.config().firebase);
var gsDB = admin.firestore();

/*******************Food Bank EndPoint *************************/

// General request handler
const foodBankFunctions = express();


// Adds a handler for POST requests to '/foodBank/placeOrder'
foodBankFunctions.post('/placeOrder', (request, response) => {

    var body = request.body;

    //Create a new Order object
    order = new Order(body);
    console.log("This is order:" + order);
    if (processor.processOrder(order, groceryStoreServ)) {
        response.status(200).send("Order Received");
    }
    //write to firestore database
});

// Handles requests on '/foodBank'
exports.foodBank = functions.https.onRequest(foodBankFunctions);


/*****************Grocery Store EndPoint **********************/
var groceryStoreFunctions = express();

//registers a grocery store
groceryStoreFunctions.post('/sendUser', (request, response) => {
    
    var userInfo = request.body;

    //TODO parse userInfo and register grocery store
    groceryStores[userInfo.storeId] = userInfo;
    
    //status check works
    response.status(200).send("Grocery Store Registered");
});


//Update inventory of a store
groceryStoreFunctions.post('/inventoryUpdate',(request, response) =>{
        
    //receive data body that is an inventory from single grocery store
    var jsonBody = request.body; 
    var newDict = new EdiOrder(jsonBody);

    newInventoryToGroceryStoreData(newDict);
    
    response.status(200).send("Inventory updated in Firestore");
});


//verify order has been picked up 
groceryStoreFunctions.post('/orderPickedUp/:orderId', (request, response) =>{

    var tempOrder = processor.getOrder(request.orderId);

    //New function here: query active order with specific id in the database
    decrementInventoryFromGroceryStoreData();
});

exports.groceryStore = functions.https.onRequest(groceryStoreFunctions);

/************************ Methods*************************************/

//Function for updating inventory in firestore
function newInventoryToGroceryStoreData(newDict){
    //write to the database new inventory
    var string_inventory_data = JSON.stringify(newDict.inventory);
    var json_inventory = JSON.parse(string_inventory_data);
    var batch = gsDB.batch();
    for (var myKey in json_inventory){
        var myKeyRef = gsDB.collection("GroceryStores").doc(`${newDict.groceryId}`).collection("InventoryCollection").doc("Items");
        batch.set(myKeyRef, json_inventory);
    }
    batch.commit().then(function() {
        console.log("Success!");
        return null;
    }).catch((err) => {
        console.log('Error getting documents', err);
        return err;
    });
}

function decrementInventoryFromGroceryStoreData(order){
    //order json object
    gsDB.ref('groceryStore/').update({
        order
    });
}

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
