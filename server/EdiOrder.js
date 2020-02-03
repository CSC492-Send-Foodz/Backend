class EdiOrder {
	constructor(jsonBody){
        this.ediOrderNumber = jsonBody.ediOrderNumber;
        this.groceryId = jsonBody.groceryId;

        //This is just nested json doc
        this.inventory = jsonBody.inventory; 
    }
}

module.exports = EdiOrder;