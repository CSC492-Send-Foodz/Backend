const Item = require("./Item");
class EdiOrder {
    constructor(groceryId, ediOrderNumber, inventoryItems) {
        this.ediOrderNumber = ediOrderNumber;
        this.groceryId = groceryId;
        this.inventoryItems = {};
        this.parseItems(inventoryItems)
    }

    parseItems(inventoryItemsRef) {
        for (const [itemId, item] of Object.entries(inventoryItemsRef)) {
            this.inventoryItems[itemId] = new Item.Item(item, this.ediOrderNumber)
        }
    }

    setGroceryId(groceryId){
        this.groceryId = groceryId;
    }
}

module.exports = {
    EdiOrder
};