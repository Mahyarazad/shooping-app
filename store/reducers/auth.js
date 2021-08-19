import * as authActions from "../actions/auth";

const initialState = {
	auth: false,
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
			return { ...action.resData, auth: true };
		case authActions.SIGN_UP:
			return { ...action.resData, auth: true };
		case authActions.LOGOUT:
			return { ...initialState  };
		case authActions.AUTHENTICATE:
			return { ...state, auth: true };
		case authActions.ISLOGGEDIN:
			return { ...action.resData, auth: true };
		default:
			return state;
	}
};
