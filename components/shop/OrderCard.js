import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import Colors from "../../constants/Colors";
import { useDispatch } from "react-redux";
import { removeOrder } from "../../store/actions/orders";
import Card from "../UI/Card";

const OrderCard = (props) => {
	console.log(props)
	const orderDetail = Object.values(props.orderItem.items);
	const [showDetails, setShowDetails] = React.useState(false);
	const [notify, setNotify] = React.useState(false);
	const dispatch = useDispatch();

	React.useEffect(() => {
		if (notify) {
			return Alert.alert("Warning", "Are you sure you want to delete this item?", [
				{
					text: "No",
					onPress: () => {
						setNotify(false);
					},
				},
				{
					text: "Yes",
					onPress: () => {
						dispatch(removeOrder(props.id));
					},
				},
			]);
		}
	}, [dispatch, notify]);

	return (
		<Card style={styles.itemContainer}>
			<View style={styles.rowStyle}>
				<Text style={{...styles.amount, fontFamily: "open-sans-bold"}}>Order ID: </Text>
				<Text style={{...styles.amount, fontFamily: "open-sans"}}>{props.orderItem.id} </Text>
			</View>
			<View style={styles.rowStyle}>
				<Text style={{...styles.amount, fontFamily: "open-sans-bold"}}>Total Amount:</Text>
				<Text style={styles.amount}>${props.orderItem.amount.toFixed(2)} </Text>
			</View>
			<View style={styles.rowStyle}>
			<Text style={{...styles.amount, fontFamily: "open-sans-bold"}}>Purchase Date:</Text>
				<Text style={styles.date}> {props.date}</Text>
			</View>
			<View style={{...styles.orderLine, borderBottomColor: 'gray'}}></View>
			<View style={{justifyContent: 'space-between',  paddingLeft: 5}}>
				<Text style={{...styles.amount, fontFamily: "open-sans-bold"}}>Delivery Address: </Text>
				<Text style={{...styles.amount, fontFamily: "open-sans"}}>{props.orderItem.address} </Text>
			</View>
			<View style={{...styles.orderLine, borderBottomColor: 'gray'}}></View>
			<View style={styles.button}>
				<TouchableOpacity
					onPress={() => {
						setShowDetails((prevState) => !prevState);
					}}
				>
					<Text style={styles.openDetail}>
						{showDetails ? "Hide Details" : "Details"}
					</Text>
				</TouchableOpacity>
				<TouchableOpacity
					onPress={() => {
						setNotify(true);
					}}
				>
					<Text style={{ fontFamily: "open-sans-bold", color: Colors.primary, fontSize:18}}>
						Delete
					</Text>
				</TouchableOpacity>
			</View>
			<View>
				{showDetails && (
					<View>
						{orderDetail.map((e) => {
							return (
								<View style={styles.detailContainer} key={Math.random()}>
									<Text style={{ width: "70%", fontFamily: "open-sans", fontSize: 16 }}>
										{e.productTitle}
									</Text>
									<Text style={{ width: "15%", fontFamily: "open-sans", fontSize: 16 }}>
										×{e.quantity}
									</Text>
									<Text style={{ width: "15%", fontFamily: "open-sans", fontSize: 16 }}>
										${e.sum / 1000 > 1
											? e.sum.toFixed(0)
											: e.sum.toFixed(2)}
									</Text>
								</View>
							);
						})}
						<View style={styles.orderLine}></View>
						<View style={styles.order}>
							<Text style={{...styles.amount, fontFamily: "open-sans-bold"}}>Total Amount: </Text>
							<Text style={{...styles.amount, fontFamily: "open-sans"}}> ${props.orderItem.amount / 1000 > 1
											? props.orderItem.amount.toFixed(0)
											: props.orderItem.amount.toFixed(2)} </Text>
						</View>
						
					</View>
					
				)}
			</View>
		</Card>
	);
};

const _fontSize = 19
const styles = StyleSheet.create({
	itemContainer: {
		marginHorizontal: 20,
		marginVertical: 5,
		paddingVertical: 10,
		paddingHorizontal: 5,
		alignItems: "stretch",
	},
	date: {
		fontFamily: "open-sans",
		color: "black",
		fontSize: _fontSize,
	},
	amount: {
		fontFamily: "open-sans-bold",
		fontSize: _fontSize,
		color: "black",
	},

	openDetail: {
		fontFamily: "open-sans-bold",
		fontSize: _fontSize,
		color: Colors.primary,
	},
	detailContainer: {
		flexDirection: "row",
		marginVertical: 5,
		paddingHorizontal: 5
	},
	order: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginHorizontal: 5,
		paddingTop: 5
	},
	button: {
		flexDirection:'row',
		justifyContent: "space-between",
		marginVertical: 5,
		paddingHorizontal: 5
	},
	rowStyle:{flexDirection: 'row', justifyContent: 'space-between',  paddingHorizontal: 5},
	orderLine:{
		borderBottomColor:Colors.primary,
		borderBottomWidth: 1,
		marginHorizontal: 5,
		paddingTop: 5

	}
});
export default OrderCard;
