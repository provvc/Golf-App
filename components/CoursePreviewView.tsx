import { ScrollView, Text, StyleSheet, View, Button } from 'react-native';
import { useState, useRef, useEffect } from 'react';
import haversineDistance from '../lib/CalculateDistance';
import fetchGolfHoles from '../lib/FetchGolfHoles'; // this may not be needed here due to the JSON file // ... which will be replaced by a database
import course from '../data/kingsway.json';
import MapView, { UrlTile, Marker, MapPressEvent, LatLng , Polyline} from 'react-native-maps';


export default function CoursePreview() {

    const [currentHoleIndex, setCurrentHoleIndex] = useState(0);
    const mapRef = useRef<MapView>(null);

    const holes = course.holes;
    const currentHole = holes[currentHoleIndex];
    

    useEffect(() => {
        if (!currentHole) return;

        const teeCoord = { latitude: currentHole.tee.lat, longitude: currentHole.tee.lon };
        const greenCoord = { latitude: currentHole.green.lat, longitude: currentHole.green.lon };   
        const bearing = calculateBearing(teeCoord, greenCoord);

        const midpoint = {
            latitude: (teeCoord.latitude + greenCoord.latitude) / 2,
            longitude: (teeCoord.longitude + greenCoord.longitude) / 2,
        }

        const distanceBetweenTeeGreen = haversineDistance(teeCoord, greenCoord) / 1.09361;

        mapRef.current?.animateCamera({
                center: midpoint,
                heading: bearing,
                pitch: 0,
                altitude: distanceBetweenTeeGreen * 2.5,
            },
            { duration: 500 }
        );
    }, [currentHoleIndex]);

    function calculateBearing(start: LatLng, end: LatLng): number {
        const toRad = (deg: number) => (deg * Math.PI) / 180;
        const toDeg = (rad: number) => (rad * 180) / Math.PI;

        const lat1 = toRad(start.latitude);
        const lat2 = toRad(end.latitude);
        const dLon = toRad(end.longitude - start.longitude);

        const y = Math.sin(dLon) * Math.cos(lat2);
        const x =
            Math.cos(lat1) * Math.sin(lat2) -
            Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);

        const bearing = toDeg(Math.atan2(y, x));
        return (bearing + 360) % 360; // normalize to 0–360
    }

    function drawHoleLine() {
        
        const holeLine = currentHole.fullLine.map((coord) => ({
            latitude: coord.lat,
            longitude: coord.lon,
        }));

        return (
            <View>
                <Polyline
                    coordinates={holeLine}
                    strokeColor='yellow'
                    strokeWidth={3}
                />
                {holeLine.map((coord, index) => (
                    <Marker
                        key={index}
                        coordinate={{ latitude: coord.latitude, longitude: coord.longitude }}
                        anchor={{x: 0.5, y: 0.5}}
                    >
                        <View style={styles.dot}></View>
                    </Marker>
                    ))
                }
                
                    
            </View>
        );

    }

    function nextHole() {
        setCurrentHoleIndex((i) => Math.min(i + 1, holes.length - 1))
    }

    function previousHole() {
        setCurrentHoleIndex((i) => Math.max(i - 1, 0));
    }

    drawHoleLine();

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                ref={mapRef}
                scrollEnabled={false}
                rotateEnabled={false}
                pitchEnabled={false}
                zoomEnabled={false}
                mapType="satellite"
                
            >
                {drawHoleLine()}
                <Button 
                    title='Next Hole'
                    onPress={nextHole}
                />
                <Button 
                    title='Previous Hole'
                    onPress={previousHole}
                />
            </MapView>
        </View>
    );

}



const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    holesContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 1,
        marginVertical: 10
    },
    content: {
        padding: 16,
        alignItems: 'center',
    },
    map: {
        flex: 1
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#ffffff',
    }
});