import React from "react";
import { StyleSheet, TouchableOpacity, Text, View } from "react-native";
import Colors from "../../constants/Colors";

const CustomButton = (props) => {

	return (
		<TouchableOpacity activeOpacity={0.7} onPress={props.onPress} {...props}>
			<View style={{ ...styles.button, ...props.buttonStyle }}>
				<Text style={{ ...styles.buttonText, ...props.textStyle }}>
					{props.text}
				</Text>
			</View>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	button: {
		backgroundColor: "white",
		paddingVertical: 2,
		paddingHorizontal: 4,
		borderRadius: 3,
	},
	buttonText: {
		color: Colors.primary,
		fontSize: 16,
		fontFamily:'open-sans'
	},
});

export default CustomButton;
