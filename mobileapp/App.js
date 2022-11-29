import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BusRoutes from "./screens/BusRoutesScreen.js";
import ChosenBusInformationScreen from "./screens/ChosenBusInformationScreen";
import HomeScreen from "./screens/HomeScreen";
import CustomRoutesScreen from "./screens/CustomRoutesScreen.js";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="BusRoutes" component={BusRoutes} />
        <Stack.Screen name="Custom Routes" component={CustomRoutesScreen} />
        <Stack.Screen
          name="Chosen Bus Information"
          component={ChosenBusInformationScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
