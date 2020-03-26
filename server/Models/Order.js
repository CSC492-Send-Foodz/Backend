const OrderStates = {
    LOOKING_FOR_DRIVER: "Looking For Driver",
    UNABLE_TO_COMPLETE: "Unable to completed",
    VALID: "Able to completed",
    PICKUP_IN_PROGRESS: "Driver on route for pick up",
    DROP_OFF_IN_PROGRESS: "Inventory picked up",
    DELIVERED: "Inventory Delivered",
    INVALID: "Order is invalid"
};

class Order {

    constructor(id, status, groceryStoreId, foodBankId, driverId, recieved, inventory, quantity) {
        this.id = id;
        this.status = status;
        this.groceryStoreId = groceryStoreId;
        this.foodBankId = foodBankId;
        this.driverId = driverId;
        this.recieved = recieved;
        this.completed;
        this.inventory = inventory;
        this.quantity = quantity;
    }

    getId() { return this.id }
    getStatus() { return this.status; }
    getGroceryStoreId() {return this.groceryStoreId;}
    getFoodBankId() {return this.foodBankId;}
    getDriverId() {return this.driverId;}
    getRecieved() {return this.recieved;}
    getCompleted() {return this.completed;}
    getInventory() { return this.inventory; }
    getQuantity() { return this.quantity; }

    setStatus(status) { this.status = status; }
    

    notifyFoodBank(foodBankURL) {
        console.log("Food Bank Notified 200");
    }

    notifyGroceryStore(groceryStoreURL) {
        console.log("Grocery Store Notified 200");
    }

    notifyDriver(potentialDriverId) {
        console.log("Driver with id " + potentialDriverId + " notified with for order " + this.id);
    }
}

module.exports = {
    Order,
    OrderStates
};