export const ADD_ORDER = "ADD_ORDER";
export const REMOVE_ORDER = "REMOVE_ORDER";

export const addOrder = (cartItem, totalAmount) => {
	return {
		type: ADD_ORDER,
		orderData: { items: {...cartItem}, amount: totalAmount }
	};
};

export const removeOrder = (orderId) => {
	return {
		type: REMOVE_ORDER,
		orderId : orderId
	};
};
