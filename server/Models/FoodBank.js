class FoodBank {
    constructor(id, name, address, locationId) {
        this.id = id;
        this.name = name;
        this.address = address;
        this.locationId = locationId;
    }
    setId(id) { this.id = id; }
    getId() { return this.id; }

    setName(name) { this.name = name; }
    getName() { return this.name; }

    setAddress(address) { this.address = address; }
    getAddress() { return this.address; }

    setLocationId(locationId) { this.locationId = locationId; }
    getLocationId() { return this.locationId; }

}
module.exports = {
    FoodBank
};