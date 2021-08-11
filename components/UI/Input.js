import React, { useEffect } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";

const INPUT_CHANGE = "INPUT_CHANGE";
const INPUT_BLUR = "INPUT_BLUR";

const inputReducer = (state, action) => {
	switch (action.type) {
		case INPUT_CHANGE:
			return {
				...state,
				value: action.value,
				isValid: action.isValid,
			};
		case INPUT_BLUR:
			return {
				...state,
				touched: true,
			};
		default:
			return state;
	}
};

const Input = (props, ref) => {
	const [inputState, dispatch] = React.useReducer(inputReducer, {
		value: props.initialValue
			? typeof props.initialValue === "number"
				? props.initialValue.toString()
				: props.initialValue
			: "",
		isValid: props.initialValid,
		touched: false,
	});

	const handleFocusChange = () => {
		dispatch({
			type: INPUT_BLUR,
		});
	};

	const { onInputChange, id } = props;

	useEffect(() => {
		onInputChange(id, inputState.value, inputState.isValid);
	}, [inputState, onInputChange, id]);

	const handelInputChange = (text) => {
		const emailRegex =
			/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		let isValid = true;
		if (props.required && text.trim().length === 0) {
			isValid = false;
		}
		if (props.email && !emailRegex.test(text.toLowerCase())) {
			isValid = false;
		}
		if (props.min != null && +text < props.min) {
			isValid = false;
		}
		if (props.max != null && +text > props.max) {
			isValid = false;
		}
		if (props.minLength != null && text.length < props.minLength) {
			isValid = false;
		}
		dispatch({
			type: INPUT_CHANGE,
			value: text,
			isValid: isValid,
		});
	};

	return (
		<View style={styles.row}>
			<Text style={styles.text}>{props.label}</Text>
			<TextInput
				ref={ref}
				{...props}
				style={styles.input}
				onChangeText={handelInputChange}
				value={inputState.value}
				onBlur={handleFocusChange}
                
			/>
			{!inputState.isValid && inputState.touched && (
				<View style={styles.errorContainer}>
					<Text style={styles.textError}> {props.inputError} </Text>
				</View>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	row: {
		marginVertical: 5,
	},
	text: {
		fontSize: 14,
		fontFamily: "open-sans-bold",
	},
	input: {
		borderBottomColor: "gray",
		borderBottomWidth: 1,
		paddingTop: 4,
	},
    errorContainer:{
        marginVertical: 5,
    },
    textError:{
        fontFamily: 'open-sans',
        color: 'red',
        fontSize: 13
    }
});

export default React.forwardRef(Input);
