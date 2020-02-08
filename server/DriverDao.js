class DriverDao{
    //findAllValidDrivers: For now, a valid driver is identified if 
    //the driver quantity is greater or equal to the total amount of 
    //quantity of all items in the order. Return an array of driver ids.

    constructor(){
        this.driverIds = [];
    }

    findAllValidDrivers(dDB, activeOrder){
        let driverDatabase = dDB.collection("DriverCollection");
        //console.log("This is total quantity:", activeOrder.getTotalQuantity());
        driverDatabase.where('capacity', '>=', activeOrder.getTotalQuantity()).get().then(snapshot => {
            snapshot.forEach(doc => {
                this.driverIds.push(doc.data()["driverId"]);
                //console.log("this is all drivers", this.driverIds);
            });
        console.log("this is full list of valid driverIDs", this.driverIds);

        //this doesn't work
        return this.driverIds;
        });
    }
}

module.exports = DriverDao;