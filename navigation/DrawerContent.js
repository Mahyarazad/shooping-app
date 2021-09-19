import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import CustomHeaderButton from "../components/UI/CustomHeaderButton";
import Colors from "../constants/Colors";
import { logout } from "../store/actions/auth";
import { closeDrawer } from "../store/actions/drawer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";

const DrawerContent = (props) => {
	const dispatch = useDispatch();
	const [userData, setUserData] = React.useState();
	const userFromAsyncStorage = React.useCallback(async () => {
		try {
			const data = await AsyncStorage.getItem("@storage_Key");
			if (data !== null) {
				const transformedData = JSON.parse(data);
				setUserData(transformedData);
			}
		} catch (err) {
			throw new Error(err.message);
		}
	}, [userData]);

	React.useEffect(() => {
		userFromAsyncStorage();
	}, [props]);

	const Logout = React.useCallback(async () => {
		await dispatch(logout());
		dispatch(closeDrawer());
		props.navigation.reset({
			index: 0,
			routes: [{ name: "Product Overview" }],
		});
	}, [dispatch]);

	return (
		<View style={styles.screen}>
			<View style={styles.userRow}>
				{userData && (
					<TouchableOpacity
						onPress={() =>
							props.navigation.navigate("profile-screen", {
								userData: {
									userName:
										userData.email.charAt(0).toUpperCase() +
										userData.email.slice(1, userData.email.search(/@/)),
								},
							})
						}
					>
						<Text style={styles.userId}>
							{userData.email.charAt(0).toUpperCase() +
								userData.email.slice(1, userData.email.search(/@/))}
						</Text>
					</TouchableOpacity>
				)}
			</View>
			<View style={styles.row}>
				<HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
					<Item
						onPress={() => props.navigation.navigate("Products")}
						title="Admin-drawer"
						iconColor={Colors.primary}
						iconName="cart"
						iconSize={24}
					/>
				</HeaderButtons>
				<TouchableOpacity onPress={() => props.navigation.navigate("Products")}>
					<Text style={styles.text}>Products</Text>
				</TouchableOpacity>
			</View>
			<View style={styles.row}>
				<HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
					<Item
						onPress={() => props.navigation.navigate("Orders")}
						title="product"
						iconColor={Colors.primary}
						iconName="receipt"
						iconSize={24}
					/>
				</HeaderButtons>
				<TouchableOpacity
					onPress={() => {
						props.navigation.navigate("Orders");
					}}
				>
					<Text style={styles.text}> Orders </Text>
				</TouchableOpacity>
			</View>
			<View style={styles.row}>
				<HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
					<Item
						onPress={() => props.navigation.navigate("Admin")}
						title="Admin-drawer"
						iconColor={Colors.primary}
						iconName="note"
						iconSize={24}
					/>
				</HeaderButtons>
				<TouchableOpacity onPress={() => props.navigation.navigate("Admin")}>
					<Text style={styles.text}> Customization </Text>
				</TouchableOpacity>
			</View>
			<View style={styles.row}>
				<HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
					<Item
						onPress={Logout}
						title="log-out"
						iconColor={Colors.primary}
						iconName="log-out"
						iconSize={24}
					/>
				</HeaderButtons>
				<TouchableOpacity onPress={Logout}>
					<Text style={styles.text}> Log-out </Text>
				</TouchableOpacity>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		justifyContent: "flex-start",
		alignItems: "flex-start",
		backgroundColor: "#FFFAF9",
	},
	row: {
		flexDirection: "row",
		marginHorizontal: 30,
		marginVertical: 20,
	},
	userRow: {
		paddingTop: 10,
		marginHorizontal: 45,
		marginVertical: 20,
	},
	text: {
		fontFamily: "open-sans",
		fontSize: 22,
	},
	userId: {
		fontFamily: "open-sans",
		fontSize: 22,
	},
	logout: {
		marginHorizontal: 30,
		marginVertical: 10,
	},
	logoutText: {
		fontFamily: "open-sans",
		fontSize: 18,
	},
});

export default DrawerContent;
