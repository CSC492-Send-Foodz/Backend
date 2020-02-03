
module.exports.listen = function listen(query, groceryStore) {
    let observer = query.onSnapshot(querySnapshot => {
        console.log('Query Snapshot:');
        console.log(querySnapshot);
        querySnapshot.docChanges().forEach(change => {
            if (change.type === 'added') {
                console.log('Attribute added: ' + change.doc.data())
            } else if (change.type === 'modified') {
                console.log('Attribute modified: ' + change.doc.data().name)
            } else if (change.type === 'removed') {
                console.log('Attribute removed: ' + change.doc.data())
            } else {
                console.log(`Change type ${change.type} not processed.`)
            }
            // Get the data that has changed
            var changeData = change.doc.data();

            // Clear the dictionary of items
            //TODO - get this to work - groceryStore.globalInventory = {};

            // Make sure that there is an inventory attribute
            if (changeData !== null) {
                //Go over each item and add it to the map
                console.log(changeData);
                /*changeData.forEach(item => {
                    console.log('Item ID: ' + item.inventoryItemId);
                    //TODO - get this to work - groceryStore.globalInventory[item.inventoryItemId] = Item(item);
                });*/
            }
        })
    }, err => {
        console.log(`Encountered error: ${err}`);
    });
}