import React from "react";
import {
	StyleSheet,
	View,
	Text,
	ScrollView,
	TextInput,
	Button,
} from "react-native";

import { useDispatch } from "react-redux";
import { updateProduct } from "../../store/actions/products";

const EditProductScreen = (props) => {
	const dispatch = useDispatch();

	const editingProduct =
		typeof props.route.params === "undefined"
			? ""
			: props.route.params.item.product;

	const [title, setTitle] = React.useState(
		editingProduct ? editingProduct.title : ""
	);
	const [imageUrl, setImageUrl] = React.useState(
		editingProduct ? editingProduct.imageUrl : ""
	);
	const [price, setPrice] = React.useState(
		editingProduct ? editingProduct.price.toString() : ""
	);
	const [description, setDescription] = React.useState(
		editingProduct ? editingProduct.description : ""
	);

	const handelSubmit = React.useCallback(() => {
		dispatch(
			updateProduct({
				price: +price,
				title: title,
				imageUrl: imageUrl,
				description: description,
				id: editingProduct?.id
			})
		);
	}, [dispatch, title, price, imageUrl, description,editingProduct]);

	React.useEffect(() => {
		props.navigation.setParams({
			submit: handelSubmit,
		});
	}, [handelSubmit]);

	return (
		<View style={styles.screen}>
			<View>
				<View style={styles.row}>
					<Text style={styles.text}>Title</Text>
					<TextInput
						style={styles.input}
						value={title}
						onChangeText={(text) => setTitle(text)}
					/>
				</View>

				<View style={styles.row}>
					<Text style={styles.text}>Image URL</Text>
					<TextInput
						style={styles.input}
						value={imageUrl}
						onChangeText={(text) => setImageUrl(text)}
					/>
				</View>
				<View style={styles.row}>
					<Text style={styles.text}>Price</Text>
					<TextInput
						style={styles.input}
						value={price}
						onChangeText={(text) => setPrice(text)}
					/>
				</View>
				<View style={styles.row}>
					<Text style={styles.text}>Description</Text>
					<TextInput
						style={styles.input}
						value={description}
						onChangeText={(text) => setDescription(text)}
					/>
				</View>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	screen: { flex: 1 },
	row: {
		marginVertical: 5,
		marginHorizontal: 50,
	},
	text: {
		fontSize: 14,
		fontFamily: "open-sans-bold",
	},
	input: {
		// marginVertical: 10,
		borderBottomColor: "gray",
		borderBottomWidth: 1,
		paddingTop: 4,
	},
});

export default EditProductScreen;
