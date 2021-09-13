import { CLOSE_DRAWER, TOGGLE_DRAWER } from "../actions/drawer";

const initialState = {
	drawerStatus: false,
};

export const drawerReducer = (state = initialState, action) => {
	switch (action.type) {
		case TOGGLE_DRAWER:
			return { drawerStatus: !state.drawerStatus };
		case CLOSE_DRAWER:
			return { drawerStatus: false };

		default:
			return state;
	}
};
