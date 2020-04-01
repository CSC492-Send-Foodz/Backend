requirements = {
    "Order": ["status", "groceryStoreId", "foodBankId", "driverId", "recieved", "inventory"],
    "Item": ["id", "name", "brand", "groceryStoreId", "quantity", "expirationDate", "ediOrderNumber"],
    "Driver": ["id", "status", "name", "status", "currentLocation"],
    "FoodBank": ["id", "name", "address", "locationId"],
    "EdiOrder": ["groceryStoreId", "ediOrderNumber", "inventory"],
};

function assertObjectValid(object) {
    if (object.constructor.name in requirements) {
        missing = []
        for (const attribute of requirements[object.constructor.name]) {
            if (!object.hasOwnProperty(attribute) || object[attribute] === undefined) {
                missing.push(attribute);
            }
        }
        if (missing.length !== 0) {
            throw new MissingAttributes(missing);
        }
    }
}

function assertValidFoodBank(foodBankIdDao, id) {
    return foodBankIdDao.getFoodBankAccountData(id).then((doc) => {
        if (!doc.exists) {
            throw new InvalidAccountId(id);
        }
        return true;
    });
}

function assertValidDriver(driverDao, id) {
    return driverDao.getDriverAccountData(id).then((doc) => {
        if (!doc.exists) {
            throw new InvalidAccountId(id);
        }
        return true;
    });
}

function assertValidGroceryStore(groceryStoreDao, id) {
    return groceryStoreDao.getGroceryStoreData(id).then((doc) => {
        if (!doc.exists) {
            throw new InvalidAccountId(id);
        }
        return true;
    });
}

function assertValidActiveOrder(orderDao, id) {
    return orderDao.getOrders(id).then((doc) => {
        if (!doc.exists) {
            throw new InvalidAccountId(id);
        }
        return true;
    });
}

class MissingAttributes extends Error {
    constructor(missingAttributes) {
        var message = "Missing Attributes: ";
        for (const attribute of missingAttributes) {
            message += attribute + "\n";
        }
        super(message);
    }
}

class InvalidAccountId extends Error {
    constructor(id) {
        super(id + " is not a vaid ID");
    }
}

module.exports = {
    assertObjectValid,
    assertValidGroceryStore,
    assertValidDriver,
    assertValidFoodBank,
    assertValidActiveOrder
};