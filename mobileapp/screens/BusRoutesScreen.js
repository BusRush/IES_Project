import React, { useState, useEffect } from "react";
import { View, Text, SafeAreaView, AsyncStorage } from "react-native";
import { useLayoutEffect } from "react";
import { SearchBar } from "@rneui/themed";
import { Icon } from "@rneui/themed";
import { useNavigation } from "@react-navigation/native";
import { RouteNumbers } from "../components/RouteNumbers.js";
import { NextBuses } from "../components/NextBuses.js";
import CalendarStrip from "react-native-calendar-strip";
import { addDays } from "date-fns";
import { Button, Provider as PaperProvider } from "react-native-paper";
import { Dimensions } from "react-native";
import * as Location from "expo-location";
import SearchableDropdown from "react-native-searchable-dropdown";

datesWhitelist = [
  {
    start: new Date(),
    end: addDays(new Date(), 7),
  },
];

function BusRoutes() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [closestBusStop, setClosestBusStop] = useState("Waiting...");
  const [closestBusStopID, setClosestBusStopID] = useState(null);
  const [busStops, setBusStops] = useState([]);
  const [nextBuses, setNextBuses] = useState([]);

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

    (async () => {
      try {
        let busStops = [];
        const response = await fetch("http://10.0.2.2:8080/api/stops");
        const json = await response.json();
        for (let i = 0; i < json.length; i++) {
          busStops.push({ id: json[i].id, name: json[i].designation });
        }
        setBusStops(busStops);
      } catch (error) {
        console.error(error);
      }
    })();
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const getClosestLocation = async () => {
    let lat = location["coords"]["latitude"];
    let lon = location["coords"]["longitude"];
    console.log("hallo");
    try {
      const response = await fetch(
        "http://10.0.2.2:8080/api/stops/closest?lat=" + lat + "&lon=" + lon
      );
      const json = await response.json();
      console.log(json);
      setClosestBusStop(json.designation);
      setClosestBusStopID(json.id);
    } catch (error) {
      console.error(error);
    }
  };

  const getBusRoutes = async () => {
    let lat = location["coords"]["latitude"];
    let lon = location["coords"]["longitude"];
    console.log("hallo");
    try {
      let nextBuses = [];
      const response = await fetch(
        "http://10.0.2.2:8080/api/schedules/next?origin_stop_id=" +
          closestBusStopID +
          "&destination_stop_id=AVRBUS-S0005"
      );
      const json = await response.json();
      for (let i = 0; i < json.length; i++) {
        nextBuses.push({
          linha: json[i].route.designation,
          paragem: json[i].stop.designation,
          time: json[i].time,
        });
      }
      console.log(nextBuses);
      setNextBuses(nextBuses);
    } catch (error) {
      console.log("here");
      console.error(error);
    }
  };

  const navigation = useNavigation();
  const [selectedDate, setSelectedDate] = useState("");
  const [partida_search, setPartidaSearch] = useState("");

  const updatePartidaSearch = (partida_search) => {
    setPartidaSearch(partida_search);
    console.log(partida_search);
  };

  const [chegada_search, setChegadaSearch] = useState("");

  const updateChegadaSearch = (chegada_search) => {
    setChegadaSearch(chegada_search);
  };

  return (
    <PaperProvider>
      <SafeAreaView className="pt-5">
        <View style={{ backgroundColor: "#245A8D", paddingTop: 40 }}>
          <SearchableDropdown
            onTextChange={(text) => console.log(text)}
            onItemSelect={(item) => getBusRoutes()}
            containerStyle={{ padding: 5 }}
            textInputStyle={{
              padding: 12,
              borderWidth: 1,
              borderColor: "#ccc",
              backgroundColor: "#FAF7F6",
            }}
            itemStyle={{
              padding: 10,
              marginTop: 2,
              backgroundColor: "#FAF9F8",
              borderColor: "#bbb",
              borderWidth: 1,
            }}
            itemTextStyle={{
              color: "#222",
            }}
            itemsContainerStyle={{
              maxHeight: "60%",
            }}
            items={busStops}
            defaultIndex={1}
            placeholder="Inserir Partida"
            resetValue={false}
            underlineColorAndroid="transparent"
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
              onPress={() => getClosestLocation()}
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

          <View>
            <Button onPress={getBusRoutes}>Get Routes</Button>
          </View>

          {/* <CalendarStrip datesWhitelist={datesWhitelist} /> */}

          <View>
            <NextBuses dados={nextBuses} />
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
