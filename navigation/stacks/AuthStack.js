import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AuthScreen from "../../screens/user/AuthScreen";
import ResetPassword from "../../screens/user/ResetPassword";
import React from 'react';
import LogoTitle from "../navigation-components/LogoTitle";
import Header from "../navigation-components/Header";
import Colors from '../../constants/Colors';

const AuthStack = createNativeStackNavigator();

const AuthNavigator = () => {
	return (
		<AuthStack.Navigator
			screenOptions={() => ({
				header: ({ navigation, route, options, back }) => {
					return (
						<Header navigation={navigation} options={options} back={back} />
					);
				},
			})}
		>
			<AuthStack.Screen
				name="auth-screen"
				component={AuthScreen}
				options={({ navigation, route }) => ({
					headerShown: true,
					headerStyle: {
						backgroundColor: Colors.primary,
					},
					headerTitle: (props) => <LogoTitle {...props} title="Authenticate" />,
				})}
			/>
			<AuthStack.Screen
				name="reset-password"
				component={ResetPassword}
				options={({ navigation, route }) => ({
					headerShown: true,
					headerStyle: { backgroundColor: Colors.primary },
					headerTitle: (props) => (
						<LogoTitle {...props} title="Reset Password" />
					),
				})}
			/>
		</AuthStack.Navigator>
	);
};

export default AuthNavigator