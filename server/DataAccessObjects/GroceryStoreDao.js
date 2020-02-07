/* eslint-disable promise/always-return */
class GroceryStoreDao {
    constructor(gsDB){
        this.gsDB = gsDB;
    }

    // for updating inventory in firestore
    newInventoryToGroceryStoreData(newEdiOrder){
        //write to the database new inventory
        if(newEdiOrder.inventory === undefined || newEdiOrder.inventory.length === 0){
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
            console.log("Error getting documents", err);
            return err;
        });
    }

    writeGroceryStoreData(companyName, location, storeNumber) {
        storeId = this.generateUniqueKey();
        this.gsDB.collection("GroceryStores").doc(`${storeId}`).set({
        companyName: companyName,
        location: location,
        storeNumber: storeNumber},
        {merge: true});
    }

    generateUniqueKey() {
        let dbKeys = [];

        //get all keys in firebase and check they don"t coincide with key
        let ordersRef = this.gsDB.collection("GroceryStores");
        
        ordersRef.get().then(snapshot => {
                snapshot.forEach(doc => {
                    console.log(doc.id, "=>", doc.data());
                    dbKeys.push(doc.id);
                });
            })
            .catch(err => {
                console.log("Error getting documents", err);
            });

        return _getKeyUnique(dbKeys);
    }

    _getKeyUnique(listOfKeys) {
        //return key if unique; otherwise recurse
        let key = Math.ceil(Math.random() * (10000));

        if (listOfKeys.includes(key)) {
            return getKeyUnique(listOfKeys);
        } else {
            console.log(key);
            return key;
        }
    }
}
module.exports = GroceryStoreDao;