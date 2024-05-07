import React, {useState, useRef, useEffect, forwardRef} from 'react';
import {
  Alert,
  Button,
  LogBox,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  ToastAndroid,
  View,
  Image,
  SafeAreaView, SafeAreaViewBase, ImageBackground
} from 'react-native';
import   {NodeCameraView}  from 'react-native-nodemediaclient';
import ViewShot from 'react-native-view-shot';
import {Camera as MediaLibrary, Camera} from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import * as Media from "expo-media-library";
import Toolbar from './toolbar.component';
import TopBar from './topbar.component';
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';

import styles from './styles'


//var ws = new WebSocket('ws://192.168.100.254:8000');

import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import ImageSourcePropType from "deprecated-react-native-prop-types/DeprecatedImageSourcePropType";

//import MapLibreGL from '@maplibre/maplibre-react-native';
//MapLibreGL.setAccessToken(null);

import { useNavigation } from '@react-navigation/native';


const Streaming = (props) => {
  console.log(props.route.params.stream)

  const streamChannel = props.route.params.stream



  const LOCATION_TRACKING = 'location-tracking';

  let l1;
  let l2;

  const [latitud, setLatitud] = useState('');
  const [longitud, setLongitud] = useState('');


  TaskManager.defineTask(LOCATION_TRACKING, async ({ data, error }) => {
    if (error) {
      console.log('LOCATION_TRACKING task ERROR:', error);
      return;
    }
    if (data) {
      const { locations } = data;
      let lat = locations[0].coords.latitude;
      let long = locations[0].coords.longitude;

      setLatitud(locations[0].coords.latitude)
      setLongitud(locations[0].coords.longitude)

      l1 = lat;
      l2 = long;

      console.log(
          `${new Date(Date.now()).toLocaleString()}: ${lat},${long}`
      );
    }
  });



  const vbRef = useRef(null)
  const [capturing, setCapturing] = useState(false);
  const [flashMode, setFlashMode] = useState(Camera.Constants.FlashMode.off);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
  const [isRecording, setIsRecording] = useState(false);
  const [isRecordingVideo, setIsRecordingVideo] = useState(false);
  const [camera, setCamera] = useState(null);
  const [CameraPermission, setCameraPermission] = useState(null)
  const [AudioPermission, setAudioPermission] = useState(null)

  const [mediaPermission, setMediaPermission] = useState(null)
  const [permissionResponse, requestPermission] = Media.usePermissions();


  const [galleryPermission, setGalleryPermission] = useState(null);
  const [hasPermission, setHasPermission] = useState(false);

  const [awakeHolder, setAwakeHolder] = useState(false);
  const [locationStarted, setLocationStarted] = useState(false);


  const [img, setImage]  = useState('')

  const mapJson = {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Point",
        "geometry": {
          "type": "Point",
          "coordinates": [longitud, latitud]
        },
        "properties": {
          // OPTIONAL: default ""
          // A title to show when this item is clicked or
          // hovered over
          //"title": "A title",

          // OPTIONAL: default ""
          // A description to show when this item is clicked or
          // hovered over
          //"description": "A description",

          // OPTIONAL: default "medium"
          // specify the size of the marker. sizes
          // can be different pixel sizes in different
          // implementations
          // Value must be one of
          // "small"
          // "medium"
          // "large"
          "marker-size": "medium",

          // OPTIONAL: default ""
          // a symbol to position in the center of this icon
          // if not provided or "", no symbol is overlaid
          // and only the marker is shown
          // Allowed values include
          // - Icon ID
          // - An integer 0 through 9
          // - A lowercase character "a" through "z"
          "marker-symbol": "airport",

          // OPTIONAL: default "7e7e7e"
          // the marker's color
          //
          // value must follow COLOR RULES
          "marker-color": "#cb0c0c",

          // OPTIONAL: default "555555"
          // the color of a line as part of a polygon, polyline, or
          // multigeometry
          //
          // value must follow COLOR RULES
          "stroke": "#ffffff",

          // OPTIONAL: default 1.0
          // the opacity of the line component of a polygon, polyline, or
          // multigeometry
          //
          // value must be a floating point number greater than or equal to
          // zero and less or equal to than one
          "stroke-opacity": 1.0,

          // OPTIONAL: default 2
          // the width of the line component of a polygon, polyline, or
          // multigeometry
          //
          // value must be a floating point number greater than or equal to 0
          "stroke-width": 2,

          // OPTIONAL: default "555555"
          // the color of the interior of a polygon
          //
          // value must follow COLOR RULES
          "fill": "#cb0c0c",

          // OPTIONAL: default 0.6
          // the opacity of the interior of a polygon. Implementations
          // may choose to set this to 0 for line features.
          //
          // value must be a floating point number greater than or equal to
          // zero and less or equal to than one
          "fill-opacity": 0.5
        }
      }]
  };

  const styledMap = {
    "type": "Feature",
    "geometry": {
      "type": "Point",
      "coordinates": [longitud, latitud]
    },
    "properties": {
      "name": "Dinagat Islands"
    }
  }

  const ActionStyles = StyleSheet.create({
    actionButtonIcon: {
      fontSize: 22,
      height: 24,
      color: 'white',
    },
  });

  const Mapstyles = StyleSheet.create({
    page: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#F5FCFF',
    },
    mapa: {
      flex: 1,
      alignSelf: 'stretch',
    },
  });

  const permisionFunction = async () => {
    // here is how you can get the camera permission




    const cameraPermission = await Camera.requestCameraPermissionsAsync();
    const audioPermission = await Camera.requestMicrophonePermissionsAsync();

    const mediaPermission = await Media.requestPermissionsAsync();


    const imagePermission = await ImagePicker.getMediaLibraryPermissionsAsync();


    setCameraPermission(cameraPermission.status === 'granted');
    setAudioPermission(audioPermission.status === 'granted');
    setGalleryPermission(imagePermission.status === 'granted');
    setHasPermission(true)
    if (audioPermission.status !== 'granted' && imagePermission.status !== 'granted' && cameraPermission.status !== 'granted') {
      alert('Permission for media access needed.');
    }
  };

  const settings = {
    camera: {cameraId: 0, cameraFrontMirror: false},
    audio: {bitrate: 32000, profile: 1, samplerate: 44100},
    video: {
      preset: 2,
      bitrate: 400000,
      profile: 1,
      fps: 30,
      videoFrontMirror: false
    }
  };

  useEffect(() => {

    LogBox.ignoreLogs(['Animated: `useNativeDriver`']);
    (async () => {
      checkPermissions();
      permisionFunction();
      await MediaLibrary.requestCameraPermissionsAsync();
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setCameraPermission(cameraStatus.status === 'granted');
    })()
  }, []);

  useEffect(() => {

    if(latitud && longitud){

      (async () => {
        await getImg(latitud,longitud)
      })()

    }
  }, [latitud])


  const getImg = async(latitud, longitud) => {

    let  json = {
      "type":"FeatureCollection",
      "features":[
        {
          "type":"Feature","properties":{"marker-color":"#462eff","marker-size":"medium","marker-symbol":"bus"},
          "geometry":{
            "type":"Point",
            "coordinates":[ latitud, longitud ]
          }
        },
        {
          "type":"Feature",
          "properties":{
            "marker-color":"#e99401",
            "marker-size":"medium",
            "marker-symbol":"park"
          },
          "geometry":{
            "type":"Point",
            "coordinates":[-122.25916385650635,37.80629162635318]}
        },
        {
          "type":"Feature",
          "properties":{
            "marker-color":"#d505ff",
            "marker-size":"medium",
            "marker-symbol":"music"},
          "geometry":{"type":"Point","coordinates":[-122.25650310516359,37.8063933469406]}
        }
      ]
    }
    await getStaticMap(latitud,longitud);

  }

  const getStaticMap = async (latitud, longitud) => {
    let uri = `https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/geojson(${JSON.stringify(styledMap)})/${longitud},${latitud},15.25,0,60/400x400?access_token=sk.eyJ1IjoidHJheWt6MTk4OCIsImEiOiJjbGg1aG5yejgyN2dsM21wbTlkMDU4cGV0In0.nYjy5fzl__gtWoWjNenmJg`
    //,{bearing},{pitch}|{bbox}|{auto}/{width}x{height}{@2x}`


    fetch(uri).then(response => {

      let resImage = JSON.stringify(response.url)
      let x = resImage.replace(/"/g, "");
      setImage(x)
    })

  };

  useEffect(()=>{
    console.log(img)
  }, [img])

  const checkPermissions = async () => {
    console.log("Checking Permissions Android");
    try {
      const granted =
          await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.CAMERA,
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
          ]);
      let hasAllPermissions = '';
      Object.keys(granted).forEach(key => {
        // key: the name of the object key
        // index: the ordinal position of the key within the object
        if (granted[key] !== "granted") {
          console.log("Does not have permission for: ", granted[key]);
          hasAllPermissions = false;
        }

      });

      hasAllPermissions = true
      console.log("hasAllPermissions: ", hasAllPermissions);
      setHasPermission(hasAllPermissions)

    } catch (err) {
      console.warn(err);
    }
  };
  const startRecordingVideo = async () => {

    if (Platform.OS === "android") {
      const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'My App Storage Permission',
            message: 'My App needs access to your storage ' + 'so you can save your photos',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
      );

      if (!hasPermission) {
        await checkPermissions()
      }else{
        if (camera) {
          setCapturing(true)
          setIsRecordingVideo(true);
          const options = { quality: '1080p', maxDuration: 30 };
          const data = await camera.recordAsync(options);
          const videoURI = data.uri;
          const saveOptions = { type: 'video',  album: 'NodeMediaClient'};
          /*...(Platform.OS === 'ios' && {previewImage: viewShotRef.current,})*/
          await Media.saveToLibraryAsync(videoURI)
          setIsRecordingVideo(false);
          setCapturing(false)
        }
      }

    }

  };
  const stopRecordingVideo = () => {
    if(capturing){
      camera.stopRecording();
      setIsRecordingVideo(false);
    }

  };

  useEffect(() => {
    if(isRecording){
      vbRef ? vbRef.current.start() : console.log(vbRef)
    }else{
      vbRef ?  console.log(vbRef) : vbRef.current.stop()
    }
  },[isRecording])

  const startBroadcasting = async () => {
    if (Platform.OS === "android") {
      if (!hasPermission) {
        await checkPermissions()
      } else {
        setIsRecording(true);
        vbRef.current.start();
        //  vbRef.current = prueba
        //  console.log(prueba)
      }
    }

  }

  const stopBroadcasting = () => {
    setIsRecording(false);
    vbRef.current.stop();
  };

  const startLocationTracking = async () => {

    if (Platform.OS === "android") {
      if (!hasPermission) {
        await checkPermissions()
      } else {
        await Location.startLocationUpdatesAsync(LOCATION_TRACKING, {
          accuracy: Location.Accuracy.BestForNavigation,
          timeInterval: 20000,
          distanceInterval: 0,
          foregroundService: {
            notificationTitle: "BackgroundLocation Is On",
            notificationBody: "We are tracking your location",
            notificationColor: "#ffce52",
          },
        });

      }
    }



    /*await Location.startLocationUpdatesAsync(LOCATION_TRACKING, {
      accuracy: Location.Accuracy.Highest,
      timeInterval: 5000,
      distanceInterval: 0,
    });*/
    const hasStarted = await Location.hasStartedLocationUpdatesAsync(
        LOCATION_TRACKING
    );
    console.log('hasestarde');
    console.log(hasStarted);
    setLocationStarted(hasStarted);
    console.log('tracking started?', hasStarted);
  };

  const stopLocation = () => {
    setLocationStarted(false);
    TaskManager.isTaskRegisteredAsync(LOCATION_TRACKING)
        .then((tracking) => {
          if (tracking) {
            Location.stopLocationUpdatesAsync(LOCATION_TRACKING);
          }
        })
  }


  const viewShotRef = useRef(null);



  return (
      <React.Fragment>
        <View style={{ flex: 1 }}>
          {Platform.OS === 'ios' && (
              <ViewShot ref={viewShotRef} style={{ width: 100, height: 100, position: 'absolute', top: -1000 }}/>
          )}

          { isRecording ?
              ( <NodeCameraView
                  ref={vbRef}
                  style={{ width: '100%', height: '100%' }}
                  outputUrl={`rtmp://159.223.199.239/live/${streamChannel}`}

                  camera={settings.camera}
                  audio={settings.audio}
                  video={settings.video}
                  autopreview={true}
                  onStatus={(code, msg) => {
                    console.log("onStatus=" + code + " msg=" + msg);
                  }}
              /> )
              :
              ( <Camera
                  style={styles.preview}
                  ref={ (r) => {  setCamera(r)} }
                  flashMode = {flashMode}
                  type={cameraType}
              /> )

          }


          <ActionButton
              buttonColor="rgba(231,76,60,1)"
              // position='left'
              offsetY={32}
              offsetX={16}
              size={42}
              hideShadow={true}
              verticalOrientation='down'
              onPress={() => {  }}
          >
            <Icon color="#ffffff" name="menu-outline" style={styles.actionButtonIcon} />




            {isRecording ? (

                <ActionButton.Item buttonColor='rgba(231,76,60,1)' title="Stop Live!" onPress={stopBroadcasting}>
                  <Icon color="#ffffff" name="radio-outline" style={styles.actionButtonIcon} />
                </ActionButton.Item>
            ) : (
                <ActionButton.Item buttonColor='rgba(231,76,60,1)' title="GoLive!" onPress={startBroadcasting}>
                  <Icon color="#ffffff" name="radio-outline" style={styles.actionButtonIcon} />
                </ActionButton.Item>
            )}

            {locationStarted ? (
                <ActionButton.Item buttonColor='#02D4FE' title="Gps Off" onPress={stopLocation}>
                  <Icon color="#ffffff" name="compass-outline" style={ActionStyles.actionButtonIcon} />
                </ActionButton.Item>
            )  : (
                <ActionButton.Item buttonColor='#02D4FE' title="GPS On" onPress={startLocationTracking}>
                  <Icon color="#ffffff" name="compass-outline" style={ActionStyles.actionButtonIcon} />
                </ActionButton.Item>
            ) }





          </ActionButton>



          <Text style={{color: '#ffffff', marginTop: 10,textAlign:'center'}}>Coordenadas  "{  latitud }" : "{longitud}"</Text>


          <Toolbar
              capturing= { capturing }
              onCaptureIn={startRecordingVideo}
              onCaptureOut={stopRecordingVideo}
              flashMode={flashMode}
              cameraType={cameraType}
              setFlashMode={ (flashMode) => setFlashMode( flashMode ) }
              setCameraType={ (cameraType) => setCameraType( cameraType ) }

          />




        </View>

        <View style={{ flex: .5, backgroundColor: 'white'}}>




          {img ? (


              <Image
                  style={{width: '100%', height: '100%'}}
                  source={{uri: `${img}` }}
              />


          ) : ( <Text>Canal: {streamChannel}, Sin Gps Activo</Text> ) }



        </View>



      </React.Fragment>
  );
};

