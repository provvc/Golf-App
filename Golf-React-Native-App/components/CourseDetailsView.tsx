import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, ActivityIndicator } from 'react-native';
import type { StaticScreenProps } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { CoursesStackParamList } from '../App';
import { useNavigation } from '@react-navigation/native';

type Props = StaticScreenProps<{
  courseId: number;
  courseName: string;
}>;

type NavigationProp = NativeStackNavigationProp<CoursesStackParamList, 'CourseInfo'>;

type Course = {
  courseId: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  city: string;
  state: string;
  country: string;
};

export default function CourseDetails({ route }: Props) {

  const { courseId, courseName } = route.params;
  const navigation = useNavigation<NavigationProp>();

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch(`http://192.168.2.112:5239/api/Course/course/${courseId}`);
        if (!response.ok) throw new Error('Failed to fetch course');
        const data: Course = await response.json();
        setCourse(data);
      } catch (err) {
        setError('Could not load course details.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  if (loading) return <ActivityIndicator />;
  if (error) return <Text>{error}</Text>;

  return (
    <View style={styles.container}>
      <Text>{course?.name}</Text>
      <Text>{course?.address}</Text>
      <Text>{course?.city}, {course?.state}, {course?.country}</Text>

      {course && (
        <Button
          title="Preview Course"
          onPress={() => navigation.navigate('CoursePrev', { courseId: course.courseId, courseName: course.name })}
        />
      )}
      {course && (
        <Button
          title="Play Round"
          onPress={() => navigation.navigate('PlayRound', { courseId: course.courseId, courseName: course.name })}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});