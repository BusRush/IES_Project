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

function HomeTabs() {
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Bus Routes") {
            iconName = focused ? "bus" : "bus-outline";
          } else if (route.name === "Bus") {
            iconName = focused ? "ios-list" : "ios-list-outline";
          }

          // You can return any component that you like here!
          return (
            <Ionicons name={iconName} size={30} fontSize={30} color={color} />
          );
        },
        tabBarActiveTintColor: "white",
        tabBarInactiveTintColor: "lightgray",
        tabBarItemStyle: { backgroundColor: "#245A8D" },
        tabBarLabelStyle: { fontSize: 14 },
      })}
    >
      <Tab.Screen name="Bus Routes" component={BusRoutes} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Welcome" component={WelcomingScreen} />
        <Stack.Screen name="Home" component={HomeTabs} />
        <Stack.Screen
          name="Chosen Bus Information"
          component={ChosenBusInformationScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
