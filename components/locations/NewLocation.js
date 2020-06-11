import { ScrollView } from "react-native";
import React, { useState, useEffect } from "react";
import styles from "../styles/global";
import { Button, Divider } from 'react-native-paper';
import CoordinateInfo from "./CoordinateInfo";
import Geolocation from 'react-native-geolocation-service';
// import ApproximateAddress from "./ApproximateAddress";
import LocationFormInputs from "./LocationFormInputs";
import { storeData } from '../DataStorage';
import Map from '../Map';

const NewLocation = () => {
    const [dateLocated, setDateLocated] = useState('');
    const [longitude, setLongitude] = useState(-122.20000);
    const [latitude, setLatitude] = useState(+47.61670);
    const [locationName, setLocationName] = useState('');
    const [locationNotes, setLocationNotes] = useState('');
    const [marker, setMarker] = useState(null);

    const getCoordinates = (pE) => {
        setDateLocated(new Date().toLocaleString());
        setLongitude(pE.nativeEvent.coordinate.longitude);
        setLatitude(pE.nativeEvent.coordinate.latitude);
        console.log(`Longitude: ${longitude} Latitude: ${latitude}`)
        setMarker([{ longitude, latitude }]);
    };

    const getGeolocation = () => {
        setDateLocated(new Date().toLocaleString());
        Geolocation.getCurrentPosition(
            (position) => {
                setLatitude(position.coords.latitude);
                setLongitude(position.coords.longitude);
            },
            (error) => {
                console.log(error.code, error.message);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 10000
            }
        );
    };

    const onLocationNameChange = (e) => {
        setLocationName(e);
        console.log(locationName);
    }

    const onLocationNoteChange = (e) => {
        setLocationNotes(e);
        console.log(locationNotes);
    }

    const addLocation = () => {

        let locationObject = {
            dateLocated,
            longitude,
            latitude,
            locationName,
            locationNotes
        }

        storeData(locationObject);
        console.log(`LocationObject: ${locationObject}`);
    };

    useEffect(() => {
        setMarker([{ longitude, latitude }]);
    }, [longitude, latitude]);

    return (
        <ScrollView style={styles.container}>
            <Map markers={marker} onPressEvent={e => getCoordinates(e)} ></Map>

            <Divider style={styles.divider} />

            <Button raised primary mode='contained' icon='map-search' color='green' style={styles.formControl}
                onPress={getGeolocation}>Get My Coordinates
            </Button>

            <CoordinateInfo dateLocated={dateLocated} longitude={longitude} latitude={latitude} />

            <Divider style={styles.divider} />

            <ApproximateAddress longitude={longitude} latitude={latitude} />

            <Divider style={styles.divider} />

            <LocationFormInputs locationNameEvent={onLocationNameChange} locationNotesEvent={onLocationNoteChange} />

            <Button raised primary mode='contained' icon='map-marker-plus' style={styles.submitButton}
                onPress={addLocation}>Add New Location</Button>
        </ScrollView>
    );
};

export default NewLocation;
