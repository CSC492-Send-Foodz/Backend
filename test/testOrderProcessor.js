const assert = require('assert');
import Item from '../server/Item';
import Order from '../server/Order';
import GroceryStoreService from '../server/GroceryStoreService';
import OrderProcessor from '../server/OrderProcessor';

// Test Data
let Apple = new Item({
    inventoryItemId: 222,
    name: 'apple',
    quantity: 34,
    expiryDate: "2020-03-08",
    groceryStoreId: "333"
});

let Orange = new Item({
    inventoryItemId: 777,
    name: 'orange',
    quantity: 35,
    expiryDate: "2020-03-08",
    groceryStoreId: "333"
});

const inventory = {
    "orderId" : 11111,
    "foodBankId" : 3,
    "groceryId" : 1,
    "inventoryItems": [
        Apple, Orange
    ],
    "status": 'Available',
    "time": "2020-01-20"
}

var Apple2 = Apple;
Apple2.quantity = 3;

const order = {
    "orderId" : 11111,
    "foodBankId" : 3,
    "groceryId" : 1,
    "inventoryItems": [
        Apple2
    ],
    "status": 'Available',
    "time": "2020-01-20"
}

let gs = GroceryStoreService(inventory);

let myOrder = new Order(order);

const main = new OrderProcessor();

// Tests
try { // check new main instance is empty
    assert.equal(main.activeDriver.length, 0);
    assert.equal(main.activeOrders.length, 0);
} catch (error) {
    assert(error instanceof assert.AssertionError);
}

// Test adding a valid order
try {
    main.addOrderToDict(myOrder, gs);
    assert.equal(MainServer.activeOrders.length, 1);
} catch (error) {
    assert(error instanceof assert.AssertionError);
}

// Test adding invalid order
try {
    let Apple3 = Apple;
    Apple3.quantity = 100;
    invalidOrder = new Order(Apple3);

    main.addOrderToDict(invalidOrder, gs);
    assert.equal(main.activeOrders.length, 1);
} catch (error) {
    assert(error instanceof assert.AssertionError);
}

// Test removing invalid order from main server
try {
    main.removeOrderFromDict(invalidOrder);
    assert.equal(main.activeOrders.length, 1);
} catch (error) {
    assert(error instanceof assert.AssertionError);
}

// Test removing valid order from main server
try {
    main.removeOrderFromDict(myOrder);
    assert.equal(main.activeOrders.length, 0);
} catch (error) {
    assert(error instanceof assert.AssertionError);
}

// Test removing valid order from main server
try {
    main.removeOrderFromDict(myOrder);
    assert.equal(main.activeOrders.length, 0);
} catch (error) {
    assert(error instanceof assert.AssertionError);
}