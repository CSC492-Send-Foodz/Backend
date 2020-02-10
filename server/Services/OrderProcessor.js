const ActiveOrderDao = require("../DataAccessObjects/ActiveOrderDao");
const Driver = require("../Models/Driver");
const GroceryStoreDao = require("../DataAccessObjects/GroceryStoreDao");

class OrderProcessor {
    constructor(driverQuery, orderQuery, groceryQuery, activeOrderDao, groceryStoreDao, driverDao) {
        this.initDriverListener(driverQuery);
        //this.initOrderListener(orderQuery, groceryQuery)
        this.activeOrderDao = activeOrderDao;
        this.groceryStoreDao = groceryStoreDao;
        this.driverDao = driverDao;
    }

    processOrder(order) {
        if (this.groceryStoreDao.isOrderValid(order)) {
            let validDriversId = this.driverDao.findAllValidDrivers(order);
            order.notifyDrivers(validDriversId);
            this.activeOrderDao.addToActiveOrders(order);
            return true;
        } else {
            console.log("Order is invalid");
            return false;
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
                if (driver.status === Driver.driverStates.AVAILABLE) {
                    // Find orders that the driver can deliver and send
                    notifyDriver(driverObj, this.activeOrderDao.findMatchingActiveOrders(driverObj));
                }
            });
        });
    }
    /*
    initOrderListener(orderQuery, groceryQuery) {
        let orderobserver = orderQuery.onSnapshot(snapshot => {
            let listener = snapshot.docChanges();
            listener.forEach(element => {
                var data = element.doc.data();
                console.log(data.status);
                if (data.status === 'Looking For Driver') {
                    groceryQuery.get().then(function (doc) {
                        if (doc.exists) {
                            console.log(doc.data().quantity);
                            var quantity = doc.data()[data.inventory['productId']]['quantity'] - data.inventory['quantity'];
                            var gs = GroceryStoreDao();
                            gs.updateGroceryStoreData(data.storeID, data.inventory['productId'], quantity)
                        } else {
                            console.log('doc does not exists');
                        }
                    }).catch(function (error) {
                        console.log('caught error', error);
                    });
                } else if (element.doc.data().status == 'In Progress') {
                    console.log('Advanced Shipping Notice - drivers')
                    console.log('Advanced Shipping Notice - grocery')
                } else if (element.doc.data().status == 'Picked Up') {
                    console.log('order received')
                    console.log(element.doc.data().orderRecieved)
                }
            });
        });
    }
    */

    notifyDriver(driver, orders) {
        orders.forEach(order => {
            order.notifyDriver([driver])
        });
    }
}

module.exports = {
    OrderProcessor
};