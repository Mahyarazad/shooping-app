import React from "react";

import { useSelector, useDispatch } from "react-redux";
import * as authActions from "../store/actions/auth";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import * as Notifications from "expo-notifications";

import DrawerContent from "./navigation-components/DrawerContent";
import LogoTitle from "./navigation-components/LogoTitle";
import Header from "./navigation-components/Header";
import Colors from "../constants/Colors";
import { toggleDrawer, closeDrawer } from "../store/actions/drawer";
import { useNavigationContainerRef } from "@react-navigation/native";

import ShopNavigator from "./stacks/ShopStack";
import AuthNavigator from "./stacks/AuthStack";
import UserNavigator from "./stacks/UserStack";
import ProfileNavigator from "./stacks/ProfileStack";
import OrdersScreen from "../screens/shop/OrdersScreen";

const Drawer = createDrawerNavigator();

const Shop = () => {
	const navigationRef = useNavigationContainerRef();
	const containerRef = React.useRef();
	const authData = useSelector((state) => state.auth.auth);
	const dispatch = useDispatch();

	const isMounted = React.useRef(false);

	const autoLogin = async () => {
		if (isMounted.current) {
			setTimeout(() => {
				dispatch(authActions.isLoggedIn());
			}, 25);
		}
	};

	React.useEffect(() => {
		isMounted.current = true;
		{
			isMounted &&
				autoLogin().then(() => {
					if (authData) dispatch(authActions.authenticate());
				});
		}
		return () => (isMounted.current = false);
	}, [authData]);

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
			{!authData ? <AuthNavigator />
			:
				<Drawer.Navigator
					screenOptions={{
						drawerStyle: {
							width: "60%",
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
						name="profile"
						component={ProfileNavigator}
						options={({ route, navigate }) => ({
							headerShown: false,
							headerTitleStyle: { fontFamily: "open-sans" },
						})}
					/>
				</Drawer.Navigator>
			}
		</NavigationContainer>
	);
};
export default Shop;
