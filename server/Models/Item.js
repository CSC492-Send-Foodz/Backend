class Item {
    constructor(id, name, brand, groceryStoreId, quantity, expirationDate, ediOrderNumber) {
        this.id = id;
        this.name = name;
        this.brand = brand;
        this.groceryStoreId = groceryStoreId;
        this.quantity = quantity;
        this.expirationDate = expirationDate;
        this.ediOrderNumber = ediOrderNumber
    }

    getId() { return this.id; }
    getName() { return this.name; }
    getBrand() { return this.brand; }
    getGroceryStoreId() { return this.groceryStoreId; }
    getQuantity() { return this.quantity; }
    getExpirationDate() { return this.expirationDate; }
    getEdiOrderNumber() { return this.ediOrderNumber; }
}

module.exports = {
    Item
};

