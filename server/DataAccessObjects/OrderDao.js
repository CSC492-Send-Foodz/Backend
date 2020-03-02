/* eslint-disable promise/always-return */
const Order = require("../Models/Order");
class OrderDao {
    constructor(DB) {
        this.DB = DB;
        this.ordersCollectionRef = this.DB.collection("Orders");
    }

    updateActiveOrderStatus(orderId, newStatus) {
        //get order from db using orderId
        let orderRef = this.ordersCollectionRef.doc(`${orderId()}`);
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

    addToOrders(order) {
        return this.ordersCollectionRef.doc(`${order.getId()}`).set(
            JSON.parse(JSON.stringify(order))
        );
    }

    // removeFromOrders(orderId) {
    //     //get all documents with orderid
    //     let orderRef = this.collectionRef.doc(String(orderId));

    //     orderRef.delete().then(() => {
    //         console.log("Order " + orderId + "deleted");
    //     })
    //         .catch(err => {
    //             console.log("Failed to remove order " + orderId, err);
    //         });
    // }

    findMatchingActiveOrders(driver) {
        this.ordersCollectionRef.get().then(snapshot => {
            snapshot.docs.forEach(order => {
                if (order.data().quantity <= driver.getCapacity() && order.data().status === Order.OrderStates.LOOKING_FOR_DRIVER) {
                    var orderRef = order.data();
                    new Order.Order(orderRef.id, orderRef.status, orderRef.groceryStoreId, orderRef.foodBankId,
                        orderRef.driverId, orderRef.recieved, orderRef.inventory, orderRef.quantity)
                    .notifyDriver(driver.getId())
                }
            });
        })
            .catch(err => {
                console.log("Error getting active orders", err);
            });
    }
}

module.exports = {
    OrderDao
};