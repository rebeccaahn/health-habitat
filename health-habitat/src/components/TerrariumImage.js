import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { theme } from '../core/theme';

export default function TerrariumImage({ state }) {
    const [imageURL, setImageURL] = useState(require('../assets/terrarium/terrarium_critical.png'));
    useEffect(() => {
        if (state == "Critical") {
            setImageURL(require('../assets/terrarium/terrarium_critical.png'));
        } else if (state == "Warning") {
            setImageURL(require('../assets/terrarium/terrarium_warning.png'));
        } else if (state == "Thriving") {
            setImageURL(require('../assets/terrarium/terrarium_thriving.png'));
        } else if (state == "Best") {
            setImageURL(require('../assets/terrarium/terrarium_best.png'));
        }
    }, [state]);

    return <View style={theme.shadow}><Image source={imageURL} style={styles.image} /></View>
}

const styles = StyleSheet.create({
    image: {
        width: 300,
        height: 300,
        margin: 35,
        borderRadius: 35,
    }
});