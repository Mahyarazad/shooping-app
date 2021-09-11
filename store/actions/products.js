import Product from "../../models/Product";

export const DELETE_PRODUCT = "DELETE_PRODUCT";
export const UPDATE_PRODUCT = "UPDATE_PRODUCT";
export const CREATE_PRODUCT = "CREATE_PRODUCT";
export const SET_PRODUCT = "SET_PRODUCT";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ENV from "../../ENV";


export const fetchProducts = () => {
	return async (dispatch, getState) => {
		const userId = getState().auth.localId;
		const token = getState().auth.idToken;
		
		try {
			//async function goes here
			const response = await fetch(
				`${ENV.databaseURL}product.json?auth=${token}`,
			);
			
			if (!response.ok) {
				const err = await response;
				throw new Error("Something went wrong!");
			}
			const resData = await response.json();
			const loadedData = [];
			for (const key in resData) {
				loadedData.push(
					new Product(
						key,
						userId,
						resData[key].title,
						resData[key].imageUrl,
						resData[key].description,
						+resData[key].price
					)
				);
			}
			return dispatch({ type: SET_PRODUCT, product: loadedData });
		} catch (err) {
			throw new Error(err.message);
		}
	};
};

export const deleteProduct = (productId) => {
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
		await fetch(
			`${ENV.databaseURL}product/${productId}.json?auth=${token}`,
			{
				method: "DELETE",
			}
		);
		return dispatch({ type: DELETE_PRODUCT, productId: productId });
	};
};

export const updateProduct = (product) => {
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

		try {
			const response = await fetch(
				`${ENV.databaseURL}product/${product.id}.json?auth=${token}`,
				{
					method: "PATCH",
					headers: { "content-type": "application/json" },
					body: JSON.stringify(product),
				}
			);
			if (!response.ok) {
				throw new Error("Something went wrong!");
			}
			return dispatch({ type: UPDATE_PRODUCT, product });
		} catch (err) {
			throw err;
		}
	};
};

export const createProduct = (product) => {
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
		// async function goes here
		try {
			const response = await fetch(
				`${ENV.databaseURL}product.json?auth=${token}`,
				{
					method: "POST",
					headers: { "content-type": "application/json" },
					body: JSON.stringify({ ...product, ownerId: userId }),
				}
			);
			if (!response.ok) {
				const error = await response.json();
				console.log(error);
				throw new Error("Something went wrong!");
			}
			const resData = await response.json();
			return dispatch({
				type: CREATE_PRODUCT,
				product: { ...product, id: resData.name, ownerId: userId },
			});
		} catch (err) {
			throw err;
		}
	};
};
