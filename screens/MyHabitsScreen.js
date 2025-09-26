import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Modal, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import Ionicons from "react-native-vector-icons/Ionicons";
import Feather from "react-native-vector-icons/Feather";
import FontAwesome from "react-native-vector-icons/FontAwesome";

const MyHabitsScreen = ({ route }) => {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();

    const { username } = route.params;

    const [habitText, setHabitText] = useState("");
    const [habits, setHabits] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [textToEdit, setTextToEdit] = useState("");
    const [activeEditIndex, setActiveEditIndex] = useState("");
    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(false);
    const [editLoading, setEditLoading] = useState(false);

    const [toDeleteIndex, setToDeleteIndex] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const handleHabitSubmit = async () => {
        if (habitText.trim() === "") {
            Toast.show({
                type: 'error',
                text1: 'Habit should not be empty.'
            });
            return;
        }
        if (status === 'offline') {
            setHabits(prev => [...prev, { habit: habitText, completed: false, streak: 0, lastCompleted: null }]);
            setHabitText('');
            Toast.show({
                type: 'success',
                text1: 'Habit added successfully.'
            });
        }
        if (status === 'online') {
            setLoading(true)
            try {
                const response = await fetch(`${BURL}/api/add-habit`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ username, habit: habitText, completed: false, streak: 0, lastCompleted: null })
                });
                const data = await response.json();
                if (data.success === true) {
                    setHabits(prev => [...prev, data.habit]);
                    setHabitText('');
                    Toast.show({
                        type: 'success',
                        text1: 'Habit added successfully.'
                    });
                }
            } catch (error) {
                console.log(error);
                Toast.show({
                    type: 'error',
                    text1: 'An error occurred.'
                });
            } finally {
                setLoading(false);
            }
        }
    }

    const getHabits = async () => {
        const got_habits = await AsyncStorage.getItem("rabbit_habits");
        if (got_habits) {
            setHabits(JSON.parse(got_habits));
        } else {
            setHabits([]);
        }
    }

    const getStatus = async () => {
        const token = await AsyncStorage.getItem("rabbit_token");
        if (token) {
            setStatus("online");
        } else {
            setStatus("offline");
        }
    }

    useEffect(() => {
        getStatus();
        getHabits();
    }, []);

    useEffect(() => {
        const handleChangeHabits = async () => {
            await AsyncStorage.setItem("rabbit_habits", JSON.stringify(habits));
        }

        handleChangeHabits();
    }, [habits]);

    const handleRemoveHabit = async (index) => {
        if (status === 'offline') {
            setHabits(prev => prev.filter((_, i) => i !== index));
        }
        if (status === 'online') {
            setDeleteLoading(true);
            setToDeleteIndex(index);
            try {
                const response = await fetch(`${BURL}/api/delete-habit`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ habitId: habits[index]._id })
                });
                const data = await response.json();
                if (data.success === true) {
                    setHabits(prev => prev.filter((_, i) => i !== index));
                    Toast.show({
                        type: 'success',
                        text1: "Habit Deleted."
                    })
                }
            } catch (error) {
                console.log(error);
                Toast.show({
                    type: 'error',
                    text1: 'An error occurred.'
                });
            } finally {
                setToDeleteIndex(null);
                setDeleteLoading(false);
            }
        }
    }

    const handleEditOpen = (index) => {
        setTextToEdit(habits[index].habit);
        setActiveEditIndex(index);
        setModalVisible(true);
    }

    const handleEditHabit = async () => {
        if (status === 'offline') {
            setHabits((prev) => prev.map((item, index) => index === activeEditIndex ? { ...item, habit: textToEdit } : item));
        }
        if (status === 'online') {
            setEditLoading(true)
            try {
                const response = await fetch(`${BURL}/api/edit-habit`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ habitId: habits[activeEditIndex]._id, newHabitText: textToEdit })
                });
                const data = await response.json();
                if (data.success === true) {
                    setHabits((prev) => prev.map((item, index) => index === activeEditIndex ? { ...item, habit: textToEdit } : item));
                }

            } catch (error) {
                console.log(error);
                Toast.show({
                    type: 'error',
                    text1: 'An error occurred.'
                });
            } finally {
                setEditLoading(false);
            }
        }
        setModalVisible(false);
    }

    return (
        <View style={[styles.container, { paddingTop: insets.top + 10, paddingBottom: insets.bottom + 10 }]}>
            <StatusBar hidden />
            <View style={styles.secondContainer}>
                <View style={{ display: 'flex', flexDirection: "row", alignItems: 'center', gap: 10 }}>
                    <TouchableOpacity activeOpacity={0.6} onPress={() => { navigation.goBack() }}>
                        <Ionicons name="arrow-back" color={"#fff8f0"} size={28} />
                    </TouchableOpacity>
                    <Text style={{ fontFamily: "Fredoka-Medium", color: "#fff8f0", fontSize: 28 }}>My Habits</Text>
                </View>
                <View style={{ marginTop: 20 }}>
                    <TextInput placeholder="Add Habit..." placeholderTextColor={"#fff8f08a"} style={{ color: "#fff8f0", backgroundColor: "#29211d", padding: 10, borderWidth: 1, borderColor: "#fff8f0", borderRadius: 10, fontFamily: "Fredoka-Regular" }} value={habitText} onChangeText={setHabitText} />
                    <TouchableOpacity style={{ backgroundColor: "#1c1815", padding: 12, borderRadius: 12, marginVertical: 10, alignItems: 'center', opacity: loading ? 0.7 : 1 }} activeOpacity={0.7} disabled={loading} onPress={handleHabitSubmit}>
                        <Text style={{ fontFamily: "Fredoka-Medium", color: "#fff8f0", fontSize: 15 }}>Add Habit</Text>
                    </TouchableOpacity>
                    <View style={{ height: "85%", marginTop: 10 }}>
                        <ScrollView contentContainerStyle={{ backgroundColor: "#302722", padding: 15, borderRadius: 15, display: 'flex', flexDirection: 'column', gap: 10 }} showsVerticalScrollIndicator={false}>
                            {habits && habits.length > 0 ? (
                                habits.map((habit, index) => {
                                    return (
                                        <View key={index} style={{ backgroundColor: "#3f342d", padding: 12, borderRadius: 10, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <Text style={{ color: "#fff8f0", fontFamily: "Fredoka-Medium", fontSize: 16 }}>{habit.habit}</Text>
                                            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 15 }}>
                                                <TouchableOpacity onPress={() => handleEditOpen(index)}>
                                                    <Feather name="edit-3" color={"#fff8f0"} size={20} />
                                                </TouchableOpacity>
                                                <TouchableOpacity onPress={() => { handleRemoveHabit(index) }} disabled={deleteLoading && index === toDeleteIndex} style={{ opacity: (deleteLoading && index === toDeleteIndex) ? 0.4 : 1 }}>
                                                    <Feather name="x-circle" color={"#fff8f0"} size={20} />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    );
                                })
                            ) : (
                                <View>
                                    <Text style={{ color: "#fff8f0", fontFamily: "Fredoka-Medium", fontSize: 16 }}>You got no habits.</Text>
                                </View>
                            )}
                        </ScrollView>
                    </View>
                </View>
            </View>
            <Modal visible={modalVisible} transparent={true} statusBarTranslucent={true} animationType="fade">
                <View style={{ flex: 1, backgroundColor: "#0000009b", alignItems: 'center', justifyContent: 'center' }}>
                    <View style={{ backgroundColor: '#29211d', padding: 20, borderRadius: 15, width: '80%' }}>
                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 5, marginBottom: 10 }}>
                            <Text style={{ fontFamily: "Fredoka-SemiBold", fontSize: 20, color: "#fff8f0" }}>Edit Habit:</Text>
                            <TouchableOpacity onPress={() => { setModalVisible(false) }}>
                                <FontAwesome name="close" color={"#fff8f0"} size={20} />
                            </TouchableOpacity>
                        </View>
                        <TextInput placeholder="Edit Habit..." placeholderTextColor={"#fff8f08a"} style={{ color: "#fff8f0", backgroundColor: "#29211d", padding: 10, borderWidth: 1, borderColor: "#fff8f0", borderRadius: 10, fontFamily: "Fredoka-Regular" }} value={textToEdit} onChangeText={setTextToEdit} />
                        <TouchableOpacity style={{ backgroundColor: "#1c1815", padding: 12, borderRadius: 12, marginTop: 10, alignItems: 'center', opacity: editLoading ? 0.7 : 1 }} activeOpacity={0.7} disabled={editLoading} onPress={handleEditHabit}>
                            <Text style={{ fontFamily: "Fredoka-Medium", color: "#fff8f0", fontSize: 15 }}>Edit Habit</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
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
        width: "85%",
        alignSelf: 'center',
    },
});

export default MyHabitsScreen;