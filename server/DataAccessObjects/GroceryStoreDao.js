const EdiOrder = require("../Models/EdiOrder");

class GroceryStoreDao {
    constructor(DB, firebase) {
        this.DB = DB;
        this.firebase = firebase;
    }

    deleteInventoryItem(id, groceryStoreId) {
        this.DB.collection("GroceryStores").doc(`${groceryStoreId}`).collection("InventoryCollection").doc("Items").update({
            [id]: this.firebase.firestore.FieldValue.delete()
        })
    }

    async getGroceryStoreData(groceryStoreId) {
        let groceryStore = await this.DB.collection("GroceryStores").doc(`${groceryStoreId}`).get();
        return groceryStore;
    }

    updateInventory(ediOrder) {
        return this.DB.collection("GroceryStores").doc(ediOrder.getGroceryStoreId()).collection("InventoryCollection").doc("Items")
            .set(JSON.parse(JSON.stringify(ediOrder.getInventory())),
                { merge: true });
    }

    updateGroceryStoreData(groceryStore) {
        this.DB.collection("GroceryStores").doc(`${groceryStore.getId()}`).set({
            company: groceryStore.getCompany(),
            storeNumber: groceryStore.getStoreNumber(),
            address: groceryStore.getAddress()
        },
            { merge: true });
    }

    isOrderValid(order) {
        return this.DB.collection("GroceryStores").doc(order.getGroceryStoreId()).collection("InventoryCollection").doc("Items")
            .get().then(groceryStoreInventory => {
                for (const [itemId, item] of Object.entries(order.getInventory())) {
                    if (item.getQuantity() > Number(groceryStoreInventory.data()[itemId]["quantity"])) return false;
                }
                this.updateStoreInventoryQuantity(order.getGroceryStoreId(), order.getInventory(), groceryStoreInventory.data())
                return true;
            });
    }

    updateStoreInventoryQuantity(groceryStoreId, orderInventory, groceryStoreInventory) {
        var updateItems = {};
        for (const [itemId, item] of Object.entries(orderInventory)) {
            var remainingQuantity = Number(groceryStoreInventory[itemId]["quantity"]) - item.getQuantity();
            if (remainingQuantity == 0) {
                this.deleteInventoryItem(item.getId(), item.getGroceryStoreId())
            } else {
                updateItems[item.getId()] = {
                    "id": item.getId(),
                    "name": item.getName(),
                    "brand": item.getBrand(),
                    "groceryStoreId": item.getGroceryStoreId(),
                    "quantity": remainingQuantity,
                    "expirationDate": item.getExpirationDate(),
                    "ediOrderNumber": item.getEdiOrderNumber()
                };
            }
        }
        if (Object.keys(updateItems).length != 0) {
            this.DB.collection("GroceryStores").doc(groceryStoreId).collection("InventoryCollection").doc("Items").update(updateItems);
        }

    }


    /**********************Timer*************************/

    async _getStores() {
        let storesRef = await this.DB.collection("GroceryStores").get();
        const storeIds = [];
        try {
            storesRef.forEach(doc => {
                storeIds.push(doc.id);
            });
        } catch (error) {
            console.log("Error getting stores", error);
        }

        storesRef.forEach(doc => {
            storeIds.push(doc.id);
        });
        return storeIds;
    }

    async pruneInventory() {
        //get IDs of all stores in grocerySTores
        let storeIds = await this._getStores();
        let uniqueStores = [...new Set(storeIds)];
        //loop through stores and update inventories
        for (let index = 0; index < uniqueStores.length; index++) {
            this._deleteInedibles(uniqueStores[index]);
        }
    }

    async _deleteInedibles(id) {
        let storeRef = await this.DB.collection("GroceryStores").doc(id).collection("InventoryCollection").doc("Items");
        try {
            storeRef.get().then(snapshot => {
                let inventory = snapshot.data();
                for (var key in inventory) {
                    let item = new Item.Item(inventory[key]);
                    let itemEBD = item.getEdibleByDate();

                    if (itemEBD < new Date(Date.now())) {
                        delete inventory[key];
                    }
                }

                this.DB.collection("GroceryStores").doc(id).collection("InventoryCollection").doc("Items").set(inventory);

            }).catch(err => { console.log("Error getting store", err) })
        } catch (error) {
            console.log("Error getting inventory", error);
        }
    }

}
module.exports = {
    GroceryStoreDao
};