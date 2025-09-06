import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { Image, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

const LoginScreen = () => {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();

    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [loading, setLoading] = useState();

    const handleLogin = async () => {
        if (!email || !password) {
            Toast.show({
                type: 'error',
                text1: "All fields are required."
            });
            return;
        }
        setLoading(true);
        try {
            const response = await fetch("http://192.168.18.85:1000/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();
            if (data.error) {
                if (data.error === "User not found.") {
                    Toast.show({
                        type: "error",
                        text1: "User not found."
                    });
                    return;
                }
                if (data.error === "Invalid Credentials.") {
                    Toast.show({
                        type: "error",
                        text1: "Invalid Credentials."
                    });
                    return;
                }
            }
            if (data.success === true) {
                await AsyncStorage.setItem("rabbit_username", data.user.username);
                await AsyncStorage.setItem("rabbit_userId", data.user.userId);
                Toast.show({
                    type: 'success',
                    text1: 'Login Successful.'
                });
                navigation.navigate("HomeScreen");
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
                <Text style={{ fontFamily: "Fredoka-Medium", fontSize: 28, color: "#fff8f0" }}>Login</Text>
                <View style={{ marginTop: 25, marginBottom: 10 }}>
                    <Text style={{ fontFamily: "Fredoka-Medium", color: "#fff8f0", marginLeft: 5, marginBottom: 7 }}>Email</Text>
                    <TextInput placeholder="example@example.com" placeholderTextColor={"#fff8f0ae"} style={{ padding: 10, borderWidth: 1, borderColor: "#fff8f0", borderRadius: 10, marginBottom: 15, fontFamily: "Fredoka-Regular", color: "#fff8f0", fontSize: 16 }} value={email} onChangeText={setEmail} />
                    <Text style={{ fontFamily: "Fredoka-Medium", color: "#fff8f0", marginLeft: 5, marginBottom: 7 }}>Password</Text>
                    <TextInput placeholder="Password..." placeholderTextColor={"#fff8f0ae"} style={{ padding: 10, borderWidth: 1, borderColor: "#fff8f0", borderRadius: 10, marginBottom: 15, fontFamily: "Fredoka-Regular", color: "#fff8f0", fontSize: 16 }} value={password} onChangeText={setPassword} secureTextEntry={true} />
                </View>
                <TouchableOpacity style={{ padding: 12, borderRadius: 12, backgroundColor: "#1c1815", alignItems: "center", opacity: loading ? 0.6 : 1 }} activeOpacity={0.6} onPress={handleLogin} disabled={loading}>
                    <Text style={{ fontFamily: "Fredoka-Medium", color: "#fff8f0", fontSize: 18 }}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { navigation.navigate("RegisterScreen") }}>
                    <Text style={{ fontFamily: "Fredoka-Regular", color: "#fff8f0dd", marginTop: 15, textAlign: 'center' }}>Don't have an account? <Text style={{ fontFamily: "Fredoka-Medium" }}>Sign Up.</Text></Text>
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

export default LoginScreen;