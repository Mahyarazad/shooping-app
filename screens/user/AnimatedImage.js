import { Image, Animated } from "react-native";
import React from "react";

const AnimatedImage = (props) => {
	const yAxis = React.useRef(new Animated.Value(-10)).current;
	const xAxis = React.useRef(new Animated.Value(-3)).current;
	React.useEffect(() => {
		Animated.loop(
			Animated.sequence([
				Animated.parallel([
					Animated.timing(yAxis, {
						toValue: -40,
						duration: 5000,
						useNativeDriver: true,
					}),
					Animated.timing(xAxis, {
						toValue: -5,
						duration: 4000,
						useNativeDriver: true,
					}),
				]),
				Animated.parallel([
					Animated.timing(yAxis, {
						toValue: -15,
						duration: 5000,
						useNativeDriver: true,
					}),
					Animated.timing(xAxis, {
						toValue: 0,
						duration: 4000,
						useNativeDriver: true,
					}),
				]),
				Animated.parallel([
					Animated.timing(yAxis, {
						toValue: -20,
						duration: 5000,
						useNativeDriver: true,
					}),
					Animated.timing(xAxis, {
						toValue: -4,
						duration: 4000,
						useNativeDriver: true,
					}),
				]),
			]),

			{
				iterations: -1,
			}
		).start();
	}, [yAxis, xAxis]);
	return (
		<Animated.Image
			// resizeMode="repeat"
			style={{
				width: "110%",
				height: "110%",
				position: "absolute",
				transform: [
					{ translateY: yAxis },
					{ translateX: xAxis },
					{
						rotate: xAxis.interpolate({
							inputRange: [0, 40],
							outputRange: ["0deg", "5deg"],
						}),
					},
				],
			}}
			// progressiveRenderingEnabled={true}
			imageStyle={{
				opacity: 0.5,
			}}
			//thanks to "Videezy.com" for this awesome animation
			source={require("../../assets/Grey.png")}
		/>
	);
};

export default AnimatedImage;
