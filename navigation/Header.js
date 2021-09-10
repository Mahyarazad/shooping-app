import { View, StyleSheet, Text, Dimensions } from "react-native";
import { Feather } from "@expo/vector-icons";
import React from "react";
import Colors from "../constants/Colors";
import CustomHeaderButton from "../components/UI/CustomHeaderButton";
import { HeaderButtons, Item } from "react-navigation-header-buttons";

const Header = ({ navigation, route, options, back }) => {
	const [titleText, setTitleText] = React.useState(
		options.headerTitle().props.title
	);

	const handleLength = React.useCallback(() => {
		if (titleText.length > 25) {
			setTitleText(titleText.substring(0, 25) + "...");
			console.log("It is lebther than 10 char");
		}
	}, [titleText]);

	React.useEffect(() => {
		handleLength();
	}, [titleText]);

	return (
		<View style={styles.header}>
			<View style={styles.icon}>
				{back && (
					<Feather
						color="white"
						name={"chevron-left"}
						onPress={() => {
							navigation.goBack();
						}}
						size={30}
					/>
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
		left: 15,
		top: 42,
	},
	headerTitle: {
		top: 42,
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
		top: 47,
	},
});

export default Header;
