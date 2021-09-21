import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ProfileScreen from "../../screens/profile/ProfileScreen";
import AddressScreen from "../../screens/profile/AddressScreen";
import React from "react";
import LogoTitle from "../navigation-components/LogoTitle";
import Header from "../navigation-components/Header";
import Colors from "../../constants/Colors";

const ProfileStack = createNativeStackNavigator();
export const ProfileContext = React.createContext();

const ProfileNavigator = (props) => {
	const { email } = props.route.params.userData;
	const userName = email.charAt(0).toUpperCase() + email.slice(1, email.search(/@/));
	return (
		<ProfileContext.Provider value={{ ...props }}>
			<ProfileStack.Navigator>
				<ProfileStack.Screen
					name="profile-screen"
					component={ProfileScreen}
					options={{
						headerTitle: (props) => <LogoTitle {...props} title={userName} />,
						header: ({ navigation, route, options, back }) => {
							return (
								<Header
									navigation={navigation}
									options={{
										...options,
									}}
									back={back}
								/>
							);
						},
					}}
				/>
				<ProfileStack.Screen
					name="address-screen"
					component={AddressScreen}
					options={({ navigation, route }) => ({
						headerShown: true,
						headerStyle: { backgroundColor: Colors.primary },
						headerTitle: (props) => <LogoTitle {...props} title="My Addresses" />,
						header: ({ navigation, route, options, back }) => {
							return (
								<Header
									navigation={navigation}
									options={{
										...options,
									}}
									back={back}
								/>
							);
						},
					})}
				/>
			</ProfileStack.Navigator>
		</ProfileContext.Provider>
	);
};

export default ProfileNavigator;
