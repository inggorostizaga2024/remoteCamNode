import * as React from 'react';
import { View, Text, StatusBar, TextInput, Button} from 'react-native';
import {useState} from "react";
import Streaming from "./Streaming";
 import {NavigationContainer, useNavigation} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from "./Login";
import AdminScreen from "./Admin";
 ;
function App() {

    const [channels, setChannels] = useState({playserver: "rtmp://159.223.199.239/live/", pushserver: "rtmp://159.223.199.239/live/", stream: 'demo_' + (Math.floor(Math.random() * (999 - 100)) + 100),})

    function InitialScreen(props) {

        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <View style={{ flex: 1, flexDirection: 'column', padding: 24, backgroundColor: '#333' }}>
                    <StatusBar
                        barStyle="light-content"
                        backgroundColor="#6a51ae"
                    />
                    <Text style={{ color: '#fff', fontSize: 48, marginTop: 36, marginBottom: 36 }}>Configuración Cámara</Text>
                    <Text style={{ color: '#fff', fontSize: 18 }}>Please enter a stream name.</Text>
                    <TextInput
                        style={{ color: '#fff', height: 40, padding: 8 }}
                        placeholder="Escribe el id de la Camara."
                        placeholderTextColor='#555'
                        value={channels.stream}
                        onChangeText={(stream) => {
                            let updateStream = {...channels, stream: stream}
                            setChannels(updateStream)
                        }
                        }
                    />
                    <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'space-between' }}>

                        <Button
                            title="Comenzar Transmisión"
                            onPress={() => props.navigation.navigate('Push', { 'pushserver': channels.pushserver, 'stream': channels.stream }) }
                        />
                    </View>

                </View>
            </View>
        );
    }



    const Stack = createNativeStackNavigator();


    return (
        <NavigationContainer>
                <Stack.Navigator initialRouteName="Login">
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Setup" component={InitialScreen} />
                <Stack.Screen name="Push"  component={Streaming} />
                <Stack.Screen name="Admin" component={AdminScreen} />
                </Stack.Navigator>
        </NavigationContainer>
    );
}

export default App;

/*

 <Stack.Screen name="Profile" component={ProfileScreen} />

    <Button
       onPress={() => navigation.navigate('Home', { 'playserver': this.state.playserver, 'stream': this.state.stream })}
       title="I Join"
                        />




                        ****
                           function RootStack() {
        return (
            <NavigationContainer>
                <Stack.Navigator
                    initialRouteName="Home"
                    headerMode="none"
                >
                    <Stack.Screen
                        name="Home"
                        component={HomeScreen}
                        options={{ title: 'Setup' }}
                    />
                    <Stack.Screen
                        name="Push"
                        component={Streaming}
                    />
                </Stack.Navigator>
            </NavigationContainer>

        );
    }


    return (
        <RootStack>
        </RootStack>
    );

 */