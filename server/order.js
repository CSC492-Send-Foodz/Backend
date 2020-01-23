/* Orders is observer of: Inventory
 *           observed by: Drivers
 */
class Orders {
    constructor() {
        this.orders = [];
        this.drivers = [];
        this.inventories = [];
    };

    fillList(ordersList) {
        ordersList.forEach(order => {
            order = new Order(order);
            if (!this.orders.includes(order)) {
                this.orders.push(order);
            }
        });
    };

    // Beginning of Observable's duties
    notify(URL) {
        try {
            let fbServer = new XMLHttpRequest();
            fbServer.open("POST", foodBankURL, true);
            fbServer.setRequestHeader('Content-Type', 'application/json');
            fbServer.send(JSON.stringify({
                "orderId": 11111,
                "foodBankId": 3,
                "groceryId": 1,
                "Inventory": [{
                        "inventoryItemId": 333,
                        "name": "Orange",
                        "quantity": 20,
                        "expiryDate": new Date(20 - 03 - 28),
                        "groceryStoreId": 1
                    },
                    {
                        "inventoryItemId": 334,
                        "name": "Apple",
                        "quantity": 20,
                        "expiryDate": new Date(20 - 03 - 20),
                        "groceryStoreId": 1
                    }
                ]
            }))

            fbServer.onreadystatechange = function () {
                if (this.status == 200) {
                    console.log("200");
                }
            };

            fbServer.send();
        } catch (error) {
            console.log("Can't notify entity.")
        }
    };

    notifyDriver(context) { // push notification
        try {
            console.log('Driver notified with ' + context);
        } catch (error) {
            console.log("Notification failed" + error);
        }
    };

    addDriver(driver) { // adds observer
        try {
            if (this.isDriverValid(driver)) {
                this.diver.push(driver);
                console.log("Driver added.");
            }
        } catch (error) {
            console.log("Can't assign driver" + error);
        }

    };

    removeDriver(driverId) { // remove observer
        try {
            this.driver.removeAt(driverId);
            console.log("Driver" + driverId + " removed.");
        } catch (error) {
            console.log("Can't unsubscribe driver " + error);
        }
    };

    isDriverValid(driver) {
        //check if Driver instance has ID, name, reg. vehicle

        return ((driver.id !== Null) && driver.name !== '' && driver.vehicle !== '');
    };
    // End of Observable duties

    // Beginning of Observer duties
    subscribe(inventory) {
        if (!this.inventories.includes(inventory)) {
            this.inventories.push(inventory);
        }
    };

    unsubscribe(inventory) {

        if (this.inventories.includes(inventory)) {
            this.inventories.splice(list.indexOf(inventory), 1);
        }
    };

    updateStatus(ordersIdList, newStatus) {
        // update properties in response to changes in Inventory
        ordersIdList.forEach(orderId => {
            order = this.orders.getOrder(orderId);
            order.setProgressStatus(newStatus);
        });
    };

    updateFoodBankId(ordersIdList, foodBankId) {
        ordersIdList.forEach(orderId => {
            orde = this.orders.getOrder(orderId);
            orde.setFoodBankId(foodBankId);
        });
    };

    updateGroceryStoreId(ordersIdList, groceryId) {
        ordersIdList.forEach(orderId => {
            orde = this.orders.getOrder(orderId);
            orde.setFoodBankId(groceryId);
        });
    };

    // End of Observer duties
};

class Order {
    constructor(orderRef) {
        this.id = orderRef.id
        this.progress = '';
        this.driver = Null;
        this.foodBankId = Null;
        this.groceryStoreId = Null;
        this.items = this.parseItems(orderRef.items);
        this.requestTime = Date(orderRef.time);
    };

    setProgressStatus(newStatus) {
        this.progress = newStatus;
    };

    getProgressStatus() {
        return this.progress;
    };

    setDriver(driver) {
        this.driver = driver;
    };

    getDriver() {
        return this.driver;
    };

    setFoodBankId(foodBankId) {
        this.foodBankId = foodBankId;
    };

    getFoodBankId() {
        return this.foodBankId;
    };

    setGroceryId(groceryId) {
        this.groceryStoreId = groceryId;
    };

    getGroceryId() {
        return this.groceryStoreId;
    };

    setTime(time) {
        this.requestTime = time;
    };

    getTime() {
        return this.requestTime;
    };

    getItem(itemId) {
        return this.items;
    };

    parseItems(itemsList) {
        itemsList.forEach(item => {
            item = new Item(item);
        });
    }

};

class Item {
    constructor(itemRef) {
        this.name = itemRef.name;
        this.qty = itemRef.qty;
    }
}