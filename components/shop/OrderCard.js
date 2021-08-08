import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Colors from "../../constants/Colors";
import { useDispatch } from "react-redux";
import {removeOrder} from '../../store/actions/orders';
import Card from "../UI/Card";

const OrderCard = (props) => {
	const orderDetail = Object.values(props.orderItem.items);
	const [showDetails, setShowDetails] = React.useState(false);
	const dispatch = useDispatch();
	return (
		<Card style={styles.itemContainer}>
			<View style={styles.order}>
				<Text style={styles.amount}>${props.orderItem.amount.toFixed(2)} </Text>
				<Text style={styles.date}> {props.date}</Text>
			</View>
			<View style={styles.button}>
				<TouchableOpacity
					onPress={() => {
						setShowDetails((prevState) => !prevState);
					}}
				>
					<Text style={styles.openDetail}>
						{" "}
						{showDetails ? "Hide Details" : "Details"}{" "}
					</Text>
				</TouchableOpacity>
				<TouchableOpacity
					onPress={() => {
						dispatch(removeOrder(props.id))
					}}
				>
					<Text style={{fontFamily: 'open-sans', color: 'black'}}>
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
									<Text style={{ width: "70%", fontFamily: "open-sans" }}>
										{" "}
										{e.productTitle}{" "}
									</Text>
									<Text style={{ width: "15%", fontFamily: "open-sans" }}>
										{" "}
										×{e.quantity}{" "}
									</Text>
									<Text style={{ width: "15%", fontFamily: "open-sans" }}>
										{" "}
										${e.sum / 1000 > 1
											? e.sum.toFixed(0)
											: e.sum.toFixed(2)}{" "}
									</Text>
								</View>
							);
						})}
					</View>
				)}
			</View>
		</Card>
	);
};

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
		color: "gray",
		fontSize: 16,
	},
	amount: {
		fontFamily: "open-sans-bold",
		fontSize: 16,
		color: "black",
	},

	openDetail: {
		fontFamily: "open-sans",
		fontSize: 18,
		color: Colors.primary,
	},
	detailContainer: {
		flexDirection: "row",
		marginVertical: 5,
	},
	order: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginHorizontal: 5,
	},
	button: {
		alignItems: "center",
		marginVertical: 5,
	},
});
export default OrderCard;
