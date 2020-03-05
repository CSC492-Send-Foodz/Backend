class DriverDao {

    constructor(DB) {
        this.DB = DB;
        this.collectionRef = this.DB.collection("Drivers");
    }

    notifyAllValidDrivers(activeOrder) {
        this.collectionRef.where('capacity', '>=', activeOrder.getQuantity()).get().then(snapshot => {
            snapshot.forEach(doc => {
                activeOrder.notifyDriver(doc.data()["id"])
            });
        })
    }

    async getDriverAccountData(driverId){
        let driver = await this.collectionRef.doc(`${driverId}`).get();
        return driver;
    }

    updateDriverAccount(driver){
        this.collectionRef.doc(`${driver.getId()}`).set({
            id: driver.getId(),
            capacity: driver.getCapacity(),
            name: driver.getName(),
            status: driver.getStatus(),
            currentLocation: driver.getCurrentLocation()
        },
        { merge: true });
    }
    
    updateDriverStatus(driverId, newStatus){
        this.DB.collection("Drivers").doc(`${driverId}`).update({
            "status": newStatus
        })
    }
}
module.exports = {
    DriverDao
};