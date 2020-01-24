const functions = require('firebase-functions');
const express = require('express');
const Order = require('./Order');

// General request handler
var groceryStoreFunctions = express();

// Adds a handler for POST requests to '/groceryStore/placeOrder'
groceryStoreFunctions.post('/placeOrder', (request, response) => {
    var body = request.body;
    //Create a new Order object
    const order = new Order(body);
    //ToDo something with the order here
    response.send("POST received");
});

// Handles quesquests on '/groceryStore'
exports.groceryStore = functions.https.onRequest(groceryStoreFunctions);