import { View, StyleSheet, Text, Dimensions,TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import React from "react";
import Colors from "../../constants/Colors";
import CustomHeaderButton from "../../components/UI/CustomHeaderButton";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { useSelector } from "react-redux";
import { DrawerActions } from "@react-navigation/native";
import HamburgerIcon from "./HamburgerIcon";

const Header = ({ navigation, route, options, back }) => {
	const drawerStatus = useSelector((state) => state.drawer.drawerStatus);
	const cartStat = useSelector((state) => state.cart.item);

	const [titleText, setTitleText] = React.useState(
		options.headerTitle().props.title
	);

	const handleLength = React.useCallback(() => {
		if (titleText.length > 25) {
			setTitleText(titleText.substring(0, 25) + "...");
		}
	}, [titleText]);

	React.useEffect(() => {
		handleLength();
	}, [titleText, drawerStatus]);

	return (
		<View style={styles.header}>
			<View style={styles.icon}>
				{back ? (
					<Feather
						color="white"
						name={"chevron-left"}
						onPress={() => {
							navigation.goBack();
						}}
						size={30}
					/>
				) : (
					titleText !== "Authenticate" &&
					titleText !== "Reset Password" && (
						<HamburgerIcon
							hamburgerWidth={27}
							hamburgerLine={4}
							burgerMargin={3}
							marginFromTop={30}
							activateIcon={drawerStatus}
							onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
						/>
					)
				)}
			</View>

			<View style={styles.headerTitle}>
				<Text style={styles.titleText}>{titleText}</Text>
			</View>

			<TouchableOpacity style={styles.buttonContainer} onPress={options.onPress}>
				<HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
					<Item
						iconName={options.iconName}
						iconColor={options.iconColor}
						iconSize={options.iconSize}
						onPress={options.onPress}
					></Item>
				</HeaderButtons>

				{Object.keys(cartStat)[0] !== undefined && options.iconName === "cart" && (
					<View style={styles.badge}>
						<Text style={styles.badgeText}>
							{Object.keys(cartStat)?.length}
						</Text>
					</View>
				)}
			</TouchableOpacity>
		</View>
	);
};
const paddingFromTop = 45;
const styles = StyleSheet.create({
	header: {
		height: 90,
		backgroundColor: Colors.primary,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
	},
	icon: {
		position: "absolute",
		left: 20,
		top: paddingFromTop,
	},
	headerTitle: {
		top: paddingFromTop,
		position: "absolute",
	},
	titleText: {
		fontFamily: "open-sans",
		fontSize: 24,
		color: "white",
	},
	buttonContainer: {
		position: "absolute",
		right: 10,
		top: paddingFromTop,
	},
	badge: {
		alignItems: "center",
		justifyContent: "center",
		width: Dimensions.get("screen").width / 25,
		height: Dimensions.get("screen").width / 25,
		borderRadius: Dimensions.get("screen").width / 50,
		backgroundColor: Colors.primary,
		borderWidth: 1,
		borderColor: "white",
		transform: [
			{ translateX: Dimensions.get("screen").width / 15 },
			{ translateY: -Dimensions.get("screen").width / 15 },
		],
	},
	badgeText: {
		fontFamily: "open-sans-bold",
		color: "white",
	},
});

export default Header;
