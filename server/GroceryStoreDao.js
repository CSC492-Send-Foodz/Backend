class GroceryStoreDao{
    constructor(){}

    getGroceryStoreInventory(gsDB, order){
        console.log("this is groceryId: ", order.groceryId);
        let gsRef = gsDB.collection("GroceryStores").doc(order.groceryId).collection("InventoryCollection").doc("Items");
        
        gsRef.get().then(doc => {
            if (!doc.exists){
                console.log("No such document!");
                return null;
            }else{
                console.log("This is doc data: ", doc.data());
                //var jsonInfo = JSON.parse(JSON.stringify(doc.data()));
                //console.log("This is jsonInfo:", jsonInfo);
                return doc.data();
            }
        }).catch(err => {
            console.log('Error getting document', err);
            return null;
        });
    }

    //order = order object
    isOrderValid(gsDB, order){
        //This is a 
        var orderInventory = order.inventoryItems;
        //console.log("This is order inventory:", orderInventory);

        //compare quantities and update the quantity 
        
        //This is the path to firestore database
        var groceryStoreInventory = this.getGroceryStoreInventory(gsDB, order);
        console.log("this is groceryStoreInventory: FOR REAL", groceryStoreInventory);
        
        // item -> itemId , value -> item
        for (const [item, value] of Object.entries(orderInventory)){ 
            console.log("This is item", item);
            console.log("This is value", value);      
            if (value.getQuantity() > Number(groceryStoreInventory[value.getInventoryItemId()]["quantity"])){
                order.setStatus("Invalid");
                console.log("new updated status: ", order.getStatus());
            }else{
                order.setStatus("Looking for driver");
                //console.log("new updated status: ",order.getStatus());
                //get the remaining quantity in the database
                var remainingQuantity =   Number(groceryStoreInventory[value.getInventoryItemId()]["quantity"]) - value.getQuantity();
                console.log("remainingQuanitity: ", remainingQuantity);                 
                this.updateStoreInventoryQuantity(gsRef, itemId, order); 
            }
        
        }
                                      
    }

    updateStoreInventoryQuantity(gsRef, itemId, order){
        var ord = {};
        ord[itemId] = {"ediOrderNumber": order, "expiryDate":expiryDate, "inventoryItemId":inventoryItemId, "name":name,"quantity": remainingQuantity};
        console.log(ord);
        gsRef.update(ord);
    }
}

module.exports = GroceryStoreDao;