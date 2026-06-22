import { View, Text, StyleSheet, Pressable, Button } from 'react-native';
import type { StaticScreenProps } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { CoursesStackParamList } from '../App';
import { useNavigation, useRoute } from '@react-navigation/native';
import haversineDistance from '../lib/CalculateDistance';
import fetchGolfHoles from '../lib/FetchGolfHoles'; // this may not be needed here due to the JSON file // ... which will be replaced by a database
import coursesData from '../data/courses.json';


type Props = StaticScreenProps<{
  courseId: number;
  courseName: string;
}>;

type NavigationProp = NativeStackNavigationProp<CoursesStackParamList, 'CourseInfo'>;

export default function CourseDetails({route}: Props) {

    // const courses = coursesData.courses
    const { courseId, courseName } = route.params;

    const course = coursesData.courses.find((c) => c.id === courseId)

    const whiteTeesInfo =  course?.tees.male.filter((tee) => tee.tee_name.toLowerCase() === "white");

    const navigation = useNavigation<NavigationProp>();

    return (
        <View style={styles.container}>
            <Text>{course?.club_name}</Text>
            <Text>{course?.location.address}</Text>
            <Text>Holes: {whiteTeesInfo?.map((tee) => {
                return tee.number_of_holes
            })}</Text>
            <Text>Par Total: {whiteTeesInfo?.map((tee) => {
                return tee.par_total
            })}</Text>
            <Text>Course Rating: {whiteTeesInfo?.map((tee) => {
                return tee.course_rating
            })}</Text>

            {course && (
                <Button 
                    title="Preview Course" 
                    onPress={() => navigation.navigate('CoursePrev', {courseId: course.id, courseName: course.club_name})}
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