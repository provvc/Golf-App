import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { CoursesStackParamList } from '../App';
import coursesData from '../data/courses.json';

type NavigationProp = NativeStackNavigationProp<CoursesStackParamList, 'CourseList'>;

export default function CoursesView() {
  const navigation = useNavigation<NavigationProp>();
  const courses = coursesData.courses;

  return (
    <View style={styles.container}>
      {courses.map((course) => (
        <Pressable
          key={course.id}
          onPress={() =>
            navigation.navigate('CourseInfo', {
              courseId: course.id,
              courseName: course.club_name,
            })
          }
        >
            
          <Text>{course.club_name}</Text>
        </Pressable>
      ))}
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