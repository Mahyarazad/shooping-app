import Product from "../../models/Product";

export const DELETE_PRODUCT = "DELETE_PRODUCT";
export const UPDATE_PRODUCT = "UPDATE_PRODUCT";
export const CREATE_PRODUCT = "CREATE_PRODUCT";
export const SET_PRODUCT = "SET_PRODUCT";

export const fetchProducts = () => {
	return async (dispatch) => {
		try {
			//async function goes here
			const response = await fetch(
				"https://shop-app-c577e-default-rtdb.asia-southeast1.firebasedatabase.app/product.json"
			);

			if (!response.ok) {
				throw new Error("Something went wrong!");
			}
			const resData = await response.json();

			const loadedData = [];
			for (const key in resData) {
				loadedData.push(
					new Product(
						key,
						"u1",
						resData[key].title,
						resData[key].imageUrl,
						resData[key].description,
						resData[key].price
					)
				);
			}
			return dispatch({ type: SET_PRODUCT, product: loadedData });
		} catch (err) {
			throw err;
		}
	};
};

export const deleteProduct = (productId) => {
	return async (dispatch) => {
		await fetch(
			`https://shop-app-c577e-default-rtdb.asia-southeast1.firebasedatabase.app/product/${productId}.json`,
			{
				method: "DELETE",
			}
		);
		return dispatch({ type: DELETE_PRODUCT, productId: productId });
	};
};

export const updateProduct = (product) => {
	return async (dispatch) => {
		try {
			const response = await fetch(
				`https://shop-app-c577e-default-rtdb.asia-southeast1.firebasedatabase.app/product/${product.id}.jon`,
				{
					method: "PATCH",
					headers: { "content-type": "application/json" },
					body: JSON.stringify(product),
				}
			);
			if(!response.ok){
				throw new Error('Something went wrong!')
			}
			return dispatch({ type: UPDATE_PRODUCT, product });
		} catch (err) {
			throw err;
		}
	};
};

export const createProduct = (product) => {
	return async (dispatch) => {
		// async function goes here
		try {
			const response = await fetch(
				"https://shop-app-c577e-default-rtdb.asia-southeast1.firebasedatabase.app/product.json",
				{
					method: "POST",
					headers: { "content-type": "application/json" },
					body: JSON.stringify(product),
				}
			);
			if (!response.ok) {
				throw new Error("Something went wrong!");
			}
			const resData = await response.json();
			return dispatch({
				type: CREATE_PRODUCT,
				product: { ...product, id: resData.name },
			});
		} catch (err) {
			throw err;
		}
	};
};
