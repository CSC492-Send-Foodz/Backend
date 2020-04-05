class FoodBankDao {
    constructor(DB) {
        this.DB = DB;
    }

    async getFoodBankAccountData(foodBankId){
        let foodBank = await this.DB.collection("Foodbanks").doc(`${foodBankId}`).get();
        return foodBank;
    }

    updateFoodBankAccountData(foodBank) {
        this.DB.collection("Foodbanks").doc(`${foodBank.getId()}`).set({
            name: foodBank.getName(),
            address: foodBank.getAddress(),
            locationId: foodBank.getLocationId()
        },
            { merge: true });
    }

    // updateCompletedOrders(order) {
    //     var stringInventoryData = JSON.stringify(order.getInventory());
    //     var json_inventory = JSON.parse(stringInventoryData);

    //     this.fbDB.collection("FoodBank").doc(`${order.getFoodBankID()}`).collection("CompletedOrdersCollection").doc("Orders").set({
    //         [`${order.getOrderId()}`]: {
    //             groceryStoreID: order.getGroceryId(),
    //             driverID: order.getdriverID(),
    //             Inventory: json_inventory
    //         }
    //     },
    //         { merge: true });
    // }

}

module.exports = {
    FoodBankDao
};