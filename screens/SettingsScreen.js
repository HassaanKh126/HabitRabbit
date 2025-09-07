import AsyncStorage from "@react-native-async-storage/async-storage";
import { CommonActions, useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import Ionicons from 'react-native-vector-icons/Ionicons';

const SettingsScreen = () => {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();

    const [username, setUsername] = useState("");

    useEffect(() => {
        const handleName = async () => {
            const gotName = await AsyncStorage.getItem('rabbit_username');
            setUsername(gotName);
        }

        handleName()
    }, [])

    const handleDeleteAllData = async () => {
        await AsyncStorage.removeItem("rabbit_username");
        await AsyncStorage.removeItem("rabbit_habits");
        await AsyncStorage.removeItem("rabbit_daily_log");
        await AsyncStorage.removeItem("rabbit_carrots");
        await AsyncStorage.removeItem("rabbit_avatar");
        setTimeout(() => {
            Toast.show({
                type: 'success',
                text1: 'Data Deleted Successfully.'
            });

            navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [
                        { name: 'WelcomeScreen' },
                    ],
                })
            );
        }, 1000);
    }

    const handleSaveUsername = async () => {
        if (username.trim() === "") {
            Toast.show({
                type: 'error',
                text1: 'Username is empty.'
            });
            return;
        }
        await AsyncStorage.setItem("rabbit_username", username);
        Toast.show({
            type: 'success',
            text1: 'Username Changed Successfully.'
        });
        navigation.goBack();
    }

    return (
        <View style={[styles.container, { paddingTop: insets.top + 10, paddingBottom: insets.bottom + 10 }]}>
            <StatusBar hidden />
            <View style={styles.secondContainer}>
                <View style={{ position: 'absolute', top: 0, display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <TouchableOpacity onPress={() => { navigation.goBack() }}>
                        <Ionicons name="arrow-back" color={"#fff8f0"} size={24} />
                    </TouchableOpacity>
                    <Text style={{ color: "#fff8f0", fontFamily: "Fredoka-Medium", fontSize: 24 }}>Settings</Text>
                </View>
                <View>
                    <Text style={{ fontFamily: "Fredoka-Medium", marginBottom: 10, marginLeft: 5, color: "#fff8f0" }}>Edit Username:</Text>
                    <TextInput placeholder="Edit Username..." placeholderTextColor={"#fff8f060"} style={{ borderWidth: 2, borderColor: "#fff8f0", color: "#fff8f0", fontFamily: "Fredoka-Regular", fontSize: 15, padding: 10, borderRadius: 10 }} value={username} onChangeText={setUsername} />
                    <TouchableOpacity style={{ backgroundColor: "#1c1815", paddingVertical: 10, paddingHorizontal: 15, borderRadius: 10, alignItems: 'center', marginTop: 15 }} onPress={handleSaveUsername}>
                        <Text style={{ color: "#fff8f0", fontFamily: "Fredoka-Medium", fontSize: 16 }}>Save</Text>
                    </TouchableOpacity>
                    <View style={{ borderBottomWidth: 1, borderBottomColor: "#fff8f030", marginVertical: 20, width: '50%', alignSelf: 'center' }}></View>
                    <TouchableOpacity style={{ backgroundColor: "#1c1815", paddingVertical: 10, paddingHorizontal: 15, borderRadius: 10, alignItems: 'center' }} onPress={handleDeleteAllData}>
                        <Text style={{ color: "#fff8f0", fontFamily: "Fredoka-Medium", fontSize: 16 }}>Delete All Data</Text>
                    </TouchableOpacity>
                </View>
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
        justifyContent: 'center'
    }
})

export default SettingsScreen;