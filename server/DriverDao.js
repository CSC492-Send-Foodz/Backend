class DriverDao {

    constructor() {
        this.driverIds = [];
    }

    notifyAllValidDrivers(dDB, activeOrder) {
        let driverDatabase = dDB.collection("DriverCollection");
        //console.log("This is total quantity:", activeOrder.getTotalQuantity());
        driverDatabase.where('capacity', '>=', activeOrder.getTotalQuantity()).get().then(snapshot => {
            var res = [];
            snapshot.forEach(doc => {
                res.push(doc.data()["driverId"]);
                // order.notifyDriver(doc.data()["driverId"]);
                //console.log("this is all drivers", this.driverIds);
            });
            activeOrder.notifyDrivers(res);
        });
    }

}

module.exports = DriverDao;