const OrderStates = {
    LOOKING_FOR_DRIVER: "Looking For Diver",
    UNABLE_TO_COMPLETE: "Order is unable to completed",
    VALID: "Order is able to completed",
    PICKUP_IN_PROGRESS: "Driver on the way to pick up inventory from the grocery store",
    DROP_OFF_IN_PROGRESS: "Driver has picked up inventory from the grocery store.",
    DELIVERED: "Driver has dropped off the inventory at the food bank",
    INVALID: "Order is invalid"
  };

class Order {

    constructor(orderRef) {
        this.orderId = orderRef.orderId
        this.foodBankId = orderRef.foodBankId;
        this.groceryId = orderRef.groceryId;
        this.inventoryItems = {};
        this.timePlaced = Date(orderRef.time);

        this.parseItems(orderRef.inventory);
        this.setStatus(orderRef.status)
    }

    getOrderId() { return this.orderId; }

    setStatus(newStatus) { 
        switch(newStatus){
            case 'Looking For Diver':
                this.status = OrderStates.LOOKING_FOR_DRIVER;
                break;
            case 'Unable To Complete':
                this.status = OrderStates.UNABLE_TO_COMPLETE;
                break;
            case 'Valid':
                this.status = OrderStates.VALID;
                break;
            case 'Pickup In Progress':
                this.status = OrderStates.PICKUP_IN_PROGRESS;
                break;
            case 'Drop Off In Progress':
                this.status = OrderStates.DROP_OFF_IN_PROGRESS;
                break;
            case 'Delivered':
                this.status = OrderStates.DELIVERED;
                break;
            default:
            this.status = OrderStates.INVALID;
        }   
    }

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
module.exports =  OrderStates;