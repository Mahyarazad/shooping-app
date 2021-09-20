import React from "react";
import {
	View,
	Text,
	Image,
	StyleSheet,
	Switch,
	Alert,
	Platform,
	Modal,
	Dimensions,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import Colors from "../../constants/Colors";
import { updateProfilePicture } from "../../store/actions/drawer";
import { useSelector, useDispatch } from "react-redux";

const ProfileScreen = (props) => {
	const [isEnabled, setIsEnabled] = React.useState(false);
	const [isEnabled2, setIsEnabled2] = React.useState(false);

	const { userName } = props.route.params.userData;
	const image = useSelector((state) => state.drawer.uri);
	const dispatch = useDispatch();

	const handleImage = async () => {
		await ImagePicker.requestCameraPermissionsAsync();
		const result = await ImagePicker.launchCameraAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.All,
			allowsEditing: false,
			aspect: [4, 3],
			quality: 1,
		});
		if (result) {
			dispatch(updateProfilePicture(result.uri));
			await FileSystem.copyAsync({
				from: result.uri,
				to: FileSystem.documentDirectory + userName + ".jpg",
			});
		}
	};

	const handleDeleteImage = async () => {
		dispatch(updateProfilePicture(null));
		const pathname = FileSystem.documentDirectory + userName + ".jpg";
		try {
			await FileSystem.deleteAsync(pathname);
		} catch (err) {
			Alert.alert("There is no image to delete", err.message, [{ text: "OK" }]);
			return;
		}
	};

	return (
		<View style={styles.screen}>
			<TouchableOpacity
				onPress={handleImage}
				style={styles.imageContainer}
				// disabled={image}
			>
				{image ? (
					<Image
						source={{ uri: image }}
						style={{
							height: Dimensions.get("screen").width / 1.5,
							width: Dimensions.get("screen").width / 1.5,
							borderRadius: Dimensions.get("screen").width / 2,
						}}
					/>
				) : (
					<Image
						source={require("../../assets/profile.jpg")}
						style={{
							height: Dimensions.get("screen").width / 1.5,
							width: Dimensions.get("screen").width / 1.5,
							borderRadius: Dimensions.get("screen").width / 2,
						}}
					/>
				)}
			</TouchableOpacity>
			<TouchableOpacity
				style={styles.touchableOpacity}
				onPress={handleDeleteImage}
			>
				<Text style={styles.textButton}> Delete Image</Text>
			</TouchableOpacity>
			<TouchableOpacity
				style={styles.touchableOpacity}
				onPress={() => props.navigation.navigate("Product Overview")}
			>
				<Text style={styles.textButton}> Address List </Text>
			</TouchableOpacity>
			<Text style={{...styles.text, marginTop:5}}>Click on change the profile Image</Text>
			<View style={styles.switchContainer}>
				<Switch
					trackColor={{ false: "#a1a1a1", true: "#a1a1a1" }}
					thumbColor={isEnabled ? Colors.primary : "#f4f3f4"}
					ios_backgroundColor="#3e3e3e"
					onValueChange={() => {
						setIsEnabled((prevState) => !prevState);
					}}
					value={isEnabled}
				/>
				<Switch
					trackColor={{ false: "#a1a1a1", true: "#a1a1a1" }}
					thumbColor={isEnabled2 ? Colors.primary : "#f4f3f4"}
					ios_backgroundColor="#3e3e3e"
					onValueChange={() => {
						setIsEnabled2((prevState) => !prevState);
					}}
					value={isEnabled2}
				/>
				<Text> {props.userName}</Text>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		alignItems: "center",
	},
	imageContainer: {
		justifyContent: "center",
		paddingVertical: "5%",
	},
	switchContainer: {
		paddingVertical: "10%",
		height: 200,
		width: 200,
		borderRadius: 100,
	},
	text: {
		fontSize: 16,
		fontFamily: "open-sans",
	},
	textButton: {
		fontSize: 18,
		fontFamily: "open-sans-bold",
	},

	touchableOpacity: {
		marginVertical: 5,
	},
});

export default ProfileScreen;
