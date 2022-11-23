import React from 'react';
import {View, Text, ScrollView} from 'react'
import RouteCard from './routeCard.js';

const Routes = () => {
    return (

        <ScrollView
            comtentContainerStyle={{
              paddingHorizontal: 10, 
              paddingTop: 10,  
            }}
            horizontal
            showHorizontalScrollIndicator={false}
        >
        <RouteCard routeNumber="1"/>
        <RouteCard routeNumber="2"/>
        <RouteCard routeNumber="3"/>
        <RouteCard routeNumber="4"/>
        <RouteCard routeNumber="5"/>
        <RouteCard routeNumber="6"/>
        <RouteCard routeNumber="7"/>
        <RouteCard routeNumber="8"/>
        <RouteCard routeNumber="9"/>
        <RouteCard routeNumber="10"/>
        <RouteCard routeNumber="11"/>
        </ScrollView>
        
    ); 
}

export default Routes; 