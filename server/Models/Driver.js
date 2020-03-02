const DriverStates = {
    AVAILABLE: "Available",
    UNAVAILABLE: "Unavailable"
};

class Driver {
    constructor(id, capcity, name, status, currentLocation) {
        this.id = id;
        this.capacity = capcity;
        this.name = name;
        this.currentLocation = currentLocation;
        this.setStatus(status);
    }

    setId(id) { this.id = id }
    getId() { return this.id; }

    setCapacity(capacity) { this.capacity = capacity }
    getCapacity() { return this.capacity; }

    setName(name) { this.name = name }
    getName() { return this.name; }

    setStatus(newStatus) {
        if(newStatus === "Available"){
            this.status = DriverStates.AVAILABLE;
        }
        else{
            this.status = DriverStates.UNAVAILABLE;
        }
    }
    getStatus() { return this.status; }

    setCurrentLocation(currentLocation) { this.currentLocation = currentLocation; }
    getCurrentLocation() { return this.currentLocation; }
}
module.exports = {
    Driver,
    DriverStates
};