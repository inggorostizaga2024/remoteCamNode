import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import axios from 'axios';
import Streaming from "./Streaming";
import AdminScreen from "./Admin";

const LoginScreen = ({ navigation }) => { // add navigation prop
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    


    const handleLogin = () => {

        navigation.navigate('Admin');


        /* axios.post('https://yourapi.com/login', {
            username: username,
            password: password
        })
            .then(response => {
                navigation.navigate('Admin');
            })
            .catch(error => {
                setError(error.message);
            }); */
    };



    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Username"
                value={username}

            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                value={password}

            />
            <Button
                title="Login"
                onPress={handleLogin}
            />
            {error ? <Text style={styles.error}>{error}</Text> : null}

            <Button
                style={styles.button}
                title="Start Working"
                onPress={() => navigation.navigate('Setup')}
            />
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

export default LoginScreen;