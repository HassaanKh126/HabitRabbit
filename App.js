import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Toast from "react-native-toast-message";
import { Text, View } from "react-native";

import HomeScreen from "./screens/HomeScreen";
import SplashScreen from "./screens/SplashScreen";
import MyHabitsScreen from "./screens/MyHabitsScreen";
import CheckStatsScreen from "./screens/CheckStatsScreen";
import RabbitShopScreen from "./screens/RabbitShopScreen";
import WelcomeScreen from "./screens/WelcomeScreen";
import SettingsScreen from "./screens/SettingsScreen";

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SplashScreen" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="SplashScreen" component={SplashScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="MyHabitsScreen" component={MyHabitsScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="CheckStatsScreen" component={CheckStatsScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="RabbitShopScreen" component={RabbitShopScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="SettingsScreen" component={SettingsScreen} options={{ animation: 'fade' }} />
      </Stack.Navigator>
      <Toast config={{
        success: ({ text1, ...rest }) => (
          <View style={{ padding: 14, backgroundColor: '#1d362d', borderRadius: 10 }}>
            <Text style={{ color: '#fff8f0', fontFamily: 'Fredoka-Medium' }}>{text1}</Text>
          </View>
        ),
        error: ({ text1, ...rest }) => (
          <View style={{ padding: 14, backgroundColor: '#381f1f', borderRadius: 10 }}>
            <Text style={{ color: '#fff8f0', fontFamily: 'Fredoka-Medium' }}>{text1}</Text>
          </View>
        ),
        info: ({ text1, ...rest }) => (
          <View style={{ padding: 14, backgroundColor: '#3d3025', borderRadius: 10 }}>
            <Text style={{ color: '#fff8f0', fontFamily: 'Fredoka-Medium', fontSize: 15 }}>{text1}</Text>
          </View>
        ),
      }} />

    </NavigationContainer>
  );
}

export default App;