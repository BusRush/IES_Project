import { View, Text, StyleSheet } from "react-native";
import React, { useLayoutEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Provider as PaperProvider } from "react-native-paper";
import {
  Card,
  Title,
  Paragraph,
  Button,
  ProgressBar,
  MD3Colors,
} from "react-native-paper";

const ChosenBusInformationScreen = () => {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
      title: "Chosen Bus Information",
    });
  }, []);

  return (
    <PaperProvider>
      <SafeAreaView>
        <View style={{ backgroundColor: "white" }}>
          <View
            style={{
              flexDirection: "row",
              backgroundColor: "#245A8D",
            }}
          >
            <View style={{ flex: 1, alignItems: "flex-start" }}>
              <Button
                labelStyle={{ fontSize: 30 }}
                icon="arrow-left-thin"
                textColor="white"
                onPress={() => navigation.navigate("Home")}
              ></Button>
            </View>
          </View>
          <View style={{ margin: 15 }}>
            <Card>
              <Card.Content>
                <Title style={{ textAlign: "center" }}>Bus Model</Title>
                <Paragraph style={{ textAlign: "center" }}>
                  Line Identificator
                </Paragraph>
              </Card.Content>
            </Card>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-evenly",
            }}
          >
            <View style={{ backgroundColor: "white", flex: 1, margin: 15 }}>
              <Card style={{ height: 140 }}>
                <Card.Content>
                  <Title style={{ textAlign: "center" }}>
                    Expected Arrival Time
                  </Title>
                  <Paragraph style={{ textAlign: "center" }}>Time</Paragraph>
                </Card.Content>
              </Card>
            </View>
            <View style={{ backgroundColor: "white", flex: 1, margin: 15 }}>
              <Card style={{ height: 140 }}>
                <Card.Content>
                  <Title style={{ textAlign: "center" }}>Next Bus Stop</Title>
                  <Paragraph style={{ textAlign: "center" }}>
                    Name of Bus Stop
                  </Paragraph>
                </Card.Content>
              </Card>
            </View>
          </View>
          <View>
            <Text style={{ textAlign: "center", fontSize: 20 }}>
              Current Occupancy
            </Text>
          </View>
          <View style={{ flexDirection: "row", margin: 15 }}>
            <View style={{ flex: 1 }}>
              <ProgressBar
                progress={0.5}
                color={"#245A8D"}
                style={{ height: 40, borderRadius: 15 }}
              />
            </View>
          </View>
          <View
            style={{
              paddingTop: 10,
              flexDirection: "row",
              margin: 15,
              height: 325,
            }}
          ></View>
        </View>
      </SafeAreaView>
    </PaperProvider>
  );
};

export default ChosenBusInformationScreen;

const styles = StyleSheet.create({
  white_bg: {
    backgroundColor: "white",
  },
  redtext: {
    color: "red",
  },
});
