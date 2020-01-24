const functions = require('firebase-functions');
const express = require('express');
const Order = require('./Order');

// General request handler
var foodBankFunctions = express();

// Adds a handler for POST requests to '/foodBank/placeOrder'
foodBankFunctions.post('/placeOrder', (request, response) => {
    var body = request.body;
    //Create a new Order object
    const order = new Order(body);
    //ToDo something with the order here
    response.status(200).send("Order Received");
});

// Handles quesquests on '/foodBank'
exports.foodBank = functions.https.onRequest(foodBankFunctions);