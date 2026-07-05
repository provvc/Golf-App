import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import MapView, { UrlTile, Marker, MapPressEvent } from 'react-native-maps';
import * as Location from 'expo-location';

type Point = {
  latitude: number;
  longitude: number;
};

type PinMode = 'none' | 'A' | 'B';

function haversineDistance(a: Point, b: Point): number {
  const R = 6371000;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.latitude)) * Math.cos(toRad(b.latitude)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.asin(Math.sqrt(h)) * 1.09361;
}

export default function DistanceMap() {
  const [pointA, setPointA] = useState<Point | null>(null);
  const [pointB, setPointB] = useState<Point | null>(null);
  const [userLocation, setUserLocation] = useState<Point | null>(null);
  const [pinMode, setPinMode] = useState<PinMode>('none');
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    let subscriber: Location.LocationSubscription | null = null;

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;

      const initial = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.BestForNavigation,
      });
      const initialPoint = {
        latitude: initial.coords.latitude,
        longitude: initial.coords.longitude,
      };
      setUserLocation(initialPoint);
      mapRef.current?.animateToRegion({
        ...initialPoint,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      }, 500);

      subscriber = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation,
          distanceInterval: 2,
        },
        (loc) => {
          const point = {
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
          };
          setUserLocation(point);
        }
      );
    })();

    return () => { subscriber?.remove(); };
  }, []);

  function handleMapPress(e: MapPressEvent) {
    const coord = e.nativeEvent.coordinate;
    if (pinMode === 'A') {
      setPointA(coord);
      setPinMode('none');
    } else if (pinMode === 'B') {
      setPointB(coord);
      setPinMode('none');
    }
  }

  function dropAtCurrentLocation(setter: (p: Point) => void) {
    if (!userLocation) return;
    setter(userLocation);
    setPinMode('none');
  }

  const distance = pointA && pointB ? haversineDistance(pointA, pointB) : null;

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        showsUserLocation
        onPress={handleMapPress}
        initialRegion={{
          latitude: 45.4215,
          longitude: -75.6972,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        <UrlTile
          urlTemplate="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          maximumZ={19}
          flipY={false}
        />
        {pointA && <Marker coordinate={pointA} title="Pin A" pinColor="blue" />}
        {pointB && <Marker coordinate={pointB} title="Pin B" pinColor="red" />}
      </MapView>

      {pinMode !== 'none' && (
        <View style={styles.modeBanner}>
          <Text style={styles.modeBannerText}>
            Tap anywhere on the map to place Pin {pinMode}
          </Text>
          <Pressable onPress={() => setPinMode('none')}>
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>
        </View>
      )}

      <View style={styles.controls}>
        {/* Pin A row */}
        <View style={styles.pinRow}>
          <Pressable
            style={[styles.button, styles.buttonBlue]}
            onPress={() => dropAtCurrentLocation(setPointA)}
          >
            <Text style={styles.buttonText}>Pin A — Here</Text>
          </Pressable>
          <Pressable
            style={[styles.button, styles.buttonOutline, pinMode === 'A' && styles.buttonActive]}
            onPress={() => setPinMode(pinMode === 'A' ? 'none' : 'A')}
          >
            <Text style={styles.buttonTextDark}>Pin A — Map</Text>
          </Pressable>
        </View>

        {/* Pin B row */}
        <View style={styles.pinRow}>
          <Pressable
            style={[styles.button, styles.buttonRed]}
            onPress={() => dropAtCurrentLocation(setPointB)}
          >
            <Text style={styles.buttonText}>Pin B — Here</Text>
          </Pressable>
          <Pressable
            style={[styles.button, styles.buttonOutline, pinMode === 'B' && styles.buttonActive]}
            onPress={() => setPinMode(pinMode === 'B' ? 'none' : 'B')}
          >
            <Text style={styles.buttonTextDark}>Pin B — Map</Text>
          </Pressable>
        </View>
        <View>
            <Pressable
            style={[styles.button, styles.buttonClear]}
            onPress={() => { setPointA(null); setPointB(null); }}
            >
                <Text style={styles.buttonText}>Clear Pins</Text>
            </Pressable>
        </View>

        {distance !== null && (
          <Text style={styles.distance}>
            {distance.toFixed(1)} yd
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  controls: { padding: 16, gap: 12, backgroundColor: '#fff' },
  pinRow: { flexDirection: 'row', gap: 8 },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonBlue: { backgroundColor: '#2563eb' },
  buttonRed: { backgroundColor: '#dc2626' },
  buttonOutline: {
    borderWidth: 1.5,
    borderColor: '#222',
    backgroundColor: 'transparent',
  },
  buttonActive: {
    borderColor: '#f59e0b',
    backgroundColor: '#fef3c7',
  },
  buttonText: { color: '#fff', fontWeight: '600' },
  buttonTextDark: { color: '#222', fontWeight: '600' },
  distance: { fontSize: 16, textAlign: 'center', fontWeight: '500' },
  modeBanner: {
    backgroundColor: '#1e293b',
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modeBannerText: { color: '#fff', fontSize: 14 },
  cancelText: { color: '#f59e0b', fontWeight: '600' },
  buttonClear: { backgroundColor: '#6b7280' },
});