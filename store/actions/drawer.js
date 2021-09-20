export const TOGGLE_DRAWER = "TOGGLE_DRAWER";
export const CLOSE_DRAWER = "CLOSE_DRAWER";
export const UPDATE_PROFILE = "UPDATE_PROFILE";


export const toggleDrawer = (status) => {
	return { type: TOGGLE_DRAWER };
};

export const closeDrawer = (status) => {
	return { type: CLOSE_DRAWER };
};

export const updateProfilePicture = (uri) => {
	return { type: UPDATE_PROFILE, uri: uri }
};
