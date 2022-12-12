import React, { useState, useEffect } from "react";
import { View, Text, ActivityIndicator, Image, Animated } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLayoutEffect } from "react";
import { Icon } from "@rneui/themed";
import { useNavigation } from "@react-navigation/native";
import { RouteNumbers } from "../components/RouteNumbers.js";
import { NextBuses } from "../components/NextBuses.js";
import CalendarStrip from "react-native-calendar-strip";
import { addDays } from "date-fns";
import {
  Button,
  Provider as PaperProvider,
  Card,
  Title,
  Paragraph,
} from "react-native-paper";
import SearchableDropdown from "react-native-searchable-dropdown";
import { Dimensions } from "react-native";
import * as Location from "expo-location";
import LoadingAnimation from "../components/LoadingAnimation.js";
import ClosestBusStop from "../components/ClosestBusStop.js";
import SearchBarDropdown from "../components/SearchBarDropDown.js";
import SearchBarDropDown from "../components/SearchBarDropDown.js";

datesWhitelist = [
  {
    start: new Date(),
    end: addDays(new Date(), 7),
  },
];

function BusRoutes() {
  // constant declaration
  const [errorMsg, setErrorMsg] = useState(null);
  const [closestBusStop, setClosestBusStop] = useState("Waiting...");
  const [closestBusStopID, setClosestBusStopID] = useState(null);
  const [busStops, setBusStops] = useState([]);
  const [nextBuses, setNextBuses] = useState([]);
  const [selectedOrigin, setSelectedOrigin] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();
  // on render this will be called
  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });

    getBusStops();

    (async () => {
      const geo_loc = await getGeoLocation();
      if (geo_loc != "error") {
        const closestStop = await getClosestStop(geo_loc);
        await getBusRoutes(closestStop);
      }
    })();
  }, []);

  // gets geolocation of the device
  const getGeoLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return "error";
      }
      let location = await Location.getCurrentPositionAsync({});
      return location;
    } catch (error) {
      console.error(error);
    }
  };

  // gets closest stop given location of device
  const getClosestStop = async (location) => {
    let lat = location["coords"]["latitude"];
    let lon = location["coords"]["longitude"];
    try {
      const response = await fetch(
        "http://10.0.2.2:8080/api/stops/closest?lat=" + lat + "&lon=" + lon
      );
      const json = await response.json();
      setClosestBusStop(json.designation);
      setClosestBusStopID(json.id);
      return json.id;
    } catch (error) {
      console.error(error);
    }
  };

  // gets bus routes given by origin_stop_id and, optionally, designation_stop_id
  const getBusRoutes = async (origin_stop_id, designation_stop_id = null) => {
    try {
      let nextBuses = [];
      if (designation_stop_id == null) {
        var response = await fetch(
          "http://10.0.2.2:8080/api/schedules/next?origin_stop_id=" +
            origin_stop_id
        );
      } else {
        var response = await fetch(
          "http://10.0.2.2:8080/api/schedules/next?origin_stop_id=" +
            origin_stop_id +
            "&destination_stop_id=" +
            designation_stop_id
        );
      }
      const json = await response.json();
      for (let i = 0; i < json.length; i++) {
        nextBuses.push({
          id: json[i].id,
          linha: json[i].route.designation,
          time: json[i].time,
          delay: json[i].delay,
        });
      }
      setNextBuses(nextBuses);
      setIsLoading(false);
      return;
    } catch (error) {
      console.error(error);
    }
  };

  const getBusStops = async () => {
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
  };

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
      <SafeAreaView
        className="pt-5"
        style={{ flex: 1, backgroundColor: "white" }}
      >
        {isLoading ? (
          <LoadingAnimation content="Preparing bus..." time={3000} />
        ) : (
          <View>
            <ClosestBusStop closestBusStop={closestBusStop} />
            <SearchBarDropDown
              placeholder="Search Origin Bus Stop"
              DATA={busStops}
              onItemSelect={getBusRoutes}
              closestBusStopID={closestBusStopID}
            />
            {/* <CalendarStrip datesWhitelist={datesWhitelist} /> */}

            <View>
              <NextBuses dados={nextBuses} />
            </View>
          </View>
        )}
      </SafeAreaView>
    </PaperProvider>
  );
}

export default BusRoutes;

const Styles = {
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3B2E6E",
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
