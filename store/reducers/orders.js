import { ADD_ORDER, REMOVE_ORDER, SET_ORDER } from "../actions/orders";
import Order from "../../models/orderItem";
import { v4 as uuidv4 } from "uuid";
import "react-native-get-random-values";

const initialState = {
	orders: [],
};

const orderReducer = (state = initialState, action) => {
	switch (action.type) {
		case SET_ORDER:
			state.orders = action.orderData;
			return state;

		case ADD_ORDER:
			const newOrder = new Order(
				uuidv4(),
				action.orderData.items,
				action.orderData.amount,
				new Date(),
				action.orderData.address
			);
			state.orders = state.orders.concat(newOrder);
			return state;

		case REMOVE_ORDER:
			const updatedList = state.orders.filter((e) => e.id !== action.orderId);
			state.orders = updatedList;
			return state;

		default:
			return state;
	}
};

export default orderReducer;
