import PRODUCTS from "../../data/dummy-data";
import {
	DELETE_PRODUCT,
	CREATE_PRODUCT,
	UPDATE_PRODUCT,
	SET_PRODUCT,
} from "../actions/products";
import Product from "../../models/Product";

const initialState = {
	availableProducts: PRODUCTS,
	userProducts: PRODUCTS,
};

const productReducer = (state = initialState, action) => {
	
	switch (action.type) {
		case SET_PRODUCT:

			return {
				availableProducts: action.product,
				userProducts: action.product
				// userProducts: action.product.filter(elem => elem.ownerId === ??)
			}
		case DELETE_PRODUCT:
			return {
				...state,
				userProducts: state.userProducts.filter(
					(element) => element.id !== action.productId
				),
			};
		case UPDATE_PRODUCT:
			const productIndex = initialState.userProducts.findIndex(
				(elem) => elem.id === action.product.id
			);
			const availableProductIndex = initialState.availableProducts.findIndex(
				(elem) => elem.id === action.product.id
			);
			const updatedProduct = new Product(
				action.product.id,
				action.product.ownerId,
				action.product.title,
				action.product.imageUrl,
				action.product.description,
				action.product.price
			);
			const userUpdatedProducts = [...state.userProducts];
			userUpdatedProducts[productIndex] = updatedProduct;
			const availableUpdatedProducts = [...state.availableProducts];
			availableUpdatedProducts[availableProductIndex] = updatedProduct;

			return {
				...state,
				availableProducts: availableUpdatedProducts,
				userProducts: userUpdatedProducts,
			};
		case CREATE_PRODUCT:
			
			const newProduct = new Product(
				action.product.id,
				action.product.ownerId,
				action.product.title,
				action.product.imageUrl,
				action.product.description,
				parseFloat(action.product.price),
				action.product.pushToken
			);

			return {
				...state,
				availableProducts: state.availableProducts.concat(newProduct),
				userProducts: state.userProducts.concat(newProduct),
			};
		default:
			return state;
	}
};

export default productReducer;
