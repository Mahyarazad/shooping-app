import React from "react";
import {
	FlatList,
	StyleSheet,
	View,
	TouchableOpacity,
	Text,
	Alert,
	ActivityIndicator,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import ProductItem from "../../components/shop/ProductItem";
import Colors from "../../constants/Colors";
import { deleteProduct } from "../../store/actions/products";
import * as productActions from "../../store/actions/products";


const UserProductScreen = (props) => {
	const products = useSelector((state) => state.products.userProducts);
	const dispatch = useDispatch();

	const [isLoading, setIsLoading] = React.useState(false);
	const [errorMessage, setErrorMessage] = React.useState();


	const loadProducts = React.useCallback(async () => {
		setErrorMessage(null);
		setIsLoading(true);
		try {
			await dispatch(productActions.fetchProducts());
		} catch (err) {
			setErrorMessage(err.message);
		}

		setIsLoading(false);
	}, [dispatch, setErrorMessage, setIsLoading]);

	React.useEffect(() => {
		const refetchProducts = props.navigation.addListener("focus", loadProducts);
		return refetchProducts;
		// return () => {
		// 	refetchProducts.remove();
		// };
	}, [loadProducts]);

	React.useEffect(() => {
		loadProducts();
	}, [dispatch, loadProducts]);



	const deleteHandler = (id) => {
		Alert.alert("Are you sure?", "Do you really want to delete this product?", [
			{ text: "No", style: "default" },
			{
				text: "Yes",
				style: "destructive",
				onPress: () => dispatch(deleteProduct(id)),
			},
		]);
	};

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
			renderItem={(itemData) => (
				<ProductItem
					imageSrc={itemData.item.imageUrl}
					itemName={itemData.item.title}
					itemPrice={itemData.item.price}
					onSelect={() => {
						props.navigation.navigate("edit-screen", {
							item: {
								product: itemData.item,
							},
						});
					}}
				>
					<View style={styles.buttonContainer}>
						<TouchableOpacity
							activeOpacity={0.7}
							onPress={() => {
								props.navigation.navigate("edit-screen", {
									item: {
										product: itemData.item,
									},
								});
							}}
						>
							<View style={styles.button}>
								<Text style={styles.buttonText}> Edit </Text>
							</View>
						</TouchableOpacity>
						<TouchableOpacity
							activeOpacity={0.7}
							onPress={deleteHandler.bind(this, itemData.item.id)}
						>
							<View style={styles.button}>
								<Text style={styles.buttonText}> Delete </Text>
							</View>
						</TouchableOpacity>
					</View>
				</ProductItem>
			)}
		/>
	);
};

const styles = StyleSheet.create({
	centered: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
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
	}
});

export default UserProductScreen;
