import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, StatusBar } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import { BURL } from "@env";

const LeaderboardScreen = ({ navigation, route }) => {
    const { status } = route.params;

    const insets = useSafeAreaInsets();
    const [leaderboard, setLeaderboard] = useState([]);

    const getLeaderboard = async () => {
        try {
            const res = await fetch(`${BURL}/leaderboard`);
            const data = await res.json();
            if (data.success) {
                setLeaderboard(data.leaderboard);
            }
        } catch (err) {
            console.error("Error fetching leaderboard:", err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getLeaderboard();
    }, []);

    const renderItem = ({ item, index }) => (
        <View style={[styles.row, index < 3 && styles.topRow]} key={index}>
            <Text style={styles.rank}>
                {index + 1}{" "}
                {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : ""}
            </Text>
            <View style={styles.userBlock}>
                <Text style={styles.username}>{item.username}</Text>
                <Text style={styles.habit}>{item.habit}</Text>
            </View>
            <Text style={styles.streak}><SimpleLineIcons name="fire" color={"#ffbe73"} size={18} style={{ textShadowRadius: 4, textShadowColor: "#fff8f0" }} />  {item.streak}</Text>
        </View>
    );

    return (
        <View style={[styles.container, { paddingTop: insets.top + 10, paddingBottom: insets.bottom + 10 }]}>
            <StatusBar hidden />
            <Text style={styles.header}>🏆 Leaderboard</Text>
            {status === 'online' && (
                <Text style={[styles.habit, { textAlign: 'center', marginBottom: 20 }]}>{`To participate in the leaderboard,\nYou need to create an account and login.`}</Text>
            )}
            <FlatList
                data={leaderboard}
                keyExtractor={(item) => item._id}
                renderItem={renderItem}
                ListEmptyComponent={<Text style={styles.empty}>Loading leaderboard...</Text>}
                contentContainerStyle={{ paddingBottom: 20 }}
            />

            <TouchableOpacity style={[styles.button, { marginBottom: 10 }]} activeOpacity={0.6} onPress={() => navigation.goBack()}>
                <Text style={styles.buttonText}>Back</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#29211d",
        paddingHorizontal: 20,
    },
    header: {
        fontSize: 28,
        fontFamily: "Fredoka-SemiBold",
        textAlign: "center",
        marginBottom: 20,
        marginTop: 10,
        color: "#fff8f0",
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#1c1815",
        padding: 15,
        marginBottom: 10,
        borderRadius: 12,
    },
    topRow: {
        borderWidth: 2,
        borderColor: "#744a31",
    },
    rank: {
        fontSize: 18,
        fontFamily: "Fredoka-Medium",
        color: "#fff8f0",
        width: 60,
    },
    userBlock: {
        flex: 1,
    },
    username: {
        fontSize: 18,
        fontFamily: "Fredoka-SemiBold",
        color: "#fff8f0",
    },
    habit: {
        fontSize: 14,
        fontFamily: "Fredoka-Regular",
        color: "#fff8f0",
        opacity: 0.8,
        marginTop: 2,
    },
    streak: {
        fontSize: 18,
        fontFamily: "Fredoka-SemiBold",
        color: "#fff8f0",
        textAlign: "right",
        minWidth: 60,
    },
    empty: {
        textAlign: "center",
        marginTop: 20,
        fontFamily: "Fredoka-Regular",
        color: "#fff8f0",
        fontSize: 16,
    },
    button: {
        backgroundColor: "#1c1815",
        padding: 12,
        borderRadius: 12,
        alignItems: "center",
        marginTop: 10,
    },
    buttonText: {
        fontFamily: "Fredoka-Medium",
        color: "#fff8f0",
        fontSize: 16,
    },
});

export default LeaderboardScreen;
