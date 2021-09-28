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
import { useSelector, useDispatch } from "react-redux";
import * as addressActions from "../../store/actions/userInfo";
import AddressFlatList from "../../components/UI/AddressFlatList";

const AddressScreen = (props) => {

	const [inputAddress, setInputAddress] = React.useState(null);
	const addressList = useSelector((state) => state.userInfo.addressList);
	const dispatch = useDispatch();

	const handleTextInput = (value) => {
		setInputAddress(value);
	};

	const fetchAddressList = () => {
		dispatch(addressActions.fetchAddress());
	};

	const handleDelete = (id) => {
		dispatch(addressActions.deleteAddress(id));
		fetchAddressList();
	};

	const handleSubmit = () => {
		if (inputAddress === null) {
			Alert.alert("Wrong Input", "Input cannot be empty", [{ text: "OK" }]);
			return;
		}
		dispatch(addressActions.insertAddress(inputAddress));
		setInputAddress(null);
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
			<AddressFlatList 
				iconName='close-outline'
				addressData={addressList} 
				addressJS={()=>{}}
				addressID={handleDelete} />
				
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
	addAddress: {
		fontFamily: "open-sans-bold",
		fontSize: 22,
	},
});
export default AddressScreen;
