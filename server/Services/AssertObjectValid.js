const Order = require("../Models/Order");

requirements = {
    "Order": ["foodBankId", "groceryId", "ediOrderNumber", "inventoryItems"],
    "Item": ["ediOrderNumber", "name", "quantity", "groceryStoreId"],
    "Driver": ["capacity", "status"],
    "EdiOrder": ["ediOrderNumber", "groceryId", "inventoryItems"]
};

function assertObjectValid(object) {
    if (object.constructor.name in requirements) {
        missing = []
        for (const attribute of requirements[object.constructor.name]) {
            if (!object.hasOwnProperty(attribute) || object[attribute] === undefined) {
                missing.push(attribute);
                console.log(missing);
            }
        }
        if (missing.length !== 0) {
            throw new AssertError(missing);
        }
    }
}

class AssertError extends Error {
    constructor(missingAttributes) {
        var message = "Missing Attributes:\n";
        for (const attribute of missingAttributes) {
            message += "\t" + attribute + "\n";
        }
        super(message);
        this.name = "Assertion Error"
    }
}

module.exports = {
    assertObjectValid
};