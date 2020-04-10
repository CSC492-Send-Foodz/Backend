const FoodBank = require("../Models/FoodBank");
const AssertRequestValid = require("./AssertObjectValid");

class FoodBankService {
    constructor(foodBankDao) {
        this.foodBankDao = foodBankDao;
        this.collectionQuery = "Drivers";
    }

    async createFoodBank(foodBankRef) {
        var foodBank = new FoodBank.FoodBank(
            foodBankRef.id,
            foodBankRef.name,
            foodBankRef.name,
            foodBankRef.locationId);

        AssertRequestValid.assertObjectValid(foodBank);
        return foodBank;
    }

    updateFoodBankAccount(foodBank) {
        this.foodBankDao.updateFoodBankAccountData(foodBank);
    }
}
module.exports = {
    FoodBankService
}

