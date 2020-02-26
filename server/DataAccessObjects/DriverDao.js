class DriverDao {

    constructor(gsDB) {
        this.gsDB = gsDB;

    }

    notifyAllValidDrivers(activeOrder) {
        this.gsDB.collection("Drivers").where('capacity', '>=', activeOrder.getTotalQuantity()).get().then(snapshot => {
            snapshot.forEach(doc => {
                activeOrder.notifyDriver(doc.data()["driverId"])
            });
            return true;
        }).catch(err=>{
            console.log(err);
        });
    }

    updateDriverAccount(driver){
    
        this.gsDB.collection("Drivers").doc(`${driver.driverId}`).set({
            name: driver.name,
            capacity: driver.capacity,
            points: driver.points,
            status: driver.status,
            defaultRegion: driver.defaultRegion,
            completedOrderIds: driver.completedOrderIds, 
        },
        { merge: true });
    }
    
    updateDriverStatus(driverId, newStatus){
        return this.gsDB.collection("Drivers").doc(`${driverId}`).update({
            "status": newStatus
        }).catch(_err => {
            console.log("Failed to update driver status " + driverId)
        }).then(() => {
            console.log("Active driver" + driverId + " status updated")
        });
    }

    generateUniqueKey() {
        let dbKeys = [];

        //get all keys in firebase and check they don"t coincide with key
        let ordersRef = this.gsDB.collection("Drivers");

        ordersRef.get().then(snapshot => {
            snapshot.forEach(doc => {
                dbKeys.push(doc.id);
            });
        })
            .catch(err => {
                console.log("Error getting documents", err);
            });

        return this._getKeyUnique(dbKeys);
    }

    _getKeyUnique(listOfKeys) {
        //return key if unique; otherwise recurse
        let key = Math.ceil(Math.random() * (10000));

        if (listOfKeys.includes(key)) {
            return this._getKeyUnique(listOfKeys);
        } else {
            return key;
        }
    }

}
module.exports = {
    DriverDao
};