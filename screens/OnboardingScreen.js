import React from "react";
import { useNavigation } from "@react-navigation/native";
import { StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const OnboardingScreen = () => {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();

    return (
        <View style={[styles.container, { paddingTop: insets.top + 10, paddingBottom: insets.bottom + 10 }]}>
            <StatusBar hidden />
            <View style={styles.secondContainer}>
                <Text style={{ fontFamily: "Chewy-Regular", color: "#fff8f0", fontSize: 42, textAlign: 'center', textShadowRadius: 5, textShadowColor: "#806453", textShadowOffset: { height: 2, width: 2 }, marginBottom: 10 }}>Habit Rabbit</Text>
                <TouchableOpacity style={{ backgroundColor: "#1c1815", padding: 12, borderRadius: 12, alignItems: 'center', marginVertical: 5 }} activeOpacity={0.7} onPress={() => { navigation.navigate("LoginScreen") }}>
                    <Text style={{ fontFamily: "Fredoka-Medium", color: "#fff8f0", fontSize: 18 }}>Login</Text>
                </TouchableOpacity>
                <View style={{ borderBottomWidth: 0.5, marginVertical: 10, width: "80%", alignSelf: "center", borderBottomColor: "#fff8f0" }}></View>
                <TouchableOpacity style={{ backgroundColor: "#1c1815", padding: 12, borderRadius: 12, alignItems: 'center', marginTop: 5, marginBottom: 20 }} activeOpacity={0.7} onPress={() => { navigation.navigate("WelcomeScreen") }}>
                    <Text style={{ fontFamily: "Fredoka-Medium", color: "#fff8f0", fontSize: 18 }}>Continue as Guest</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: "#29211d"
    },
    secondContainer: {
        flex: 1,
        width: "85%",
        alignSelf: 'center',
        justifyContent: "center"
    }
});

export default OnboardingScreen;