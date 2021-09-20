import React from 'react';
import {View, Text, TextInput, StyleSheet} from 'react-native';

const AddressScreen = props => {

    const [inputAddress, setInputAddress] = React.useState([])
    const handleDeleteImage = () => {
        return 
    }

    return (<View>
        <Text> Address List </Text>
        <TextInput onChangeText={handleTextChange}/>
    </View>)
}

export default AddressScreen
