import * as authActions from "../actions/auth";

const initialState = {
	displayName: "",
	email: "",
	expiresIn: "",
	kind: "",
	localId: "",
	registered: "",
};

export const authReducer = (state = initialState, action) => {
	switch (action.type) {
		
		case authActions.LOGIN:
			return { ...action.resData };
		case authActions.SIGN_UP:
			return { ...action.resData };
		default:
			return state;
	}
};
