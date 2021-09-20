import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import LogoTitle from "../navigation-components/LogoTitle";
import Header from "../navigation-components/Header";
import UserProductScreen from "../../screens/user/UserProductScreen";
import EditProductScreen from "../../screens/user/EditProductScreen";

const UserStack = createNativeStackNavigator();

const UserNavigator = () => {
	return (
		<UserStack.Navigator>
			<UserStack.Screen
				name="user-product"
				component={UserProductScreen}
				options={{
					headerTitle: (props) => (
						<LogoTitle {...props} title="Customization" />
					),
					header: ({ navigation, route, options, back }) => {
						return (
							<Header
								navigation={navigation}
								options={{
									iconName: "edit",
									iconColor: "white",
									iconSize: 24,
									onPress() {
										navigation.navigate("edit-screen", {
											item: { product: { submit: "" } },
										});
									},
									...options,
								}}
								back={back}
							/>
						);
					},
				}}
			/>
			<UserStack.Screen
				name="edit-screen"
				component={EditProductScreen}
				options={({ route }) => ({
					headerTitle: (props) => (
						<LogoTitle
							{...props}
							title={
								route.params.item.product.submit === ""
									? "New Product"
									: route.params.item.product.title
							}
						/>
					),
					header: ({ navigation, route, options, back }) => {
						return (
							<Header
								navigation={navigation}
								options={{
									iconName: "save",
									iconColor: "white",
									iconSize: 24,
									onPress: route.params.submit,
									...options,
								}}
								back={back}
							/>
						);
					},
				})}
			/>
		</UserStack.Navigator>
	);
};

export default UserNavigator