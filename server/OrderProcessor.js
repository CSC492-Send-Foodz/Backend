const ActiveOrderDao = require('./ActiveOrderDao');
const Driver = require('./Driver');

class OrderProcessor {
    constructor(driverQuery) {
        this.activeOrder = {};
        this.initDriverListener(driverQuery);
    }

    initDriverListener(driverQuery) {
        let observer = driverQuery.onSnapshot(querySnapshot => {
            querySnapshot.docChanges().forEach(change => {
                // Get the driver data
                var driver = change.doc.data();
                driver.driverId = change.doc.ref.id;
                var driverObj = Driver(driver);
                // Update the orders if the driver is Available
                if (driver.status === 'Available') {
                    // Find orders that the driver can deliver and send
                    notifyDriver(ActiveOrderDao.findMatchingActiveOrders(driver));
                }
            });
        });
    }

    notifyDriver(orders) {

    }

    getOrder(orderId) {
        //return order object
        return this.activeOrder[orderId];
    }

    processOrder(order, gs) {
        gs.updateStatus(order);

        if (order.status !== 'Invalid') {
            this.addOrderToDict(order);
            console.log("Order created")
            return true
        }
        return false;
    }

    addOrderToDict(order) {
        this.activeOrder[order.orderId] = order;
    }

    removeOrderFromDict(order) {
        if (order.orderId in this.activeOrder) {
            delete this.activeOrder[order.id];
            console.log("Order removed");
        }
    }
}

module.exports = OrderProcessor;