export const SIGN_UP = "SIGN_UP";
export const LOGIN = "LOGIN";

export const signUp = (email, password) => {
	return async (dispatch) => {
		const response = await fetch(
			"https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDBzYjPMMeI94kScNnZN9_XEQMalP1iJGI",
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					email: email,
					password: password,
					returnSecureToken: true,
				}),
			}
		);
		if (!response.ok) {
			const errResponse = await response.json();

			const errorId = errResponse.error.message;
			const messageHandler = (id) => {
				switch (id) {
					case "INVALID_EMAIL":
						return "The email address is already in use by another account.";
					case "OPERATION_NOT_ALLOWED":
						return "Password sign-in is disabled for this project.";
					case "TOO_MANY_ATTEMPTS_TRY_LATER":
						return "We have blocked all requests from this device due to unusual activity. Try again later.";
				}
			};
			throw new Error(messageHandler(errorId));
		}
		const resData = await response.json();

		dispatch({ type: SIGN_UP, resData: resData });
	};
};

export const login = (email, password) => {
	return async (dispatch) => {
		const response = await fetch(
			"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDBzYjPMMeI94kScNnZN9_XEQMalP1iJGI",
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					email: email,
					password: password,
					returnSecureToken: true,
				}),
			}
		);
		if (!response.ok) {
			const errResponse = await response.json();
			const errorId = errResponse.error.message;
			const messageHandler = (id) => {
				switch (id) {
					case "INVALID_PASSWORD":
						return "Incorrect Password";
					case "EMAIL_NOT_FOUND":
						return "There is no user record corresponding to this identifier. The user may have been deleted.";
					case "USER_DISABLED":
						return "The user account has been disabled by an administrator.";
				}
			};
			throw new Error(messageHandler(errorId));
		}
		const resData = await response.json();

		dispatch({ type: LOGIN, resData: resData });
	};
};
