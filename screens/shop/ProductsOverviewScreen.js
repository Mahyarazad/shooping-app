import React from "react";
import {
	FlatList,
	View,
	StyleSheet,
	TouchableOpacity,
	Text,
	Dimensions,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import ProductItem from "../../components/shop/ProductItem";
import * as cartAction from "../../store/actions/cart.js";
import * as productAction from "../../store/actions/products";
import Colors from "../../constants/Colors";
import { addToCart } from "../../store/actions/cart.js";
import AnimatedView from "../../components/UI/AnimatedView";
import AnimatedDots from "../../components/UI/AnimatedDots";


const ProductOverviewScreen = (props) => {
	const products = useSelector((state) => state.products.availableProducts);
	const dispatch = useDispatch();
	const [isLoading, setIsLoading] = React.useState(false);
	const [isRefreshing, setIsRefreshing] = React.useState(false);
	const [errorMessage, setErrorMessage] = React.useState();
	const [purchaseMessage, setPurchaseMessage] = React.useState(false);
	const [addToCartLoading, setAddToCardLoading] = React.useState(false);



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
		loadProducts().then(() => {
			setIsLoading(false);
		});
	}, [dispatch, loadProducts]);

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
			<AnimatedView style={styles.centered}>
				<AnimatedDots
							circleSize ={30}
							marginSize = {5}
							container={{
								...styles.animatedDotsStyle,
								backgroundColor: "transparent",
							}}
						/>
			</AnimatedView>
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
		<View style={{alignItems:'center'}}>
			{purchaseMessage ? (
				<AnimatedView
					duration={300}
					style={{ height: 30, backgroundColor: "rgba(255, 130, 5, 1)",justifyContent:'center', borderRadius: 10, width: '60%' }}
				>
					<Text style={styles.purchaseMessage}> Added to cart </Text>
				</AnimatedView>
			) : (
				<></>
			)}
			<View style={{marginTop: 7.5, marginBottom: 7.5}}>
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
							setAddToCardLoading(true)
							dispatch(cartAction.addToCart(itemData.item));
							setAddToCardLoading(false)
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
									dispatch(addToCart(itemData.item)), renderPurchaseMessage();
								}}
							>
								{addToCartLoading ? <AnimatedDots 
									circleSize ={15}
									marginSize = {2.5}
									container={{backgroundColor:'transparent'}}/> : <View style={styles.button}>
									<Text style={styles.buttonText}> To Cart </Text>
								</View> }
								
							</TouchableOpacity>
						</View>
					</ProductItem>
				)}

				// numColumns={2}
			/>
			</View>
		</View>
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
		fontSize: 17,
		fontFamily: "open-sans-bold",
	},
	emptyScreen: {
		fontFamily: "open-sans",
		color: "black",
		fontSize: 20,
		paddingBottom: 10,
	},
	purchaseMessage: {
		fontFamily: "open-sans",
		color: "white",
		fontSize: 22,
		textAlign: "center",
	},
	animatedDotsStyle:{
		height: Dimensions.get("screen").height / 20,
		width: Dimensions.get("screen").width - 40,
		maxWidth: Dimensions.get("screen").width,
		paddingVertical: 10,
		marginVertical: 2,
		borderRadius: 10,
	}
});

export default ProductOverviewScreen;
