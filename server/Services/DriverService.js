const Driver = require("../Models/Driver");
const AssertRequestValid = require("./AssertObjectValid");

class DriverService {
    constructor(DB, driverDao, uniqueIdService, orderDao) {
        this.driverDao = driverDao;
        this.uniqueIdService = uniqueIdService;
        this.collectionQuery = "Drivers";
        this._DriverCollectionQuery = DB.collection(this.collectionQuery);
        this.orderDao = orderDao

    }

    async createDriver(driverRef, isFromDB) {
        var driver = new Driver.Driver(
            driverRef.id,
            Number(driverRef.capacity),
            driverRef.name,
            driverRef.status,
            driverRef.currentLocation);

        AssertRequestValid.assertObjectValid(driver);
        if (driverRef.id !== undefined && isFromDB) await AssertRequestValid.assertValidDriver(this.driverDao, driver.getId())

        return driver;
    }

    updateDriverAccount(driver) {
        this.driverDao.updateDriverAccount(driver);
    }

    async updateDriverStatus(driverId, newStatus) {
        if (driverId !== undefined) await AssertRequestValid.assertValidDriver(this.driverDao, driverId)
        this.driverDao.updateDriverStatus(driverId, this._setOrderStatus(newStatus));
    }


  
    _setOrderStatus(newStatus) {
        switch (newStatus) {
            case "Available":
                return Driver.DriverStates.AVAILABLE;
            default:
                return Driver.DriverStates.UNAVAILABLE;
        }
    }

    findMatchingActiveOrders(driver) {
        if (driver.getStatus() === Driver.DriverStates.AVAILABLE) {
            this.orderDao.findMatchingActiveOrders(driver);
        }
    }
}
module.exports = {
    DriverService
}

