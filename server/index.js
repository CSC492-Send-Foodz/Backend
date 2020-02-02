const admin = require("firebase-admin");
const functions = require('firebase-functions');
const express = require('express');
const Order = require('./Order');
const OrderProcessor = require('./OrderProcessor');
const GroceryStoreService = require('./GroceryStoreService');

var groceryStores = {};
var processor = new OrderProcessor();
var groceryStoreServ = new GroceryStoreService(groceryStores);
var order;

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
    order = new Order(body);

    if (processor.processOrder(order, groceryStoreServ)) {
        response.status(200).send("Order Received");
    }
});

// Handles requests on '/foodBank'
exports.foodBank = functions.https.onRequest(foodBankFunctions);


/*****************Grocery Store EndPoint **********************/
var groceryStoreFunctions = express();

//for parsing json data
groceryStoreFunctions.use(express.json());

//registers a grocery store
groceryStoreFunctions.post('/sendUser', (request, response) => {
    
    var userInfo = request.body;

    // TODO parse userInfo and register grocery store
    groceryStores[userInfo.storeId] = userInfo;
    
    //status check works
    response.status(200).send("Grocery Store Registered");
});

//receive inventory update; receive entire GroceryStoreService inventory?
groceryStoreFunctions.post('/inventoryUpdate', (request, response) =>{
    //what would request look like?
    //here we just need order Id to access orders in active order set

    
    var orderid = request.body;
    response.status(200).send("following is the OrderId: " + orderid.storeId);
    
});

//verify order has been picked up 
groceryStoreFunctions.put('/orderPickedUp/:orderid', (request, response) =>{
    //what would request look like?
    //eg. 
    var order2 = processor.getOrder(request.orderid);
    console.log(order2);
    console.log(processor.activeOrder);
    response.status(200).send(order2.groceryId);
    
});


//Adding Data
let gsDBRef = gsDB.collection('grocery').doc('store1');

let setApple = gsDBRef.set({
    inventoryItemId: '354',
    name: 'Fiji Apple',
    quantity: 10,
    expiryDate: "20 - 03 - 28",
    groceryStoreId: 3
})

//Adding Data
let gsDBRef2 = gsDB.collection('grocery').doc('store2');
let setPear = gsDBRef2.set({
    inventoryItemId: '322',
    name: 'Detroit Pear',
    quantity: 9,
    expiryDate: "20 - 05- 30",
    groceryStoreId: 3
}) 

/* Doesn't work
db.collection('grocery').get()
  .then((snapshot) => {
    snapshot.forEach((doc) => {
      //console.log(doc.id, '=>', doc.data());
      return doc.id;
    });
  })
  .catch((err) => {
    console.log('Error getting documents', err);
    return err;
  });
*/

// Handles requests on '/grocerystore'
exports.groceryStore = functions.https.onRequest(groceryStoreFunctions)


/************************ Methods*************************************/
function newInventoryToGroceryStoreData(orderID){
    console.log(orderID);
    //gsDB.ref('groceryStore/' + storeId).set({
    //    quantity: quantity
    //});
}

function decrementInventoryFromGroceryStoreData(storeId, quantity){
    gsDB.ref('groceryStore/' + storeId).update({
        quantity: quantity
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