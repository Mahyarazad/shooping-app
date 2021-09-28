import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons, EvilIcons } from "@expo/vector-icons";
import Colors from "../../constants/Colors";
import Card from "../UI/Card";

const CartItem = (props) => {

	return (
		<Card style={styles.itemContainer}>
			<View style={styles.colOne}>
				<Text style={styles.itemName}> {props.itemName} </Text>
			</View>
			<View style={styles.colfour}>
				<TouchableOpacity onPress={props.subtract}>
                    <EvilIcons name="minus" size={18} color={Colors.primary} />
                </TouchableOpacity>
			</View>
			<View style={styles.colTwo}>
				<Text style={styles.unitPrice}>${
					props.unitPrice/1000 > 1 ?props.unitPrice.toFixed(0) :props.unitPrice.toFixed(2)}</Text>
				<Text style={styles.quantity}>×{props.quantity}</Text>
				<Text style={styles.unitSum}>${props.sum/1000 > 1? props.sum.toFixed(0) : props.sum.toFixed(2)} </Text>
			</View>
			
            <View style={styles.colThree}>
				<TouchableOpacity onPress={props.remove}>
                    <Ionicons name="ios-trash-outline" size={18} color={Colors.primary} />
                </TouchableOpacity>
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
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		height: 40,
	},
	colOne: {
		flexDirection: "row",
		justifyContent: "flex-start",
		alignItems: "center",
		flex: 0.4,

	},
	colTwo: {
		flexDirection: "row",
		alignItems: "center",
        justifyContent: "space-between",
		flex: 0.4,
	},
	colThree: {
		flexDirection: "row",
		justifyContent: "flex-end",
        alignItems: "center",
		flex: 0.1,
	},
	colThree: {
		flexDirection: "row",
		justifyContent: "flex-end",
        alignItems: "center",
		flex: 0.1,
	},
    quantity:{
        fontSize: 13,
        fontFamily: 'open-sans'
    },
    unitPrice:{
        fontSize: 12,
        fontFamily: 'open-sans'
    },
    unitSum:{
        fontSize: 14,
        fontFamily: 'open-sans'
    },
    itemName:{
        fontSize: 16,
        fontFamily: 'open-sans'
    }

});

export default CartItem;
