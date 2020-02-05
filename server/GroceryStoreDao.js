class GroceryStoreDao {
    constructor(gsDB){
        this.gsDB = gsDB;
    }

    // for updating inventory in firestore
    newInventoryToGroceryStoreData(newEdiOrder){
        //write to the database new inventory
        if(newEdiOrder.inventory === undefined || newEdiOrder.inventory.length == 0){
            console.log("Empty Order");
            return null;
        }

        var stringInventoryData = JSON.stringify(newEdiOrder.inventory);
        var json_inventory = JSON.parse(stringInventoryData);
        var batch = this.gsDB.batch();
        console.log(json_inventory);
        var myKeyRef = this.gsDB.collection("GroceryStores").doc(`${newEdiOrder.groceryId}`).collection("InventoryCollection").doc("Items");
        batch.set(myKeyRef, json_inventory);

        batch.commit().then( function() {
            console.log("Success!");
            return null;
        }).catch((err) => {
            console.log('Error getting documents', err);
            return err;
        });
    }

    decrementInventoryFromGroceryStoreData(order){
        this.gsDB.ref('groceryStore/').update({
            order
        });
    }

    writeGroceryStoreData(storeId, companyName, location, storeNumber) {
        this.gsDB.ref('groceryStore/' + storeId).set({
        companyName: companyName,
        location: location,
        storeNumber: storeNumber
        });
    }

    updateGroceryStoreData(storeId, companyName, location, storeNumber) {
        var update = {};
        var updatedInfo = {
            companyName: companyName,
            location: location,
            storeNumber: storeNumber
        }
        update['groceryStore/' + storeId] = updatedInfo;
        this.gsDB.ref().update(update);
    }
}
module.exports = GroceryStoreDao;