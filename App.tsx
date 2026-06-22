import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import CoursesView from './components/CoursesView';
import CourseDetails from './components/CourseDetailsView';
import CoursePreview from './components/CoursePreviewView';

import "./global.css";

// One source of truth for every route + its params, like an MVC route table
export type CoursesStackParamList = {
  CourseList: undefined;
  CourseInfo: { courseId: number; courseName: string };
  CoursePrev: { courseId: number; courseName: string };
};

const Stack = createNativeStackNavigator<CoursesStackParamList>();

function CoursesStackScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="CourseList"
        component={CoursesView}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CourseInfo"
        component={CourseDetails}
        options={({ route }) => ({ title: `${route.params.courseName} Details` })}
      />
      <Stack.Screen name="CoursePrev" component={CoursePreview} options={({route}) => ({title: `${route.params.courseName}`})} />
    </Stack.Navigator>
  );
}

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#2e7d32',
          tabBarInactiveTintColor: '#888',
        }}
      >
        <Tab.Screen
          name="Courses"
          component={CoursesStackScreen}
          options={{ title: 'Courses', headerShown: false }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}