import React, { useRef, useState, useEffect } from 'react'
import {
    View,
    Text,
    FlatList,
    Pressable,
    StyleSheet,
    Dimensions,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

const { width: SCREEN_WIDTH } = Dimensions.get('window')

const CARD_WIDTH = 50
const CARD_GAP = 10
const INACTIVE_CARD_WIDTH = 36

type CourseHole = {
    courseHoleId: number;
    courseHoleNumber: number;
    par: number;
    tee: { latitude: number; longitude: number };
    green: { latitude: number; longitude: number };
    fullLine: { latitude: number; longitude: number }[];
};

interface Props {
    holes: CourseHole[]
    initialHole?: number
    onHoleChange?: (hole: number) => void
    onHoleSelect?: (holeNumber: number) => void
}



export default function HoleCarousel({ holes, initialHole = 0, onHoleChange, onHoleSelect }: Props) {
    const [activeIndex, setActiveIndex] = useState(initialHole)
    const flatListRef = useRef<FlatList>(null)
    const navigation = useNavigation<BottomTabNavigationProp<any>>();

    useEffect(() => {
        navigation.getParent()?.setOptions({ tabBarStyle: { display: 'none' } });

        return () => {
            navigation.getParent()?.setOptions({ tabBarStyle: {
            position: 'absolute',
            marginHorizontal: 20,
            bottom: 24,
            borderRadius: 24,
            height: 68,
            borderTopWidth: 0,
            elevation: 0,
            }});
        };
    }, [navigation]);

    const scrollToIndex = (index: number) => {
        const clamped = Math.max(0, Math.min(index, holes.length - 1))
        setActiveIndex(clamped)
        onHoleChange?.(clamped)
        onHoleSelect?.(holes[clamped].courseHoleNumber)
        flatListRef.current?.scrollToIndex({ index: clamped, animated: true, viewPosition: 0.5 })
    }

    const renderCard = ({ item, index }: { item: CourseHole; index: number }) => {
        const isActive = index === activeIndex
        return (
            <Pressable
                onPress={() => scrollToIndex(index)}
                style={[styles.card, isActive ? styles.cardActive : styles.cardInactive]}
            >
                {isActive && <View style={styles.activeTopBar} />}
                <Text style={[styles.holeNum, isActive ? styles.holeNumActive : styles.holeNumInactive]}>
                    {item.courseHoleNumber}
                </Text>
                {isActive && (
                    <Text style={styles.par}>P{item.par}</Text>
                )}
            </Pressable>
        )
    }

    if (!holes.length) return null;

    return (
        <View style={styles.root}>
            <Text style={styles.label}>Hole</Text>
            <FlatList
                ref={flatListRef}
                data={holes}
                keyExtractor={(item) => String(item.courseHoleNumber)}
                renderItem={renderCard}
                horizontal
                showsHorizontalScrollIndicator={false}
                snapToInterval={INACTIVE_CARD_WIDTH + CARD_GAP}
                snapToAlignment="center"
                decelerationRate="fast"
                contentContainerStyle={styles.trackContent}
                ItemSeparatorComponent={() => <View style={{ width: CARD_GAP }} />}
                getItemLayout={(_, index) => ({
                    length: INACTIVE_CARD_WIDTH + CARD_GAP,
                    offset: (INACTIVE_CARD_WIDTH + CARD_GAP) * index,
                    index,
                })}
                initialScrollIndex={initialHole}
            />

            <View style={styles.dots}>
                {holes.map((_, i) => (
                    <View key={i} style={[styles.dot, i === activeIndex && styles.dotActive]} />
                ))}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    root: {
        alignItems: 'center',
        position: 'relative',
        top: '8%',
        gap: 2,
        paddingVertical: 6,
        paddingHorizontal: 13,
        backgroundColor: 'rgba(8, 18, 10, 0.78)',
        borderRadius: 100,
        borderWidth: 0.5,
        borderColor: 'rgba(255,255,255,0.10)',
        width: SCREEN_WIDTH - 35,
    },
    label: {
        fontSize: 10,
        fontWeight: '500',
        letterSpacing: 2.5,
        color: 'rgba(255,255,255,0.38)',
    },
    trackContent: {
        paddingHorizontal: 6,
        alignItems: 'center',
    },
    card: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 100,
        borderWidth: 0.5,
        overflow: 'hidden',
    },
    cardActive: {
        width: CARD_WIDTH,
        height: 60,
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderColor: 'rgba(74, 124, 89, 0.6)',
    },
    cardInactive: {
        width: INACTIVE_CARD_WIDTH,
        height: 50,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderColor: 'rgba(255,255,255,0.10)',
        opacity: 0.55,
    },
    activeTopBar: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 3,
    },
    holeNum: {
        color: '#ffffff',
        fontWeight: '700',
    },
    holeNumActive: { fontSize: 22 },
    holeNumInactive: { fontSize: 15 },
    par: {
        fontSize: 11,
        fontWeight: '500',
        color: '#4a7c59',
        marginTop: 2,
        letterSpacing: 0.5,
    },
    dots: {
        flexDirection: 'row',
        gap: 5,
        alignItems: 'center',
    },
    dot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: 'rgba(255,255,255,0.22)',
    },
    dotActive: {
        width: 16,
        borderRadius: 2,
        backgroundColor: '#4a7c59',
    },
})