import { View, StyleSheet, Text, Dimensions } from "react-native";
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
							onPress={()=>navigation.dispatch(DrawerActions.openDrawer())}/>
					)
				)}
			</View>

			<View style={styles.headerTitle}>
				<Text style={styles.titleText}>{titleText}</Text>
			</View>

			<View style={styles.buttonContainer}>
				<HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
					<Item
						iconName={options.iconName}
						iconColor={options.iconColor}
						iconSize={options.iconSize}
						onPress={options.onPress}
					></Item>
				</HeaderButtons>
			</View>
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
});

export default Header;