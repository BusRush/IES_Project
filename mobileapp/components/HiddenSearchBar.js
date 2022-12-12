import { View, Animated, TouchableOpacity, Text } from "react-native";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import SearchBarDropDown from "./SearchBarDropDown";

const HiddenSearchBar = (props) => {
  const [searchBarVisible, setSearchBarVisible] = useState(false);
  const [disable, setDisable] = useState(false);
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    if (props.originInput == null) {
      setDisable(true);
    } else {
      setDisable(false);
    }
  }, [props.originInput]);

  const startFadeIn = () => {
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
    }).start();
  };

  const toggleVisibility = () => {
    // Set the component's visibility to the opposite of its current value
    setSearchBarVisible(!searchBarVisible);
  };

  return (
    <View>
      {searchBarVisible ? (
        <SearchBarDropDown
          placeholder="Search Destination Bus Stop"
          DATA={props.DATA}
          getBusRoutes={props.getBusRoutes}
          closestBusStopID={props.closestBusStopID}
          setQueryIsLoading={props.setQueryIsLoading}
          setStop={props.setStop}
          originStop={props.originStop}
          destinationStop={props.destinationStop}
          disabled={disable}
        />
      ) : null}
      <TouchableOpacity onPress={toggleVisibility}>
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          {searchBarVisible ? (
            <Ionicons name="chevron-up-outline" color="#3B2E6E" size={25} />
          ) : (
            <Ionicons name="chevron-down-outline" color="#3B2E6E" size={25} />
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};
export default HiddenSearchBar;
