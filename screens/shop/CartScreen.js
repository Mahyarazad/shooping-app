import React from "react";
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	ActivityIndicator,
} from "react-native";
import Colors from "../../constants/Colors";
import { useSelector, useDispatch } from "react-redux";
import { FlatList } from "react-native-gesture-handler";
import CardItem from "../../components/shop/CardItem";
import {
	removeFromCart,
	subtractFromItem,
	clearCart,
} from "../../store/actions/cart";
import { addOrder } from "../../store/actions/orders";
import { StackActions } from "@react-navigation/native";
import Card from "../../components/UI/Card";

const CartScreen = (props) => {
	const totalAmount = useSelector((state) => state.cart.totalAmount);
	const [isLoading, setIsLoading] = React.useState(false);
	const dispatch = useDispatch();

	const item = useSelector((state) => {
		const itemArray = [];
		for (const key in state.cart.item) {
			itemArray.push({
				productId: key,
				productTitle: state.cart.item[key].productTitle,
				productPrice: state.cart.item[key].productPrice,
				quantity: state.cart.item[key].quantity,
				sum: state.cart.item[key].sum,
			});
		}
		return itemArray.sort((a, b) => (a.productId > b.productId ? 1 : -1));
	});

	const placeOrder = React.useCallback(async () => {
		setIsLoading(true);
		await dispatch(addOrder(item, totalAmount));
		dispatch(clearCart());
		setIsLoading(false);
		props.navigation.dispatch(StackActions.popToTop());
		props.navigation.navigate("Orders");
	}, [dispatch, isLoading]);

	return (
		<View>
			<Card style={styles.totalAmount}>
				<Text style={styles.text}>
					{" "}
					Total: $<Text style={styles.price}>{totalAmount.toFixed(2)}</Text>
				</Text>
				{isLoading ? (
					<ActivityIndicator
						style={{ marginRight: 10 }}
						color={Colors.primary}
						size="small"
					/>
				) : (
					<TouchableOpacity
						style={styles.button}
						activeOpacity={0.7}
						onPress={placeOrder}
						disabled={totalAmount === 0}
					>
						<Text
							style={
								totalAmount === 0 ? styles.buttonTextDisable : styles.buttonText
							}
						>
							Order Now
						</Text>
					</TouchableOpacity>
				)}
			</Card>
			<View>
				<FlatList
					data={item}
					keyExtractor={(item) => item.productId}
					renderItem={(itemData) => (
						<CardItem
							itemName={itemData.item.productTitle}
							quantity={itemData.item.quantity}
							unitPrice={itemData.item.productPrice}
							sum={itemData.item.sum}
							remove={() => {
								dispatch(removeFromCart(itemData.item.productId));
							}}
							subtract={() => {
								dispatch(subtractFromItem(itemData.item.productId));
							}}
						/>
					)}
				/>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	totalAmount: {
		marginHorizontal: 20,
		marginVertical: 20,
		paddingVertical: 10,
		paddingHorizontal: 5,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	price: {
		fontSize: 20,
		fontFamily: "open-sans-bold",
		color: Colors.primary,
	},
	text: {
		fontSize: 20,
		fontFamily: "open-sans-bold",
	},
	buttonText: {
		fontSize: 18,
		fontFamily: "open-sans",
		textAlign: "center",
		color: Colors.primary,
	},
	buttonTextDisable: {
		fontSize: 18,
		fontFamily: "open-sans",
		textAlign: "center",
		color: "white",
	},
	button: {
		backgroundColor: "white",
		width: 100,
		height: "100%",
		borderRadius: 4,
		marginHorizontal: 10,
	},
});
export default CartScreen;
