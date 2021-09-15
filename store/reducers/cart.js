import {
	ADD_TO_CART,
	CLEAR_CART,
	REMOVE_FROM_CART,
	SUBTRACT_FROM_ITEM,
} from "../actions/cart";
import CartItem from "../../models/cartItem";
import { DELETE_PRODUCT } from "../../store/actions/products";

const initialState = {
	item: {},
	totalAmount: 0,
};

const cartReducer = (state = initialState, action) => {
	switch (action.type) {
		case ADD_TO_CART:
			const addedProduct = action.product;
			const prodPrice = addedProduct.price;
			const prodTitle = addedProduct.title;
			const pushToken = addedProduct.pushToken;
			let updatedOrNewCart;

			if (state.item[addedProduct.id]) {
				updatedOrNewCart = new CartItem(
					state.item[addedProduct.id].quantity + 1,
					prodTitle,
					pushToken,
					prodPrice,
					state.item[addedProduct.id].sum + prodPrice,
					
				);
			} else {
				updatedOrNewCart = new CartItem(1, prodTitle, pushToken, prodPrice, prodPrice);
			}
			return {
				...state,
				item: { ...state.item, [addedProduct.id]: updatedOrNewCart },
				totalAmount: state.totalAmount + prodPrice,
			};
		case REMOVE_FROM_CART:
			const amount = { ...state.item }[action.id].sum;
			let updatedCart = { ...state.item };
			delete updatedCart[action.id];

			return {
				...state,
				item: { ...updatedCart },
				totalAmount: state.totalAmount - amount,
			};

		case SUBTRACT_FROM_ITEM:
			const targetItem = { ...state.item }[action.id];
			if (targetItem.quantity === 1) {
				const amount = { ...state.item }[action.id].sum;
				const updatedCart = { ...state.item };
				delete updatedCart[action.id];

				return {
					...state,
					item: { ...updatedCart },
					totalAmount: state.totalAmount - amount,
				};
			}
			const updatedItem = new CartItem(
				targetItem.quantity - 1,
				targetItem.productTitle,
				targetItem.productPrice,
				targetItem.sum - targetItem.productPrice
			);

			return {
				...state,
				item: { ...state.item, [action.id]: updatedItem },
				totalAmount: state.totalAmount - targetItem.productPrice,
			};
		case CLEAR_CART:
			state = initialState;
			return {
				...state,
			};

		case DELETE_PRODUCT:
			if (!state.item[action.productId]) {
				return state;
			}
			updatedCart = { ...state.item };
			const itemTotal = state.item[action.productId].sum;
			delete updatedCart[action.productId];

			return {
				...state,
				item: updatedCart,
				totalAmount: state.totalAmount - itemTotal,
			};

		default:
			return state;
	}
};

export default cartReducer;
