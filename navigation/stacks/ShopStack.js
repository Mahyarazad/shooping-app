import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ProductOverviewScreen from "../../screens/shop/ProductsOverviewScreen";
import ProductDetailScreen from "../../screens/shop/ProductDetailScreen";
import CartScreen from "../../screens/shop/CartScreen";
import LogoTitle from "../navigation-components/LogoTitle";
import Header from "../navigation-components/Header";
import React from 'react';

const ShopStack = createNativeStackNavigator();

const ShopNavigator = () => {
	return (
		<ShopStack.Navigator>
			<ShopStack.Screen
				name="Product Overview"
				component={ProductOverviewScreen}
				options={{
					headerTitle: (props) => (
						<LogoTitle {...props} title="Product Overview" />
					),
					header: ({ navigation, route, options, back }) => {
						return (
							<Header
								navigation={navigation}
								options={{
									iconName: "cart",
									iconColor: "white",
									iconSize: 24,
									onPress() {
										navigation.navigate("CartScreen");
									},
									...options,
								}}
								back={back}
							/>
						);
					},
				}}
			/>
			<ShopStack.Screen
				name="product-detail"
				component={ProductDetailScreen}
				options={({ route }) => ({
					headerTitle: (props) => (
						<LogoTitle {...props} title={route.params.itemData.title} />
					),
					header: ({ navigation, route, options, back }) => {
						return (
							<Header navigation={navigation} options={options} back={back} />
						);
					},
				})}
			/>
			<ShopStack.Screen
				name="CartScreen"
				component={CartScreen}
				options={{
					headerTitle: (props) => <LogoTitle {...props} title="Cart" />,
					header: ({ navigation, route, options, back }) => {
						return (
							<Header
								navigation={navigation}
								options={{
									iconName: "receipt",
									iconColor: "white",
									iconSize: 24,
									onPress() {
										navigation.navigate("Orders");
									},
									...options,
								}}
								back={back}
							/>
						);
					},
				}}
			/>
		</ShopStack.Navigator>
	);
};

export default ShopNavigator