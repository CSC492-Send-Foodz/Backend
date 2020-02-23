const Order = require("../Models/Order");
const OrderObject = Order.Order
requirements = {
    OrderObject: ["foodBankId", "groceryId", "driverId", "ediOrderNumber", "inventoryItems"]
};

function assertObjectValid(object) {
    if ((typeof object) in requirements) {
            if (!object.hasOwnProperty(attribute)) {
                return false;
            }
        }
    }
    return true;
}