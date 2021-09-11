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
import { useDispatch } from "react-redux";
import * as cartAction from "../../store/actions/cart";
import AnimatedView from "../../components/UI/AnimatedView";
const ProductDetailScreen = (props) => {
	const dispatch = useDispatch();
	const productItem = props.route.params.itemData;
	const [purchaseMessage, setPurchaseMessage] = React.useState(false);

	const renderPurchaseMessage = React.useCallback(() => {
		setPurchaseMessage(true);
	}, [purchaseMessage]);

	React.useEffect(() => {
		if (purchaseMessage) {
			const Timer = setTimeout(() => {
				setPurchaseMessage(false);
			}, 1500);
			return () => clearTimeout(Timer);
		}
	}, [renderPurchaseMessage]);

	return (
		<ScrollView>
			<View style={styles.screen}>
				<View style={styles.imageContainer}>
					
					<Image
						style={styles.image}
						source={{ uri: productItem.product.imageUrl }}
					/>
				</View>
				{purchaseMessage ? (
						<AnimatedView duration={300} style={{ height: 40 }}>
							<Text style={styles.purchaseMessage}> Added to cart </Text>
						</AnimatedView>
					) : (
						<></>
					)}
				<TouchableOpacity
					style={styles.button}
					onPress={() => {
						dispatch(cartAction.addToCart(productItem.product)),
							renderPurchaseMessage();
					}}
				>
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
		height: 400,
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
	purchaseMessage: {
		fontFamily: "open-sans-bold",
		color: "black",
		fontSize: 18,
		textAlign: "center",
	},
});

export default ProductDetailScreen;
