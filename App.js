import React from "react";
import { StyleSheet, LogBox } from "react-native";
import { Provider } from "react-redux";
import { createStore, combineReducers, applyMiddleware } from "redux";
import ReduxThunk from "redux-thunk";

import Shop from "./navigation/ShopNavigator";
import { useFonts } from "expo-font";
import cartReducer from "./store/reducers/cart";
import productReducer from "./store/reducers/products";
import orderReducer from "./store/reducers/orders";
import { composeWithDevTools } from "redux-devtools-extension";
import { authReducer } from "./store/reducers/auth";
import { StatusBar } from 'expo-status-bar';

// LogBox.ignoreLogs([
// 	"Non-serializable values were found in the navigation state",
// ]);

const rootReducer = combineReducers({
	products: productReducer,
	cart: cartReducer,
	order: orderReducer,
	auth: authReducer,
});

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

export default function App() {
	const [loaded] = useFonts({
		"open-sans": require("./constants/fonts/OpenSans-Regular.ttf"),
		"open-sans-bold": require("./constants/fonts/OpenSans-Bold.ttf"),
	});

	if (!loaded) {
		return null;
	}
	return (
		<Provider store={store}>
			<Shop />
			<StatusBar style='auto'/>
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
