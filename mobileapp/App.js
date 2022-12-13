import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BusRoutes from "./screens/BusRoutesScreen.js";
import ChosenBusInformationScreen from "./screens/ChosenBusInformationScreen";
import WelcomingScreen from "./screens/WelcomingScreen.tsx";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useLayoutEffect } from "react";
import { useNavigation } from "@react-navigation/native";

const Stack = createNativeStackNavigator();

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Welcome" component={WelcomingScreen} />
        <Stack.Screen name="Home" component={BusRoutes} />
        <Stack.Screen
          name="Chosen Bus Information"
          component={ChosenBusInformationScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
