import React from "react";
import {
	FlatList,
	View,
	Text,
	TouchableOpacity,
	StyleSheet,
	Dimensions,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import Colors from "../../constants/Colors";

const AddressFlatList = (props) => {
	const iconSelctor = () => {
		switch (props.iconName) {
			case "close-outline":
				return (
					<Ionicons name={props.iconName} size={40} color={Colors.primary} />
				);
			case "selection-ellipse":
				return (
					<MaterialCommunityIcons
						name={props.iconName}
						size={25}
						color={Colors.primary}
					/>
				);
			default:
				return null
		}
	};
	return (
		<FlatList
			keyExtractor={(item, index) => index.toString(2)}
			data={props.addressData}
			renderItem={(itemData) => (
				<View style={{ ...styles.listView, ...props.listView }}>
					<TouchableOpacity
						style={{ justifyContent: "center" }}
						onPress={() => props.addressJS(itemData.item)}
					>
						<Text style={{ ...styles.listItem, ...props.listItem }}>
							{itemData.item.address}
						</Text>
					</TouchableOpacity>

					<TouchableOpacity
						style={styles.delete}
						onPress={() => props.addressID(itemData.item.id)}
					>
						{iconSelctor()}
					</TouchableOpacity>
				</View>
			)}
		/>
	);
};

const styles = StyleSheet.create({
	listView: {
		flexDirection: "row",
		width: Dimensions.get("screen").width * 0.9,
		height: Dimensions.get("screen").height * 0.1,
		alignItems: "center",
		justifyContent: "space-between",
		borderBottomWidth: 1,
		borderBottomColor: "gray",
	},
	listItem: {
		width: Dimensions.get("screen").width * 0.8,
		fontFamily: "open-sans",
		fontSize: 19,
	},
	delete: {
		width: Dimensions.get("screen").width * 0.1,
	},
});

export default AddressFlatList;
