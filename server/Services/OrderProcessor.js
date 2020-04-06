const Order = require("../Models/Order");
const Item = require("../Models/Item");
const AssertRequestValid = require("./AssertObjectValid");

class OrderProcessor {
    constructor(DB, orderDao, groceryStoreDao, driverDao, foodBankDao, uniqueIdService) {
        this._orderQuery = DB.collection("Orders");
        this.orderDao = orderDao;
        this.groceryStoreDao = groceryStoreDao;
        this.driverDao = driverDao;
        this.foodBankDao = foodBankDao;
        this.uniqueIdService = uniqueIdService;
    }


    async createOrder(orderRef) {
        var inventory = this._processOrderInventory(orderRef.inventory);
        var order = new Order.Order(this.uniqueIdService.generateUniqueKey("Orders"), this._setOrderStatus(orderRef.status), orderRef.groceryStoreId, orderRef.foodBankId,
            null, Date(orderRef.time), inventory, this._processOrderQuantity(inventory));
        if (orderRef.groceryStoreId !== undefined) await AssertRequestValid.assertValidGroceryStore(this.groceryStoreDao, orderRef.groceryStoreId)
        if (orderRef.foodBankId !== undefined) await AssertRequestValid.assertValidFoodBank(this.foodBankDao, orderRef.foodBankId)

        AssertRequestValid.assertObjectValid(order);
        return order
    }

    _processOrderInventory(inventoryRef) {
        var inventory = {};
        inventoryRef.forEach(itemRef => inventory[itemRef.id] = new Item.Item(itemRef.id, itemRef.name, itemRef.brand, itemRef.groceryStoreId,
            Number(itemRef.quantity), Date(itemRef.expirationDate), itemRef.ediOrderNumber))
        return inventory;
    }

    _processOrderQuantity(inventory) {
        var totalQuantity = 0;
        for (const [itemId, item] of Object.entries(inventory)) {
            totalQuantity += item.getQuantity();
        }
        return totalQuantity;
    }

    _setOrderStatus(newStatus) {
        switch (newStatus) {
            case "Looking For Driver":
                return Order.OrderStates.LOOKING_FOR_DRIVER;

            case "Unable to completed":
                return Order.OrderStates.UNABLE_TO_COMPLETE;

            case "Driver on route for pick up":
                return Order.OrderStates.PICKUP_IN_PROGRESS;

            case "Inventory picked up":
                return Order.OrderStates.DROP_OFF_IN_PROGRESS;

            case "Inventory Delivered":
                return Order.OrderStates.DELIVERED;

            default:
                return Order.OrderStates.INVALID;
        }
    }

    async processOrder(order) {
        await this.groceryStoreDao.isOrderValid(order).then(res => {
            if (res) {
                this.orderDao.addToOrders(order)
                order.setStatus(Order.OrderStates.LOOKING_FOR_DRIVER)
            }
            else {
                order.setStatus(Order.OrderStates.UNABLE_TO_COMPLETE);
            }
            return true;
        })
    }

    async updateActiveOrderStatus(orderId, status) {
        if (orderId !== undefined) await AssertRequestValid.assertValidActiveOrder(this.orderDao, orderId)
        this.orderDao.updateActiveOrderStatus(orderId, this._setOrderStatus(status));
    }

}

module.exports = {
    OrderProcessor
};