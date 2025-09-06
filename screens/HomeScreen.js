import React, { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Image, Pressable, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";

const HomeScreen = () => {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();

    const [username, setUsername] = useState("");
    const [habits, setHabits] = useState([]);
    const [carrots, setCarrots] = useState(0);


    const getToken = async () => {
        const got_username = await AsyncStorage.getItem("rabbit_username");
        setUsername(got_username);
    }

    useEffect(() => {
        getToken();
    }, []);

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
                let carrotReward = 0;

                if (!habit.completed) {
                    carrotReward = 2;

                    if (habit.lastCompleted) {
                        const lastDate = new Date(habit.lastCompleted).toDateString();

                        if (lastDate === today) {
                            newStreak = habit.streak;
                        } else {
                            const yesterday = new Date();
                            yesterday.setDate(yesterday.getDate() - 1);

                            if (lastDate === yesterday.toDateString()) {
                                newStreak = habit.streak + 1;
                                carrotReward += 2;
                            } else {
                                newStreak = 1;
                            }
                        }
                    } else {
                        newStreak = 1;
                    }
                    updateCarrots(carrotReward);
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

        handleHabits();
    }, [habits]);


    const updateDailyLog = async (habits) => {
        const today = new Date().toISOString().split("T")[0];
        const completed = habits.filter(h => h.completed).length;
        const total = habits.length;

        let log = await AsyncStorage.getItem("rabbit_daily_log");
        log = log ? JSON.parse(log) : {};

        log[today] = { completed, total };

        await AsyncStorage.setItem("rabbit_daily_log", JSON.stringify(log));
    };

    useEffect(() => {
        if (habits.length > 0) {
            updateDailyLog(habits);
        }
    }, [habits]);

    // useEffect(() => {
    //     const loadCarrots = async () => {
    //         const stored = await AsyncStorage.getItem("rabbit_carrots");
    //         setCarrots(stored ? parseInt(stored, 10) : 0);
    //     };
    //     loadCarrots();
    // }, []);

    useFocusEffect(
        useCallback(() => {
            const loadCarrots = async () => {
                const stored = await AsyncStorage.getItem("rabbit_carrots");
                setCarrots(stored ? parseInt(stored, 10) : 0);
            };

            loadCarrots();
        }, [])
    );

    const updateCarrots = async (amount) => {
        setCarrots((prev) => {
            const newTotal = prev + amount;
            AsyncStorage.setItem("rabbit_carrots", newTotal.toString());
            return newTotal;
        });
    };


    return (
        <View style={[styles.container, { paddingTop: insets.top + 10, paddingBottom: insets.bottom + 10 }]}>
            <StatusBar hidden />
            <View style={styles.secondContainer}>
                <TouchableOpacity onPress={() => { navigation.navigate("RabbitShopScreen", { carrots }) }} style={{ position: 'absolute', top: 0, right: 0, display: 'flex', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, backgroundColor: '#3f342d' }}>
                    <Image source={require('../assets/carrot.png')} style={{ height: 18, width: 18 }} />
                    <Text style={{ fontFamily: "Fredoka-SemiBold", color: "#fff8f0", fontSize: 16, marginRight: 5, marginLeft: 5 }}>{carrots}</Text>
                </TouchableOpacity>
                <Pressable onPress={() => { navigation.navigate("RabbitShopScreen", { carrots }) }}>
                    <Image source={require('../assets/rabbit_elder.png')} style={{ height: 150, width: 150, alignSelf: 'center', marginBottom: 20 }} />
                </Pressable>
                {username && (
                    <View style={{ marginBottom: 20 }}>
                        <Text style={{ fontSize: 28, color: "#fff8f0", textAlign: "center", fontFamily: "Fredoka-Medium", letterSpacing: 0.5 }}>Hi, <Text style={{ fontFamily: "Fredoka-SemiBold" }}>{username}</Text>.</Text>
                        <Text style={{ fontSize: 12, color: "#fff8f0", textAlign: 'center', fontFamily: "Fredoka-Regular" }}>"Consistency is the key to success"</Text>
                    </View>
                )}
                <View style={{ maxHeight: 250 }}>
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
                                    <TouchableOpacity onPress={() => { handleToggleHabit(index) }} disabled={habit.completed}>
                                        {habit.completed ? (
                                            <MaterialIcons name="check-box" color={"#fff8f0"} size={18} />
                                        ) : (
                                            <MaterialIcons name="check-box-outline-blank" color={"#fff8f0"} size={18} />
                                        )}
                                    </TouchableOpacity>
                                </View>
                            )
                        }) : (
                            <Text style={{ color: "#fff8f0", fontFamily: "Fredoka-Medium", fontSize: 16 }}>No habits added yet.</Text>
                        )}
                    </ScrollView>
                </View>
                <TouchableOpacity style={{ backgroundColor: "#1c1815", padding: 12, borderRadius: 12, alignItems: "center", marginBottom: 7, marginTop: 20 }} activeOpacity={0.6} onPress={() => { navigation.navigate("MyHabitsScreen") }}>
                    <Text style={{ fontFamily: "Fredoka-Medium", color: "#fff8f0", fontSize: 15 }}>My Habits</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ backgroundColor: "#1c1815", padding: 12, borderRadius: 12, alignItems: "center", marginBottom: 7 }} activeOpacity={0.6} onPress={() => { navigation.navigate("CheckStatsScreen") }}>
                    <Text style={{ fontFamily: "Fredoka-Medium", color: "#fff8f0", fontSize: 15 }}>Stats</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ backgroundColor: "#1c1815", padding: 12, borderRadius: 12, alignItems: "center", marginBottom: 10 }} activeOpacity={0.6} onPress={() => { navigation.navigate("RabbitShopScreen", { carrots }) }}>
                    <Text style={{ fontFamily: "Fredoka-Medium", color: "#fff8f0", fontSize: 15 }}>Shop</Text>
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