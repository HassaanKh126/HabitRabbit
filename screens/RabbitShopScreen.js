import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Image, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";

const RabbitShopScreen = ({ route }) => {
    const { carrots, avatarImage } = route.params;

    const insets = useSafeAreaInsets();
    const navigation = useNavigation();

    const [gotCarrots, setGotCarrots] = useState(carrots);
    const [rabbitAvatar, setRabbitAvatar] = useState(avatarImage);
    const [inventoryList, setInventoryList] = useState([]);


    const shopItems = [
        { name: "Black Hoodie", cost: 10, image: require('../assets/rabbit/black_hoodie.png') },
        { name: "Blue Hoodie", cost: 15, image: require('../assets/rabbit/blue_hoodie.png') },
        { name: "Orange Hoodie", cost: 20, image: require('../assets/rabbit/orange_hoodie.png') },
        { name: "Black Hoodie with Glasses", cost: 30, image: require('../assets/rabbit/black_hoodie_glasses.png') },
        { name: "Blue Hoodie with Glasses", cost: 40, image: require('../assets/rabbit/blue_hoodie_glasses.png') },
        { name: "Orange Hoodie with Glasses", cost: 50, image: require('../assets/rabbit/orange_hoodie_glasses.png') },
        { name: "Golden Hoodie", cost: 60, image: require('../assets/rabbit/golden_hoodie.png') },
        { name: "Golden Hoodie with Glasses", cost: 70, image: require('../assets/rabbit/golden_hoodie_glasses.png') },
        { name: "Golden Hoodie with Crown", cost: 100, image: require('../assets/rabbit/golden_hoodie_crown.png') },
    ]

    useEffect(() => {
        const getInventory = async () => {
            const gotInventory = await AsyncStorage.getItem("rabbit_inventory");
            setInventoryList(gotInventory ? JSON.parse(gotInventory) : []);
        };

        getInventory();
    }, []);

    // const handleBuyItem = async (item) => {
    //     if (gotCarrots < item.cost) {
    //         Toast.show({
    //             type: "error",
    //             text1: "Insufficient Carrots."
    //         });
    //         return;
    //     }
    //     await AsyncStorage.setItem("rabbit_avatar", item.name);
    //     await AsyncStorage.setItem("rabbit_carrots", (gotCarrots - item.cost).toString());
    //     setRabbitAvatar(item.image);
    //     setGotCarrots(prev => prev - item.cost);
    // }

    const handleBuyItem = async (item) => {
        try {
            const storedInventory = await AsyncStorage.getItem("rabbit_inventory");
            let inventory = storedInventory ? JSON.parse(storedInventory) : [];

            if (inventory.includes(item.name)) {
                await AsyncStorage.setItem("rabbit_avatar", item.name);
                setRabbitAvatar(item.image);

                Toast.show({
                    type: "info",
                    text1: `${item.name} equipped!`,
                });
                return;
            }

            if (gotCarrots < item.cost) {
                Toast.show({
                    type: "error",
                    text1: "Insufficient Carrots.",
                });
                return;
            }

            const newCarrots = gotCarrots - item.cost;
            inventory.push(item.name);

            await AsyncStorage.setItem("rabbit_carrots", newCarrots.toString());
            await AsyncStorage.setItem("rabbit_avatar", item.name);
            await AsyncStorage.setItem("rabbit_inventory", JSON.stringify(inventory));

            setGotCarrots(newCarrots);
            setRabbitAvatar(item.image);
            setInventoryList(prev => [...prev, item.name]);

            Toast.show({
                type: "success",
                text1: `${item.name} purchased & equipped!`,
            });
        } catch (err) {
            console.error("Error handling purchase:", err);
        }
    };


    return (
        <View style={[styles.container, { paddingTop: insets.top + 10, paddingBottom: insets.bottom + 10 }]}>
            <StatusBar hidden />
            <View style={styles.secondContainer}>
                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                        <TouchableOpacity onPress={() => { navigation.goBack(); }}>
                            <Ionicons name="arrow-back" size={28} color={"#fff8f0"} />
                        </TouchableOpacity>
                        <Text style={{ fontFamily: "Fredoka-Medium", color: "#fff8f0", fontSize: 26 }}>Rabbit Shop</Text>
                    </View>
                    <TouchableOpacity onPress={() => { navigation.navigate("RabbitShopScreen") }} style={{ position: 'absolute', top: 0, right: 0, display: 'flex', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, backgroundColor: '#3f342d' }}>
                        <Image source={require('../assets/carrot.png')} style={{ height: 18, width: 18 }} />
                        <Text style={{ fontFamily: "Fredoka-SemiBold", color: "#fff8f0", fontSize: 16, marginRight: 5, marginLeft: 5 }}>{gotCarrots}</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ flex: 1 }}>
                    <Image source={rabbitAvatar} style={{ height: 200, width: 200, alignSelf: 'center', marginVertical: 30 }} />
                    <ScrollView contentContainerStyle={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center" }} showsVerticalScrollIndicator={false}>
                        {shopItems.map((item, index) => {
                            const owned = inventoryList.includes(item.name);

                            return (
                                <View key={index} style={{ margin: 5, backgroundColor: "#3f342d", padding: 10, borderRadius: 10, width: "30%", alignItems: 'center' }}>
                                    <Image
                                        source={item.image}
                                        style={{ height: 100, width: 100, borderRadius: 10 }}
                                    />
                                    <TouchableOpacity style={{ marginTop: 10, backgroundColor: "#544740", padding: 5, borderRadius: 10, display: "flex", flexDirection: "row", alignItems: 'center', justifyContent: 'center', width: '100%' }} onPress={() => { handleBuyItem(item) }}>
                                        {owned ? (
                                            <View>
                                                <Text style={{ fontFamily: "Fredoka-Medium", color: "#fff8f0" }}>Equip</Text>
                                            </View>
                                        ) : (
                                            <View style={{ display: "flex", flexDirection: "row", alignItems: 'center', justifyContent: 'center', }}>
                                                <Image source={require('../assets/carrot_light.png')} style={{ height: 18, width: 18 }} />
                                                <Text style={{ fontFamily: "Fredoka-Medium", color: "#fff8f0" }}>{item.cost}</Text>
                                            </View>
                                        )}
                                    </TouchableOpacity>
                                </View>
                            )
                        })}
                    </ScrollView>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#29211d",
    },
    secondContainer: {
        flex: 1,
        width: "90%",
        alignSelf: 'center',
    }
});

export default RabbitShopScreen;