class OrderProcessor {
    constructor() {
        this.activeOrder = {};
        this.activeDriver = {};
    }

    getOrder(orderId){
        //return order object
        return this.activeOrder[orderId];
    }

    processOrder(order, gs) {
        gs.updateStatus(order);

        if (order.status !== 'Invalid') {
            this.addOrderToDict(order);
            console.log("Order created")
            return true
        }
        return false;
    }

    addOrderToDict(order) {
        this.activeOrder[order.orderId] = order;
    }

    addDriverToDict(driver) {
        if (driver.isValid()) {
            this.activeDriver[driver.driverId] = driver;
            console.log("Driver added")
        }
    }

    removeOrderFromDict(order) {
        if (order.orderId in this.activeOrder) {
            delete this.activeOrder[order.id];
            console.log("Order removed");
        }
    }

    removeDriverFromDict(driver) {
        if (driver.driverId in this.activeDriver) {
            delete this.activeDriver[driver.driverId];
            console.log("Driver removed");
        }
    }
}

module.exports = OrderProcessor;