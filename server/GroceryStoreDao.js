class GroceryStoreDao{
    constructor(gsDB){
        this.gsDB = gsDB;
    }

    isOrderValid(order){
       var orderInventory = order.inventoryItems;
       let gsRef = this.gsDB.collection("GroceryStores").doc(order.groceryId).collection("InventoryCollection").doc("Items");
       gsRef.get().then(groceryStoreInventory =>{
        for (const [itemId, item] of Object.entries(orderInventory)){
            if (item.getQuantity() > Number(groceryStoreInventory.data()[item.getInventoryItemId()]["quantity"])){
                order.setStatus("Invalid");
                return false;
            }
        }
        order.setStatus("Looking for driver");
        this.updateStoreInventoryQuantity(gsRef, orderInventory, groceryStoreInventory.data()); 
        return true;

      });                  
    }

    updateStoreInventoryQuantity(gsRef, orderInventory, groceryStoreInventory){
        var updateItems = {};
        for(const [itemId, item] of Object.entries(orderInventory)){
            var remainingQuantity =  Number(groceryStoreInventory[itemId]["quantity"]) - value.getQuantity();
            
            ord[orderInventory[itemId].getInventoryItemId()] = {"ediOrderNumber": orderInventory[itemId].getEdiOrderNumber(), "expiryDate":orderInventory[itemId].getExpiryDate(),
             "inventoryItemId":orderInventory[itemId].getInventoryItemId(), "name":orderInventory[itemId].getName(),"quantity": remainingQuantity};
        }
        console.log("Decrement Values: ", updateItems);
        gsRef.update(updateItems);
    }
}

module.exports = GroceryStoreDao;