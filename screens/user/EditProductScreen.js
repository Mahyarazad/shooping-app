import React from "react";
import {
	StyleSheet,
	View,
	KeyboardAvoidingView,
	Alert,
	ScrollView,
	ActivityIndicator,
} from "react-native";
import Input from "../../components/UI/Input";
import { useDispatch } from "react-redux";
import { updateProduct, createProduct } from "../../store/actions/products";

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

const EditProductScreen = (props) => {
	const dispatch = useDispatch();
	const ref_input1 = React.useRef();
	const ref_input2 = React.useRef();
	const ref_input3 = React.useRef();
	const [isLoading, setIsLoading] = React.useState(false);
	const [errorMessage, setErrorMessage] = React.useState();

	const editingProduct =
		props.route.params.item.product.submit === ""
			? null
			: props.route.params.item.product;

	const [formState, fromDispatch] = React.useReducer(formInputReducer, {
		inputValues: {
			title: editingProduct ? editingProduct.title : "",
			imageUrl: editingProduct ? editingProduct.imageUrl : "",
			price: editingProduct ? editingProduct.price : "",
			description: editingProduct ? editingProduct.description : "",
		},
		inputValidities: {
			title: editingProduct ? true : false,
			imageUrl: editingProduct ? true : false,
			price: editingProduct ? true : false,
			description: editingProduct ? true : false,
		},
		formIsValid: editingProduct ? true : false,
	});

	React.useEffect(() => {
		if (errorMessage) {
			Alert.alert("An error occured:", errorMessage, [{ text: "OK" }]);
		}
	}, [errorMessage]);

	const handelSubmit = React.useCallback(async () => {
		if (!formState.formIsValid) {
			Alert.alert("Wrong Input", "Please check the errors in the form.", [
				{ text: "Okay" },
			]);
			return;
		}
		setErrorMessage(null);
		setIsLoading(true);
		try {
			if (editingProduct) {
				await dispatch(
					updateProduct({
						price: +formState.inputValues.price,
						title: formState.inputValues.title,
						imageUrl: formState.inputValues.imageUrl,
						description: formState.inputValues.description,
						id: editingProduct?.id,
					})
				);
			} else {
				await dispatch(
					createProduct({
						price: +formState.inputValues.price,
						title: formState.inputValues.title,
						imageUrl: formState.inputValues.imageUrl,
						description: formState.inputValues.description,
					})
				);
			}
			props.navigation.navigate("user-product");
		} catch (err) {
			setErrorMessage(err.message);
			setIsLoading(false);
		}
	}, [dispatch, formState, editingProduct]);

	React.useEffect(() => {
		props.navigation.setParams({
			submit: handelSubmit,
		});
	}, [handelSubmit, isLoading, errorMessage]);

	const textChangeHandler = React.useCallback(
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

	if (isLoading) {
		return (
			<View style={styles.centered}>
				<ActivityIndicator color="gray" size="large" />
			</View>
		);
	}

	return (
		<KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
			<ScrollView>
				<View style={styles.screen}>
					<Input
						input={{
							borderBottomColor: "gray",
							borderBottomWidth: 1,
							paddingTop: 4,
						}}
						id="title"
						label="Title"
						errorMessage="Please enter a valid title!"
						autoCapitalize="words"
						returnKeyType="next"
						onInputChange={textChangeHandler}
						onSubmitEditing={() => {
							ref_input1.current.focus();
						}}
						initialValue={editingProduct ? editingProduct.title : ""}
						initialValid={!!editingProduct}
						required
					/>

					<Input
						input={{
							borderBottomColor: "gray",
							borderBottomWidth: 1,
							paddingTop: 4,
						}}
						id="imageUrl"
						ref={ref_input1}
						onSubmitEditing={() => ref_input2.current.focus()}
						label="Image Url"
						errorMessage="Please enter a valid image URL!"
						autoCapitalize="words"
						returnKeyType="next"
						onInputChange={textChangeHandler}
						initialValue={editingProduct ? editingProduct.imageUrl : ""}
						initialValid={!!editingProduct}
						required
					/>
					<Input
						input={{
							borderBottomColor: "gray",
							borderBottomWidth: 1,
							paddingTop: 4,
						}}
						ref={ref_input2}
						onSubmitEditing={() => ref_input3.current.focus()}
						id="price"
						label="Price"
						errorMessage="Please enter a valid price!"
						autoCapitalize="words"
						returnKeyType="next"
						keyboardType="decimal-pad"
						onInputChange={textChangeHandler}
						initialValue={editingProduct ? editingProduct.price : ""}
						initialValid={!!editingProduct}
						required
						min={1}
					/>
					<Input
						input={{
							borderBottomColor: "gray",
							borderBottomWidth: 1,
							paddingTop: 4,
						}}
						ref={ref_input3}
						id="description"
						label="Description"
						errorMessage="Please enter a valid description!"
						autoCapitalize="words"
						returnKeyType="next"
						onInputChange={textChangeHandler}
						initialValue={editingProduct ? editingProduct.description : ""}
						initialValid={!!editingProduct}
						required
						minLength={5}
						multiline={true}
						numberOfLines={2}
					/>
				</View>
			</ScrollView>
		</KeyboardAvoidingView>
	);
};

const styles = StyleSheet.create({
	screen: { flex: 1, paddingTop: 10, marginHorizontal: 20 },
	centered: { flex: 1, justifyContent: "center", alignItems: "center" },
	errorMessage: {
		fontFamily: "open-sans",
		color: "black",
		fontSize: 20,
		paddingBottom: 10,
	},
});

export default EditProductScreen;
