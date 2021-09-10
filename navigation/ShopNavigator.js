import React from "react";

import { useSelector, useDispatch } from "react-redux";
import * as authActions from "../store/actions/auth";
import { NavigationContainer, StackActions } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { HeaderButtons, Item } from "react-navigation-header-buttons";

import ProductOverviewScreen from "../screens/shop/ProductsOverviewScreen";
import ProductDetailScreen from "../screens/shop/ProductDetailScreen";
import UserProductScreen from "../screens/user/UserProductScreen";
import EditProductScreen from "../screens/user/EditProductScreen";
import CartScreen from "../screens/shop/CartScreen";
import OrdersScreen from "../screens/shop/OrdersScreen";
import LandingScreen from "../screens/LandScreen";
import DrawerContent from "./DrawerContent";
import Colors from "../constants/Colors";
import CustomHeaderButton from "../components/UI/CustomHeaderButton";
import AuthScreen from "../screens/user/AuthScreen";
import ResetPassword from "../screens/user/ResetPassword";
import LogoTitle from "./LogoTitle";
import Header from "./Header";

const ShopStack = createNativeStackNavigator();
const UserStack = createNativeStackNavigator();
const AuthStack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const AuthNavigator = () => {
	return (
		<AuthStack.Navigator
			screenOptions={() => ({
				header: ({ navigation, route, options, back }) => {
					return (
						<Header navigation={navigation} options={options} back={back} />
					);
				},
			})}
		>
			<AuthStack.Screen
				name="auth-screen"
				component={AuthScreen}
				options={({ navigation, route }) => ({
					headerShown: true,
					headerStyle: {
						backgroundColor: Colors.primary,
					},
					headerTitle: (props) => <LogoTitle {...props} title="Authenticate" />,
				})}
			/>
			<AuthStack.Screen
				name="reset-password"
				component={ResetPassword}
				options={({ navigation, route }) => ({
					headerShown: true,
					headerStyle: { backgroundColor: Colors.primary },
					headerTitle: (props) => (
						<LogoTitle {...props} title="Reset Password" />
					),
				})}
			/>
		</AuthStack.Navigator>
	);
};

const UserNavigator = () => {
	return (
		<UserStack.Navigator>
			<UserStack.Screen
				name="user-product"
				component={UserProductScreen}
				options={({ navigation }) => ({
					headerStyle: {
						backgroundColor: Colors.primary,
					},
					headerTitle: (props) => (
						<LogoTitle {...props} title="Customization" />
					),
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
				options={({route}) => ({
					headerTitle: (props) => (
						<LogoTitle
							{...props}
							title={
								route.params.item.product.submit === ""
									? "New Product"
									: route.params.item.product.title
							}
						/>
					),
					header: ({ navigation, route, options, back }) => {
						return (
							<Header
								navigation={navigation}
								options={{
									iconName: "save",
									iconColor: "white",
									iconSize: 24,
									onPress:
										route.params.submit
									,
									...options,
								}}
								back={back}
							/>
						);
					},
				})}
				// options={({ route }) => ({
					
				// 	headerRight: () => (
				// 		<HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
				// 			<Item
				// 				iconName="save"
				// 				iconSize={24}
				// 				onPress={route.params.submit}
				// 				iconColor="white"
				// 			/>
				// 		</HeaderButtons>
				// 	),
				// })}
			/>
		</UserStack.Navigator>
	);
};

const ShopNavigator = () => {
	return (
		<ShopStack.Navigator>
			<ShopStack.Screen
				name="Product Overview"
				component={ProductOverviewScreen}
				options={({ navigation }) => ({
					headerStyle: {
						backgroundColor: Colors.primary,
					},
					headerTitle: (props) => (
						<LogoTitle {...props} title="Product Overview" />
					),

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
				options={({ route }) => ({
					headerTitle: (props) => (
						<LogoTitle {...props} title={route.params.itemData.title} />
					),
					header: ({ navigation, route, options, back }) => {
						return (
							<Header navigation={navigation} options={options} back={back} />
						);
					},
				})}
			/>
			<ShopStack.Screen
				name="CartScreen"
				component={CartScreen}
				options={{
					headerTitle: (props) => <LogoTitle {...props} title="Cart" />,
					header: ({ navigation, route, options, back }) => {
						return (
							<Header
								navigation={navigation}
								options={{
									iconName: "receipt",
									iconColor: "white",
									iconSize: 24,
									onPress() {
										navigation.navigate("Orders");
									},
									...options,
								}}
								back={back}
							/>
						);
					},
				}}
			/>
		</ShopStack.Navigator>
	);
};

const Shop = () => {
	const authData = useSelector((state) => state.auth.auth);
	const dispatch = useDispatch();

	const autoLogin = React.useCallback(() => {
		dispatch(authActions.isLoggedIn());
	}, [dispatch, authActions]);

	React.useEffect(() => {
		autoLogin();
		if (authData) {
			dispatch(authActions.authenticate());
		}
		return () => {};
	}, [authData, dispatch, autoLogin]);

	return (
		<NavigationContainer>
			{!authData ? (
				<AuthNavigator />
			) : (
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
					drawerContent={(props) => <DrawerContent {...props} />}
				>
					<Drawer.Screen
						name="Products"
						component={ShopNavigator}
						options={({ route, navigation }) => ({
							headerShown: false,
							headerStyle: {
								fontFamily: "open-sans",
							},
						})}
					/>
					<Drawer.Screen
						name="Orders"
						component={OrdersScreen}
						options={({ route, navigation }) => ({
							headerTitleStyle: { fontFamily: "open-sans" },
							headerRight: () => (
								<HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
									<Item
										style={{ marginRight: 15 }}
										title="cart"
										iconColor={Colors.primary}
										iconName="cart"
										iconSize={24}
										onPress={() => navigation.navigate("CartScreen")}
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
							headerTitleStyle: { fontFamily: "open-sans" },
						})}
					/>
				</Drawer.Navigator>
			)}
		</NavigationContainer>
	);
};
export default Shop;
