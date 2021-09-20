import React from "react";

import { useSelector, useDispatch } from "react-redux";
import * as authActions from "../store/actions/auth";
import { NavigationContainer, StackActions } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";

import OrdersScreen from "../screens/shop/OrdersScreen";
import LandingScreen from "../screens/LandScreen";
import DrawerContent from "./navigation-components/DrawerContent";
import Colors from "../constants/Colors";

import LogoTitle from "./navigation-components/LogoTitle";
import Header from "./navigation-components/Header";
import ProfileScreen from "../screens/user/ProfileScreen";
import { toggleDrawer, closeDrawer } from "../store/actions/drawer";
import { useNavigationContainerRef } from "@react-navigation/native";

import * as Notifications from "expo-notifications";

import ShopNavigator from './stacks/ShopStack';
import AuthNavigator from './stacks/AuthStack';
import UserNavigator from './stacks/UserStack';


const Drawer = createDrawerNavigator();


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

							width: '60%',
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
						drawerActiveBackgroundColor: "blue",
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
