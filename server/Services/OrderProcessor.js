const ActiveOrderDao = require("../DataAccessObjects/ActiveOrderDao");
const Driver = require("../Models/Driver");

class OrderProcessor {
    constructor(driverQuery, activeOrderDao) {
        this.initDriverListener(driverQuery);
        this.activeOrderDao = activeOrderDao;
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
                if (driver.status === Driver.driverStates.AVAILABLE) {
                    // Find orders that the driver can deliver and send
                    notifyDriver(driver, ActiveOrderDao.findMatchingActiveOrders(driver));
                }
            });
        });
    }

    notifyDriver(driver, orders) {
        orders.forEach(order => {
            order.notifyDriver(driver)
        });
    }
}

module.exports = OrderProcessor;