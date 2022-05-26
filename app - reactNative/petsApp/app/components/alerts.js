import React from 'react';
import { Alert } from 'react-native';

export const genericAlerts = (title, msg, navigate, nav) =>
    Alert.alert(
        title,
        msg,
        [
            { text: "OK", onPress: () => { nav.navigate(navigate); } }
        ]
    );