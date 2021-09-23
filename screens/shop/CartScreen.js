import React from "react";
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	FlatList,
	Modal,
	Alert,
	Dimensions,
} from "react-native";
import Colors from "../../constants/Colors";
import { useSelector, useDispatch } from "react-redux";
import CardItem from "../../components/shop/CardItem";
import {
	removeFromCart,
	subtractFromItem,
	clearCart,
} from "../../store/actions/cart";
import { addOrder } from "../../store/actions/orders";
import { StackActions } from "@react-navigation/native";
import Card from "../../components/UI/Card";
import AnimatedDots from "../../components/UI/AnimatedDots";
import * as addressActions from "../../store/actions/userInfo";
import AddressFlatList from "../../components/UI/AddressFlatList";

const CartScreen = (props) => {
	const totalAmount = useSelector((state) => state.cart.totalAmount);
	const [selectAddressModal, setSelectAddressModal] = React.useState(false);
	const [isLoading, setIsLoading] = React.useState(false);
	const dispatch = useDispatch();
	const addressInfo = useSelector((state) => state.userInfo.addressList);

	const fetchAddressList = () => {
		dispatch(addressActions.fetchAddress());
	};

	const item = useSelector((state) => {
		const itemArray = [];
		for (const key in state.cart.item) {
			itemArray.push({
				productId: key,
				productTitle: state.cart.item[key].productTitle,
				productPrice: state.cart.item[key].productPrice,
				quantity: state.cart.item[key].quantity,
				sum: state.cart.item[key].sum,
				pushToken: state.cart.item[key].pushToken,
			});
		}

		return itemArray.sort((a, b) => (a.productId > b.productId ? 1 : -1));
	});

	const addressJs = (object) => {
		// console.log(object);
		setSelectAddressModal(false);
	};
	const placeOrder = React.useCallback(async () => {
		///check the address List
	

		if (addressInfo.length !== 0) {
			setSelectAddressModal(true);
		}
		if (addressInfo.length === 0) {
			Alert.alert(
				"You need to add a new address",
				'You will be redirected to "Addresses Screen" to add an address for delivery purposes.',
				[
					{
						text: "OK",
						onPress: () =>
							props.navigation.navigate("profile", {
								screen: "address-screen",
							}),
					},
				]
			);
		}

		// setIsLoading(true);
		// await dispatch(addOrder(item, totalAmount));
		// dispatch(clearCart());
		// setIsLoading(false);
		// props.navigation.dispatch(StackActions.popToTop());
		// props.navigation.navigate("Orders");
	}, [dispatch, isLoading,addressInfo]);

	React.useEffect(() => {
		fetchAddressList();
	}, []);

	return (
		<View>
			<View style={styles.centerView}>
				<Modal
					transparent
					animationType="slide"
					visible={selectAddressModal}
					onRequestClose={() => setSelectAddressModal(false)}
				>
					<View style={styles.modalView}>
						<View style={styles.modalText}>
							<Text
								style={{
									fontFamily: "open-sans",
									fontSize: 22,
									color: "white",
								}}
							>
								Please chose the delivery address
							</Text>
						</View>

						<AddressFlatList
							listItem={{
								color: "white",
								paddingHorizontal: Dimensions.get("screen").width * 0.05,
							}}
							// iconName="selection-ellipse"
							addressData={addressInfo}
							addressJS={addressJs}
						/>
					</View>
				</Modal>
			</View>
			<Card style={styles.totalAmount}>
				<Text style={styles.text}>
					Total: $<Text style={styles.price}>{totalAmount.toFixed(2)}</Text>
				</Text>
				{isLoading ? (
					<AnimatedDots
						circleSize={9}
						marginSize={1.5}
						container={styles.button}
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
	modalView: {
		overflow: "hidden",
		backgroundColor: "rgba(52, 52, 52, 0.7)",
		borderRadius: 5,
		top: Dimensions.get("screen").width * 0.2,
		left: Dimensions.get("screen").width * 0.05,
		width: Dimensions.get("screen").width * 0.9,
		height: Dimensions.get("screen").height * 0.8,
	},
	centerView: {
		justifyContent: "center",
		alignItems: "center",
	},
	modalText: {
		backgroundColor: "rgba(52, 52, 52, 0.9)",
		height: Dimensions.get("screen").height * 0.07,
		justifyContent: "center",
		alignItems: "center",
	},
});
export default CartScreen;
