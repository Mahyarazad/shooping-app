import React from "react";
import { View, Text } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { useSelector } from "react-redux";
import OrderCard from "../../components/shop/OrderCard";
import sortObject from "sort-object-js";

const OrdersScreen = (props) => {
	const orderData = useSelector((state) => state.order.orders);
	
	if (orderData?.length > 1) {
		orderData.sort((a, b) =>
			a.id < b.id ? 1 : -1
		);
	}

	return (
		<FlatList
			data={orderData}
			renderItem={(itemData) => (
				<OrderCard
					orderItem={itemData.item}
					date={itemData.item.date.toLocaleString()}
					id={itemData.item.id}
				/>
			)}
		/>
	);
};

export default OrdersScreen;
