const admin = require('firebase-admin');
const functions = require('firebase-functions');

admin.initializeApp(functions.config().firebase);
var gsDB = admin.firestore();

// Creating a realime listener for updates to database
let query = gsDB.collection('grocery').doc('store').collection('Inven');
listen(query, groceryStores);

module.exports.listen = function listen(query, groceryStore) {
    let observer = query.onSnapshot(querySnapshot => {
        querySnapshot.docChanges().forEach(change => {
            // Get the data that has changed
            var changeData = change.doc.data();
            // If data is added or changed update the map by modifying/adding the entry
            if (change.type === 'added' || change.type === 'modified') {
                // Make sure that there not null data
                if (changeData !== null && changeData.inventoryItemId !== null) {
                    groceryStore.globalInventory[changeData.inventoryItemId] = changeData
                }
            } else if (change.type === 'removed') { // If we remove we need to remove the entry
                console.log('Attribute removed:')
                console.log(change.doc.data());
            } else {
                console.log(`Change type ${change.type} not processed.`)
            }
        })
    }, err => {
        console.log(`Encountered error: ${err}`);
    });
}