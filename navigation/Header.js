import { View, StyleSheet, Text, Dimensions } from "react-native";
import { Feather } from "@expo/vector-icons";
import React from "react";
import Colors from "../constants/Colors";

const Header = ({ navigation, route, options, back }) => {
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
				<Text style={styles.titleText}>
					{options.headerTitle().props.title}
				</Text>
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
		top: 40,
	},
	headerTitle: {
		marginTop: 25,
	},
	titleText: {
		fontFamily: "open-sans",
		fontSize: 25,
		color: "white",
	},
});

export default Header;
