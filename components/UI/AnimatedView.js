import React from "react";
import { View, Animated } from "react-native";

const AnimatedView = (props) => {
	const slideFromButton = React.useRef(new Animated.Value(-10)).current;
	React.useEffect(() => {
		Animated.timing(slideFromButton, {
			toValue: 3,
			duration: props.duration,
			useNativeDriver: true,
		}).start();
	}, [slideFromButton]);

	return (
		<Animated.View
			style={{
				...props.style,
				transform: [{ translateY: slideFromButton }],

			}}
		>
			{props.children}
		</Animated.View>
	);
};

export default AnimatedView;
