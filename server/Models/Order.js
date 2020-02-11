const Item = require("./Item");

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
        this.orderId;
        this.foodBankId = orderRef.foodBankId;
        this.groceryId = orderRef.groceryId;
        this.inventoryItems = {};
        this.timePlaced = Date(orderRef.time);
        this.totalQuantity = 0;
        this.driverId = {};  
        this.ediOrderNumber = orderRef.ediOrderNumber;

        this.parseItems(orderRef.inventoryItems);
        this.setStatus(orderRef.status)
    }

    getTotalQuantity(){ return this.totalQuantity; }

    getOrderId() { return this.orderId; }

    setOrderId(orderId) { this.orderId = orderId; }

    setStatus(newStatus) {
        switch (newStatus) {
            case "Looking For Diver":
                this.status = OrderStates.LOOKING_FOR_DRIVER;
                break;
            case "Unable To Complete":
                this.status = OrderStates.UNABLE_TO_COMPLETE;
                break;
            case "Valid":
                this.status = OrderStates.VALID;
                break;
            case "Pickup In Progress":
                this.status = OrderStates.PICKUP_IN_PROGRESS;
                break;
            case "Drop Off In Progress":
                this.status = OrderStates.DROP_OFF_IN_PROGRESS;
                break;
            case "Delivered":
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

    parseItems(inventoryItemsRef) {

        for (const [itemId, item] of Object.entries(inventoryItemsRef)){
            this.inventoryItems[itemId] = new Item.Item(item, this.ediOrderNumber)
            this.totalQuantity += Number(item.quantity); 
        }
    }
    notifyFoodBank(foodBankURL) {
        console.log("Food Bank Notified 200")
    }

    notifyGroceryStore(groceryStoreURL) {
        console.log("Grocery Store Notified 200");

    }

    // Push notifications based on an array of Driver IDs
    notifyDrivers(potentialDrivers) {
        if (potentialDrivers !== undefined && potentialDrivers.length !== 0) {
            potentialDrivers.forEach(driverId => {
                console.log("Driver with id " + driverId + " notified with for order" + this.orderId);
            });
        } else {
            console.log("Notification failed" + error);
        }
    }
}

module.exports = {
    Order,
    OrderStates
};