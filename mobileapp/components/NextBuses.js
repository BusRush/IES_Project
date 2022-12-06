import React from "react";
import {
  SafeAreaView,
  View,
  FlatList,
  StyleSheet,
  Text,
  StatusBar,
  TouchableOpacity,
} from "react-native";

import { useNavigation } from "@react-navigation/native";
const DATA = [
  {
    number: "L11",
    title: "Universidade de Aveiro",
    hour: "10:00",
  },
  {
    number: "L3",
    title: "Cacia",
    hour: "10:10",
  },
  {
    number: "L7",
    title: "Estarreja",
    hour: "10:20",
  },
];

const NextBuses = (props) => {
  const navigation = useNavigation();
  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate("Chosen Bus Information")}
    >
      <View style={styles.row}>
        <View style={styles.number}>
          <Text style={styles.title}>{item.linha}</Text>
        </View>
        <View style={styles.item}>
          <Text style={styles.title}>{item.paragem}</Text>
        </View>
        <View style={styles.hour}>
          <Text style={styles.hour}>{item.time}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={props.dados}
      renderItem={renderItem}
      keyExtractor={(item) => item.linha}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  hour: {
    color: "#000000",
    fontSize: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#dcdcdc",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    padding: 10,
    justifyContent: "space-between",
  },
  routeNumber: {
    width: 20,
    height: 20,
    borderRadius: 10,
    color: "#245A8D",
  },
  item: {
    padding: 20,
    marginVertical: 1,
    marginHorizontal: 5,
  },
  title: {
    fontSize: 20,
    color: "#245A8D",
  },
});

export { NextBuses };
