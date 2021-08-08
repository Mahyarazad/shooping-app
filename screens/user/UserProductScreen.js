import React from "react";
import {
	FlatList,
	StyleSheet,
	View,
	TouchableOpacity,
	Text,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import ProductItem from "../../components/shop/ProductItem";
import Colors from "../../constants/Colors";
import { deleteProduct } from "../../store/actions/products";

const UserProductScreen = (props) => {
	const products = useSelector((state) => state.products.userProducts);
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
							onPress={() => {
								dispatch(deleteProduct(itemData.item.id));
							}}
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

export default UserProductScreen;
