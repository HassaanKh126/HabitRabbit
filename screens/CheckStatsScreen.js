import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import CompletionHeatmap from "../components/Heatmap";

const CheckStatsScreen = () => {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();

    const [habits, setHabits] = useState([]);
    const [heatmapData, setHeatmapData] = useState([]);

    useEffect(() => {
        const loadLog = async () => {
            const log = await AsyncStorage.getItem("rabbit_daily_log");
            const parsed = log ? JSON.parse(log) : {};

            const data = Object.keys(parsed).map((date) => ({
                date,
                completed: parsed[date].completed,
                total: parsed[date].total,
            }));

            setHeatmapData(data);
        };
        loadLog();
    }, []);


    const getHabits = async () => {
        const gotHabits = await AsyncStorage.getItem("rabbit_habits");
        setHabits(JSON.parse(gotHabits));
    }

    useEffect(() => {
        getHabits();
    }, []);

    return (
        <View style={[styles.container, { paddingTop: insets.top + 10, paddingBottom: insets.bottom + 10 }]}>
            <StatusBar hidden />
            <ScrollView contentContainerStyle={styles.secondContainer}>
                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 15 }}>
                    <TouchableOpacity onPress={() => { navigation.goBack() }}>
                        <Ionicons name="arrow-back" color={"#fff8f0"} size={24} />
                    </TouchableOpacity>
                    <Text style={{ fontFamily: "Fredoka-Medium", fontSize: 28, color: "#fff8f0" }}>Stats</Text>
                </View>
                <View style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 20, justifyContent: 'center' }}>
                    <View style={{ padding: 15, backgroundColor: "#362b26", borderRadius: 15 }}>
                        <Text style={{ fontFamily: "Fredoka-Medium", fontSize: 20, color: "#fff8f0" }}>Current Highest Streak</Text>
                        <View style={{ padding: 20, backgroundColor: "#463934", borderRadius: 15, marginTop: 5, display: "flex", flexDirection: 'row', justifyContent: "center", alignItems: 'center', gap: 5 }}>
                            <Text style={{ fontFamily: "Fredoka-SemiBold", fontSize: 32, color: "#fff8f0" }}>{habits.length > 0 ? Math.max(...habits.map(habit => habit.streak || 0)) : 0}</Text>
                            <SimpleLineIcons name="fire" color={"#fff8f0"} size={24} style={{ textShadowRadius: 4, textShadowColor: "#fff8f0" }} />
                        </View>
                    </View>
                    <View style={{ padding: 15, backgroundColor: "#362b26", borderRadius: 15 }}>
                        <Text style={{ fontFamily: "Fredoka-Medium", fontSize: 20, color: "#fff8f0" }}>Current Habits</Text>
                        <View style={{ padding: 20, backgroundColor: "#463934", borderRadius: 15, marginTop: 5, display: "flex", flexDirection: 'row', justifyContent: "center", alignItems: 'center', gap: 5 }}>
                            <Text style={{ fontFamily: "Fredoka-SemiBold", fontSize: 32, color: "#fff8f0" }}>{habits.length}</Text>
                            <FontAwesome5 name="check" color={"#fff8f0"} size={24} />
                        </View>
                    </View>
                    <View style={{ padding: 15, backgroundColor: "#362b26", borderRadius: 15 }}>
                        <Text style={{ fontFamily: "Fredoka-Medium", fontSize: 20, color: "#fff8f0" }}>Completion Rate</Text>
                        <View style={{ padding: 20, backgroundColor: "#463934", borderRadius: 15, marginTop: 5, display: "flex", flexDirection: 'row', justifyContent: "center", alignItems: 'center', gap: 5 }}>
                            <Text style={{ fontFamily: "Fredoka-SemiBold", fontSize: 32, color: "#fff8f0" }}>{habits.length > 0 ? (habits.filter(habit => habit.completed === true).length / habits.length) * 100 : 0}</Text>
                            <FontAwesome5 name="percentage" color={"#fff8f0"} size={24} />
                        </View>
                    </View>
                    <View style={{ padding: 15, backgroundColor: "#362b26", borderRadius: 15, alignSelf: 'center', marginBottom: 20, width: '100%', alignItems: 'center' }}>
                        <Text style={{ fontFamily: "Fredoka-Medium", fontSize: 20, color: "#fff8f0", marginBottom: 5 }}>Habit Heatmap</Text>
                        {heatmapData && (
                            <CompletionHeatmap data={heatmapData} weeks={12} />
                        )}
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#29211d",
    },
    secondContainer: {
        flexGrow: 1,
        width: '85%',
        alignSelf: 'center',
    }
});

export default CheckStatsScreen;