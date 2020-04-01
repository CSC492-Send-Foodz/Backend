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

        this.initOrderListener();
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
            itemRef.quantity, Date(itemRef.expirationDate), itemRef.ediOrderNumber))
        return inventory;
    }

    _processOrderQuantity(inventory) {
        var totalQuantity = 0;
        for (const [itemId, item] of Object.entries(inventory)) {
            totalQuantity += Number(item.getQuantity());
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
    initOrderListener() {
        this._orderQuery.get().then(activeOrders => {
            activeOrders.docs.forEach(activeOrder => {
                this._initOrderListener(activeOrder.id);
            });
            return true;
        }).catch(error => {
            console.log(error);
        })
    }

    _initOrderListener(id) {
        this._orderQuery.doc(`${id}`).onSnapshot(orderSnapshot => {
            if (orderSnapshot.data() !== undefined && orderSnapshot.data().inventory !== undefined) {
                var orderRef = orderSnapshot.data();
                var order = new Order.Order(orderRef.id, orderRef.status, orderRef.groceryStoreId, orderRef.foodBankId,
                    orderRef.driverId, orderRef.recieved, orderRef.inventory, orderRef.quantity);
                var status = order.getStatus();

                switch (status) {
                    case "Looking For Driver":
                        this.driverDao.notifyAllValidDrivers(order);
                        return

                    case "In Progress":
                        console.log('Advanced Shipping Notice - drivers');
                        console.log('Advanced Shipping Notice - grocery');
                        return

                    case "Picked Up":
                        console.log('Order ' + order.getId() + ' received');
                        return
                }
            }
        });
    }

    async processOrder(order) {
        await this.groceryStoreDao.isOrderValid(order).then(res => {
            if (res) {
                this.orderDao.addToOrders(order).then(
                    res => {
                        if (res.writeTime !== undefined) this._initOrderListener(order.getId());
                        return;
                        
                    }).catch(error=>{
                        console.log(error);
                    });
                order.setStatus(Order.OrderStates.LOOKING_FOR_DRIVER);
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