import React from "react";
import {
	ScrollView,
	View,
	Text,
	StyleSheet,
	Image,
	TouchableOpacity,
} from "react-native";
import Colors from "../../constants/Colors";
import {useDispatch} from 'react-redux';
import * as cartAction from '../../store/actions/cart';

const ProductDetailScreen = (props) => {
	const dispatch = useDispatch();
	const productItem = props.route.params.itemData;

	return (
		<ScrollView>
			<View style={styles.screen}>
				<View style={styles.imageContainer}>
					<Image
						style={styles.image}
						source={{ uri: productItem.product.imageUrl }}
					/>
				</View>
				<TouchableOpacity style={styles.button} onPress={() => dispatch(cartAction.addToCart(productItem.product))}>
					<Text style={styles.buttonText}> Add to Cart </Text>
				</TouchableOpacity>
				<View style={styles.detailContainer}>
					<Text style={styles.price}>
						{" "}
						{`$${productItem.product.price.toFixed(2)}`}{" "}
					</Text>
					<Text style={styles.Item}> {productItem.product.description} </Text>
				</View>
			</View>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	imageContainer: {
		height: 300,
		width: "100%",
	},
	detailContainer: {},
	image: {
		width: "100%",
		height: "100%",
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
	button: {
		backgroundColor: Colors.primary,
		marginVertical: 10,
		paddingVertical: 2,
		paddingHorizontal: 4,
		borderRadius: 3,
		width: 100,
	},
	buttonText: {
		textAlign: "center",
		fontFamily: "open-sans",
		fontSize: 16,
		color: "white",
	},
});

export default ProductDetailScreen;
