import React from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import Colors from "../constants/Colors";

const LandingScreen = (props) => {
	return (
		<View style={styles.screen}>
			<ActivityIndicator size="large" color={Colors.primary} />
		</View>
	);
};

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},

});

export default LandingScreen;
