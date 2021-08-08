import React from "react";
import { FlatList, View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import ProductItem from "../../components/shop/ProductItem";
import * as cartAction from "../../store/actions/cart.js";
import Colors from "../../constants/Colors";
import { addToCart } from "../../store/actions/cart.js";

const ProductOverviewScreen = (props) => {
	const products = useSelector((state) => state.products.availableProducts);
	const dispatch = useDispatch();


	return (
		<FlatList
			data={products}
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
						<TouchableOpacity activeOpacity={0.7} onPress={()=> dispatch(addToCart(itemData.item))}>
							<View style={styles.button}>
								<Text style={styles.buttonText}> To Cart </Text>
							</View>
						</TouchableOpacity>
					</View>
				</ProductItem>
			)}

			// numColumns={2}
		/>
	);
};

const styles = StyleSheet.create({
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
});

export default ProductOverviewScreen;
