class FoodBankDao {
    constructor(DB) {
        this.DB = DB;
    }

    async getFoodBankAccountData(foodBankId){
        let foodBank = await this.DB.collection("Foodbanks").doc(`${foodBankId}`).get();
        return foodBank;
    }

    updateFoodBankAccountData(foodBank) {
        this.DB.collection("Foodbanks").doc(`${foodBank.getId()}`).set({
            name: foodBank.getName(),
            address: foodBank.getAddress(),
            locationId: foodBank.getLocationId()
        },
            { merge: true });
    }
}

module.exports = {
    FoodBankDao
};