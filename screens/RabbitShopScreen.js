import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Image, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const RabbitShopScreen = ({ route }) => {
    const { carrots } = route.params;

    const insets = useSafeAreaInsets();
    const navigation = useNavigation();

    const [wearingHeadphones, setWearingHeadphones] = useState();
    const [gotCarrots, setGotCarrots] = useState(carrots);

    const handleBuyHeadphones = async () => {
        await AsyncStorage.setItem("rabbit_carrots", (carrots - 10).toString());
        setGotCarrots(carrots - 10);
        setWearingHeadphones(true);
    }

    return (
        <View style={[styles.container, { paddingTop: insets.top + 10, paddingBottom: insets.bottom + 10 }]}>
            <StatusBar hidden />
            <View style={styles.secondContainer}>
                <View style={{ position: 'absolute', width: "100%", display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
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
                <View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', flex: 1 }}>
                    <Image source={wearingHeadphones ? require('../assets/headphone_rabbit.png') : require('../assets/rabbit_elder.png')} style={{ height: 150, width: 150, alignSelf: 'center', marginBottom: 20 }} />
                    <TouchableOpacity style={{ alignItems: 'center', marginTop: 20, padding: 10, borderRadius: 10, backgroundColor: "#c9c9c9" }} onPress={handleBuyHeadphones}>
                        <Text style={{ fontFamily: "Fredoka-Medium", fontSize: 18 }}>Buy Headphones</Text>
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
        width: "85%",
        alignSelf: 'center',
    }
});

export default RabbitShopScreen;