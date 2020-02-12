/* eslint-disable promise/always-return */
const Order = require("../Models/Order");
class ActiveOrderDao {
    constructor(gsDB) {
        this.gsDB = gsDB;
    }

    updateActiveOrderStatus(orderId, newStatus) {
        //get order from db using orderId
        let orderRef = this.gsDB.collection("ActiveOrders").doc(String(orderId));
        //modify order status
        return orderRef.update({
            "status": newStatus
        }).catch(_err => {
            console.log("Failed to update order " + orderId)
            // eslint-disable-next-line promise/always-return
        }).then(() => {
            console.log("Active order" + orderId + " status updated")
        });

    }

    addToActiveOrders(order) {
        //write order to db; index by orderId
        var jsonOrder = JSON.parse(JSON.stringify(order));
        let key = this.generateUniqueKey();
        this.gsDB.collection("ActiveOrders").doc(`${key}`).set(
            jsonOrder
        );
    }

    removeFromActiveOrders(orderId) {
        //get all documents with orderid
        let orderRef = this.gsDB.collection("ActiveOrders").doc(String(orderId));

        orderRef.delete().then(() => {
            console.log("Order " + orderId + "deleted");
        })
            .catch(err => {
                console.log("Failed to remove order " + orderId, err);
            });
    }

    findMatchingActiveOrders(driver) {
        let currCapacity = driver.getCapacity();
        let ordersRef = this.gsDB.collection("ActiveOrders");
        ordersRef.get().then(snapshot => {
            snapshot.docs.forEach(order => {
                if (order.data().totalQuantity <= currCapacity) {
                    new Order.Order(order.data()).notifyDriver(driver.getDriverId())
                }
            });
        })
            .catch(err => {
                console.log("Error getting active orders", err);
            });
    }

    generateUniqueKey() {
        let dbKeys = [];

        //get all keys in firebase and check they don"t coincide with key
        let ordersRef = this.gsDB.collection("ActiveOrders");

        ordersRef.get().then(snapshot => {
            snapshot.forEach(doc => {
                dbKeys.push(doc.id);
            });
        })
            .catch(err => {
                console.log("Error getting documents", err);
            });

        return this._getKeyUnique(dbKeys);
    }

    _getKeyUnique(listOfKeys) {
        //return key if unique; otherwise recurse
        let key = Math.ceil(Math.random() * (10000));

        if (listOfKeys.includes(key)) {
            return this._getKeyUnique(listOfKeys);
        } else {
            return key;
        }
    }
}

module.exports = {
    ActiveOrderDao
};