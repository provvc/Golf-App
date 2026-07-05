import { StyleSheet, View } from 'react-native';
import { useState, useRef, useEffect } from 'react';
import haversineDistance from '../lib/CalculateDistance';
import MapView, { Marker, LatLng, Polyline } from 'react-native-maps';
import HoleCarousel from './CoursePreviewHoleCarousel';

type Coord = {
    latitude: number;
    longitude: number;
};

type CourseHole = {
    courseHoleId: number;
    courseHoleNumber: number;
    par: number;
    tee: Coord;
    green: Coord;
    fullLine: Coord[];
};

type Props = {
    route: {
        params: {
            courseId: number;
            courseName: string;
        };
    };
};

export default function CoursePreview({ route }: Props) {

    const { courseId } = route.params;

    const [holes, setHoles] = useState<CourseHole[]>([]);
    const [currentHoleIndex, setCurrentHoleIndex] = useState(0);
    const mapRef = useRef<MapView>(null);

    const currentHole = holes[currentHoleIndex];

    useEffect(() => {
        const fetchHoles = async () => {
            try {
                const response = await fetch(`http://192.168.2.112:5239/api/CourseHole/course/${courseId}`);
                if (!response.ok) throw new Error('Failed to fetch holes');
                const data: CourseHole[] = await response.json();
                setHoles(data);
            } catch (err) {
                console.error('Could not load course holes:', err);
            }
        };

        fetchHoles();
    }, [courseId]);

    useEffect(() => {
        if (!currentHole) return;

        const teeCoord = { latitude: currentHole.tee.latitude, longitude: currentHole.tee.longitude };
        const greenCoord = { latitude: currentHole.green.latitude, longitude: currentHole.green.longitude };
        const bearing = calculateBearing(teeCoord, greenCoord);

        const midpoint = {
            latitude: (teeCoord.latitude * 0.35 + greenCoord.latitude * 0.65),
            longitude: (teeCoord.longitude * 0.35 + greenCoord.longitude * 0.65),
        };

        const distanceBetweenTeeGreen = haversineDistance(teeCoord, greenCoord) / 1.09361;

        mapRef.current?.animateCamera({
            center: midpoint,
            heading: bearing,
            pitch: 0,
            altitude: distanceBetweenTeeGreen * 2.6,
        }, { duration: 500 });
    }, [currentHoleIndex, holes]);

    const handleHoleSelect = (holeNumber: number) => {
        setCurrentHoleIndex(holeNumber - 1);
    };

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

        return ((toDeg(Math.atan2(y, x))) + 360) % 360;
    }

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
                showsCompass={false}
            >
                {currentHole && (
                    <>
                        <Polyline
                            coordinates={currentHole.fullLine}
                            strokeColor='yellow'
                            strokeWidth={3}
                        />
                        {currentHole.fullLine.map((coord, index) => (
                            <Marker
                                key={index}
                                coordinate={coord}
                                anchor={{ x: 0.5, y: 0.5 }}
                            >
                                <View style={styles.dot} />
                            </Marker>
                        ))}
                        {/* <Marker
                            coordinate={currentHole.tee}
                            anchor={{ x: 0.5, y: 0.5 }}
                        >
                            <View style={styles.teeDot} />
                        </Marker>
                        <Marker
                            coordinate={currentHole.green}
                            anchor={{ x: 0.5, y: 0.5 }}
                        >
                            <View style={styles.greenDot} />
                        </Marker> */}
                    </>
                )}
            </MapView>

            <HoleCarousel holes={holes} onHoleSelect={handleHoleSelect} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#ffffff',
    },
    teeDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#ffffff',
    },
    greenDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#00ff00',
    },
});