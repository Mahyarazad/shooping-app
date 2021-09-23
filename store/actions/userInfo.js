export const FETCH_ADDRESS = "FETCH_ADDRESS";
export const DELETE_ADDRESS = "DELETE_ADDRESS";
export const INSERT_ADDRESS = "INSERT_ADDRESS";
import * as dbActions from "../../Helper/db";

export const fetchAddress = () => {
	console.log('fires')
	return async (dispatch) => {
		const res = await dbActions.fetchAddress();
		dispatch({ type: FETCH_ADDRESS, addressList: { ...res } });
	};
};

export const deleteAddress = (id) => {
	return async (dispatch) => {
		dbActions
			.deleteAddress(id)
			.then((res) => {
				console.log(res);
			})
			.catch((err) => console.log(err));
		const res = await dbActions.fetchAddress();
		dispatch({ type: DELETE_ADDRESS, addressList: { ...res } });
	};
};

export const insertAddress = (inputAddress) => {
	return async (dispatch) => {
		dbActions
			.insertAddress(new Date().toLocaleDateString(), inputAddress, 50.05, 50.5)
			.then((res) => {
				console.log(res);
			})
			.catch((err) => {
				console.log(err);
				return;
			});
		const res = await dbActions.fetchAddress();
		dispatch({ type: INSERT_ADDRESS, addressList: { ...res } });
	};
};
