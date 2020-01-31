/* Order is observer of: Inventory
 *           observed by: Drivers
 */

class Order {

    constructor(orderRef) {
        this.orderId = orderRef.orderId

        //changed name 
        this.status = orderRef.status;

        this.foodBankId = orderRef.foodBankId;
        this.groceryId = orderRef.groceryId;

        //this has been changed; this is a list
        this.inventoryItems = {} 
        
        this.parseItems(orderRef.inventory);
        
       
        this.timePlaced = Date(orderRef.time);

        this.driverId = {};
    }

    getOrderId(){
        return this.orderId;
    }

    setStatus(newStatus) {
        this.status = newStatus;
    }

    getStatus() {
        return this.status;
    }

    getDriver(driverId) {
        return this.driverId[driverId];
    }

    setFoodBankId(foodBankId) {
        this.foodBankId = foodBankId;
    }

    getFoodBankId() {
        return this.foodBankId;
    }

    setGroceryId(groceryId) {
        this.groceryId = groceryId;
    }

    getGroceryId() {
        return this.groceryId;
    }

    setTime(time) {
        this.timePlaced = time;
    }

    getTime() {
        return this.timePlaced;
    }

    getItem(itemId) {
        return this.inventoryItems[itemId];
    }

    //added because it wasn't available
    getInventory(){
        return this.inventoryItems;
    }

    parseItems(itemsList) { // who parses itemsJSON into Items?
        itemsList.forEach(item => {
            this.inventoryItems[item.inventoryItemId] = item
        });
    }

    // Beginning of Observable's duties
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
            console.log("200")

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
            console.log("200");
        } catch (error) {
            console.log("Can't notify entity.")
        }
    }

    notifyDrivers(context) { // push notification
        if (this.driverId.length !== 0) {
            this.driverId.forEach(driver => {
                driver.messages = context;
            });
            console.log('Driver notified with ' + context);
        } else {
            console.log("Notification failed" + error);
        }
    }

    addDriver(driver) { // adds observer
        if (this.isDriverValid(driver)) {
            this.driverId[driver.driverId] = driver;
            console.log("Driver added.")
        } else {
            console.log("Can't assign driver" + error);
        }
    }

    removeDriver(driverId) { // removes observer
        if (driverId in this.driverId) {
            delete this.driverId[driverId];
            console.log("Driver" + driverId + " removed.");
        } else {
            console.log("Can't unsubscribe driver " + error);
        }
    }

    isDriverValid(driver) {
        //check if Driver instance has ID, name, reg. vehicle

        return ((driver.id !== null) && driver.name !== undefined && driver.vehicle !== undefined);
    }
    // End of Observable duties

    // Beginning of Observer duties
    updateStatus(newStatus) {
        // update properties in response to changes in Inventory
        this.setProgressStatus(newStatus);
    }

    // End of Observer duties
}

module.exports = Order;
