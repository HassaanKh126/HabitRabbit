import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect } from "react";
import { Image, StatusBar, StyleSheet, Text, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

const SplashScreen = () => {
    const navigation = useNavigation();

    const opacity = useSharedValue(0);
    const scale = useSharedValue(0.96);

    useEffect(() => {
        opacity.value = withTiming(1, { duration: 1500 });
        scale.value = withTiming(1, { duration: 1500 });
    }, [opacity, scale]);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            opacity: opacity.value,
            transform: [{ scale: scale.value }],
        };
    });

    const getToken = async () => {
        const username = await AsyncStorage.getItem("rabbit_username");
        setTimeout(() => {
            if (username) {
                navigation.replace("HomeScreen");
            } else {
                navigation.replace("WelcomeScreen");
            }
        }, 2500);
    }

    useEffect(() => {
        getToken();
    }, []);

    return (
        <View style={styles.container}>
            <StatusBar hidden />
            <Animated.View style={animatedStyle} >
                <Image source={require("../assets/heavyLogo.png")} style={{ height: 200, width: 200 }} />
                <Text style={{ fontFamily: "Chewy-Regular", fontSize: 38, color: "#efe6da", letterSpacing: 0.5, textAlign: 'center', textShadowRadius: 1, textShadowColor: "#766347", textShadowOffset: { width: 2, height: 2 }, marginTop: 10 }}>Habit Rabbit</Text>
            </Animated.View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#29211d"
    }
});

export default SplashScreen;