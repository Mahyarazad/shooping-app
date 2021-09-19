import React from "react";

import { useSelector, useDispatch } from "react-redux";
import * as authActions from "../store/actions/auth";
import { NavigationContainer, StackActions } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";

import ProductOverviewScreen from "../screens/shop/ProductsOverviewScreen";
import ProductDetailScreen from "../screens/shop/ProductDetailScreen";
import UserProductScreen from "../screens/user/UserProductScreen";
import EditProductScreen from "../screens/user/EditProductScreen";
import CartScreen from "../screens/shop/CartScreen";
import OrdersScreen from "../screens/shop/OrdersScreen";
import LandingScreen from "../screens/LandScreen";
import DrawerContent from "./DrawerContent";
import Colors from "../constants/Colors";
import AuthScreen from "../screens/user/AuthScreen";
import ResetPassword from "../screens/user/ResetPassword";
import LogoTitle from "./LogoTitle";
import Header from "./Header";
import ProfileScreen from "../screens/user/ProfileScreen";
import { toggleDrawer, closeDrawer } from "../store/actions/drawer";
import { useNavigationContainerRef } from "@react-navigation/native";

import * as Notifications from "expo-notifications";

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
				options={{
					headerTitle: (props) => (
						<LogoTitle {...props} title="Customization" />
					),
					header: ({ navigation, route, options, back }) => {
						return (
							<Header
								navigation={navigation}
								options={{
									iconName: "edit",
									iconColor: "white",
									iconSize: 24,
									onPress() {
										navigation.navigate("edit-screen", {
											item: { product: { submit: "" } },
										});
									},
									...options,
								}}
								back={back}
							/>
						);
					},
				}}
			/>
			<UserStack.Screen
				name="edit-screen"
				component={EditProductScreen}
				options={({ route }) => ({
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
									onPress: route.params.submit,
									...options,
								}}
								back={back}
							/>
						);
					},
				})}
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
				options={{
					headerTitle: (props) => (
						<LogoTitle {...props} title="Product Overview" />
					),
					header: ({ navigation, route, options, back }) => {
						return (
							<Header
								navigation={navigation}
								options={{
									iconName: "cart",
									iconColor: "white",
									iconSize: 24,
									onPress() {
										navigation.navigate("CartScreen");
									},
									...options,
								}}
								back={back}
							/>
						);
					},
				}}
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
	const navigationRef = useNavigationContainerRef();
	const containerRef = React.useRef();

	// const [authState, setAuthState] = React.useState(true);
	const authData = useSelector((state) => state.auth.auth);
	const dispatch = useDispatch();

	const autoLogin = React.useCallback(async () => {
		await dispatch(authActions.isLoggedIn());
	}, [dispatch, authActions]);

	React.useEffect(() => {
		// let isMounted = true;
		// if (isMounted) {

		// }

		autoLogin();
		if (authData) {
			dispatch(authActions.authenticate());
		}
		// return () => {
		// 	isMounted = false;
		// };
	}, [authData, dispatch, authActions, autoLogin]);

	React.useEffect(() => {
		navigationRef.addListener("state", (e) => {
			if (e.data.state.history) {
				const navState = Object.values(e.data.state.history);
				const drawerState =
					Object.values(navState)[Object.values(navState).length - 1];

				if (Object.keys(drawerState)[1] === "status") {
					dispatch(toggleDrawer());
				}
				if (Object.keys(drawerState)[1] === "key") {
					dispatch(closeDrawer());
				}
			}
		});
	}, []);

	React.useEffect(() => {
		const backgoundSubscrption =
			Notifications.addNotificationResponseReceivedListener((notifications) => {
				console.log(notifications);
			});
		const foregoundSubscrption = Notifications.addNotificationReceivedListener(
			(notifications) => {
				console.log(notifications);
				const { request } = notifications;
				//navigationRef.navigate(request.content.data.data);
			}
		);

		return () => {
			foregoundSubscrption.remove(), backgoundSubscrption.remove();
		};
	});

	return (
		<NavigationContainer
			ref={navigationRef}
			onReady={() => {
				containerRef.current = navigationRef;
			}}
		>
			{!authData ? (
				<AuthNavigator />
			) : (
				<Drawer.Navigator
					screenOptions={{
						drawerStyle: {
							backgroundColor: "white",
							width: 240,
							marginTop: 90,
							height: "80%",
							marginVertical: "20%",
							borderRadius: 20,
							borderWidth: 0,
							overflow: "hidden",
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
						options={{
							headerTitle: (props) => <LogoTitle {...props} title="Order" />,
							header: ({ navigation, route, options, back }) => {
								return (
									<Header
										navigation={navigation}
										options={{
											iconName: "cart",
											iconColor: "white",
											iconSize: 24,
											onPress() {
												navigation.navigate("CartScreen");
											},
											...options,
										}}
										back={back}
									/>
								);
							},
						}}
					/>
					<Drawer.Screen
						name="Admin"
						component={UserNavigator}
						options={({ route, navigate }) => ({
							headerShown: false,
							headerTitleStyle: { fontFamily: "open-sans" },
						})}
					/>
					<Drawer.Screen
						name="profile-screen"
						component={ProfileScreen}
						
						options={({ route }) => ({
							
							headerTitle: ( props) => {
								const {userName} = route.params.userData
								return <LogoTitle {...props} title={userName} />
								
							},
							header: ({ navigation, route, options, back }) => {
								
								return (
									<Header
										navigation={navigation}
										options={{
											iconName: "cart",
											iconColor: "white",
											iconSize: 24,
											onPress() {
												navigation.navigate("CartScreen");
											},
											...options,
										}}
										back={back}
									/>
								);
							},
						})}
					/>
				</Drawer.Navigator>
			)}
		</NavigationContainer>
	);
};
export default Shop;
