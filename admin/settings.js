import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';

const SettingsScreen = ({ navigation }) => { // add navigation prop



    return (
        <View style={styles.container}>
            <Text title={'Settings'}/>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    input: {
        height: 40,
        marginBottom: 12,
        borderWidth: 1,
        padding: 10,
    },
    error: {
        color: 'red',
    },
});

export default SettingsScreen;