import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
export const SIGN_UP = "SIGN_UP";
export const LOGIN = "LOGIN";
export const LOGOUT = "LOGOUT";
export const AUTHENTICATE = "AUTHENTICATE";
export const ISLOGGEDIN = "ISLOGGEDIN";
import env from "../../ENV";

const storeData = async (comingData) => {
	try {
		const jsonValue = JSON.stringify(comingData);
		await AsyncStorage.setItem("@storage_Key", jsonValue);
	} catch (err) {
		throw err;
	}
};

export const signUp = (email, password) => {
	return async (dispatch) => {
		const response = await fetch(
			`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${env.apiKey}`,
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					email: email,
					password: password,
					returnSecureToken: true,
				}),
			}
		);

		if (!response.ok) {
			const errResponse = await response.json();

			const errorId = errResponse.error.message;
			const messageHandler = (id) => {
				
				switch (id) {
					case "INVALID_EMAIL":
						return "The email address is already in use by another account.";
					case "OPERATION_NOT_ALLOWED":
						return "Password sign-in is disabled for this project.";
					case "TOO_MANY_ATTEMPTS_TRY_LATER":
						return "We have blocked all requests from this device due to unusual activity. Try again later.";
				}
			};
			throw new Error(messageHandler(errorId));
		}
		const resData = await response.json();

		dispatch({ type: SIGN_UP, resData: resData });
		const { localId, idToken, expiresIn } = resData;
		const expirationDate = new Date(
			new Date().getTime() + parseInt(expiresIn) * 1000
		);
		storeData({ localId, idToken, expirationDate, email: resData.email });
	};
};

export const login = (email, password) => {
	return async (dispatch) => {
		try {
			const response = await fetch(
				`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${env.apiKey}`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						email: email,
						password: password,
						returnSecureToken: true,
					}),
				}
			);

			if (!response.ok) {
				const errResponse = await response.json();
				const errorId = errResponse.error.message;
				const messageHandler = (id) => {
					switch (id) {
						case "INVALID_EMAIL":
							return "The email address is already in use by another account.";
						case "OPERATION_NOT_ALLOWED":
							return "Password sign-in is disabled for this project.";
						case "TOO_MANY_ATTEMPTS_TRY_LATER":
							return "We have blocked all requests from this device due to unusual activity. Try again later.";
					}
				};
				throw new Error(messageHandler(errorId));
			}
			const resData = await response.json();
			dispatch({ type: LOGIN, resData: resData });

			const { localId, idToken, expiresIn } = resData;
			dispatch(setLogoutTimer(parseInt(expiresIn) * 1000));
			const expirationDate = new Date(
				new Date().getTime() + parseInt(expiresIn) * 1000
			);
			storeData({ localId, idToken, expirationDate, email: resData.email });
		} catch (err) {
			throw new Error(err.message);
		}
	};
};

export const authenticate = () => {
	return { type: AUTHENTICATE };
};

export const isLoggedIn = () => {
	return async (dispatch) => {
		try {
			const value = await AsyncStorage.getItem("@storage_Key");
			if (value !== null) {
				const transformedData = JSON.parse(value);
				const { localId, idToken, expirationDate } = transformedData;
				const expireDate = Math.floor(new Date(expirationDate).valueOf());
				const now = Math.floor(new Date().valueOf());
				if (
					expirationDate >= new Date().toLocaleString() ||
					!idToken ||
					!localId
				) {
					return;
				} else {
					dispatch(setLogoutTimer(expireDate - now));
					dispatch({ type: ISLOGGEDIN, resData: transformedData });
				}
			}
		} catch (err) {
			throw new Error(err.message);
		}
	};
};

let timer;

const clearLogoutTimer = () => {
	if (timer) {
		clearTimeout(timer);
	}
};

export const setLogoutTimer = (expirationDate) => {
	return (dispatch) => {
		timer = setTimeout(() => {
			dispatch(logout());
		}, expirationDate);
	};
};

export const logout = () => {
	clearLogoutTimer();
	return async (dispatch) => {
		try {
			dispatch({ type: LOGOUT });
			await AsyncStorage.removeItem("@storage_Key");
		} catch (err) {
			throw new Error("Something went wrong!");
		}
	};
};
