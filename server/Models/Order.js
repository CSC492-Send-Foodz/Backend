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
        this.driverId;
        this.ediOrderNumber = orderRef.ediOrderNumber;
        this.parseItems(orderRef.inventoryItems);
        if(orderRef.orderId !== null){
            this.orderId = orderRef.orderId;  
        }
        this.setStatus(orderRef.status)
    }

    getTotalQuantity() { return this.totalQuantity; }

    getOrderId() { return this.orderId; }

    setOrderId(orderId) { this.orderId = orderId; }

    setStatus(newStatus) {
        switch (newStatus) {
            case "Looking For Diver":
                this.status = OrderStates.LOOKING_FOR_DRIVER;
                break;
            case "Order is unable to completed":
                this.status = OrderStates.UNABLE_TO_COMPLETE;
                break;
            case "Order is able to completed":
                this.status = OrderStates.VALID;
                break;
            case "Driver on the way to pick up inventory from the grocery store":
                this.status = OrderStates.PICKUP_IN_PROGRESS;
                break;
            case "Driver has picked up inventory from the grocery store.":
                this.status = OrderStates.DROP_OFF_IN_PROGRESS;
                break;
            case "Driver has dropped off the inventory at the food bank":
                this.status = OrderStates.DELIVERED;
                break;
            default:
                this.status = OrderStates.INVALID;
        }
        this.status = newStatus;
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

        for (const [itemId, item] of Object.entries(inventoryItemsRef)) {
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

    notifyDriver(potentialDriverId) {
        console.log("Driver with id " + potentialDriverId + " notified with for order " + this.orderId)
    }
}

module.exports = {
    Order,
    OrderStates
};