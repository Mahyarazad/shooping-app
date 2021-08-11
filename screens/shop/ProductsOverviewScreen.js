import React from "react";
import {
	FlatList,
	View,
	StyleSheet,
	TouchableOpacity,
	Text,
	ActivityIndicator,
	Animated,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import ProductItem from "../../components/shop/ProductItem";
import * as cartAction from "../../store/actions/cart.js";
import * as productAction from "../../store/actions/products";
import Colors from "../../constants/Colors";
import { addToCart } from "../../store/actions/cart.js";
import AnimatedView from "../../components/UI/AnimatedView";

const ProductOverviewScreen = (props) => {
	const products = useSelector((state) => state.products.availableProducts);
	const dispatch = useDispatch();
	const [isLoading, setIsLoading] = React.useState(false);
	const [isRefreshing, setIsRefreshing] = React.useState(false);
	const [errorMessage, setErrorMessage] = React.useState();


	const loadProducts = React.useCallback(async () => {
		setErrorMessage(null);
		setIsRefreshing(true);
		try {
			await dispatch(productAction.fetchProducts());
		} catch (err) {
			setErrorMessage(err.message);
		}

		setIsRefreshing(false);
	}, [dispatch, setErrorMessage, setIsLoading]);

	React.useEffect(() => {
		const refetchProducts = props.navigation.addListener("focus", loadProducts);
		return refetchProducts;
	}, [loadProducts]);

	React.useEffect(() => {
		setIsLoading(true);
		loadProducts().then(()=>{
			setIsLoading(false);
		})
	}, [dispatch, loadProducts]);

	

	if (errorMessage) {
		return (
			<View style={styles.centered}>
				<Text style={styles.emptyScreen}> {errorMessage}</Text>
				<TouchableOpacity activeOpacity={0.7} onPress={loadProducts}>
					<View style={styles.button}>
						<Text style={styles.buttonText}> Try Again </Text>
					</View>
				</TouchableOpacity>
			</View>
		);
	}

	if (isLoading) {
		return (
			<View style={styles.centered}>
				<ActivityIndicator size="large" color={Colors.primary} />
			</View>
		);
	}

	if (!isLoading && products.length === 0) {
		return (
			<View style={styles.centered}>
				<Text style={styles.emptyScreen}> There is no product to show. </Text>
			</View>
		);
	}

	return (
		<FlatList
			data={products}
			onRefresh={loadProducts}
			refreshing={isRefreshing}
			extraData={products}
			renderItem={(itemData) => (
				<ProductItem
					imageSrc={itemData.item.imageUrl}
					itemName={itemData.item.title}
					itemPrice={itemData.item.price}
					onSelect={() => {
						props.navigation.navigate("product-detail", {
							itemData: {
								title: itemData.item.title,
								product: itemData.item,
							},
						});
					}}
					addToCart={() => {
						dispatch(cartAction.addToCart(itemData.item));
					}}
				>
					<View style={styles.buttonContainer}>
						<TouchableOpacity
							activeOpacity={0.7}
							onPress={() => {
								props.navigation.navigate("product-detail", {
									itemData: {
										title: itemData.item.title,
										product: itemData.item,
									},
								});
							}}
						>
							<View style={styles.button}>
								<Text style={styles.buttonText}> View Details </Text>
							</View>
						</TouchableOpacity>
						<TouchableOpacity
							activeOpacity={0.7}
							onPress={() => {
								dispatch(
									addToCart(itemData.item),
								);
							}}
						>
							<View style={styles.button}>
								<Text style={styles.buttonText}> To Cart </Text>
							</View>
						</TouchableOpacity>
					</View>
					{/* {purchaseMessage ? (
						<View>
							<Text style={styles.purchaseMessage}> Added to cart </Text>
						</View>
					) : (
						<></>
					)} */}
				</ProductItem>
			)}

			// numColumns={2}
		/>
	);
};

const styles = StyleSheet.create({
	centered: { flex: 1, justifyContent: "center", alignItems: "center" },

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
	},
	emptyScreen: {
		fontFamily: "open-sans",
		color: "black",
		fontSize: 20,
		paddingBottom: 10,
	},
	purchaseMessage: {
		fontFamily: "open-sans-bold",
		color: "black",
		fontSize: 16,
	},
});

export default ProductOverviewScreen;
