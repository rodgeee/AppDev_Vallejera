import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function CustomButton({ label, mainStyle, textStyle, route, onPress }) {
    const navigation = useNavigation();

    const handlePress = () => {
        if (onPress) {
            onPress();
        } else if (route) {
            navigation.navigate(route);
        }
    };

    return (
        <TouchableOpacity
        style={mainStyle}
        onPress={handlePress}
        >
        <Text style={textStyle}>{label}</Text>
        </TouchableOpacity>
    );
}