const Driver = require("../Models/Driver");
const AssertRequestValid = require("./AssertObjectValid");

class DriverService {
    constructor(DB, driverDao, uniqueIdService, orderDao) {
        this.driverDao = driverDao;
        this.uniqueIdService = uniqueIdService;
        this.collectionQuery = "Drivers";
        this._DriverCollectionQuery = DB.collection(this.collectionQuery);
        this.orderDao = orderDao
        
        this.initDriverListener();
    }

    async createDriver(driverRef, isFromDB) {
        var driver = new Driver.Driver(
            driverRef.id === undefined ? this.uniqueIdService.generateUniqueKey(this.collectionQuery) : driverRef.id,
            Number(driverRef.capacity),
            driverRef.name,
            driverRef.status,
            driverRef.currentLocation);

            if(driverRef.id !== undefined && isFromDB) await AssertRequestValid.assertValidDriver(this.driverDao, driver.getId())
            AssertRequestValid.assertObjectValid(driver);

            if(!isFromDB) this._initDriverListener(driver.getId())
        return driver;
    }

    updateDriverAccount(driver){
        this.driverDao.updateDriverAccount(driver);
    }

    async updateDriverStatus(driverId, newStatus){
        if(driverId !== undefined) await AssertRequestValid.assertValidDriver(this.driverDao, driverId)
        this.driverDao.updateDriverStatus(driverId, this._setOrderStatus(newStatus));
    }


    initDriverListener() {
        this._DriverCollectionQuery.get().then(drivers => { 
            drivers.docs.forEach(driver => {
                this._initDriverListener(driver.id);
            });
        })
    }
    
    _initDriverListener(id) {
        this._DriverCollectionQuery.doc(`${id}`).onSnapshot(driverSnapshot => {
            if (driverSnapshot.data() !== undefined && 
            (driverSnapshot.type === "added" || driverSnapshot.type === "modified")) {
                console.log(driverSnapshot.type)
                var driverRef = driverSnapshot.data();
                var driver = new Driver.Driver(
                    driverRef.id,
                    Number(driverRef.capacity),
                    driverRef.name,
                    driverRef.status,
                    driverRef.currentLocation);

                var status = driver.getStatus();

                switch (status) {
                    case "Available":
                        // this.findMatchingActiveOrders(driver);
                        return
                    case "Unavailable":
                        console.log('Driver ' + driver.getId() + ' unavailable');
                        return 
                }
            }
        });
    }
   
    _setOrderStatus(newStatus) {
        switch (newStatus) {
            case "Available":
                return Driver.DriverStates.AVAILABLE;
            default:
                return Driver.DriverStates.UNAVAILABLE;
        }
    }

    findMatchingActiveOrders(driver){
        if (driver.getStatus() === Driver.DriverStates.AVAILABLE){
            this.orderDao.findMatchingActiveOrders(driver);
        }
    }
}
module.exports = {
    DriverService
}

