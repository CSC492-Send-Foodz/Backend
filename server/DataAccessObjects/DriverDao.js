class DriverDao {

    constructor() {
    }

    notifyAllValidDrivers(dDB, activeOrder) {
        let driverDatabase = dDB.collection("DriverCollection");
        driverDatabase.where('capacity', '>=', activeOrder.getTotalQuantity()).get().then(snapshot => {
            var driverIds = [];
            snapshot.forEach(doc => {
                driverIds.push(doc.data()["driverId"]);
            });
            activeOrder.notifyDrivers(driverIds);
        });
    }

}
module.exports = {
    DriverDao
};