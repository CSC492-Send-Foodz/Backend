const Order = require("../Models/Order");
const OrderObject = Order.Order
requirements = {
    OrderObject: ["foodBankId", "groceryId", "driverId", "ediOrderNumber", "inventoryItems"]
};

function assertObjectValid(object) {
    if ((typeof object) in requirements) {
        for (attribute in requirements[typeof object]) {
            if (!object.hasOwnProperty(attribute)) {
                return false;
            }
        }
    }
    return true;
}