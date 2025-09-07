import AsyncStorage from "@react-native-async-storage/async-storage";
import { CommonActions, useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { KeyboardAvoidingView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const WelcomeScreen = () => {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();

    const [username, setUsername] = useState('');

    const handleSubmit = async () => {
        await AsyncStorage.setItem("rabbit_username", username);
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [
                    { name: 'HomeScreen' },
                ],
            })
        );
    }

    return (
        <KeyboardAvoidingView behavior="height" style={[styles.container, { paddingTop: insets.top + 10, paddingBottom: insets.bottom + 10 }]}>
            <StatusBar hidden />
            <View style={styles.secondContainer}>
                <Text style={{ fontFamily: "Chewy-Regular", color: "#fff8f0", fontSize: 42, textAlign: 'center', textShadowRadius: 5, textShadowColor: "#806453", textShadowOffset: { height: 2, width: 2 } }}>Habit Rabbit</Text>
                <View style={{ marginTop: 10, width: "80%", alignSelf: 'center' }}>
                    <Text style={{ fontFamily: "Fredoka-Medium", color: "#fff8f0", marginLeft: 5, marginBottom: 5 }}>Username:</Text>
                    <TextInput placeholder="Username..." placeholderTextColor={"#fff8f060"} style={{ borderWidth: 2, borderColor: "#fff8f0", color: "#fff8f0", fontFamily: "Fredoka-Regular", fontSize: 15, padding: 10, borderRadius: 10 }} value={username} onChangeText={setUsername} />
                    <TouchableOpacity style={{ backgroundColor: "#1c1815", marginVertical: 10, padding: 10, borderRadius: 10, alignItems: 'center' }} onPress={handleSubmit}>
                        <Text style={{ fontFamily: "Fredoka-Medium", fontSize: 15, color: "#fff8f0" }}>Submit</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#29211d"
    },
    secondContainer: {
        flex: 1,
        width: '85%',
        alignSelf: 'center',
        justifyContent: 'center'
    }
});

export default WelcomeScreen;