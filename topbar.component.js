import React from 'react';
import { Camera } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { Col, Row, Grid } from "react-native-easy-grid";
import { View, Text, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';

import styles from './styles';

const { FlashMode: CameraFlashModes, Type: CameraTypes } = Camera.Constants;

export default ({capturing = false, setCameraType, onCaptureIn, onCaptureOut, onLongCapture, onShortCapture,
                }) => (
    <Grid style={styles.topBar}>
        <Row>

            <Col size={2} style={styles.alignCenter}>
                <TouchableWithoutFeedback>
                    <View style={[styles.captureBtn, capturing && styles.captureBtnActive]}>
                        <Text style={{color: '#ffffff', fontSize: 8, marginTop: 'auto', marginBottom: 'auto', marginLeft: 'auto', marginRight: 'auto' }} >GoLive!</Text>
                        {capturing &&  <View style={styles.captureBtnInternal} />}
                    </View>
                </TouchableWithoutFeedback>
            </Col>

        </Row>
    </Grid>
);