import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ChosenBusInformationScreen from "./screens/ChosenBusInformationScreen";
import HomeScreen from "./screens/HomeScreen";
import CustomRoutesScreen from "./screens/CustomRoutesScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen
          name="Chosen Bus Information"
          component={ChosenBusInformationScreen}
        />
        <Stack.Screen
          name="Custom Routes Page"
          component={CustomRoutesScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
