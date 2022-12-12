import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Provider as PaperProvider } from "react-native-paper";
import {
  Card,
  Title,
  Paragraph,
  Button,
  ProgressBar,
} from "react-native-paper";
import LoadingAnimation from "../components/LoadingAnimation";

const ChosenBusInformationScreen = ({ route }) => {
  const navigation = useNavigation();
  const id = route.params.id;
  const linha = route.params.linha;
  const [data, setData] = useState({
    id: "",
    bus: { id: "", registration: "", brand: "", model: "" },
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
      title: "Chosen Bus Information",
    });

    (async () => {
      try {
        const response = await fetch(
          "http://10.0.2.2:8080/api/schedules/info/" + id
        );
        const json = await response.json();
        setData(json);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  return (
    <PaperProvider>
      <SafeAreaView style={{ flex: 1 }}>
        {isLoading ? (
          <LoadingAnimation content="Loading bus details..." time={4000} />
        ) : (
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
                  onPress={() => navigation.navigate("Bus Routes")}
                ></Button>
              </View>
            </View>
            <View style={{ margin: 15 }}>
              <Card>
                <Card.Content>
                  <Title style={{ textAlign: "center" }}>
                    {data.bus.model}
                  </Title>
                  <Paragraph style={{ textAlign: "center" }}>{linha}</Paragraph>
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
                    <Paragraph style={{ textAlign: "center" }}>
                      {data.time}
                    </Paragraph>
                    <Paragraph style={{ textAlign: "center" }}>
                      {data.delay}
                    </Paragraph>
                  </Card.Content>
                </Card>
              </View>
              <View style={{ backgroundColor: "white", flex: 1, margin: 15 }}>
                <Card style={{ height: 140 }}>
                  <Card.Content>
                    <Title style={{ textAlign: "center" }}>Next Bus Stop</Title>
                    <Paragraph style={{ textAlign: "center" }}>
                      {data.next_stop.designation}
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
                  progress={data.passengers / 90}
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
        )}
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
