import {
	DELETE_ADDRESS,
	FETCH_ADDRESS,
	INSERT_ADDRESS,
} from "../actions/userInfo";

const initialState = {
	addressList: [],
};

export const userInfoReducer = (state = initialState, action) => {
	switch (action.type) {
		case FETCH_ADDRESS:	
			state.addressList = action.addressList.rows._array;
			return { ...state };
		case DELETE_ADDRESS:
			state.addressList = action.addressList.rows._array;
			return { ...state };
		case INSERT_ADDRESS:
			state.addressList = action.addressList.rows._array;
			return { ...state };
		default:
			return state;
	}
};
