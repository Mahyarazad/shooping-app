import { HeaderButton } from "react-navigation-header-buttons";
import {} from "react-native";
import {
	Ionicons,
	AntDesign,
	SimpleLineIcons,
	Feather,
	Entypo,
} from "@expo/vector-icons";
import React from "react";

const CustomHeaderButton = (props) => {
	const iconLib = () => {
		switch (props.iconName) {
			case "cart":
				return Ionicons;
			case "receipt":
				return Ionicons;
			case "note":
				return SimpleLineIcons;
			case "menu-fold":
				return AntDesign;
			case "menu":
				return Feather;
			case "edit":
				return Feather;
			case "log-out":
				return Entypo;
			default:
				return Ionicons;
		}
	};

	return (
		<HeaderButton
			{...props}
			IconComponent={iconLib()}
			color={props.iconColor}
			iconSize={props.iconSize}
		/>
	);
};

export default CustomHeaderButton;
