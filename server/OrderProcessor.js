const ActiveOrderDao = require('./ActiveOrderDao');

class OrderProcessor {
    constructor(driverQuery) {
        this.activeOrder = {};
        this.activeDriver = [];
        this.initDriverListener(driverQuery);
    }

    initDriverListener(driverQuery) {
        let observer = driverQuery.onSnapshot(querySnapshot => {
            querySnapshot.docChanges().forEach(change => {
                // Get the driver data
                var driver = change.doc.data();
                driver.driverId = change.doc.ref.id;
                console.log(driver);
                // Update the list based on driver status
                if (driver.status === 'AVAILABLE') {
                    this.addDriverToDict(driver);
                } else {
                    this.removeDriverFromDict(driver);
                }
                ActiveOrderDao.findMatchingActiveOrders(this.activeDriver);
            });
        });
    }

    notifyDrivers() {

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

    addDriverToDict(driver) {
        this.activeDriver.push(driver);
    }

    removeOrderFromDict(order) {
        if (order.orderId in this.activeOrder) {
            delete this.activeOrder[order.id];
            console.log("Order removed");
        }
    }

    removeDriverFromDict(driver) {
        var idx;
        for (idx = 0; idx < this.activeDriver.length; idx++) {
            if (this.activeDriver[idx].driverId === driver.driverID) {
                this.activeDriver.splice(idx, 1);
            }
        }
    }
}

module.exports = OrderProcessor;