 class Item {
    constructor(itemRef) {
        this.inventoryItemId = itemRef.inventoryItemId;
        this.name = itemRef.name;
        this.quantity = itemRef.quantity;
        this.expiryDate = Date(itemRef.expiryDate);
        this.groceryStoreId = itemRef.groceryStoreId
    }

    getInventoryItemId() {
        return this.inventoryItemId;
    }

    getName() {
        return this.name;
    }

    getQuantity() {
        return this.quantity;
    }

    setQuantity(quantity){
        this.quantity = quantity;
    }

    getExpiryDate() {
        return this.expiryDate;
    }

    getGroceryStoreId() {
        return this.groceryStoreId;
    }
}


