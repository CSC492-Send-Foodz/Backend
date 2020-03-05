const FoodBank = require("../Models/FoodBank");
const AssertRequestValid = require("./AssertObjectValid");

class FoodBankService {
    constructor(foodBankDao, uniqueIdService) {
        this.foodBankDao = foodBankDao;
        this.uniqueIdService = uniqueIdService;
        this.collectionQuery = "Drivers";
    }

    async createFoodBank(foodBankRef) {
        var foodBank = new FoodBank.FoodBank(
            foodBankRef.id === undefined ? this.uniqueIdService.generateUniqueKey(this.collectionQuery) : foodBankRef.id,
            foodBankRef.name,
            foodBankRef.name,
            foodBankRef.locationId);

        if (foodBankRef.id !== undefined) await AssertRequestValid.assertValidFoodBank(this.foodBankDao, foodBank.getId())
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

