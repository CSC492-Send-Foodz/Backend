const Order = require("../Models/Order");
const EdiOrder = require("../Models/EdiOrder");

class GroceryStoreDao {
    constructor(gsDB) {
        this.gsDB = gsDB;
    }

    isOrderValid(order) {
        var orderInventory = order.inventoryItems;
        let gsRef = this.gsDB.collection("GroceryStores").doc(order.groceryId).collection("InventoryCollection").doc("Items");
        return gsRef.get().then(groceryStoreInventory => {
            for (const [itemId, item] of Object.entries(orderInventory)) {
                if (item.getQuantity() > Number(groceryStoreInventory.data()[itemId]["quantity"])) {
                    order.setStatus(Order.OrderStates.INVALID);
                    return false;
                }
            }
            order.setStatus(Order.OrderStates.LOOKING_FOR_DRIVER);
            console.log(order.getStatus())
            this.updateStoreInventoryQuantity(gsRef, orderInventory, groceryStoreInventory.data());
            return true;

        });
    }

    updateStoreInventoryQuantity(gsRef, orderInventory, groceryStoreInventory) {
        var updateItems = {};
        for (const [itemId, item] of Object.entries(orderInventory)) {
            var remainingQuantity = Number(groceryStoreInventory[itemId]["quantity"]) - item.getQuantity();
            updateItems[orderInventory[itemId].getInventoryItemId()] = {
                "ediOrderNumber": orderInventory[itemId].getEdiOrderNumber(), "expiryDate": orderInventory[itemId].getExpiryDate(),
                "inventoryItemId": orderInventory[itemId].getInventoryItemId(), "name": orderInventory[itemId].getName(), "quantity": remainingQuantity
            };
        }
        gsRef.update(updateItems);
    }

    newInventoryToGroceryStoreData(newEdiOrder) {
        if (newEdiOrder.inventoryItems === undefined || newEdiOrder.inventoryItems.length === 0) {
            return null;
        }
        var stringInventoryData = JSON.stringify(newEdiOrder.inventoryItems);
        var json_inventory = JSON.parse(stringInventoryData);
    
        var myKeyRef = this.gsDB.collection("GroceryStores").doc(`${newEdiOrder.groceryId}`).collection("InventoryCollection").doc("Items");
        myKeyRef.set(json_inventory,
            { merge: true });
    }

    writeGroceryStoreData(companyName, location, storeNumber, ediOrderNumber, inventory, storeId) {
        this.gsDB.collection("GroceryStores").doc(`${storeId}`).set({
            companyName: companyName,
            location: location,
            storeNumber: storeNumber
        },
            { merge: true }).then(() =>{
                var ediOrder = new EdiOrder.EdiOrder(storeId, ediOrderNumber, inventory);
                this.newInventoryToGroceryStoreData(ediOrder);
            }).catch(function(error){
                console.error("Error writing document:", error);
            });
        return storeId;
    }

    generateUniqueKey() {
        let dbKeys = [];

        //get all keys in firebase and check they don"t coincide with key
        let ordersRef = this.gsDB.collection("GroceryStores");

        ordersRef.get().then(snapshot => {
            snapshot.forEach(doc => {
                dbKeys.push(doc.id);
            });
        })
            .catch(err => {
                console.log("Error getting documents", err);
            });

        return this._getKeyUnique(dbKeys);
    }

    _getKeyUnique(listOfKeys) {
        //return key if unique; otherwise recurse
        let key = Math.ceil(Math.random() * (10000));

        if (listOfKeys.includes(key)) {
            return this._getKeyUnique(listOfKeys);
        } else {
            return key;
        }
    }
}
module.exports = {
    GroceryStoreDao
};