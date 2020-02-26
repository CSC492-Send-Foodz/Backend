const AssertRequestValid = require("../Services/AssertObjectValid");

const DriverStates = {
    AVAILABLE: "Driver available to deliever an order",
    ACCEPTED: "Driver has accepted order",
    REJECTED: "Driver has rejected order",
    CANCELLED: "Driver has cancelled order",
    UNAVAILABLE: "Driver unavailable to deliever an order"
};

class Driver {
    constructor(driverRef) {
        if (driverRef.driverId !== null ){
            this.driverId = driverRef.driverId;
        }
        this.capacity = driverRef.capacity;
        this.defaultRegion = driverRef.defaultRegion;
        this.name = driverRef.name;
        this.points = driverRef.points;
        this.setCompletedOrderIds(driverRef.completedOrderIds);
        this.setDriverStatus(driverRef.status);
        AssertRequestValid.assertObjectValid(this);
    }

    setDriverId(driverId){ this.driverId = driverId }

    getDriverId() { return this.driverId; }
    getCapacity() { return this.capacity; }

    setDefaultLocation(defaultRegion) { this.defaultRegion = defaultRegion; }
    getDefaultLocation() { return this.defaultRegion; }

    getCompletedOrderIds(){ return this.completedOrderIds; }

    setCompletedOrderIds(lst){
        if (lst != undefined) {
            this.completedOrderIds = lst;   
        }
        this.completedOrderIds = [];
    }

    setDriverStatus(newStatus) {
        switch (newStatus) {
            case "Driver available to deliever an order":
                this.status = DriverStates.AVAILABLE;
                break;
            case "Driver has accepted order":
                this.status = DriverStates.ACCEPTED;
                break;
            case "Driver has rejected order":
                this.status = DriverStates.REJECTED;
                break;
            case "Driver has cancelled order":
                this.status = DriverStates.CANCELLED;
                break;
            default:
                this.status = DriverStates.UNAVAILABLE;
        }
    }
    
    getDriverStatus() { return this.status; }
}
module.exports = {
    Driver,
    DriverStates
};