import React from "react";
import { useSelector } from "react-redux";
import { NavigationContainer, StackActions } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
	createDrawerNavigator,
	DrawerItemList,
} from "@react-navigation/drawer";
import { HeaderButtons, Item } from "react-navigation-header-buttons";

import ProductOverviewScreen from "../screens/shop/ProductsOverviewScreen";
import ProductDetailScreen from "../screens/shop/ProductDetailScreen";
import UserProductScreen from "../screens/user/UserProductScreen";
import EditProductScreen from "../screens/user/EditProductScreen";
import CartScreen from "../screens/shop/CartScreen";
import OrdersScreen from "../screens/shop/OrdersScreen";
import Colors from "../constants/Colors";
import CustomHeaderButton from "../components/UI/CustomHeaderButton";
import AuthScreen from "../screens/user/AuthScreen";

const ShopStack = createNativeStackNavigator();
const UserStack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const UserNavigator = () => {
	return (
		<UserStack.Navigator
			screenOptions={{
				headerShown: true,
			}}
		>
			<UserStack.Screen
				name="user-product"
				component={UserProductScreen}
				options={({ navigation }) => ({
					headerShown: true,
					headerStyle: {
						backgroundColor: Colors.primary,
					},
					headerTintColor: "white",
					title: "Admin",
					headerLeft: ({ focused, size }) => (
						<HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
							<Item
								title="product"
								iconColor="white"
								iconName="menu"
								iconSize={24}
								onPress={() => navigation.openDrawer()}
							/>
						</HeaderButtons>
					),
					headerRight: ({ focused, size }) => (
						<HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
							<Item
								iconName="edit"
								iconSize={24}
								onPress={() =>
									navigation.navigate("edit-screen", {
										item: {
											product: {
												submit: "",
											},
										},
									})
								}
								iconColor="white"
							/>
						</HeaderButtons>
					),
				})}
			/>
			<UserStack.Screen
				name="edit-screen"
				component={EditProductScreen}
				options={({ route, navigation }) => ({
					title:
						route.params.item.product.submit === ""
							? "New Product"
							: route.params.item.product.title,
					headerStyle: {
						backgroundColor: Colors.primary,
					},
					headerTintColor: "white",
					headerRight: () => (
						<HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
							<Item
								iconName="save"
								iconSize={24}
								onPress={route.params.submit}
								iconColor="white"
							/>
						</HeaderButtons>
					),
				})}
			/>
		</UserStack.Navigator>
	);
};

const ShopNavigator = () => {
	return (
		<ShopStack.Navigator
			screenOptions={{
				headerShown: true,
			}}
		>
			<ShopStack.Screen
				name="Product Overview"
				component={ProductOverviewScreen}
				options={({ route, navigation }) => ({
					headerShown: true,
					headerStyle: {
						backgroundColor: Colors.primary,
					},
					headerTintColor: "white",
					headerLeft: ({ focused, size }) => (
						<HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
							<Item
								title="product"
								iconColor="white"
								iconName="menu"
								iconSize={24}
								onPress={() => navigation.openDrawer()}
							/>
						</HeaderButtons>
					),

					headerRight: () => (
						<HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
							<Item
								title="cart"
								iconColor="white"
								iconName="cart"
								iconSize={24}
								onPress={() => navigation.navigate("CartScreen")}
							/>
						</HeaderButtons>
					),
				})}
			/>
			<ShopStack.Screen
				name="product-detail"
				component={ProductDetailScreen}
				options={({ route, navigation }) => ({
					title: route.params.itemData.title,
					headerStyle: {
						backgroundColor: Colors.primary,
					},
					headerTintColor: "white",
				})}
			/>
			<ShopStack.Screen
				name="CartScreen"
				component={CartScreen}
				options={({ route, navigation }) => ({
					title: "Cart",
					headerRight: () => (
						<HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
							<Item
								iconName="caret-back-circle"
								iconColor={Colors.primary}
								iconSize={40}
								onPress={() => {
									navigation.goBack();
								}}
							></Item>
						</HeaderButtons>
					),
				})}
			/>
		</ShopStack.Navigator>
	);
};

const Shop = () => {
	const [isAuth, setIsAuth] = React.useState(false);
	const token = useSelector(state => state.auth);

	React.useEffect(() => {
		if (token.registered !== "") {
			setIsAuth(true);
		}
	}, [isAuth, token]);

	if (!isAuth) {
		return <AuthScreen />;
	}
	return (
		<NavigationContainer>
			<Drawer.Navigator
				screenOptions={{
					drawerStyle: {
						backgroundColor: "white",
						width: 240,
						height: "90%",
						marginVertical: "20%",
					},
					drawerLabelStyle: {
						fontSize: 18,
						marginVertical: 0,
						fontFamily: "open-sans",
						color: "black",
					},
					drawerActiveTintColor: Colors.primary,
					drawerActiveBackgroundColor: "white",
				}}
			>
				<Drawer.Screen
					name="Products"
					component={ShopNavigator}
					options={({ route, navigate }) => ({
						headerShown: false,
						drawerIcon: ({ focused, size }) => (
							<HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
								<Item
									title="Admin-drawer"
									iconColor={Colors.primary}
									iconName="cart"
									iconSize={24}
								/>
							</HeaderButtons>
						),
					})}
				/>
				<Drawer.Screen
					name="Orders"
					component={OrdersScreen}
					options={({ route, navigate }) => ({
						headerShown: true,
						drawerIcon: ({ focused, size }) => (
							<HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
								<Item
									title="product"
									iconColor={Colors.primary}
									iconName="receipt"
									iconSize={24}
								/>
							</HeaderButtons>
						),
					})}
				/>
				<Drawer.Screen
					name="Admin"
					component={UserNavigator}
					options={({ route, navigate }) => ({
						headerShown: false,
						drawerIcon: ({ focused, size }) => (
							<HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
								<Item
									title="Admin-drawer"
									iconColor={Colors.primary}
									iconName="note"
									iconSize={24}
								/>
							</HeaderButtons>
						),
					})}
				/>
			</Drawer.Navigator>
		</NavigationContainer>
	);
};
export default Shop;
