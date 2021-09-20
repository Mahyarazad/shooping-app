import { View, Text, StyleSheet } from "react-native";
import React from "react";
import Colors from "../../constants/Colors";

const LogoTitle = (props) => {
	return <Text style={styles.title}> {props.title} </Text>;
};

const styles = StyleSheet.create({
	title: { fontFamily: "open-sans", fontSize: 24, color:'white' },
});

export default LogoTitle;
