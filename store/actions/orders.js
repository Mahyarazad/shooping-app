import Order from "../../models/orderItem";
export const ADD_ORDER = "ADD_ORDER";
export const REMOVE_ORDER = "REMOVE_ORDER";
export const SET_ORDER = "SER_ORDER";

export const addOrder = (cartItem, totalAmount) => {
	return async (dispatch) => {
		try {
			const date = new Date();
			const response = await fetch(
				"https://shop-app-c577e-default-rtdb.asia-southeast1.firebasedatabase.app/order/u1.json",
				{
					method: "POST",
					headers: { "content-type": "aplication/json" },
					body: JSON.stringify({
						items: { ...cartItem },
						amount: totalAmount,
						date: date,
					}),
				}
			);

			const resData = await response.json();

			return dispatch({
				type: ADD_ORDER,
				orderData: {
					items: { ...cartItem },
					amount: totalAmount,
					id: resData.name,
					date: date
				},
			});
		} catch (err) {
			throw err;
		}
	};
};

export const removeOrder = (orderId) => {
	return async (dispatch) => {
		await fetch(
			`https://shop-app-c577e-default-rtdb.asia-southeast1.firebasedatabase.app/order/u1/${orderId}.json`,
			{
				method: "DELETE"
			}
		);

		return dispatch({
			type: REMOVE_ORDER,
			orderId: orderId,
		});
	};
};

export const fetchOrders = () => {
	return async (dispatch) => {
		const response = await fetch(
			"https://shop-app-c577e-default-rtdb.asia-southeast1.firebasedatabase.app/order/u1.json"
		);

		const resData = await response.json();

		const loadedOrder = [];
		for (const key in resData) {
			loadedOrder.push(
				new Order(
					key,
					resData[key].items,
					resData[key].amount,
					resData[key].date
				)
			);
		}

		return dispatch({
			type: SET_ORDER,
			orderData: loadedOrder,
		});
	};
};
