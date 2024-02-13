import React, { useEffect, useRef } from 'react';
import { Text, Animated, Easing, StyleSheet, View } from 'react-native';
import { theme } from '../core/theme';
import { LinearGradient } from 'expo-linear-gradient';

export const styles = StyleSheet.create({
    bar: {
        alignSelf: 'center',
        borderColor: theme.colors.blue,
        borderRadius: 10,
        borderWidth: 1,
        height: 20,
        marginBottom: 20,
        width: '100%',
    },
    progress: {
        ...StyleSheet.absoluteFillObject,
        borderRadius: 10,
        justifyContent: 'center',
    },
    score: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
        textAlign: 'right',
        verticalAlign: 'middle',
        margin: 0,
        paddingRight: 5
    },
    });

export default function ProgressBar({ step, numberOfSteps }) {
    const prevStep = Math.min(0, step - 1);
    const { current: progress } = useRef(new Animated.Value(prevStep));

    const width = progress.interpolate({
        inputRange: [0, numberOfSteps],
        outputRange: ['0%', '100%'],
        extrapolate: 'clamp',
    });

    useEffect(() => {
        Animated.timing(progress, {
            easing: Easing.ease,
            duration: 800,
            toValue: step,
            useNativeDriver: false,
        }).start();
    }, [step]);

    return (
        <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            colors={theme.colors.brownGradient}
            style={[styles.bar, theme.shadow]}
        >
            <Animated.View style={[styles.progress, { width }, theme.shadow]}>
                <LinearGradient
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    colors={theme.colors.blueGradient}
                    style={StyleSheet.absoluteFillObject}
                />
                <Text style={styles.score}>{step}</Text>
            </Animated.View>
        </LinearGradient>
    );
}