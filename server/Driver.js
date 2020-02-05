
const driverStates = {
    AVAILABLE: "Driver available to deliever an order",
    PICKUP_IN_PROGRESS: "Driver on the way to pick up inventory from the grocery store",
    DROP_OFF_IN_PROGRESS: "Driver has picked up inventory from the grocery store.",
    DELIVERED: "Driver has dropped off the inventory at the food bank",
  };

class Driver {
    constructor(driverRef) {
        this.driverId = driverRef.driverId;
        this.capacity = driverRef.capacity;
        this.defaultLocation = driverRef.defaultLocation;
        this.status = driverRef.status;
    }

    getDriverId() { return this.driverId; }
    getCapacity() {return this.capacity; }

    setDefaultLocation (defaultLocation) { this.defaultLocation = defaultLocation; }
    getDefaultLocation() { return this.defaultLocation; }

    setDriverStatus(status){ this.status = status; }
    getDriverStatus() { return this.status; }
}
module.exports =  Driver;
module.exports =  driverStates;