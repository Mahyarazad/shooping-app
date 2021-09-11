import React from "react";
import { FlatList } from "react-native-gesture-handler";
import { View, Text, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import OrderCard from "../../components/shop/OrderCard";
import { useDispatch } from "react-redux";
import * as orderActions from "../../store/actions/orders";
import { ActivityIndicator } from "react-native";
import Colors from "../../constants/Colors";
import AnimatedView from "../../components/UI/AnimatedView";

const OrdersScreen = (props) => {
	const orderData = useSelector((state) => state.order.orders);
	const dispatch = useDispatch();
	const [isLoading, setIsLoading] = React.useState(false);
	const [isRefreshing, setIsRefreshing] = React.useState(false);

	const loadOrder = React.useCallback(async () => {
		setIsLoading(true);
		try {
			await dispatch(orderActions.fetchOrders());

			setIsLoading(false);
		} catch (err) {
			throw new Error(err);
		}
	}, [dispatch, isLoading]);

	React.useEffect(() => {
		const refetchProducts = props.navigation.addListener("focus", loadOrder);
		return refetchProducts;
	}, [loadOrder]);

	React.useEffect(() => {
		if (!orderData) {
			loadOrder();
		}
	}, [loadOrder, orderData]);

	if (orderData?.length > 1) {
		orderData.sort((a, b) => (a.id < b.id ? 1 : -1));
	}

	if (isLoading) {
		return (
			<AnimatedView style={styles.centered}>
				<ActivityIndicator size="large" color={Colors.primary} />
			</AnimatedView>
		);
	}

	if (!isLoading && !orderData) {
		return (
			<View style={styles.centered}>
				<Text style={styles.emptyScreen}> There is no order to show. </Text>
			</View>
		);
	}

	return (
		<View>
			<FlatList
				onRefresh={loadOrder}
				refreshing={isRefreshing}
				data={orderData}
				extraData={orderData}
				renderItem={(itemData) => (
					<OrderCard
						orderItem={itemData.item}
						date={new Date(itemData.item.date).toLocaleString()}
						id={itemData.item.id}
					/>
				)}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	centered: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	emptyScreen: {
		fontFamily: "open-sans",
		color: "black",
		fontSize: 20,
		paddingBottom: 10,
	},
});
export default OrdersScreen;
