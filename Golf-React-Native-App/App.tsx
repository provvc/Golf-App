import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import CoursesView from './components/CoursesView';
import CourseDetails from './components/CourseDetailsView';
import CoursePreview from './components/CoursePreviewView';

import HoleLogView from './components/HoleLogView';

import "./global.css";

// One source of truth for every route + its params, like an MVC route table
export type CoursesStackParamList = {
  CourseList: undefined;
  CourseInfo: { courseId: number; courseName: string };
  CoursePrev: { courseId: number; courseName: string };
};

export type HoleLogStackParamList = {
  HoleLogList: undefined;
}

const CourseStack = createNativeStackNavigator<CoursesStackParamList>();
const HoleLogStack =createNativeStackNavigator<HoleLogStackParamList>();

function CoursesStackScreen() {
  return (
    <CourseStack.Navigator screenOptions={{ headerShown: false }}>
      <CourseStack.Screen
        name="CourseList"
        component={CoursesView}
        options={{ headerShown: false }}
      />
      <CourseStack.Screen
        name="CourseInfo"
        component={CourseDetails}
        options={({ route }) => ({ title: `${route.params.courseName} Details` })}
      />
      <CourseStack.Screen name="CoursePrev" component={CoursePreview} options={({route}) => ({title: `${route.params.courseName}`})} />
    </CourseStack.Navigator>
  );
}

function HoleLogStackScreen() {
  return (
    <HoleLogStack.Navigator>
      <HoleLogStack.Screen 
        name="HoleLogList"
        component={HoleLogView}
        options={{ headerShown: false }}
      />
    </HoleLogStack.Navigator>
  );
}

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarIconStyle: {
            display: 'none'
          },
          tabBarActiveTintColor: '#2E7D32',
          tabBarInactiveTintColor: '#000000',
          tabBarActiveBackgroundColor: 'rgba(233, 233, 233, 0.85)',
          tabBarInactiveBackgroundColor: 'transparent',
          tabBarStyle: {
            position: 'absolute',
            marginHorizontal: 20,
            bottom: 24,
            left: 20,
            right: 20,
            borderRadius: 24,
            height: 68,
            // backgroundColor: 'rgba(75, 72, 72, 0.85)',
            borderTopWidth: 0,
            elevation: 0,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 12,
          },
          tabBarItemStyle: {
            borderRadius: 25,
            overflow: 'hidden'
          },
          tabBarLabelStyle: {
            fontSize: 11,
            marginBottom: 6,
          },
          headerStyle: {
            backgroundColor: 'rgba(255, 255, 255, 0.85)',
          },
          headerTitleStyle: {
            fontSize: 16,
            fontWeight: '500',
          },
          headerTransparent: true,
        }}
      >
        <Tab.Screen
          name="Courses"
          component={CoursesStackScreen}
          options={{ title: 'Courses', headerShown: false,}}
        /> 
        <Tab.Screen
          name="History"
          component={HoleLogStackScreen}
          options={{ title: 'History', headerShown: false }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}