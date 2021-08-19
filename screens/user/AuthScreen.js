import React from "react";
import {
	StyleSheet,
	View,
	KeyboardAvoidingView,
	ScrollView,
	Text,
	ActivityIndicator,
	Alert,
} from "react-native";
import Input from "../../components/UI/Input";
import Card from "../../components/UI/Card";
import CustomButton from "../../components/UI/CustomButton";
import Colors from "../../constants/Colors";
import { useDispatch, useSelector } from "react-redux";
import * as authAction from "../../store/actions/auth";
import LandingScreen from "../LandScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";

const UPDATE_FORM_INPUT = "UPDATE_FORM_INPUT";

const formInputReducer = (state, action) => {
	if (action.type === UPDATE_FORM_INPUT) {
		const updatedValues = {
			...state.inputValues,
			[action.input]: action.value,
		};
		const updatedValidities = {
			...state.inputValidities,
			[action.input]: action.isValid,
		};
		let updatedFormIsValid = true;
		for (key in updatedValidities) {
			updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
		}
		return {
			formIsValid: updatedFormIsValid,
			inputValues: updatedValues,
			inputValidities: updatedValidities,
		};
	}
	return state;
};

const AuthScreen = (props) => {
	const inputRef = React.useRef();
	const dispatch = useDispatch();
	const [loggedIn, setLoggedIn] = React.useState(false);
	const [disableButton, setDisableButton] = React.useState(false);
	const [logState, setLogState] = React.useState(false);
	const [errorMessage, setErrorMessage] = React.useState();

	const [authState, fromDispatch] = React.useReducer(formInputReducer, {
		inputValues: {
			email: "",
			password: "",
		},
		inputValidities: {
			email: false,
			password: false,
		},
		formIsValid: false,
	});

	const inputChangeHandler = React.useCallback(
		(inputIdentifier, initialValue, initialisValid) => {
			fromDispatch({
				type: UPDATE_FORM_INPUT,
				value: initialValue,
				isValid: initialisValid,
				input: inputIdentifier,
			});
		},
		[fromDispatch]
	);

	const logHandler = React.useCallback(async () => {
		setDisableButton(true);
		try {
			if (!logState) {
				await dispatch(
					authAction.login(
						authState.inputValues.email,
						authState.inputValues.password
					)
				);
			} else {
				await dispatch(
					authAction.signUp(
						authState.inputValues.email,
						authState.inputValues.password
					)
				);
			}
		} catch (err) {
			setErrorMessage(err.message);
			setErrorMessage("");
			setDisableButton(false);
		}
	}, [disableButton, errorMessage, logState, authState, dispatch]);

	const redirect = React.useCallback(async () => {
		try {
			const value = await AsyncStorage.getItem("@storage_Key");
			if (value === null) {
				setLoggedIn(true);
			}
		} catch (err) {
			throw new Error(err.message);
		}
	}, [AsyncStorage, loggedIn]);

	React.useEffect(() => {
		if (errorMessage) {
			Alert.alert("An error occured!", errorMessage, [{ text: "OK" }]);
		}
		redirect();
	}, [errorMessage, redirect]);

	if (!loggedIn) {
		return <LandingScreen />;
	}
	return (
		<KeyboardAvoidingView
			// behavior="padding"
			// keyboardVerticalOffset={-100}
			style={{ backgroundColor: "pink", flex: 1 }}
		>
			<View style={styles.header}>
				<Text style={styles.headerText}> Authenticate</Text>
			</View>
			<ScrollView>
				<Card style={styles.screen}>
					<Input
						labelStyle={{ fontSize: 17, fontFamily: "open-sans-bold" }}
						screen={{ width: "80%" }}
						label="E-mail"
						id="email"
						keyboardType="email-address"
						required
						email
						onInputChange={inputChangeHandler}
						initialValue={authState.email}
						textContentType="username"
						autoCapitalize="none"
						onSubmitEditing={() => {
							inputRef.current.focus();
						}}
						returnKeyType="next"
						errorMessage="Please type a correct E-mail address."
					/>
					<Input
						labelStyle={{ fontSize: 17, fontFamily: "open-sans-bold" }}
						screen={{ width: "80%" }}
						ref={inputRef}
						label="Password"
						id="password"
						keyboardType="default"
						secureTextEntry={true}
						required
						onInputChange={inputChangeHandler}
						initialValue={authState.password}
						errorMessage="Minimun length should be six letters"
					/>
					<View style={styles.buttonContainer}>
						{disableButton ? (
							<ActivityIndicator size="small" color="gray" />
						) : (
							<CustomButton
								buttonStyle={styles.buttonStyle}
								textStyle={styles.textStyleLogin}
								text={logState ? "Sign-up " : "Login"}
								onPress={logHandler}
								disabled={disableButton}
							/>
						)}
						<CustomButton
							buttonStyle={styles.buttonStyle}
							textStyle={styles.textStyle}
							text={logState ? "I have a user" : "Don't have user, sign-up"}
							onPress={() => {
								setLogState((prevState) => !prevState);
							}}
							disabled={disableButton}
						/>
					</View>
				</Card>
			</ScrollView>
		</KeyboardAvoidingView>
	);
};

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		marginHorizontal: 20,
		paddingHorizontal: 20,
		paddingVertical: 20,
		marginTop: 100,
		borderRadius: 10,
		backgroundColor: "white",
	},
	header: {
		height: 80,
		backgroundColor: Colors.primary,
		justifyContent: "center",
		alignItems: "center",
	},
	headerText: {
		textAlign: "center",
		fontFamily: "open-sans",
		color: "white",
		fontSize: 20,
		marginTop: 20,
	},
	buttonContainer: {
		width: "100%",
		alignItems: "center",
		paddingHorizontal: 30,
		paddingVertical: 20,
	},
	buttonStyle: {
		paddingVertical: 10,
	},
	textStyle: {
		fontSize: 18,
		color: "black",
	},
	textStyleLogin: {
		fontSize: 18,
	},
});

export default AuthScreen;
