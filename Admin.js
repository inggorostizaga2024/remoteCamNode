import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Button, Text, StyleSheet, ScrollView } from 'react-native';
import Video from 'react-native-video';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons'; // Optional: For adding icons
import axios from 'axios';


const AdminScreen = ({ navigation }) => { // add navigation prop

    const Tab = createBottomTabNavigator();
    function ProfileScreen({ navigation }) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Profile!</Text>
                <Button
                    title="Go to Settings"
                    onPress={() => navigation.navigate('Settings')}
                />
            </View>
        );
    }
    function SettingsScreen({ navigation }) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Settings!</Text>
                <Button title="Go to Home" onPress={() => navigation.navigate('Profile')} />
            </View>
        );
    }
    const [streamz, setStreams] = useState([]);
    const [token, setToken] = useState([]);


    const fetchStreams = () => {
        const x =  axios.get('http://159.223.199.239:8000/api/streams').then( response => {
            let streamsData = [];
            let index = 0;
            let data = response.data
            console.log(data)
            for (let app in data) {
                for (let name in data[app]) {
                    let stream = data[app][name].publisher;
                    let clients = data[app][name].subscribers;
                    if (stream) {
                        let now = new Date().getTime() / 1000;
                        let str = new Date(stream.connectCreated).getTime() / 1000;
                        let streamData = {
                            key: index++,
                            app,
                            name,
                            id: stream.clientId,
                            ip: stream.ip,
                            ac: stream.audio ? stream.audio.codec + " " + stream.audio.profile : "",
                            freq: stream.audio ? stream.audio.samplerate : "",
                            chan: stream.audio ? stream.audio.channels : "",
                            vc: stream.video ? stream.video.codec + " " + stream.video.profile : "",
                            size: stream.video ? stream.video.width + "x" + stream.video.height : "",
                            fps: stream.video ? Math.floor(stream.video.fps) : "",
                            time: secondsToDhmsSimple(now - str),
                            clients: clients.length
                        };

                        streamsData.push(streamData);
                    }
                }
            }
            return streamsData
        }).catch( err => console.log(err));

        console.log(x)
        x.then( res => setStreams(res));
    }

    const getLiveStreams = () => {
        /* const listActiveLiveStreams = [
             {
                 id: '1',
                 stateTransmision: 'Live',
                 streamName: 'demo_844',
                 deviceId: '11061987',
                 operatorName: 'Miguel Angel Gorostizaga',
                 operatorPosition: 'Bobcat Operator',
                 groupId: 1,
                 groupName: 'Construccion Tren Maya',
                 groupLocationCity: 'Merida',
                 groupLocationProvince: 'Yucatán',
                 lastGpsPosition: {latitude: '13.342,234234', longitude: '12.123,234'},
             },
             {
                 id: '2',
                 stateTransmision: 'Live',
                 streamName: 'Livestream2',
                 deviceId: '11061988',
                 operatorName: 'Roberto Martinez',
                 operatorPosition: 'Conductor Uber',
                 groupId: 1,
                 groupName: 'Uber',
                 groupLocationCity: 'Benito Juarez',
                 groupLocationProvince: 'CDMX',
                 lastGpsPosition: {latitude: '13.342,234234', longitude: '12.123,234'},
             },
             {
                 id: '3',
                 stateTransmision: 'Offline',
                 streamName: 'Livestream3',
                 deviceId: '11061989',
                 operatorName: 'Ramon Quiroz',
                 operatorPosition: 'Conductor Uber',
                 groupId: 2,
                 groupName: 'Bodega',
                 groupLocationCity: 'Iztapalapa',
                 groupLocationProvince: 'CDMX',
                 lastGpsPosition: {latitude: '13.342,234234', longitude: '12.123,234'},
             }
         ]; */
        console.log(streamz)
       /* if(streamz) {
            return streamz.map( (item, id) => {
                return <DashboardCard01 key={id} activeStreams={item} />
            })
        }else {

            return streamz.map( (item, id) => {
                return <DashboardCard01 key={id} activeStreams={item} />
            })

        } */
    }


    const MyGrid = () => {


        // Example array of videos
        fetchStreams();
        const videos = new Array(24).fill(null).map((_, index) => ({
            id: index,
            url: `http://example.com/video${index + 1}.mp4`
        }));

        const [selectedVideo, setSelectedVideo] = React.useState(null);

        return (
            <ScrollView contentContainerStyle={styles2.container}>
                {videos.map((video) => (
                    <TouchableOpacity key={video.id} style={styles2.card} onPress={() => setSelectedVideo(video.url)}>
                        <Text>Video {video.id + 1}</Text>
                    </TouchableOpacity>
                ))}
                {selectedVideo && (


                    <Video
                        source={{ uri: selectedVideo }}
                        style={styles2.video}
                        controls
                        fullscreen
                        resizeMode="contain"
                        onError={(e) => console.log(e)}
                    />
                )}
            </ScrollView>
        );
    };

    function OperadoresScreen({ navigation }) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Button title="Go to Operadores" onPress={() => navigation.navigate('Operadores')}/>

                <MyGrid />
            </View>
        );
    }

    return (
        <Tab.Navigator screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    if (route.name === 'Profile') {
                        iconName = focused ? 'ios-home' : 'ios-home-outline';
                    } else if (route.name === 'Settings') {
                        iconName = focused ? 'ios-settings' : 'ios-settings-outline';
                    } else if (route.name === 'Operadores') {
                        iconName = focused ? 'ios-person' : 'ios-person-outline';
                    }
                    // You can return any component that you like here!
                    return <Icon name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: 'blue',
                tabBarInactiveTintColor: 'gray',
            })}>
            <Tab.Screen name="Profile" component={ProfileScreen} />
            <Tab.Screen name="Settings" component={SettingsScreen} />
            <Tab.Screen name="Operadores" component={OperadoresScreen} />
        </Tab.Navigator>
    );
};


const styles2 = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        padding: 10
    },
    card: {
        width: '45%', // approximately two cards per row
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ddd',
        margin: 5,
    },
    video: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'black',
    },
});

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

export default AdminScreen;