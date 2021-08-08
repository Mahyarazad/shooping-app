import React from "react";
import { StyleSheet } from "react-native";
import { Provider } from "react-redux";
import { createStore, combineReducers } from "redux";

import Shop from "./navigation/ShopNavigator";
import { useFonts } from "expo-font";
import cartReducer from "./store/reducers/cart";
import productReducer from "./store/reducers/products";
import orderReducer from "./store/reducers/orders";
import {composeWithDevTools} from 'redux-devtools-extension';

const rootReducer = combineReducers({
	products: productReducer,
	cart: cartReducer,
	order: orderReducer
});

const store = createStore(rootReducer, composeWithDevTools());

export default function App() {
	const [loaded] = useFonts({
		"open-sans": require("./constants/fonts/OpenSans-Regular.ttf"),
		"open-sans-bold": require("./constants/fonts/OpenSans-Bold.ttf")
	});

	if (!loaded) {
		return null;
	}
	return (
		<Provider store={store}>
			<Shop />
		</Provider>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
	},
});
