const Driver = require('./Driver');

class OrderProcessor {
    constructor(driverQuery, activeOrderDao, groceryStoreDao, driverDao) {
        this.initDriverListener(driverQuery);
        this.activeOrderDao = activeOrderDao;
        this.groceryStoreDao = groceryStoreDao;
        this.driverDao = driverDao;
    } 

    processOrder(order) {
        if (this.groceryStoreDao.isOrderValid(order)) {
            let validDrivers = this.driverDao.findAllValidDrivers(order);
            order.notifyDriver(validDrivers);
            this.activeOrderDao.addToActiveOrders(order);
        } else {
            console.log("Order is invalid");
        }
    }

    initDriverListener(driverQuery) {
        // Construct a listener for driver statuses
        let observer = driverQuery.onSnapshot(querySnapshot => {
            querySnapshot.docChanges().forEach(change => {
                // Get the driver data
                var driver = change.doc.data();
                driver.driverId = change.doc.ref.id;
                var driverObj = Driver(driver);
                // Update the orders if the driver is Available
                if (driver.status === 'Available') {
                    // Find orders that the driver can deliver and send
                    notifyDriver(driverObj, this.activeOrderDao.findMatchingActiveOrders(driverObj));
                }
            });
        });
    }

    notifyDriver(driver, orders) {
        orders.forEach(order => {
            order.notifyDriver([driver])
        });
    }

    addOrderToDict(order) {
        this.activeOrder[order.orderId] = order;
    }

    addDriverToDict(driver) {
        if (driver.isValid()) {
            this.activeDriver[driver.driverId] = driver;
            console.log("Driver added")
        }
    }

    removeOrderFromDict(order) {
        if (order.orderId in this.activeOrder) {
            delete this.activeOrder[order.id];
            console.log("Order removed");
        }
    }

    removeDriverFromDict(driver) {
        if (driver.driverId in this.activeDriver) {
            delete this.activeDriver[driver.driverId];
            console.log("Driver removed");
        }
    }
}

module.exports = OrderProcessor;