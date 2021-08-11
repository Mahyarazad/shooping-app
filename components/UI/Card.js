import React from 'react';
import { View, StyleSheet } from 'react-native';

const Card = props => {
    return (
        <View style={{...styles.screen, ...props.style}}>
            {props.children}
        </View>
    )
}

const styles= StyleSheet.create({
    screen:{
        backgroundColor: "white",
		borderRadius: 10,
		elevation: 5,
    }
    
})

export default Card