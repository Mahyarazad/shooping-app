import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

const ProfileScreen = (props) => {

	return (
		<View style={styles.alignItems}>
			<Text> {props.userName}</Text>
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

export default ProfileScreen;
