import React, { useState, useEffect } from "react";
import { SearchBar } from "@rneui/themed";
import {
  FlatList,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from "react-native";

const SearchBarDropDown = (props) => {
  const [search, setSearch] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [data, setData] = useState([]);

  const updateSearch = (search) => {
    if (search.length > 0) {
      matchData(search);
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
    setSearch(search);
  };

  const matchData = (search) => {
    const newData = props.DATA.filter((item) => {
      const itemData = `${item.name.toUpperCase()}`;
      const textData = search.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    setData(newData);
  };

  const onSelectOption = (item) => {
    setSearch(item.name);
    props.onItemSelect(item.id);
    setIsVisible(false);
  };

  const handleOnClear = () => {
    setSearch("");
    props.onItemSelect(props.closestBusStopID);
    setIsVisible(false);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => onSelectOption(item)}>
      <View style={styles.row}>
        <View style={styles.number}>
          <Text style={styles.title}>{item.name}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.view}>
      <SearchBar
        placeholder={props.placeholder}
        onChangeText={updateSearch}
        value={search}
        containerStyle={styles.container}
        inputContainerStyle={styles.inputContainer}
        inputStyle={styles.inputStyle}
        onClear={handleOnClear}
      />
      {isVisible ? (
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          style={styles.optionList}
        />
      ) : null}
    </View>
  );
};
export default SearchBarDropDown;

const styles = StyleSheet.create({
  view: {
    margin: 10,
  },
  container: {
    backgroundColor: "transparent",
    borderTopWidth: 0,
    borderBottomWidth: 0,
  },
  inputContainer: {
    backgroundColor: "#3B2E6E",
    borderRadius: 10,
    height: 45,
    borderBottomWidth: 0,
  },
  inputStyle: {
    color: "#fff",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#3B2E6E",
    borderRadius: 10,
  },
  number: {
    color: "#000000",
    fontSize: 16,
  },
  title: {
    fontSize: 20,
    color: "#245A8D",
  },
  optionList: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginTop: 10,
    maxHeight: 260,
  },
});
