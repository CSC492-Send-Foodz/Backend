const Driver = require("../Models/Driver");

class OrderProcessor {
    constructor(gsDB, activeOrderDao, groceryStoreDao, driverDao) {
        var driverQuery = gsDB.collection("Drivers");
        var orderQuery = gsDB.collection("ActiveOrders");
        this.activeOrderDao = activeOrderDao;
        this.groceryStoreDao = groceryStoreDao;
        this.driverDao = driverDao;
        this.initDriverListener(driverQuery);
        this.initOrderListener(orderQuery);
    }

    processOrder(order) {
        this.groceryStoreDao.isOrderValid(order).then(res => {
            if (res) {
                this.driverDao.notifyAllValidDrivers(order);
                this.activeOrderDao.addToActiveOrders(order);
                return true;
            }
            return false;
        });
    }

    initDriverListener(driverQuery) {
        driverQuery.onSnapshot(querySnapshot => {
            querySnapshot.docChanges().forEach(change => {
                // Get the driver data
                var driver = change.doc.data();
                driver.driverId = change.doc.ref.id;
                var driverObj = new Driver.Driver(driver);
                if (driverObj.getDriverStatus() === Driver.DriverStates.AVAILABLE) {
                    this.activeOrderDao.findMatchingActiveOrders(driverObj);
                }
            });
        });
    }

    initOrderListener(orderQuery) {
        // orderQuery.onSnapshot(snapshot => {
        //     let listener = snapshot.docChanges();
        //     listener.forEach(element => {
        //         var order = new Order.Order(element.doc.data());
        //         order.setOrderId(element.doc.data().orderId);
        //         console.log(element.doc.data().status)
        //         if (element.doc.data().status == 'Looking For Driver') {
        //             this.driverDao.notifyAllValidDrivers(order)
        //         } else if (element.doc.data().status == 'In Progress') {
        //             console.log('Advanced Shipping Notice - drivers')
        //             console.log('Advanced Shipping Notice - grocery')
        //         } else if (element.doc.data().status == 'Picked Up') {
        //             console.log('order received')
        //             console.log(element.doc.data().orderRecieved)
        //         }
        //     });
        // });
    }


    notifyDriver(driver, orders) {
        orders.forEach(order => {
            order.notifyDriver(driver.getDriverId())
        });
    }
}

module.exports = {
    OrderProcessor
};