import * as React from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BusRoutes from "./screens/BusRoutesScreen.js";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="BusRoutes"
          component={BusRoutes}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
