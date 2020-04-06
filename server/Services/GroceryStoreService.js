const GroceryStore = require("../Models/GroceryStore");
const EdiOrder = require("../Models/EdiOrder");
const Item = require("../Models/Item");
const AssertRequestValid = require("./AssertObjectValid");

class GroceryStoreService {
    constructor(DB, groceryStoreDao) {
        this.groceryStoreDao = groceryStoreDao;
        this.collectionQuery = "GroceryStores";
        this._GroceryStoresCollectionQuery = DB.collection(this.collectionQuery);
	}

    async createGroceryStore(groceryStoreRef) {
        var groceryStore = new GroceryStore.GroceryStore(
            groceryStoreRef.id,
            groceryStoreRef.storeNumber,
            groceryStoreRef.address,
            groceryStoreRef.company);

        AssertRequestValid.assertObjectValid(groceryStore);
        return groceryStore;
    }

    updateGroceryStoreAccount(groceryStore) {
        this.groceryStoreDao.updateGroceryStoreData(groceryStore);
    }

    async createEDIOrder(ediOrderRef) {
        var ediOrder = new EdiOrder.EdiOrder(ediOrderRef.groceryStoreId, ediOrderRef.ediOrderNumber,
            this._processEDIOrderInventory(ediOrderRef.inventory, ediOrderRef.ediOrderNumber));
        AssertRequestValid.assertObjectValid(ediOrder);
        await AssertRequestValid.assertValidGroceryStore(this.groceryStoreDao, ediOrderRef.groceryStoreId);
        return ediOrder
    }

    _processEDIOrderInventory(inventoryRef, ediOrderNumber) {
        var inventory = {};
        inventoryRef.forEach(itemRef => inventory[itemRef.id] = new Item.Item(itemRef.id, itemRef.name, itemRef.brand, itemRef.groceryStoreId,
            itemRef.quantity, new Date(itemRef.expirationDate), ediOrderNumber))
        return inventory;
    }

    updateInventory(editOrder) {
        this.groceryStoreDao.updateInventory(editOrder);
    }

    deleteInventoryItem(id, groceryStoreId){
        this.groceryStoreDao.deleteInventoryItem(id, groceryStoreId);
    }
}

module.exports = {
    GroceryStoreService
};


