class DriverDao{
    //findAllValidDrivers: For now, a valid driver is identified if 
    //the driver quantity is greater or equal to the total amount of 
    //quantity of all items in the order. Return an array of driver ids.

    constructor(){
        this.driverIds = [];
    }

    findAllValidDrivers(dDB, activeOrder){
        let driverDatabase = dDB.collection("DriverCollection").doc("Driver")
        driverDoc = driverDatabase.get().then(doc => {
            if (!doc.exists){
                console.log('No such document!');
                return null;
            }else{
                if (doc.data()["driverId"] >= activeOrder.getTotalQuantity()){
                    this.driverIds.push(doc.data()["driverId"]);
                }
            }
        })
    }
}

module.exports = DriverDao;