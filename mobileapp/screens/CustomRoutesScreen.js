import { View, Text, StyleSheet } from "react-native";
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
} from "react-native-paper";

import MyComponent from "../components/bottomNavigation";
import SelectDropdown from "react-native-select-dropdown";
import FontAwesome from "react-native-vector-icons/FontAwesome";

const CustomRoutesScreen = () => {
  const navigation = useNavigation();
  const countries = [
    "Bus Route A",
    "Bus Route B",
    "Bus Route C",
    "Bus Route D",
  ];
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
      title: "Chosen Bus Information",
    });
  }, []);

  return (
    <PaperProvider>
      <SafeAreaView style={{ backgroundColor: "white" }}>
        <View style={{ flexDirection: "row" }}>
          <View style={{ flex: 1, alignItems: "flex-start" }}>
            <Button
              labelStyle={{ fontSize: 30 }}
              icon="arrow-left-thin"
              onPress={() => navigation.navigate("Home")}
            ></Button>
          </View>
          <View style={{ flex: 1, alignItems: "flex-end" }}>
            <Button
              labelStyle={{ fontSize: 30 }}
              icon="account-circle"
              onPress={() => navigation.navigate("Home")}
            ></Button>
          </View>
        </View>
        <View style={{ margin: 15 }}>
          <Card>
            <Card.Content>
              <Title style={{ textAlign: "center" }}>Bus Routes</Title>
            </Card.Content>
          </Card>
        </View>
        <View>
          <SelectDropdown
            data={countries}
            onSelect={(selectedItem, index) => {
              console.log(selectedItem, index);
            }}
            buttonTextAfterSelection={(selectedItem, index) => {
              // text represented after item is selected
              // if data array is an array of objects then return selectedItem.property to render after item is selected
              return selectedItem;
            }}
            renderDropdownIcon={(isOpened) => {
              return (
                <FontAwesome
                  name={isOpened ? "chevron-up" : "chevron-down"}
                  color={"black"}
                  size={18}
                />
              );
            }}
            defaultButtonText={"Select a Bus Route"}
            rowTextForSelection={(item, index) => {
              // text represented for each item in dropdown
              // if data array is an array of objects then return item.property to represent item in dropdown
              return item;
            }}
            buttonStyle={{
              backgroundColor: "#fff",
              borderColor: "lightgrey",
              borderWidth: 1,
              borderRadius: 5,
              padding: 10,
              width: 300,
              height: 50,
              alignSelf: "center",
            }}
          />
        </View>
        <View style={{ margin: 15 }}>
          <Card>
            <Card.Content>
              <Title style={{ textAlign: "center" }}>Selected Bus Route</Title>
              <Paragraph style={{ textAlign: "center" }}>Info</Paragraph>
              <Paragraph style={{ textAlign: "center" }}>Info</Paragraph>
              <Paragraph style={{ textAlign: "center" }}>Info</Paragraph>
              <Paragraph style={{ textAlign: "center" }}>Info</Paragraph>
              <Paragraph style={{ textAlign: "center" }}>Info</Paragraph>
            </Card.Content>
          </Card>
        </View>
        <View style={{ margin: 15 }}>
          <Button mode="outlined">Set Bus Route</Button>
        </View>
      </SafeAreaView>
      <MyComponent></MyComponent>
    </PaperProvider>
  );
};

export default CustomRoutesScreen;

const styles = StyleSheet.create({
  white_bg: {
    backgroundColor: "white",
  },
  redtext: {
    color: "red",
  },
});
