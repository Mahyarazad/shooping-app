import { Animated, View, StyleSheet, Text } from "react-native";
import React from "react";
import Colors from "../../constants/Colors";
import { Easing } from "react-native-reanimated";

const AnimatedDots = (props) => {
	const radiusDot2 = React.useRef(new Animated.Value(1)).current;
	const radiusDot1 = React.useRef(new Animated.Value(1)).current;
	const radiusDot0 = React.useRef(new Animated.Value(1)).current;
	const xAxisDot2 = React.useRef(new Animated.Value(0)).current;
	const xAxisDot1 = React.useRef(new Animated.Value(0)).current;
	const xAxisDot0 = React.useRef(new Animated.Value(0)).current;

	const circleSize = props.circleSize; // 
	const marginSize = props.marginSize;  // marginSize should be 1/6 fraction of cricleSize
	const velocity = 1000;
	const restSpeedThreshold = 10;
	const backgroundColor = Colors.primary;
	const translateDuration = 100;
	const radiusDuration = 250;
	const speedConst = 10;
	React.useEffect(() => {
		Animated.loop(
			//first sequence 2 0 1
			Animated.sequence([
				Animated.parallel([
					Animated.spring(xAxisDot1, {
						toValue: circleSize + 2 * marginSize,
						duration: translateDuration,
						velocity: velocity,
						restSpeedThreshold: restSpeedThreshold,
						useNativeDriver: true,
						// easing: Easing.elastic(1),
					}),
					Animated.spring(xAxisDot0, {
						toValue: circleSize + 2 * marginSize,
						duration: translateDuration,
						velocity: velocity,
						restSpeedThreshold: restSpeedThreshold,
						useNativeDriver: true,
						// easing: Easing.elastic(1),
					}),

					Animated.spring(xAxisDot2, {
						toValue: circleSize * -3 + 2 * marginSize,
						duration: translateDuration,
						velocity: velocity,
						restSpeedThreshold: restSpeedThreshold,
						useNativeDriver: true,
						// easing: Easing.elastic(1),
					}),
				]),
				// Animated.parallel([
				// 	Animated.timing(radiusDot2, {
				// 		toValue: 1,
				// 		duration: radiusDuration,
				// 		// velocity: velocity,
				// 		useNativeDriver: true,
				// 	}),
				// 	Animated.timing(radiusDot1, {
				// 		toValue: 0,
				// 		duration: radiusDuration,
				// 		// velocity: velocity,
				// 		useNativeDriver: true,
				// 	}),
				// ]),
				//second sequence 1 2 0
				Animated.parallel([
					Animated.spring(xAxisDot0, {
						toValue: circleSize * 3 - 2 * marginSize,
						duration: translateDuration,
						velocity: velocity,
						restSpeedThreshold: restSpeedThreshold,
						useNativeDriver: true,
						// easing: Easing.elastic(1),
					}),
					Animated.spring(xAxisDot1, {
						toValue: -circleSize - 2 * marginSize,
						duration: translateDuration,
						velocity: velocity,
						restSpeedThreshold: restSpeedThreshold,
						useNativeDriver: true,
						// easing: Easing.elastic(1),
					}),
					Animated.spring(xAxisDot2, {
						toValue: -circleSize - 2 * marginSize,
						duration: translateDuration,
						velocity: velocity,
						restSpeedThreshold: restSpeedThreshold,
						useNativeDriver: true,
						// easing: Easing.elastic(1),
					}),
				]),
				// 	Animated.parallel([
				// 		Animated.timing(radiusDot1, {
				// 			toValue: 1,
				// 			duration: radiusDuration,
				// 			useNativeDriver: true,
				// 		}),
				// 		Animated.timing(radiusDot0, {
				// 			toValue: 0,
				// 			duration: radiusDuration,
				// 			useNativeDriver: true,
				// 		}),
				// 	]),
				Animated.parallel([
					Animated.spring(xAxisDot0, {
						toValue: 0,
						duration: translateDuration,
						velocity: velocity,
						restSpeedThreshold: restSpeedThreshold,
						useNativeDriver: true,
						// easing: Easing.elastic(1),
					}),
					Animated.spring(xAxisDot1, {
						toValue: 0,
						duration: translateDuration,
						velocity: velocity,
						restSpeedThreshold: restSpeedThreshold,
						useNativeDriver: true,
						// easing: Easing.elastic(1),
					}),
					Animated.spring(xAxisDot2, {
						toValue: 0,
						duration: translateDuration,
						velocity: velocity,
						restSpeedThreshold: restSpeedThreshold,
						useNativeDriver: true,
						// easing: Easing.elastic(1),
					}),
				]),
				// Animated.parallel([
				// 	Animated.timing(radiusDot2, {
				// 		toValue: 0,
				// 		duration: radiusDuration,
				// 		useNativeDriver: true,
				// 	}),
				// 	Animated.timing(radiusDot0, {
				// 		toValue: 1,
				// 		duration: radiusDuration,
				// 		useNativeDriver: true,
				// 	}),
				// ]),
			]),

			{
				iterations: -1,
			}
		).start();
	}, [xAxisDot0, xAxisDot1, xAxisDot2, radiusDot0, radiusDot1, radiusDot2]);

	return (
		<View style={{ ...styles.container, ...props.container }}>
			<Animated.View
				style={{
					marginHorizontal: marginSize,
					height: circleSize,
					width: circleSize,
					borderRadius: circleSize / 2,
					backgroundColor: backgroundColor,
					transform: [
						{ translateX: xAxisDot0 },
						{ scaleX: radiusDot0 },
						{ scaleY: radiusDot0 },
					],
				}}
			>
				{/* <Text style={{ color: "white", alignItems: "center" }}>0</Text> */}
			</Animated.View>
			<Animated.View
				style={{
					marginHorizontal: marginSize,
					height: circleSize,
					width: circleSize,
					borderRadius: circleSize / 2,
					backgroundColor: backgroundColor,
					transform: [
						{ translateX: xAxisDot1 },
						{ scaleX: radiusDot1 },
						{ scaleY: radiusDot1 },
					],
				}}
			>
				{/* <Text style={{ color: "white", alignItems: "center" }}>1</Text> */}
			</Animated.View>
			<Animated.View
				style={{
					marginHorizontal: marginSize,
					height: circleSize,
					width: circleSize,
					borderRadius: circleSize / 2,
					backgroundColor: backgroundColor,

					transform: [
						{ translateX: xAxisDot2 },
						{ scaleX: radiusDot2 },
						{ scaleY: radiusDot2 },
					],
				}}
			>
				{/* <Text style={{ color: "white", alignItems: "center" }}>2</Text> */}
			</Animated.View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
	},
});

export default AnimatedDots;
