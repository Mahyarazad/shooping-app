import React from "react";
import {
	StyleSheet,
	View,
	KeyboardAvoidingView,
	ScrollView,
	Text,
	ActivityIndicator,
	Alert,
	ImageBackground,
	TouchableOpacity,
	Dimensions,
} from "react-native";
import LoginInput from "../../components/UI/LoginInput";
import CustomButton from "../../components/UI/CustomButton";
import Colors from "../../constants/Colors";
import { useDispatch } from "react-redux";
import * as authAction from "../../store/actions/auth";
import LandingScreen from "../LandScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AntDesign, Entypo } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import CheckBox from "@react-native-community/checkbox";

const UPDATE_FORM_INPUT = "UPDATE_FORM_INPUT";

const loadRememberMe = async () => {
	try {
		const email = await FileSystem.readAsStringAsync(
			FileSystem.cacheDirectory + "remember-me.txt",
			{ encoding: FileSystem.EncodingType.UTF8 }
		);

		return email;
	} catch (err) {
		return err;
	}
};

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
	const [passwordVisible, setPasswordVisible] = React.useState(true);
	const [rememberMe, setRememberMe] = React.useState(false);

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

	const handleRememberMe = React.useCallback(async () => {
		if(rememberMe){
			try {
				const done = await FileSystem.writeAsStringAsync(
					FileSystem.cacheDirectory + "remember-me.txt",
					`${authState.inputValues.email}`,
					{ encoding: FileSystem.EncodingType.UTF8 }
				);
			} catch (err) {
				throw new Error(err);
			}
		} else {
			try {
				const done = await FileSystem.deleteAsync(
					FileSystem.cacheDirectory + "remember-me.txt",
				);
			} catch (err) {
				throw new Error(err);
			}
		}
		
	}, [authState,rememberMe]);

	const handleLoadRememberMe = React.useCallback(async () => {
		try {
			const res = await loadRememberMe();
			if (res) {
				setRememberMe(true);
				authState.email = res
			}
		} catch (err) {
			throw new Error(err);
		}
	}, [fromDispatch, rememberMe, loadRememberMe, inputChangeHandler]);

	React.useEffect(() => {
		if (rememberMe) {
			handleRememberMe();
		}

		if (errorMessage) {
			Alert.alert("An error occured!", errorMessage, [{ text: "OK" }]);
		}
		redirect();
	}, [
		errorMessage,
		redirect,
		rememberMe,
		handleRememberMe,
		handleLoadRememberMe,
	]);

	React.useEffect(() => {
		handleLoadRememberMe();

		return () => {
			handleLoadRememberMe();
		};
	}, [handleLoadRememberMe, inputChangeHandler]);

	if (!loggedIn) {
		return <LandingScreen />;
	}
	return (
		<KeyboardAvoidingView style={{ backgroundColor: "white", flex: 1 }}>
			<View style={styles.header}>
				<Text style={styles.headerText}> Authenticate</Text>
			</View>
			<ImageBackground
				resizeMode="cover"
				style={{
					width: "100%",
					height: Dimensions.get("window").height * 1.2,
					position: "absolute",
				}}
				imageStyle={{ opacity: 0.3 }}
				source={require("../../assets/14256015.jpg")}
			>
				<ScrollView style={{ marginTop: 150 }}>
					<View style={styles.fieldContainer}>
						<AntDesign
							style={{ paddingLeft: 5 }}
							name="user"
							size={24}
							color="gray"
						/>
						<LoginInput
							input={styles.textInput}
							placeholder="Email"
							labelStyle={{ fontSize: 20, fontFamily: "open-sans-bold" }}
							screen={{ width: "80%" }}
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
							errorContainer={styles.errorContainer}
							errorMessage="Minimun length should be six letters"
						/>
					</View>

					<View style={styles.fieldContainer}>
						<AntDesign
							style={{ paddingLeft: 5 }}
							name="lock"
							size={24}
							color="gray"
						/>
						<LoginInput
							placeholder="Password"
							input={styles.textInput}
							labelStyle={{ fontSize: 20, fontFamily: "open-sans-bold" }}
							screen={{ width: "80%" }}
							ref={inputRef}
							id="password"
							keyboardType="default"
							secureTextEntry={passwordVisible}
							required
							onInputChange={inputChangeHandler}
							initialValue={authState.password}
							errorContainer={styles.errorContainer}
							errorMessage="Minimun length should be six letters"
						/>
						<TouchableOpacity
							onPress={() => setPasswordVisible((prevState) => !prevState)}
						>
							<Entypo
								name={passwordVisible ? "eye" : "eye-with-line"}
								size={24}
								color="#fc036b"
							/>
						</TouchableOpacity>
					</View>
					<View style={styles.checkBox}>
						<Text style={{ fontFamily: "open-sans", fontSize: 16 }}>
							{" "}
							Remember Me{" "}
						</Text>
						<CheckBox
							disabled={false}
							value={rememberMe}
							onValueChange={() => setRememberMe((prevState) => !prevState)}
							tintColors={{ true: Colors.primary }}
						/>
					</View>

					<View style={styles.buttonContainer}>
						{disableButton ? (
							<ActivityIndicator size="large" color={Colors.primary} />
						) : (
							<CustomButton
								buttonStyle={{
									backgroundColor: "#fc036b",
									...styles.buttonStyle,
								}}
								textStyle={styles.textStyleLogin}
								text={logState ? "Sign-up " : "Login"}
								onPress={logHandler}
								disabled={disableButton}
							/>
						)}
						<CustomButton
							buttonStyle={{
								backgroundColor: "white",
								borderColor: "#fc036b",
								borderWidth: 1,
								...styles.buttonStyle,
							}}
							textStyle={styles.textStyle}
							text={logState ? "I have a user" : "Don't have user, sign-up"}
							onPress={() => {
								setLogState((prevState) => !prevState);
							}}
							disabled={disableButton}
						/>
					</View>
				</ScrollView>
			</ImageBackground>
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
		zIndex: 2,
	},
	headerText: {
		textAlign: "center",
		fontFamily: "open-sans",
		color: "white",
		fontSize: 20,
		marginTop: 20,
	},
	buttonContainer: {
		flex: 1,
		alignItems: "center",
		paddingHorizontal: 20,
		paddingVertical: 20,
		marginTop: 20,
	},
	buttonStyle: {
		width: Dimensions.get("screen").width - 40,
		maxWidth: Dimensions.get("screen").width,
		paddingVertical: 10,
		marginVertical: 2,
	},
	textStyle: {
		fontSize: 18,
		color: "#fc036b",
		textAlign: "center",
	},

	textStyleLogin: {
		fontSize: 18,
		textAlign: "center",
		color: "white",
	},
	fieldContainer: {
		marginHorizontal: 20,
		height: 70,
		flexDirection: "row",
		alignItems: "center",
		borderRadius: 5,
		borderColor: "white",
		marginVertical: 10,
		backgroundColor: "white",
		elevation: 20,
	},

	textInput: {
		marginLeft: 10,
		position: "absolute",
		transform: [{ translateY: -15 }],
	},
	errorContainer: {
		marginLeft: 10,
		position: "absolute",
		transform: [{ translateY: +10 }],
	},
	checkBox: {
		paddingLeft: 20,
		flexDirection: "row",
		justifyContent: "flex-start",
		alignItems: "center",
	},
});

export default AuthScreen;
