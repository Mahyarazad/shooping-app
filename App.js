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
import { drawerReducer } from "./store/reducers/drawer";
import { composeWithDevTools } from "redux-devtools-extension";
import { authReducer } from "./store/reducers/auth";
import { StatusBar } from "expo-status-bar";
import * as Notifications from "expo-notifications";
import { init } from "./Helper/db";

init()
	.then(() => {
		console.log("db initialized");
	})
	.catch((err) => {
		console.log("database initialization failed");
		console.log(err);
	});

LogBox.ignoreLogs([
	"Non-serializable values were found in the navigation state",
	"expo-permissions is now deprecated — the functionality has been moved to other expo packages that directly use these permissions (e.g. expo-location, expo-camera). The package will be removed in the upcoming releases.",
]);

Notifications.setNotificationHandler({
	handleNotification: async () => {
		return { shouldShowAlert: true, shouldPlaySound: false };
	},
});

const rootReducer = combineReducers({
	products: productReducer,
	cart: cartReducer,
	order: orderReducer,
	auth: authReducer,
	drawer: drawerReducer,
});

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

export default function App() {
	const [loaded] = useFonts({
		"open-sans": require("./constants/fonts/Glory-Light.ttf"),
		"open-sans-bold": require("./constants/fonts/Glory-Bold.ttf"),
	});

	if (!loaded) {
		return null;
	}
	return (
		<Provider store={store}>
			<Shop />
			<StatusBar style="auto" />
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
