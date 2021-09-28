import React from "react";
import {
	View,
	Text,
	Image,
	StyleSheet,
	TouchableNativeFeedback,
	TouchableOpacity,
	Platform,
	Animated,
} from "react-native";
import Colors from "../../constants/Colors";
import Card from "../UI/Card";


const ProductItem = (props) => {


	let TouchableCmp = TouchableOpacity;
	if (Platform.OS === "android" && Platform.Version >= 21) {
		TouchableCmp = TouchableNativeFeedback;
	}
	return (
		<Card style={styles.productCard}>
			<TouchableCmp onPress={props.onSelect} useForeground>
				<View style={styles.screen}>
					<View style={styles.imageContainer}>
						<Image style={styles.image} source={{ uri: props.imageSrc }} />
					</View>

					<View style={styles.textContainer}>
						<Text style={styles.Item}> {props.itemName}</Text>
						<Text style={styles.price}>
							{" "}
							{`$${props.itemPrice.toFixed(2)}`}{" "}
						</Text>
					</View>
					{props.children}
				</View>
			</TouchableCmp>
		</Card>
	);
};

const styles = StyleSheet.create({
	productCard: {
		flex: 1,
		overflow: "hidden",
		marginVertical:7.5,
		marginHorizontal: 10,
	},
	screen: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "white",
	},
	buttonContainer: {
		flexDirection: "row",
		width: "80%",
		justifyContent: "space-between",
		marginBottom: 10,
	},
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
	textContainer: {
		paddingBottom: 10,
	},
	imageContainer: {
		width: "100%",
		height: 170,
		overflow: "hidden",
		paddingBottom: 10,
	},
	image: {
		height: "100%",
		width: "100%",
	},
	Item: {
		fontFamily: "open-sans-bold",
		fontSize: 20,
		color: "black",
		textAlign: "center",
	},
	price: {
		fontFamily: "open-sans",
		fontSize: 16,
		color: "gray",
		textAlign: "center",
	},
});

export default ProductItem;
