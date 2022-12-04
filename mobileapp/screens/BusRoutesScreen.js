import React, { useState, useEffect } from "react";
import { View, Text, SafeAreaView } from "react-native";
import { useLayoutEffect } from "react";
import { SearchBar } from "@rneui/themed";
import { Icon } from "@rneui/themed";
import { useNavigation } from "@react-navigation/native";
import { RouteNumbers } from "../components/RouteNumbers.js";
import { NextBuses } from "../components/NextBuses.js";
import CalendarStrip from "react-native-calendar-strip";
import { addDays } from "date-fns";
import { Provider as PaperProvider } from "react-native-paper";
import { Dimensions } from "react-native";
import * as Location from "expo-location";
datesWhitelist = [
  {
    start: new Date(),
    end: addDays(new Date(), 7),
  },
];

function getClosestStop() {
  console.log("Getting closest stop");
}

function BusRoutes() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [closestBusStop, setClosestBusStop] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  const getClosestLocation = async () => {
    let lat = location["coords"]["latitude"];
    let lon = location["coords"]["longitude"];
    try {
      const response = await fetch(
        "http://10.0.2.2:8080/api/stops/closest?lat=" + lat + "&lon=" + lon
      );
      const json = await response.json();
      setClosestBusStop(json.designation);
    } catch (error) {
      console.error(error);
    }
  };

  getClosestLocation();
  console.log(closestBusStop);

  const navigation = useNavigation();
  const [selectedDate, setSelectedDate] = useState("");
  const [partida_search, setPartidaSearch] = useState("");

  const updatePartidaSearch = (partida_search) => {
    setPartidaSearch(partida_search);
  };

  const [chegada_search, setChegadaSearch] = useState("");

  const updateChegadaSearch = (chegada_search) => {
    setChegadaSearch(chegada_search);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  return (
    <PaperProvider>
      <SafeAreaView className="pt-5">
        <View style={{ backgroundColor: "#245A8D" }}>
          <SearchBar
            placeholder="Inserir partida"
            containerStyle={{
              height: 55,
              backgroundColor: "#245A8D",
              borderTopWidth: 0,
              marginTop: 25,
              borderBottomWidth: 0,
            }}
            onChangeText={updatePartidaSearch}
            value={partida_search}
            //inputStyle={{backgroundColor: '#3B71CA, height: 40, borderRadius: 10}}
          />
        </View>
        <View>
          <SearchBar
            placeholder="Inserir destino"
            containerStyle={{
              height: 55,
              backgroundColor: "#245A8D",
              borderTopWidth: 0,
              borderBottomWidth: 0,
            }}
            onChangeText={updateChegadaSearch}
            value={chegada_search}
            //inputStyle={{backgroundColor: '#3B71CA, height: 40, borderRadius: 10}}
          />

          <View style={Styles.row}>
            <Icon
              reverse
              name="my-location"
              color="#245A8D"
              onPress={() => getClosestStop()}
            />
            <View
              style={{
                flexDirection: "row",
                width: Dimensions.get("window").width - 100,
              }}
            >
              <Text style={Styles.subtextStyle}>
                Paragem mais próxima: {closestBusStop}
              </Text>
            </View>
          </View>

          <View style={{ paddingTop: 5, backgroundColor: "white" }}>
            <RouteNumbers />
          </View>

          {/* <CalendarStrip datesWhitelist={datesWhitelist} /> */}

          <View>
            <NextBuses />
          </View>
        </View>
      </SafeAreaView>
    </PaperProvider>
  );
}

export default BusRoutes;

const Styles = {
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#245A8D",
    justifyContent: "center", //Centered horizontally
    alignItems: "center", //Centered vertically
  },
  titleStyle: {
    alignItems: "center",
    backgroundColor: "#245A8D",
    height: 50,
    marginTop: 25,
    padding: 5,
  },
  textStyle: {
    marginTop: 10,
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  subtextStyle: {
    flex: 1,
    marginTop: 10,
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
  },
  container: {
    flex: 1,
    paddingTop: 22,
  },
};
