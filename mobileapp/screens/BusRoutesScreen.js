
import React from 'react';
import { View, Text, Button, SafeAreaView, TextInput, ScrollView } from 'react-native';
import { useLayoutEffect } from 'react';
import { SearchBar } from '@rneui/themed';
import { Icon } from '@rneui/themed';
import { useNavigation } from "@react-navigation/native";
import Routes from '../components/busroutes.js';

function BusRoutes() {
      const navigation = useNavigation();
    
      useLayoutEffect(() => {
          navigation.setOptions({
            headerShown: false,
          });
        }, [navigation]);
        
    
      return (
        <SafeAreaView className="pt-5">

            <SearchBar
                placeholder="Enter Destination"
                containerStyle={{ height: 70, marginTop: 25, borderTopWidth: 0, paddingRight:60, borderBottomWidth: 0 }}
                //inputStyle={{backgroundColor: '#3B71CA, height: 40, borderRadius: 10}}
            />

        <View style={{
            paddingVertical: 15,
            paddingHorizontal: 10,
            flexDirection: "row",
            alignItems: "center"
        }}>
            <Icon 
                reverse
                name='location'
                type='ionicon'
                color='#517fa4'
                
            />
            <Text style={{
                    fontSize: 16,
                    color: "black"
                }}>Closest Bus Stop: </Text>
            <Icon/>
            <Text>
                    Estação de Aveiro
                </Text>
        </View>
        <Routes/>
            
        </SafeAreaView>
     

      );
    }

    export default BusRoutes;
