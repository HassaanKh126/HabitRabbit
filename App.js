import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Toast from "react-native-toast-message";
import { Text, View } from "react-native";

import HomeScreen from "./screens/HomeScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import SplashScreen from "./screens/SplashScreen";

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SplashScreen" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="SplashScreen" component={SplashScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="RegisterScreen" component={RegisterScreen} options={{ animation: 'fade_from_bottom' }} />
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
          <View style={{ padding: 14, backgroundColor: '#423d11', borderRadius: 10 }}>
            <Text style={{ color: '#fff8f0', fontFamily: 'Fredoka-Medium' }}>{text1}</Text>
          </View>
        ),
      }} />

    </NavigationContainer>
  );
}

export default App;