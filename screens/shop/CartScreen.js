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
import ENV from '../../ENV'
var AWS = require("aws-sdk");

AWS.config.update({
	accessKeyId: ENV.accessKeyId,
	secretAccessKey: ENV.secretAccessKey,
	region: ENV.region,
});

const ses = new AWS.SES({ apiVersion: "2010-12-01" });

const CartScreen = (props) => {
	const { totalAmount } = useSelector((state) => state.cart);
	const { email } = useSelector((state) => state.auth);
	const { orders } = useSelector((state) => state.order);
	const [selectAddressModal, setSelectAddressModal] = React.useState(false);
	const [isLoading, setIsLoading] = React.useState(false);
	const dispatch = useDispatch();
	const addressInfo = useSelector((state) => state.userInfo.addressList);

	const fetchAddressList = React.useCallback(() => {
		dispatch(addressActions.fetchAddress());
	}, [addressInfo]);

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

	const addressJs = async (object) => {
		setIsLoading(true);
		setSelectAddressModal(false);

		let itemHTML = "";
		let totalitemHTML = "";
		let itemQuantity = 0;

		item.map((e) => {
			itemQuantity += e.quantity
			itemHTML += `<tr><td">${e.productTitle}</td><td>$${e.productPrice}</td><td>${e.quantity}</td><td>$${e.sum}</td></tr>`;
		});
		totalitemHTML = `<tr><td"><b>Total Amount</b></td><td></td><td><b>${itemQuantity}</b></td><td><b>$${totalAmount}</b></td></tr>`;
		dispatch(addOrder(item, totalAmount, object["address"])).then((resData) => {
			const { orderData } = resData;

			let params = {
				// send to list
				Destination: {
					ToAddresses: [email],
				},
				Message: {
					Body: {
						Html: {
							Charset: "UTF-8",
							Data:`<!DOCTYPE html><html> <head> <link href="https://fonts.googleapis.com/css2?family=Glory:wght@100&display=swap" rel="stylesheet"> <style>.container{font-family: 'Glory', sans-serif; height: 100%; display:grid; grid-template-columns: 0.4fr ; grid-template-rows: 0.5fr 0.35fr 1fr; grid-template-areas: "header" "order-container" "table-container";}.header{grid-area: header; grid-row-start:1 ; grid-column: 1; place-self: center;}.order-container{grid-area: orderDetail; grid-row-start:2 ; grid-column: 1; align-self: start;}.table-container{grid-area: table-container; grid-row-start:3 ; grid-column: 1; overflow: hidden; align-self: start;}.image{}p.bigger{margin-bottom: 0; font-size: 3.5em; text-align: center;}p.smaller{text-align: center; font-size: 2em;}p.text{font-size: 1.5em; text-align: center;}table{width: 100%; font-size: 1em; border:0.1em solid black; border-radius: 0.2em;}tr{text-align: center; border:0.1em solid black;}th{font-size: 1em;}</style> </head> <body> <div class="container"> <div class="header"> <p class="bigger"> <b>Your order placed</b> </p><p class="smaller"> <b>Thanks for your purchase</b></p><img class="image" src="https://cdn2.tychesoftwares.com/wp-content/uploads/2018/03/14061445/Reduce-Shopping-Cart-Abandonment.png" alt="featured-thumbnail"/> </div><div class="order-container"> <p class="text"> <b> Order ID: </b>${orderData.id}</p><p class="text"><b> Delivery Address: </b>${object['address']}</p><p class="text" style="margin-bottom: 1em;"> <b> Total Amount: $</b><b>${orderData.amount.toFixed(2)}</b></p></div><div class="table-container"> <table cellspacing="0"> <tr> <th> Product Name</th> <th> Unit Price </th> <th> Quantity </th> <th> Total</th> </tr>${itemHTML}${totalitemHTML}</table> </div></div></body></html>`,
						},
					},

					Subject: {
						Charset: "UTF-8",
						Data: "Purchased Confirmed",
					},
				},
				Source: "mhyrinc@gmail.com", // must relate to verified SES account
				ReplyToAddresses: ["mhyrinc@gmail.com"],
			};

			
			ses.sendEmail(params, (err, data) => {
				if (err) {
					Alert.alert('Ops... Something went wrong!',err + 'Your order processed successfully, though the confirmation email cannot be sent at the moment. You can check your order in the "Orders" section. Sorry for the inconvenience',[{text:'OK'}])
				}
				else {
					dispatch(clearCart());
					setIsLoading(false);
					props.navigation.dispatch(StackActions.popToTop());
					props.navigation.navigate("Orders");
					console.log(data);
				}
			});
		});
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
						onPress: () => {
							props.navigation.navigate("profile", {
								screen: "address-screen",
							});
						},
					},
				]
			);
		}
	}, [addressInfo]);

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
							circleSize={15}
							marginSize={2.5}
							container={{
								...styles.animatedDotsStyle,
								backgroundColor: "transparent",
							}}
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
			<View style={{marginTop: 7.5, marginBottom: 7.5}}>
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
		marginTop: 20,
		paddingVertical: 12,
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
		fontFamily: "open-sans-bold",
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
	animatedDotsStyle:{
		height: Dimensions.get("screen").height / 20,
		width: Dimensions.get("screen").width - 40,
		maxWidth: Dimensions.get("screen").width,
		paddingVertical: 10,
		marginVertical: 2,
		borderRadius: 10,
	}
});
export default CartScreen;
