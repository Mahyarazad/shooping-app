import React from "react";
import { FlatList } from "react-native-gesture-handler";
import { View, Text } from "react-native";
import { useSelector } from "react-redux";
import OrderCard from "../../components/shop/OrderCard";
import { useDispatch } from "react-redux";
import * as orderActions from "../../store/actions/orders";
import { ActivityIndicator } from "react-native";
import Colors from "../../constants/Colors";

const OrdersScreen = (props) => {
	const orderData = useSelector((state) => state.order.orders);
	const dispatch = useDispatch();
	const [isLoading, setIsLoading] = React.useState(false);

	const loadedOrder = React.useCallback(async () => {
		setIsLoading(true);
		try {
			await dispatch(orderActions.fetchOrders());
		} catch (err) {
			throw err;
		}
		setIsLoading(false);
	}, [dispatch, isLoading]);

	React.useEffect(() => {
		loadedOrder();
	}, [loadedOrder,orderData]);
	

	if (orderData?.length > 1) {
		orderData.sort((a, b) => (a.id < b.id ? 1 : -1));
	}
	if (isLoading) {
		<ActivityIndicator size="large" color={Colors.primary} />;
	}

	return (
		<FlatList
			data={orderData}
			renderItem={(itemData) => (
				<OrderCard
					orderItem={itemData.item}
					date={new Date(itemData.item.date).toLocaleString()}
					id={itemData.item.id}
				/>
			)}
		/>
	);
};

export default OrdersScreen;
