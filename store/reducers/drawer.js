import { CLOSE_DRAWER, TOGGLE_DRAWER, UPDATE_PROFILE } from "../actions/drawer";

const initialState = {
	drawerStatus: false,
	uri: undefined,
};

export const drawerReducer = (state = initialState, action) => {
	switch (action.type) {
		case TOGGLE_DRAWER:
			return { ...state, drawerStatus: !state.drawerStatus };
		case CLOSE_DRAWER:
			return { ...state, drawerStatus: false };
		case UPDATE_PROFILE:
			return { ...state, uri: action.uri };
		default:
			return state;
	}
};
