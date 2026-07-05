import { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  TextInput,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { CoursesStackParamList } from '../App';
import { useRef } from 'react';
import { Keyboard } from 'react-native';

type NavigationProp = NativeStackNavigationProp<CoursesStackParamList, 'CourseList'>;

type Course = {
  courseId: number;
  name: string;
  address: string;
};

export default function CoursesView() {
  const navigation = useNavigation<NavigationProp>();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const fetchCourses = async () => {
    try {
      setError(null);
      const response = await fetch('http://192.168.2.112:5239/api/Course/courses');
      if (!response.ok) throw new Error('Failed to fetch courses');
      const data: Course[] = await response.json();
      setCourses(data);
    } catch (err) {
      setError('Could not load courses. Pull down to try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchCourses();
  };

  const [isFocused, setIsFocused] = useState(false);
  const searchInputRef = useRef<TextInput>(null);

  const handleCancel = () => {
    setSearch('');
    Keyboard.dismiss();
    setIsFocused(false);
  };

  const filteredCourses = useMemo(() => {
    if (!search.trim()) return courses;
    return courses.filter((c) =>
      c.name.toLowerCase().includes(search.trim().toLowerCase())
    );
  }, [courses, search]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2E7D32" />
      </View>
    );
  }

  if (error && courses.length === 0) {
    return (
      <View style={styles.centered}>
        {/* <Ionicons name="cloud-offline-outline" size={48} color="#9CA3AF" /> */}
        <Text style={styles.errorText}>{error}</Text>
        <Pressable style={styles.retryButton} onPress={fetchCourses}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerSearchContainer}>
        <View style={styles.headerText}>
          <Text>All Courses</Text>
        </View>
        <View style={styles.searchContainer}>
          {/* <Ionicons name="search" size={18} color="#9CA3AF" style={styles.searchIcon} /> */}
          <TextInput
            ref={searchInputRef}
            style={styles.searchInput}
            placeholder="Search Courses..."
            placeholderTextColor="#9CA3AF"
            value={search}
            onChangeText={setSearch}
            onFocus={() => setIsFocused(true)}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
          />
          {search.length > 0 && (
            <Pressable onPress={() => setSearch('')} hitSlop={8} style={styles.clearIcon}>
              {/* <Ionicons name="close-circle" size={18} color="#9CA3AF" /> */}
            </Pressable>
          )}
          {(isFocused || search.length > 0) && (
            <Pressable onPress={handleCancel} hitSlop={8}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
          )}
        </View>
      </View>

      <FlatList
        data={filteredCourses}
        keyExtractor={(item) => item.courseId.toString()}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#2E7D32" />
        }
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            {/* <Ionicons name="golf-outline" size={40} color="#D1D5DB" /> */}
            <Text style={styles.emptyText}>
              {search ? 'No courses match your search' : 'No courses found'}
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <Pressable
            style={({ pressed }) => [
              styles.courseRow,
              pressed && styles.courseRowPressed,
            ]}
            onPress={() =>
              navigation.navigate('CourseInfo', {
                courseId: item.courseId,
                courseName: item.name,
              })
            }
          >

            <View style={styles.courseInfo}>
              <Text style={styles.courseName} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={styles.courseAddress}>
                {item.address}
              </Text>
              <Text style={styles.courseSubtext}>Tap to view course details</Text>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
    gap: 2,
  },
  headerText: {
    fontWeight: '600',
    color: '#111827',
    marginHorizontal: 16,
    marginBottom: 4,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  headerSearchContainer: {
    marginTop: 60,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    backgroundColor: '#F7F8FA',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 4,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cancelText: {
    fontSize: 14,
    color: '#2E7D32',
    fontWeight: '500',
  },
  clearIcon: {
    marginRight: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#111827',
    paddingVertical: 0,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
    flexGrow: 1,
  },
  separator: {
    height: 10,
  },
  courseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  courseRowPressed: {
    backgroundColor: '#F0FDF4',
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  courseInfo: {
    flex: 1,
    borderWidth: 0.2,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 15,
    backgroundColor: "#ffffff",
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 5,
  },
  courseName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  courseAddress: {
      fontSize: 12,
      fontWeight: '400',
      color: '#111827',
  },
  courseSubtext: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 14,
    color: '#9CA3AF',
  },
  errorText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 16,
    backgroundColor: '#2E7D32',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});