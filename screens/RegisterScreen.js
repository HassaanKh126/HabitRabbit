import React, { useState } from "react";
import { CommonActions, useNavigation } from "@react-navigation/native";
import { KeyboardAvoidingView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

const RegisterScreen = () => {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [loading, setLoading] = useState(false);

    const handleSignup = async () => {
        if (!username || !email || !password) {
            Toast.show({
                type: 'error',
                text1: 'All fields are required.'
            });
            return;
        }
        setLoading(true);
        try {
            const response = await fetch(`${BURL}/api/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username, email, password })
            });
            const data = await response.json();
            if (data.error === "Email already exists.") {
                Toast.show({
                    type: 'error',
                    text1: 'An account with this email already exists..'
                });
                return;
            }
            if (data.error === "Username already exists.") {
                Toast.show({
                    type: 'error',
                    text1: 'Username already exists.'
                });
                return;
            }
            if (data.success === true) {
                Toast.show({
                    type: 'success',
                    text1: 'Login Successful.'
                });
                navigation.goBack();
                return;
            }
        } catch (error) {
            console.log(error);
            Toast.show({
                type: 'error',
                text1: 'An error occurred. Please try again.'
            });
        } finally {
            setLoading(false);
        }
    }

    return (
        <KeyboardAvoidingView behavior="height" style={[styles.container, { paddingTop: insets.top + 10, paddingBottom: insets.bottom + 10 }]}>
            <StatusBar hidden />
            <View style={styles.secondContainer}>
                <Text style={{ fontFamily: "Chewy-Regular", color: "#fff8f0", fontSize: 42, textShadowRadius: 5, textShadowColor: "#806453", textShadowOffset: { height: 2, width: 2 } }}>Habit Rabbit</Text>
                <Text style={{ fontFamily: "Fredoka-Medium", color: "#fff8f0", fontSize: 28, marginBottom: 15, marginTop: 5 }}>Sign Up</Text>

                <Text style={{ fontFamily: "Fredoka-Medium", color: "#fff8f0", fontSize: 15, marginLeft: 5, marginBottom: 5 }}>Username:</Text>
                <TextInput placeholder="Username..." placeholderTextColor={"#fff8f060"} style={{ borderWidth: 2, borderColor: "#fff8f0", color: "#fff8f0", fontFamily: "Fredoka-Regular", fontSize: 15, padding: 10, borderRadius: 10 }} value={username} onChangeText={setUsername} />

                <Text style={{ fontFamily: "Fredoka-Medium", color: "#fff8f0", fontSize: 15, marginLeft: 5, marginBottom: 5, marginTop: 10 }}>Email:</Text>
                <TextInput placeholder="example@example.com" placeholderTextColor={"#fff8f060"} style={{ borderWidth: 2, borderColor: "#fff8f0", color: "#fff8f0", fontFamily: "Fredoka-Regular", fontSize: 15, padding: 10, borderRadius: 10 }} value={email} onChangeText={setEmail} />
                <Text style={{ fontFamily: "Fredoka-Medium", color: "#fff8f0", fontSize: 15, marginLeft: 5, marginBottom: 5, marginTop: 10 }}>Password:</Text>
                <TextInput placeholder="Password..." placeholderTextColor={"#fff8f060"} secureTextEntry style={{ borderWidth: 2, borderColor: "#fff8f0", color: "#fff8f0", fontFamily: "Fredoka-Regular", fontSize: 15, padding: 10, borderRadius: 10 }} value={password} onChangeText={setPassword} />
                <TouchableOpacity style={{ backgroundColor: "#1c1815", marginTop: 15, marginBottom: 10, padding: 10, borderRadius: 10, alignItems: 'center', opacity: loading ? 0.7 : 1 }} activeOpacity={0.7} onPress={handleSignup}>
                    <Text style={{ fontFamily: "Fredoka-Medium", fontSize: 15, color: "#fff8f0" }}>Sign Up</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { navigation.goBack() }}>
                    <Text style={{ fontFamily: "Fredoka-Regular", fontSize: 14, color: "#fff8f0", textAlign: 'center' }}>Already have an account? <Text style={{ fontFamily: "Fredoka-Medium" }}>Login.</Text></Text>
                </TouchableOpacity>
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

export default RegisterScreen;