class FoodBank{
    constructor(foodbankRef){
        this.foodBankID= foodbankRef.foodBankID,
        this.fbName = foodbankRef.fbName,
        this.fblocation=foodbankRef.fblocation,
        this.fblocationNumber=foodbankRef.fblocationNumber;
    }
    setFoodBankId(foodBankID) { this.foodBankID = foodBankID; }
    
    getFoodBankId() { return this.foodBankID; }
    
    setFoodBankName(fbName) { this.fbName=fbName; }
    
    getFoodBankName(){ return this.fbName; }
    
    setFoodBankLocation(fblocation) { this.fblocation=fblocation; }
    
    getFoodBankLocation(){ return this.fblocation; }
    
    setFoobBankLocationId(fblocationNumber){this.fblocationNumber=fblocationNumber;}
    
    getFoodBankLocationId(){ return this.fblocationNumber; }

}

module.exports = FoodBank;
