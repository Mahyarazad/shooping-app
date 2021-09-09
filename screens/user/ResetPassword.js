import React from "react";
import {
	View,
	StyleSheet,
	ImageBackground,
	Dimensions,
	ActivityIndicator,
	Linking,
	Modal,
	Text,
	KeyboardAvoidingView,
} from "react-native";
import CustomButton from "../../components/UI/CustomButton";
import LoginInput from "../../components/UI/LoginInput";
import { Fontisto } from "@expo/vector-icons";
import Colors from "../../constants/Colors";
import firebase from "firebase";
import ENV from "../../ENV";


if (!firebase.apps.length) {
	firebase.initializeApp(ENV);
} else {
	firebase.app(); // if already initialized, use that one
}

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

const ResetPassword = (props) => {
	const [disableButton, setDisableButton] = React.useState(false);
	const [modalStatus, setModalStatus] = React.useState(false);

	const [authState, fromDispatch] = React.useReducer(formInputReducer, {
		inputValues: {
			email: "",
		},
		inputValidities: {
			email: false,
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

	const handleSendEmail = async () => {
		setDisableButton(true);
		try {
			await firebase.auth().sendPasswordResetEmail(authState.inputValues.email);
			setModalStatus(true);
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<KeyboardAvoidingView style={{ backgroundColor: "white", flex: 1 }}>
			<ImageBackground
				style={{
					width: "100%",
					height: "100%",
					position: "absolute",
				}}
				//thanks to "Videezy.com" for this awesome animation
				source={require("../../assets/Grey.png")}
				resizeMode="cover"
				imageStyle={{ opacity: 0.7 }}
			>
				{modalStatus && (
					<View style={styles.centerView}>
						<Modal
							visible={modalStatus}
							animationType="fade"
							transparent={true}
						>
							<View style={styles.modalContainer}>
								<Image
									imageStyle={{ backgroundColor: "transparent" }}
									source={require("../../assets/green-check.png")}
									style={styles.greenCheck}
								/>

								<Text
									style={{
										fontFamily: "open-sans",
										textAlign: "center",
										fontSize: 20,
									}}
								>
									Please check your email accout for password reset email.
								</Text>

								<CustomButton
									buttonStyle={{ marginTop: 30 }}
									text="OK"
									onPress={() => {
										props.navigation.navigate("auth-screen");
									}}
									textStyle={{ fontSize: 22 }}
								/>
							</View>
						</Modal>
					</View>
				)}
				<View style={styles.screen}>
					<View style={styles.fieldContainer}>
						<Fontisto
							style={{ paddingLeft: 15 }}
							name="email"
							size={24}
							color="gray"
						/>
						<LoginInput
							input={styles.textInput}
							placeholder="Email"
							labelStyle={{ fontSize: 20, fontFamily: "open-sans" }}
							screen={{ width: "80%" }}
							id="email"
							keyboardType="email-address"
							required
							email
							onInputChange={inputChangeHandler}
							initialValue={authState.email}
							textContentType="username"
							autoCapitalize="none"
							returnKeyType="next"
							errorContainer={styles.errorContainer}
							errorMessage="Please enter a valid email address"
						/>
					</View>
					<View style={styles.buttonContainer}>
						{disableButton ? (
							<ActivityIndicator size="large" color={Colors.primary} />
						) : (
							<CustomButton
								buttonStyle={{
									backgroundColor: Colors.primary,
									...styles.buttonStyle,
								}}
								textStyle={styles.textStyle}
								text="Send Email"
								onPress={handleSendEmail}
								disabled={disableButton}
							/>
						)}
					</View>
				</View>
			</ImageBackground>
		</KeyboardAvoidingView>
	);
};

const styles = StyleSheet.create({
	screen: { marginHorizontal: 20, justifyContent: "center" },

	textInput: {
		marginLeft: 10,
		position: "absolute",
		transform: [{ translateY: -15 }],
		fontFamily: 'open-sans'
	},
	fieldContainer: {
		marginTop: 150,
		height: 60,
		flexDirection: "row",
		alignItems: "center",
		borderWidth: 1,
		borderRadius: 15,
		borderColor: "white",
		marginVertical: 10,
		backgroundColor: "white",
		elevation: 20,
	},
	buttonStyle: {
		width: Dimensions.get("screen").width - 40,
		maxWidth: Dimensions.get("screen").width,
		paddingVertical: 10,
		marginVertical: 2,
		borderRadius:10
	},
	textStyle: {
		fontSize: 18,
		textAlign: "center",
		color: "white",
		fontFamily:'open-sans'
	},
	modalContainer: {
		borderRadius: 10,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "white",
		marginVertical: Dimensions.get("window").height * 0.3,
		marginHorizontal: Dimensions.get("window").width * 0.05,
		paddingVertical: 10,
	},
	greenCheck: {
		width: 200,
		height: 200,
	},
	centerView: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
});

export default ResetPassword;
