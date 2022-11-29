import {
  TouchableHighlight,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React, { useLayoutEffect } from "react";
import { useNavigation } from "@react-navigation/native";

import { SafeAreaView } from "react-native-safe-area-context";
import { Provider as PaperProvider } from "react-native-paper";
import {
  Appbar,
  Card,
  Avatar,
  Title,
  Paragraph,
  Button,
  Text,
} from "react-native-paper";
import MyComponent from "../components/bottomNavigation";

const HomeScreen = () => {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
      title: "Chosen Bus Information",
    });
  }, []);
  return (
    <PaperProvider>
      <SafeAreaView style={{ backgroundColor: "white" }}>
        <View style={{ flexDirection: "row", paddingTop: 10 }}>
          <View style={{ flex: 2, alignItems: "flex-start" }}>
            <Text style={{ paddingLeft: 10, fontSize: 30 }}>Welcome, User</Text>
          </View>
          <View style={{ flex: 1, alignItems: "flex-end" }}>
            <Button
              labelStyle={{ fontSize: 30 }}
              icon="account-circle"
              onPress={() => navigation.navigate("Home")}
            ></Button>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-evenly",
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              flex: 1,
              margin: 15,
            }}
          >
            <TouchableOpacity onPress={() => navigation.navigate("BusRoutes")}>
              <Card
                style={{
                  height: 160,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Card.Content>
                  <Title style={{ textAlign: "center" }}>See Bus Routes</Title>
                </Card.Content>
              </Card>
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-evenly",
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              flex: 1,
              margin: 15,
            }}
          >
            <TouchableOpacity
              onPress={() => navigation.navigate("Custom Routes")}
            >
              <Card
                style={{
                  height: 160,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Card.Content>
                  <Title style={{ textAlign: "center" }}>
                    See Custom Routes
                  </Title>
                </Card.Content>
              </Card>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
      <MyComponent></MyComponent>
    </PaperProvider>
  );
};

export default HomeScreen;
