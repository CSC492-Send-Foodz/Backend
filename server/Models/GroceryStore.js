class GroceryStore {
    constructor(id, storeNumber, address, company){
        this.id = id;
        this.storeNumber = storeNumber;
        this.address = address;
        this.company = company;
    }

    getId() {return this.id}
    getStoreNumber() {return this.storeNumber}
    getAddress() {return this.address}
    getCompany() {return this.company}
}
module.exports = {
    GroceryStore
}