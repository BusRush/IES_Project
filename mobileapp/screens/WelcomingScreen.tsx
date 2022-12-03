import { useNavigation } from "@react-navigation/native";
import React, { useLayoutEffect, useState } from "react";
import {
  Dimensions,
  ScrollView,
  View,
  Image,
  Text,
  StyleSheet,
  PixelRatio,
} from "react-native";
import { Button } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { Icon } from "@rneui/themed";

const WelcomingScreen = () => {
  const [sliderState, setSliderState] = useState({ currentPage: 0 });
  const { width, height } = Dimensions.get("window");

  const setSliderPage = (event: any) => {
    const { currentPage } = sliderState;
    const { x } = event.nativeEvent.contentOffset;
    const indexOfNextScreen = Math.floor(x / width);
    if (indexOfNextScreen !== currentPage) {
      setSliderState({
        ...sliderState,
        currentPage: indexOfNextScreen,
      });
    }
  };
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const { currentPage: pageIndex } = sliderState;

  return (
    <>
      <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
        <ScrollView
          style={{ flex: 1 }}
          horizontal={true}
          scrollEventThrottle={16}
          pagingEnabled={true}
          showsHorizontalScrollIndicator={false}
          onScroll={(event: any) => {
            setSliderPage(event);
          }}
        >
          <View style={{ width, height }}>
            <Image
              source={require("../assets/logo.jpeg")}
              style={styles.imageStyle}
            />
            <View style={styles.wrapper}>
              <Icon name="arrow-right" size={50} />
            </View>
          </View>
          <View style={{ width, height }}>
            <Image
              source={require("../assets/nearest.png")}
              style={styles.imageStyle}
            />
            <View style={styles.wrapper}>
              <Text style={styles.header}>Browse The Nearest Bus Stops</Text>
            </View>
          </View>
          <View style={{ width, height }}>
            <Image
              source={require("../assets/businfo.png")}
              style={styles.imageStyle}
            />
            <View style={styles.wrapper}>
              <Text style={styles.header}>
                See in real-time the information of the bus you need to catch.
              </Text>
            </View>
          </View>
          <View style={{ width, height }}>
            <Image
              source={require("../assets/cool2.jpeg")}
              style={styles.imageStyle}
            />
            <View style={styles.wrapper}>
              <Text style={styles.header}>
                Add your prefered route to your favourites list.
              </Text>
              <Text style={styles.paragraph}>
                This way you can receive notifications from the app.
              </Text>
            </View>
          </View>
        </ScrollView>
        <View style={{ paddingBottom: 50 }}>
          <View style={styles.paginationWrapper}>
            {Array.from(Array(4).keys()).map((key, index) => (
              <View
                style={[
                  styles.paginationDots,
                  { opacity: pageIndex === index ? 1 : 0.2 },
                ]}
                key={index}
              />
            ))}
          </View>
        </View>
        <Button
          onPress={() => navigation.navigate("Home")}
          style={{
            borderWidth: 1,
            borderColor: "lightgrey",
            width: 200,
            alignSelf: "center",
            marginBottom: 20,
          }}
        >
          <Text style={{ fontSize: 18, color: "#245A8D" }}>Get Started</Text>
        </Button>
      </SafeAreaView>
    </>
  );
};
export default WelcomingScreen;

const styles = StyleSheet.create({
  imageStyle: {
    height: PixelRatio.getPixelSizeForLayoutSize(155),
    width: "100%",
  },
  wrapper: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 30,
  },
  header: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  paragraph: {
    fontSize: 17,
    textAlign: "center",
  },
  paginationWrapper: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  paginationDots: {
    height: 10,
    width: 10,
    borderRadius: 10 / 2,
    backgroundColor: "#0898A0",
    marginLeft: 10,
  },
});
