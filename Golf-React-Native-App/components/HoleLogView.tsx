import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { HoleLogStackParamList } from '../App';

type NavigationProp = NativeStackNavigationProp<HoleLogStackParamList, 'HoleLogList'>;


export default function HoleLogView() {
  const navigation = useNavigation<NavigationProp>();

  return (
    <View style={styles.container}>
        <Text>This will be the hole log</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center',
    alignItems: 'center',
  },
});