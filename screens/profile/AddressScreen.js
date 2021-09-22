import React from "react";
import {
	View,
	Text,
	TextInput,
	StyleSheet,
	Dimensions,
	FlatList,
	TouchableOpacity,
	Alert,
} from "react-native";
import * as dbActions from "../../Helper/db";
import moment from "moment";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../constants/Colors";

const AddressScreen = (props) => {
	const [inputAddress, setInputAddress] = React.useState(null);
	const [addressList, setAddressList] = React.useState([]);
	const handleTextInput = (value) => {
		setInputAddress(value);
	};

	const fetchAddressList = async () => {
		try {
			const dbResult = await dbActions.fetchAddress();
			if (dbResult) {
				setAddressList(dbResult.rows._array);
			}
		} catch (err) {
			console.log(err);
		}
	};

	const handleSubmit = () => {
		dbActions
			.insertAddress(new Date().toLocaleDateString(), inputAddress, 50.05, 50.5)
			.then((res) => {
				setInputAddress(null)
			})
			.catch((err) => {
				console.log(err);
				Alert.alert("Wrong Input", "Input cannot be empty", [{ text: "OK" }]);
				return;
			});
		fetchAddressList();
	};

	const handleDelete = (id) => {
		dbActions
			.deleteAddress(id)
			.then((res) => console.log(res))
			.catch((err) => console.log(err));
		fetchAddressList();
	};

	React.useEffect(() => {
		fetchAddressList();
	}, []);

	return (
		<View style={styles.screen}>
			<View style={styles.inputView}>
				<TextInput
					style={styles.input}
					keyboardType="default"
					placeholder="New Address"
					keyboardAppearance="dark"
					value={inputAddress}
					onChangeText={handleTextInput}
					multiline
				/>
				<TouchableOpacity onPress={handleSubmit}>
					<Text style={styles.addAddress}> Add Address </Text>
				</TouchableOpacity>
			</View>

			<FlatList
				keyExtractor={(item, index) => index.toString(2)}
				data={addressList}
				renderItem={(itemData) => (
					<View style={styles.listView}>
						<View style={{ justifyContent: "center" }}>
							<Text style={styles.listItem}>{itemData.item.address}</Text>
						</View>

						<TouchableOpacity
							style={styles.delete}
							onPress={handleDelete.bind(this, itemData.item.id)}
						>
							<Ionicons name="close-outline" size={40} color={Colors.primary} />
						</TouchableOpacity>
					</View>
				)}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	input: {
		width: "90%",
		borderBottomColor: "gray",
		borderBottomWidth: 1,
		paddingTop: 4,
		fontSize: 19,
		fontFamily: "open-sans",
	},
	inputView: {
		flexDirection: "column",
		width: Dimensions.get("screen").width,
		height: Dimensions.get("screen").height * 0.2,
		justifyContent: "space-evenly",
		alignItems: "center",
	},
	listView: {
		flexDirection: "row",
		width: Dimensions.get("screen").width * 0.9,
		height: Dimensions.get("screen").height * 0.1,
		alignItems: "center",
		justifyContent: "space-between",
		borderBottomWidth: 1,
		borderBottomColor: "gray",
	},
	listItem: {
		width: Dimensions.get("screen").width * 0.8,
		fontFamily: "open-sans",
		fontSize: 19,
	},
	delete: {
		width: Dimensions.get("screen").width * 0.1,
	},

	addAddress: {
		fontFamily: "open-sans-bold",
		fontSize: 22,
	},
});
export default AddressScreen;
