
const DriverStates = {
    AVAILABLE: "Driver available to deliever an order",
    ACCEPTED: "Driver has accepted order",
    REJECTED: "Driver has rejected order",
    CANCELLED: "Driver has cancelled order"
  };

class Driver {
    constructor(driverRef) {
        this.driverId = driverRef.driverId;
        this.capacity = driverRef.capacity;
        this.defaultLocation = driverRef.defaultLocation;
        this.setDriverStatus(driverRef.status);
    }

    getDriverId() { return this.driverId; }
    getCapacity() {return this.capacity; }

    setDefaultLocation (defaultLocation) { this.defaultLocation = defaultLocation; }
    getDefaultLocation() { return this.defaultLocation; }

    setDriverStatus(newStatus) { 
        switch(newStatus){
            case "Available":
                this.status = DriverStates.AVAILABLE;
                break;
            case "Accepted":
                this.status = DriverStates.ACCEPTED;
                break;
            case "Rejected":
                this.status = DriverStates.REJECTED;
                break;
            case "Cancelled":
                this.status = DriverStates.CANCELLED;
                break;
        }   
    }
    getDriverStatus() { return this.status; }
}
module.exports =  Driver;
module.exports =  DriverStates;