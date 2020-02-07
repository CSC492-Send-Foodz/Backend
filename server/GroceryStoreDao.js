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

    writeGroceryStoreData(storeId, companyName, location, storeNumber) {
        this.gsDB.collection('GroceryStores').doc(`${storeId}`).set({
        companyName: companyName,
        location: location,
        storeNumber: storeNumber},
        {merge: true});
    }
}
module.exports = GroceryStoreDao;