import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { Image, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

const RegisterScreen = () => {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    function isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    const handleRegister = async () => {
        if (!isValidEmail(email)) {
            Toast.show({
                type: "error",
                text1: "Invalid Email."
            })
        }
        if (password.length < 8) {
            Toast.show({
                type: "error",
                text1: "Password must be atleast 8 characters."
            });
            return;
        }
        setLoading(true);
        try {
            const response = await fetch("http://localhost:1000/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username, email, password })
            });
            const data = await response.json();
            if (data.error === "Email already exists.") {
                Toast.show({
                    type: "error",
                    text1: "An account with this email already exists."
                });
                return;
            }
            if (data.error === "Username already exists.") {
                Toast.show({
                    type: "error",
                    text1: "Username already exists."
                });
                return;
            }

            if (data.success === true) {
                Toast.show({
                    type: 'success',
                    text1: "User Registered Successfully."
                });
                navigation.goBack();
            }
        } catch (error) {
            console.log(error);
            Toast.show({
                type: "error",
                text1: "An error occurred."
            });
        } finally {
            setLoading(false);
        }
    }

    return (
        <View style={[styles.container, { paddingTop: insets.top + 10, paddingBottom: insets.bottom + 10 }]}>
            <StatusBar hidden />
            <View style={styles.secondContainer}>
                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 15 }}>
                    <Text style={{ fontFamily: "Chewy-Regular", fontSize: 36, color: "#fff8f0" }}>Habit Rabbit</Text>
                    <Image source={require('../assets/logo.png')} style={{ width: 60, height: 60 }} />
                </View>
                <Text style={{ fontFamily: "Fredoka-Medium", fontSize: 28, color: "#fff8f0" }}>Register</Text>
                <View style={{ marginTop: 25, marginBottom: 10 }}>
                    <Text style={{ fontFamily: "Fredoka-Medium", color: "#fff8f0", marginLeft: 5, marginBottom: 7 }}>Username</Text>
                    <TextInput placeholder="Username..." placeholderTextColor={"#fff8f0ae"} style={{ padding: 10, borderWidth: 1, borderColor: "#fff8f0", borderRadius: 10, marginBottom: 15, fontFamily: "Fredoka-Regular", color: "#fff8f0", fontSize: 16 }} value={username} onChangeText={setUsername} />
                    <Text style={{ fontFamily: "Fredoka-Medium", color: "#fff8f0", marginLeft: 5, marginBottom: 7 }}>Email</Text>
                    <TextInput placeholder="example@example.com" placeholderTextColor={"#fff8f0ae"} style={{ padding: 10, borderWidth: 1, borderColor: "#fff8f0", borderRadius: 10, marginBottom: 15, fontFamily: "Fredoka-Regular", color: "#fff8f0", fontSize: 16 }} value={email} onChangeText={setEmail} />
                    <Text style={{ fontFamily: "Fredoka-Medium", color: "#fff8f0", marginLeft: 5, marginBottom: 7 }}>Password</Text>
                    <TextInput placeholder="Password..." placeholderTextColor={"#fff8f0ae"} style={{ padding: 10, borderWidth: 1, borderColor: "#fff8f0", borderRadius: 10, marginBottom: 15, fontFamily: "Fredoka-Regular", color: "#fff8f0", fontSize: 16 }} secureTextEntry={true} value={password} onChangeText={setPassword} />
                </View>
                <TouchableOpacity style={{ padding: 12, borderRadius: 12, backgroundColor: "#1c1815", alignItems: "center", opacity: loading ? 0.6 : 1 }} activeOpacity={0.6} onPress={handleRegister} disabled={loading}>
                    <Text style={{ fontFamily: "Fredoka-Medium", color: "#fff8f0", fontSize: 18 }}>Sign Up</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { navigation.goBack() }}>
                    <Text style={{ fontFamily: "Fredoka-Regular", color: "#fff8f0dd", marginTop: 15, textAlign: 'center' }}>Already have an account? <Text style={{ fontFamily: "Fredoka-Medium" }}>Login.</Text></Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#29211d",
    },
    secondContainer: {
        flex: 1,
        width: '85%',
        alignSelf: 'center',
        justifyContent: 'center',
    }
});

export default RegisterScreen;