class DriverDao {

    constructor(gsDB) {
        this.gsDB = gsDB;
    }

    notifyAllValidDrivers(activeOrder) {
        let driverDatabase = this.gsDB.collection("DriverCollection");
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