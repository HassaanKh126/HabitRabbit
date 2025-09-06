import React, { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";

const HomeScreen = () => {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();

    const [username, setUsername] = useState("");
    const [habits, setHabits] = useState([]);

    const getToken = async () => {
        const got_username = await AsyncStorage.getItem("rabbit_username");
        setUsername(got_username);
    }

    useEffect(() => {
        getToken();
    }, [])

    const getHabits = async () => {
        const gotHabits = await AsyncStorage.getItem('rabbit_habits');
        let parsedHabits = JSON.parse(gotHabits) || [];

        const today = new Date().toDateString();

        parsedHabits = parsedHabits.map((habit) => {
            const lastDate = habit.lastCompleted
                ? new Date(habit.lastCompleted).toDateString()
                : null;

            if (habit.completed && lastDate !== today) {
                return { ...habit, completed: false };
            }

            if (lastDate && lastDate !== today) {
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);

                if (lastDate !== yesterday.toDateString()) {
                    return { ...habit, completed: false, streak: 0 };
                }
            }

            return habit;
        });

        setHabits(parsedHabits);
    };

    useFocusEffect(
        useCallback(() => {
            getHabits();
        }, [])
    );

    const handleToggleHabit = (index) => {
        setHabits((prevHabits) =>
            prevHabits.map((habit, i) => {
                if (i !== index) return habit;

                const today = new Date().toDateString();
                let newStreak = habit.streak;

                if (!habit.completed) {
                    if (habit.lastCompleted) {
                        const lastDate = new Date(habit.lastCompleted).toDateString();

                        if (lastDate === today) {
                            newStreak = habit.streak;
                        } else {
                            const yesterday = new Date();
                            yesterday.setDate(yesterday.getDate() - 1);

                            if (lastDate === yesterday.toDateString()) {
                                newStreak = habit.streak + 1;
                            } else {
                                newStreak = 1;
                            }
                        }
                    } else {
                        newStreak = 1;
                    }
                }

                return {
                    ...habit,
                    completed: !habit.completed,
                    streak: newStreak,
                    lastCompleted: !habit.completed ? new Date().toISOString() : habit.lastCompleted
                };
            })
        );
    }

    useEffect(() => {
        const handleHabits = async () => {
            await AsyncStorage.setItem("rabbit_habits", JSON.stringify(habits));
        }

        handleHabits()
    }, [habits])

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
                <View style={{ maxHeight: 300 }}>
                    <ScrollView contentContainerStyle={{ backgroundColor: "#302722", display: 'flex', flexDirection: 'column', gap: 5, padding: 15 }} style={{ borderRadius: 15 }} showsVerticalScrollIndicator={false}>
                        {habits.length > 0 ? habits.map((habit, index) => {
                            return (
                                <View key={index} style={{ backgroundColor: "#3f342d", padding: 12, borderRadius: 10, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                        <View style={{ paddingHorizontal: 10, paddingVertical: 8, display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: "#544740", borderRadius: 10 }}>
                                            <SimpleLineIcons name="fire" color={"#fff8f0"} size={16} style={{ textShadowRadius: 4, textShadowColor: "#fff8f0" }} />
                                            <Text style={{ color: "#fff8f0", fontFamily: "Fredoka-Medium", fontSize: 16 }}>{habit.streak}</Text>
                                        </View>
                                        <Text style={{ color: "#fff8f0", fontFamily: "Fredoka-Medium", fontSize: 16 }}>{habit.habit}</Text>
                                    </View>
                                    <TouchableOpacity onPress={() => { handleToggleHabit(index) }}>
                                        {habit.completed ? (
                                            <MaterialIcons name="check-box" color={"#fff8f0"} size={18} />
                                        ) : (
                                            <MaterialIcons name="check-box-outline-blank" color={"#fff8f0"} size={18} />
                                        )}
                                    </TouchableOpacity>
                                    {/* <View style={{ backgroundColor: "#fff8f0", borderRadius: 1 }}>
                                        <MaterialIcons name="check-box-outline-blank" color={"#fff8f0"} size={13} />
                                    </View> */}
                                </View>
                            )
                        }) : (
                            <Text style={{ color: "#fff8f0", fontFamily: "Fredoka-Medium", fontSize: 16 }}>No habits added yet.</Text>
                        )}
                    </ScrollView>
                </View>
                <TouchableOpacity style={{ backgroundColor: "#1c1815", padding: 12, borderRadius: 12, alignItems: "center", marginBottom: 10, marginTop: 20 }} activeOpacity={0.6} onPress={() => { navigation.navigate("MyHabitsScreen") }}>
                    <Text style={{ fontFamily: "Fredoka-Medium", color: "#fff8f0", fontSize: 15 }}>My Habits</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ backgroundColor: "#1c1815", padding: 12, borderRadius: 12, alignItems: "center", marginBottom: 10 }} activeOpacity={0.6} onPress={() => { navigation.navigate("CheckStatsScreen") }}>
                    <Text style={{ fontFamily: "Fredoka-Medium", color: "#fff8f0", fontSize: 15 }}>Stats</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ backgroundColor: "#1c1815", padding: 12, borderRadius: 12, alignItems: "center", marginBottom: 10 }} activeOpacity={0.6} onPress={() => { console.log(habits) }}>
                    <Text style={{ fontFamily: "Fredoka-Medium", color: "#fff8f0", fontSize: 15 }}>LOG HABITS</Text>
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