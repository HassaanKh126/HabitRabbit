import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const HomeScreen = () => {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();

    const [username, setUsername] = useState();

    const getToken = async () => {
        const got_username = await AsyncStorage.getItem("rabbit_username");
        setUsername(got_username);
    }

    useEffect(() => {
        getToken();
    }, [])

    return (
        <View style={[styles.container, { paddingTop: insets.top + 10, paddingBottom: insets.bottom + 10 }]}>
            <StatusBar hidden />
            <View style={styles.secondContainer}>
                {username && (
                    <View style={{ marginBottom: 20 }}>
                        <Text style={{ fontSize: 28, color: "#fff8f0", textAlign: "center", fontFamily: "Fredoka-Medium", letterSpacing: 0.5 }}>Hi, <Text style={{ fontFamily: "Fredoka-SemiBold" }}>{username}</Text>.</Text>
                        <Text style={{ fontSize: 12, color: "#fff8f0", textAlign: 'center', fontFamily: "Fredoka-Regular" }}>"Consistency is the key to success"</Text>
                    </View>
                )}
                <TouchableOpacity style={{ backgroundColor: "#1c1815", padding: 12, borderRadius: 12, alignItems: "center", marginBottom: 10 }} activeOpacity={0.6} onPress={() => { navigation.navigate("MyHabitsScreen") }}>
                    <Text style={{ fontFamily: "Fredoka-Medium", color: "#fff8f0", fontSize: 15 }}>My Habits</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ backgroundColor: "#1c1815", padding: 12, borderRadius: 12, alignItems: "center", marginBottom: 10 }} activeOpacity={0.6}>
                    <Text style={{ fontFamily: "Fredoka-Medium", color: "#fff8f0", fontSize: 15 }}>Stats</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#29211d"
    },
    secondContainer: {
        width: "85%",
        flex: 1,
        alignSelf: 'center',
        justifyContent: 'center'
    }
});

export default HomeScreen;