
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
    getCapacity() { return this.capacity; }

    setDefaultLocation(defaultLocation) { this.defaultLocation = defaultLocation; }
    getDefaultLocation() { return this.defaultLocation; }

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
        }
    }
    getDriverStatus() { return this.status; }
}
module.exports = {
    Driver,
    DriverStates
};