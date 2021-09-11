import Order from "../../models/orderItem";
export const ADD_ORDER = "ADD_ORDER";
export const REMOVE_ORDER = "REMOVE_ORDER";
export const SET_ORDER = "SER_ORDER";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ENV from "../../ENV";
export const addOrder = (cartItem, totalAmount) => {
	return async (dispatch, getState) => {
		let token = getState().auth.idToken;

		const asyncData = async () => {
			try {
				const authData = await AsyncStorage.getItem("@storage_Key");
				return authData !== null ? JSON.parse(authData) : null;
			} catch (err) {
				throw new Error(err.message);
			}
		};
		if (typeof token === "undefined") {
			const { idToken } = await asyncData();
			token = idToken;
		}
		const userId = getState().auth.localId;
		try {
			const date = new Date();
			const response = await fetch(
				`https://shop-app-c577e-default-rtdb.asia-southeast1.firebasedatabase.app/order/${userId}.json?auth=${token}`,
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
					date: date,
				},
			});
		} catch (err) {
			throw err;
		}
	};
};

export const removeOrder = (orderId) => {
	return async (dispatch, getState) => {
		let token = getState().auth.idToken;

		const asyncData = async () => {
			try {
				const authData = await AsyncStorage.getItem("@storage_Key");
				return authData !== null ? JSON.parse(authData) : null;
			} catch (err) {
				console.log(err);
			}
		};
		if (typeof token === "undefined") {
			const { idToken } = await asyncData();
			token = idToken;
		}
		const userId = getState().auth.localId;
		try {
			const resData = await fetch(
				`${ENV.databaseURL}order/${userId}/${orderId}.json?auth=${token}`,
				{
					method: "DELETE",
				}
			);
			
			return dispatch({
				type: REMOVE_ORDER,
				orderId: orderId,
			});
		} catch (err) {
			console.log(err)
			throw new Error(err.message);
		}
	};
};

export const fetchOrders = () => {
	return async (dispatch, getState) => {
		const userId = getState().auth.localId;
		let token = getState().auth.idToken;

		const asyncData = async () => {
			try {
				const authData = await AsyncStorage.getItem("@storage_Key");
				return authData !== null ? JSON.parse(authData) : null;
			} catch (err) {
				console.log(err);
			}
		};
		if (typeof token === "undefined") {
			const { idToken } = await asyncData();
			token = idToken;
		}
		const response = await fetch(
			`${ENV.databaseURL}order/${userId}.json?auth=${token}`
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
