import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';

const RouteCard = ({routeNumber}) => {
    return (
        <TouchableOpacity
            className={{
                backgroundColor: "#3B71CA",
                borderRadius: 10,
                height: 20,
                width: 20,
            }}>
            <Text>RouteCard</Text>
        </TouchableOpacity>
    );
}

export default RouteCard;