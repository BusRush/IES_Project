
import React , { useState } from 'react';
import { View, Text, Button, SafeAreaView, TextInput, ScrollView } from 'react-native';
import { useLayoutEffect } from 'react';
import { SearchBar } from '@rneui/themed';
import { Icon } from '@rneui/themed';
import { useNavigation } from "@react-navigation/native";
import {RouteNumbers} from '../components/RouteNumbers.js';
import {NextBuses} from '../components/NextBuses.js';
import CalendarStrip from 'react-native-calendar-strip';
import { addDays, format, subDays } from 'date-fns';
import MyComponent from "../components/bottomNavigation.js";

datesWhitelist = [
  {
    start: new Date(),
    end: addDays(new Date(), 7)
  }
];

function getClosestStop() {
    console.log("Getting closest stop");

}

function BusRoutes() {
      const navigation = useNavigation();
      const [selectedDate, setSelectedDate] = useState('');
    
      useLayoutEffect(() => {
          navigation.setOptions({
            headerShown: false,
          });
        }, [navigation]);
        
    
      return (
        <SafeAreaView className="pt-5">
            <SearchBar
                placeholder="Inserir destino"
                containerStyle={{ 
                  height: 55,
                  backgroundColor: '#245A8D',
                  borderTopWidth: 0, 
                  marginTop: 25,
                  borderBottomWidth: 0 }}
                //inputStyle={{backgroundColor: '#3B71CA, height: 40, borderRadius: 10}}
            />

        <View style={Styles.row}>
            <Icon 
                reverse
                name='my-location'
                color='#245A8D'
                onPress={() => getClosestStop()}
            />

              <Text style={Styles.subtextStyle}>Paragem mais próxima: </Text>
              <Text style={Styles.subtextStyle}>Terminal Rodoviário de Aveiro </Text>
            
        </View>
       
       <ScrollView
            style={{marginTop: 20}}
            className="bg-gray-100"
        >
          <RouteNumbers/>

        </ScrollView>

        <CalendarStrip
          datesWhitelist={datesWhitelist}
        />

        <ScrollView
            className="bg-gray-100"
        >
           <NextBuses />

        </ScrollView>
       
        <MyComponent/>
        </SafeAreaView>

      );
    }

    export default BusRoutes;

    const Styles = {
      row: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: '#245A8D',
        justifyContent: 'center', //Centered horizontally
        alignItems: 'center', //Centered vertically
      },
      titleStyle: {
          alignItems:'center',
          backgroundColor: '#245A8D',
          height:50,
          marginTop: 25, 
          padding:5,
      },
      textStyle: {
          marginTop: 10,
          color: '#fff',
          fontSize: 20,
          fontWeight: 'bold',
      },
      subtextStyle: {
        marginTop: 10,
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
        alignItems:'center',
        marginBottom: 10,
      },
      container: {
        flex: 1,
        paddingTop: 22
       }
  };