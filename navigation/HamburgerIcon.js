import { TouchableOpacity, Animated } from "react-native";
import React from "react";

const HamburgerIcon = (props) => {
	const { activateIcon } = props;
	const containerValue = React.useRef(new Animated.Value(0)).current;
	const middleBarOpacity = React.useRef(new Animated.Value(0)).current;
	const buttomBar = React.useRef(new Animated.Value(0)).current;
	const topBar = React.useRef(new Animated.Value(0)).current;
	const buttomBarMargin = React.useRef(new Animated.Value(0)).current;
	const topBarMargin = React.useRef(new Animated.Value(0)).current;

	React.useEffect(() => {
		Animated.spring(containerValue, {
			toValue: activateIcon ? 1 : 0,
			duration: props.duration,
			useNativeDriver: true,
		}).start();
		Animated.spring(middleBarOpacity, {
			toValue: activateIcon ? 0 : 1,
			duration: props.duration,
			useNativeDriver: true,
		}).start();
		Animated.spring(topBar, {
			toValue: activateIcon ? 0.85 : 0,
			duration: props.duration,
			useNativeDriver: true,
		}).start();
		Animated.spring(buttomBar, {
			toValue: activateIcon ? 0.85 : 0,
			duration: props.duration,
			useNativeDriver: true,
		}).start();
		Animated.spring(topBarMargin, {
			toValue: activateIcon ? 10 : 0,
			duration: props.duration,
			useNativeDriver: true,
		}).start();
		Animated.spring(buttomBarMargin, {
			toValue: activateIcon ? -10 : 0,
			duration: props.duration,
			useNativeDriver: true,
		}).start();

	}, [
		containerValue,
		activateIcon,
		middleBarOpacity,
		topBar,
		buttomBar,
		topBarMargin,
		buttomBarMargin,
	]);

	return (
		<TouchableOpacity onPress={props.onPress}>
			<Animated.View
				style={{

					width: props.hamburgerWidth,
					justifyContent: "center",
					alignItems: "center",
					height: props.marginFromTop,
					transform: [
						{
							rotate: containerValue.interpolate({
								inputRange: [0, 1],
								outputRange: ["0deg", "360deg"],
							}),
						},
					],
				}}
			>
				<Animated.View
					style={{
						width: props.hamburgerWidth,
						justifyContent: "center",
						alignItems: "center",
						height: props.hamburgerLine,
                        marginLeft:activateIcon ?  10 : 0,
						backgroundColor: activateIcon ?  "white" :"white",
						transform: [
							{
								rotate: topBar.interpolate({
									inputRange: [0, 1],
									outputRange: ["0deg", "50deg"],
								}),
							},
							{ translateY: topBarMargin },
						],
					}}
				></Animated.View>
				<Animated.View
					style={{
						width: props.hamburgerWidth,
						justifyContent: "center",
						alignItems: "center",
						height: props.hamburgerLine,
						backgroundColor: "#0062ff",
						marginTop: props.burgerMargin,
						opacity: middleBarOpacity,
						transform: [
							{
								rotate: middleBarOpacity.interpolate({
									inputRange: [0, 0.5],
									outputRange: ["0deg", "360deg"],
								}),
							},
                            
						],
					}}
				></Animated.View>
				<Animated.View
					style={{
						width: props.hamburgerWidth,
						justifyContent: "center",
						alignItems: "center",
						height: props.hamburgerLine,
						marginTop: props.burgerMargin,
                        marginLeft:activateIcon ?  10 : 0,
						backgroundColor: activateIcon ?  "white" :"white",
						transform: [
							{
								rotate: buttomBar.interpolate({
									inputRange: [0, 1],
									outputRange: ["0deg", "-50deg"],
								}),
							},
							{ translateY: buttomBarMargin },
						],
					}}
				></Animated.View>
			</Animated.View>
		</TouchableOpacity>
	);
};

export default HamburgerIcon;
