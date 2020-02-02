
/*This our observable; GSInventory will notify all orders when the store inventory
 * get's updated*/

class GroceryStoreService {
	constructor(emptyDict){
		this.globalInventory = emptyDict;
	}

 	//newly added
 	refreshInventory(updatedGlobalInventory){
 		this.globalInventory = updatedGlobalInventory;
 	}

	/*Update status of each order in the list based on whether the order
	 * can be completed with store inventory in stock 
	 * */
	updateStatus(order){
		
		//check there is a matching groceryId of order
		if (order.getGroceryId() in this.globalInventory){

			//this is the grocery inventory value we want
			var matchingInventory = this.globalInventory[order.getGroceryId()];
			
			//iterate through each item in the order
			//an item is a hash table
			for (var item in order.getInventory()){
				if (item["inventoryItemId"] in matchingInventory){

					//increment counter if items in order is less than that of inventory
					if (item["quantity"] > matchingInventory[item["inventoryItemId"]].getQuantity()){
						order.setStatus("Invalid");
						return;
					}
				}
			}
			order.setStatus("Looking for Driver");

			//update actual quantity
			this.updateInventory(order);
		}
	}
	
	/*If the order can be fulfilled, update store inventory by decrementing 
	 * store inventory items
	 */
	updateInventory(order){
		for(var orditem in order.getInventory()){
			const gs = this.globalInventory[order.getGroceryId()];
			gs[orditem].setQuantity(gs[orditem].getQuantity() - order.getInventory()[orditem]["quantity"]);	
		}
	}

	// outputToConsole(order){
	// 	console.log("Order Id " + order.getOrderId() + ", Status Update: " + order.getStatus());
	// }
}

module.exports = GroceryStoreService;

