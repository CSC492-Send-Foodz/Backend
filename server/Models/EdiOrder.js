class EdiOrder {
    constructor(groceryStoreId, ediOrderNumber, inventory) {
        this.groceryStoreId = groceryStoreId;
        this.ediOrderNumber = ediOrderNumber;
        this.inventory = inventory;
    }
    getGroceryStoreId() {return this.groceryStoreId}
    getEdiOrderNumber() {return this.ediOrderNumber}
    getInventory() {return this.inventory}
}

module.exports = {
    EdiOrder
};