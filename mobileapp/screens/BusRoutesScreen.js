import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NextBuses } from "../components/NextBuses.js";
import { addDays } from "date-fns";
import { Provider as PaperProvider } from "react-native-paper";
import { Dimensions } from "react-native";
import * as Location from "expo-location";
import LoadingAnimation from "../components/LoadingAnimation.js";
import ClosestBusStop from "../components/ClosestBusStop.js";
import SearchBarDropDown from "../components/SearchBarDropDown.js";
import Loading from "../components/Loading.js";
import HiddenSearchBar from "../components/HiddenSearchBar.js";
import RouteBanner from "../components/RouteBanner.js";
// import { Connection, Exchange, Queue } from "react-native-rabbitmq";
// import { Client, Message } from "@stomp/stompjs";
// // import Stomp from "stompjs";
// import SockJS from "sockjs-client";
// import { connect } from "amqplib";

datesWhitelist = [
  {
    start: new Date(),
    end: addDays(new Date(), 7),
  },
];

function BusRoutes() {
  //const api_addr = "http://192.168.160.222:8080";
  const api_addr = "http://10.0.2.2:8080";
  // constants and useStates declaration
  const [errorMsg, setErrorMsg] = useState(null);
  const [closestBusStop, setClosestBusStop] = useState("Waiting...");
  const [closestBusStopID, setClosestBusStopID] = useState(null);
  const [busStops, setBusStops] = useState([]);
  const [nextBuses, setNextBuses] = useState([]);
  const [pageIsLoading, setPageIsLoading] = useState(true);
  const [queryIsLoading, setQueryIsLoading] = useState(true);
  const [originStop, setOriginStop] = useState(null);
  const [destinationStop, setDestinationStop] = useState(null);
  const [originInput, setOriginInput] = useState(null);
  const navigation = useNavigation();

  // async function connectToRabbitMQ() {
  //   try {
  //     const connection = await connect("amqp://10.0.2.2:15674");
  //     const channel = await connection.createChannel();
  //     await channel.assertQueue("events");
  //     console.log('Successfully connected to RabbitMQ queue "events"');
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }

  // useEffect(() => {
  //   connectToRabbitMQ();
  // }, []);

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

  // const stompConfig = {
  //   connectHeaders: {
  //     login: "guest",
  //     passcode: "guest",
  //   },
  //   brokerURL: "ws://10.0.2.2:15674/ws",
  //   debug: (str) => {
  //     console.log("STOMP - " + str);
  //   },
  //   reconnectDelay: 200,
  //   onConnect: () => {
  //     console.log("connected");
  //   },
  //   onStompError: (frame) => {
  //     console.log("Broker reported error: " + frame.headers["message"]);
  //     console.log("Additional details: " + frame.body);
  //   },
  //   forceBinaryWSFrames: true,
  //   appendMissingNULLonIncoming: true,
  // };
  // const client = new Client(stompConfig);

  useEffect(() => {
    // var ws = new WebSocket("ws://localhost:15674");
    // ws.onerror = (e) => {
    //   console.log(e);
    // };
    // console.log("connecting");
    // ws.onopen = () => {
    //   console.log("connected");
    // };
    // ws.onmessage = (e) => {
    //   console.log(e.data);
    // };
    // SockJS
    // let socket = new SockJS("http://localhost:15674/ws");
    // let stomClient = Stomp.over(socket);
    // stomClient.connect({}, console.log("connected"), console.log("error"));
    // Stomp JS (not working)
    //client.activate();
    // const stomp = Stomp.client("ws://10.0.2.2:15674/ws");
    // const headers = {
    //   login: "guest",
    //   passcode: "guest",
    // };
    // stomp.connect(
    //   headers,
    //   () => {
    //     console.log("connected");
    //     stomp.subscribe("/queue/events", (msg) => {
    //       console.log("in subscribe");
    //     });
    //   },
    //   (err) => {
    //     console.log("connection error");
    //     console.log(err);
    //   }
    // );
    // console.log("after try connect");
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
        api_addr + "/api/stops/closest?lat=" + lat + "&lon=" + lon
      );
      const json = await response.json();
      setOriginStop(json.id);
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
          api_addr + "/api/schedules/next?origin_stop_id=" + origin_stop_id
        );
      } else {
        var response = await fetch(
          api_addr +
            "/api/schedules/next?origin_stop_id=" +
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
      setPageIsLoading(false);
      setQueryIsLoading(false);
      return;
    } catch (error) {
      console.error(error);
    }
  };

  const getBusStops = async () => {
    try {
      let busStops = [];
      const response = await fetch(api_addr + "/api/stops");
      const json = await response.json();
      for (let i = 0; i < json.length; i++) {
        busStops.push({ id: json[i].id, name: json[i].designation });
      }
      setBusStops(busStops);
    } catch (error) {
      console.error(error);
    }
  };

  const getDesignationOfStop = (stop_id) => {
    let bus_designation = null;
    for (let i = 0; i < busStops.length; i++) {
      if (busStops[i].id == stop_id) {
        bus_designation = busStops[i].name;
      }
    }
    return bus_designation;
  };

  return (
    <PaperProvider>
      <SafeAreaView
        className="pt-5"
        style={{ flex: 1, backgroundColor: "white" }}
      >
        {pageIsLoading ? (
          <LoadingAnimation content="Preparing bus..." time={3000} />
        ) : (
          <View>
            <ClosestBusStop closestBusStop={closestBusStop} />

            <SearchBarDropDown
              placeholder="Search Origin Bus Stop"
              DATA={busStops}
              getBusRoutes={getBusRoutes}
              closestBusStopID={closestBusStopID}
              setQueryIsLoading={setQueryIsLoading}
              setOriginStop={setOriginStop}
              originStop={originStop}
              destinationStop={destinationStop}
              setOriginInput={setOriginInput}
            />

            <HiddenSearchBar
              placeholder="Search Origin Bus Stop"
              DATA={busStops}
              getBusRoutes={getBusRoutes}
              closestBusStopID={closestBusStopID}
              setQueryIsLoading={setQueryIsLoading}
              setDestinationStop={setDestinationStop}
              originStop={originStop}
              destinationStop={destinationStop}
              originInput={originInput}
            />

            <View>
              {queryIsLoading ? (
                <Loading />
              ) : (
                <View>
                  {nextBuses.length == 0 ? (
                    <View style={{ paddingTop: 150 }}>
                      <Text
                        style={{
                          textAlign: "center",
                          fontSize: 20,
                        }}
                      >
                        No buses available
                      </Text>
                    </View>
                  ) : (
                    <View>
                      <View style={{ width: Dimensions.get("screen").width }}>
                        <RouteBanner
                          originStop={getDesignationOfStop(originStop)}
                          destinationStop={getDesignationOfStop(
                            destinationStop
                          )}
                          buses={nextBuses}
                        />
                      </View>
                      <NextBuses dados={nextBuses} />
                    </View>
                  )}
                </View>
              )}
            </View>
          </View>
        )}
      </SafeAreaView>
    </PaperProvider>
  );
}

export default BusRoutes;

const styles = {
  routeLabels: {
    fontSize: 15,
    textAlign: "center",
    paddingTop: 20,
    paddingBottom: 20,
  },
};
