class GroceryStoreDao{
    constructor(){}

    isOrderValid(gsDB, order){
        //This is a list
        var orderInventory = order.inventoryItems;
        //console.log("This is order inventory:", orderInventory);

        //compare quantities and update the quantity 
        let gsRef = gsDB.collection("GroceryStores").doc(order.groceryId).collection("InventoryCollection").doc("Items");
        
        for (const [key, value] of Object.entries(orderInventory)){
            let queryById = gsRef.get().then(doc => {
                if (!doc.exists){
                    console.log("No such document!");
                    return null;
                }else{
                    var jsonInfo = JSON.parse(JSON.stringify(doc.data()));

                    //console.log("This is item:", orderInventory[key]);          
                    
                    if (orderInventory[key]["quantity"] <= Number(jsonInfo[key]["quantity"])){
                        order.setStatus("Looking for driver");
                        //console.log("new updated status: ",order.getStatus());

                        //get the remaining quantity in the database
                        var remainingQuantity =   Number(jsonInfo[key]["quantity"]) - orderInventory[key]["quantity"];
                        //console.log("remainingQuanitity: ", remainingQuantity); 

                        var ediOrderNumber = jsonInfo[key]['ediOrderNumber'];
                        var expiryDate = jsonInfo[key]['expiryDate'];
                        var inventoryItemId = jsonInfo[key]['inventoryItemId'];
                        var name = jsonInfo[key]["name"];
                        this.updateStoreInventoryQuantity(gsRef, key, ediOrderNumber, expiryDate, inventoryItemId, name, remainingQuantity);
                    }else{
                        order.setStatus("Invalid");
                        //console.log("new updated status: ", order.getStatus());
                    }
                    return null;
                }
            }).catch(err => {
                console.log('Error getting document', err);
                return null;
            })
        }
    }

    updateStoreInventoryQuantity(gsRef, key, ediOrderNumber, expiryDate, inventoryItemId, name, remainingQuantity){
        var ord = {};
        ord[key] = {"ediOrderNumber": ediOrderNumber, "expiryDate":expiryDate, "inventoryItemId":inventoryItemId, "name":name,"quantity": remainingQuantity};
        console.log(ord);
        gsRef.update(ord);
    }



}

module.exports = GroceryStoreDao;