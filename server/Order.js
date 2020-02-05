/* Order is observer of: Inventory
 *           observed by: Drivers
 */

class Order {

    constructor(orderRef) {
        this.orderId = orderRef.orderId
        this.status = orderRef.status;
        this.foodBankId = orderRef.foodBankId;
        this.groceryId = orderRef.groceryId;
        this.inventoryItems = {};
        this.timePlaced = Date(orderRef.time);

        console.log(orderRef.inventory);

        this.parseItems(orderRef.inventory);
    }

    getOrderId() { return this.orderId; }

    setStatus(newStatus) { this.status = newStatus; }

    getStatus() { return this.status; }

    setFoodBankId(foodBankId) { this.foodBankId = foodBankId; }

    getFoodBankId() { return this.foodBankId; }

    setGroceryId(groceryId) { this.groceryId = groceryId; }

    getGroceryId() { return this.groceryId; }

    setTime(time) { this.timePlaced = time; }

    getTime() { return this.timePlaced; }

    getItem(itemId) { return this.inventoryItems[itemId]; }

    getInventory() { return this.inventoryItems; }

    parseItems(itemsList) {
        itemsList.forEach(item => {
            this.inventoryItems[item.inventoryItemId] = item
        });
    }
    notifyFoodBank(foodBankURL) {
        try {
            // let fbServer = new XMLHttpRequest();
            // fbServer.open("POST", foodBankURL, true);
            // fbServer.setRequestHeader('Content-Type', 'application/json');
            // fbServer.send(JSON.stringify({
            //     "orderId": this.orderId,
            //     "status": this.progressStatus
            // }))

            // fbServer.onreadystatechange = function () {
            //     if (this.status === 200) {
            //         console.log("200");
            //     }
            // }

            // fbServer.send();
            console.log("Food Bank Notified 200")

        } catch (error) {
            console.log("Can't notify entity.")
        }
    }

    notifyGroceryStore(groceryStoreURL) {
        try {
            // let gsServer = new XMLHttpRequest();
            // gsServer.open("POST", groceryStoreURL, true);
            // gsServer.setRequestHeader('Content-Type', 'application/json');
            // gsServer.send(JSON.stringify({
            //     "orderId": this.orderId,
            //     "status": this.progressStatus
            // }))

            // gsServer.onreadystatechange = function () {
            //     if (this.status === 200) {
            //         console.log("200");
            //     }
            // }

            // gsServer.send();
            console.log("Grocery Store Notified 200");
        } catch (error) {
            console.log("Can't notify entity.")
        }
    }

    notifyDrivers(potentialDrivers) { // push notification
        if (potentialDrivers === undefined || potentialDrivers.length == 0) {
            potentialDrivers.forEach(driver => {
                console.log('Driver with id ' + driver.driverId + ' notified with for order' + this.orderId);
            });
        } else {
            console.log("Notification failed" + error);
        }
    }
}

module.exports =  Order;
