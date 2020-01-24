const functions = require('firebase-functions');
const express = require('express');
// const order = require('./Order');
import Order from './Order.js'

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

var groceryStoreFunctions = express();

// Adds a handler for POST requests to /groceryStore/placeOrder
groceryStoreFunctions.post('/placeOrder', (request, response) => {
    var body = request.body
    newOrder = new order.Order(body);
    console.log(newOrder);
    response.send("POST received");
});

// Handles quesquests on /groceryStore
exports.groceryStore = functions.https.onRequest(groceryStoreFunctions);