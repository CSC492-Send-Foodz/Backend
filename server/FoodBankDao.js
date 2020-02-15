class FoodBankDao{
    constructor(fbDB){
    this.fbDB = fbDB;  
}


    writeFoodBankData(foodBankID, fbName, fblocation, fblocationNumber){
        this.fbDB.collection("FoodBank").doc(`${foodBankID}`).set({
            fbName: fbName,
            fblocation: fblocation,
            fblocationNumber: fblocationNumber
            },
            {merge:true});
    }
  
    updateCompletedOrders(order) {
        var stringInventoryData = JSON.stringify(order.getInventory());
        var json_inventory = JSON.parse(stringInventoryData);
        this.fbDB.collection("FoodBank").doc(`${order.getFoodBankID()}`).collection("CompletedOrdersCollection").doc("Orders").set({
            foodBankID: order.getfoodBankID(), 
            storeID: order.getGroceryId(), 
            driverID: order.getdriverID(),
            Inventory: json_inventory

        }
        )
  
    }
}
   
module.exports = FoodBankDao;