export default Streaming;


/*


LOCAL DEV =    outputUrl={'rtmp://192.168.100.254/live/test'}


style={{flex: 1,width:"100%"}}
 outputUrl={'rtmp://192.168.100.254/live/test_stream'}
outputUrl={'rtmp://global-live.mux.com:5222/app/7d2dd932-7736-8137-b315-b5a696e434d7'}

ReactNative TOKEN MAPBOX = sk.eyJ1IjoidHJheWt6MTk4OCIsImEiOiJjbGg1aG5yejgyN2dsM21wbTlkMDU4cGV0In0.nYjy5fzl__gtWoWjNenmJg

rtmp://120.79.58.1:6604/3/3?AVType=1&jsession=923E9E7DDE1397BCAC8C8906B32DEA37&DevIDNO=4655&Channel=0&Stream=1

'rtmp://a.rtmp.youtube.com/live2/14fv-pqc3-6fk2-0932-83jk'


//outputUrl={'rstp://120.79.58.1:6604/3/3?AVType=1&jsession=DF08927BECF49797DE8CE9B134317494&DevIDNO=088324000001&Channel=1&Stream=1'}



  <View style={{backgroundColor: 'transparent', width: 'auto', marginTop: 10, borderColor:'white',borderBottomWidth:1,borderTopWidth:1}}>

            <Text style={{color: '#ffffff', textAlign:'center', fontSize: 14}}>{ (isRecording) ? 'Live Stream' : 'Offline'}</Text>

          </View>

 */


