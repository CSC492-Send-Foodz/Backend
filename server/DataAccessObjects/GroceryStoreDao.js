/* eslint-disable promise/always-return */
class GroceryStoreDao {
    constructor(gsDB) {
        this.gsDB = gsDB;
    }

    isOrderValid(order) {
        var orderInventory = order.inventoryItems;
        let gsRef = this.gsDB.collection("GroceryStores").doc(order.groceryId).collection("InventoryCollection").doc("Items");
        return gsRef.get().then(groceryStoreInventory => {
            for (const [itemId, item] of Object.entries(orderInventory)) {
                if (item.getQuantity() > Number(groceryStoreInventory.data()[item.getInventoryItemId()]["quantity"])) {
                    order.setStatus("Invalid");
                    console.log("Reached Invalid State")
                    return false;
                }
            }
            console.log("Continued to valid state")
            order.setStatus("Looking for driver");
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
        console.log("Decrement Values: ", updateItems);

        gsRef.update(updateItems);
    }

    // for updating inventory in firestore
    newInventoryToGroceryStoreData(newEdiOrder) {
        //write to the database new inventory
        if (newEdiOrder.inventory === undefined || newEdiOrder.inventory.length === 0) {
            console.log("Empty Order");
            return null;
        }

        var stringInventoryData = JSON.stringify(newEdiOrder.inventory);
        var json_inventory = JSON.parse(stringInventoryData);
        var batch = this.gsDB.batch();
        var myKeyRef = this.gsDB.collection("GroceryStores").doc(`${newEdiOrder.groceryId}`).collection("InventoryCollection").doc("Items");
        batch.set(myKeyRef, json_inventory);

        batch.commit().then(function () {
            console.log("Success!");
            return null;
        }).catch((err) => {
            console.log("Error getting documents", err);
            return err;
        });
    }

    writeGroceryStoreData(companyName, location, storeNumber) {
        var storeId = this.generateUniqueKey();
        this.gsDB.collection("GroceryStores").doc(`${storeId}`).set({
            companyName: companyName,
            location: location,
            storeNumber: storeNumber
        },
            { merge: true });
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
    updateGroceryStoreData(storeID, productID, newquantity) {
        data = {}
        data[storeID + "." + productID] = newquantity
        this.gsDB.collection('GroceryStores').doc(`${storeID}`).collection('InventoryCollection').doc('Items').update(data);
    }
}
module.exports = {
    GroceryStoreDao
};