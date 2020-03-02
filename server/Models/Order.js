const OrderStates = {
    LOOKING_FOR_DRIVER: "Looking For Driver",
    UNABLE_TO_COMPLETE: "Order is unable to completed",
    VALID: "Order is able to completed",
    PICKUP_IN_PROGRESS: "Driver on the way to pick up inventory from the grocery store",
    DROP_OFF_IN_PROGRESS: "Driver has picked up inventory from the grocery store.",
    DELIVERED: "Driver has dropped off the inventory at the food bank",
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
        this.quantity = quantity
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