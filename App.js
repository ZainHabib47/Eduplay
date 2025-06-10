import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import IntroScreen from './components/IntroScreen';
import AuthScreen from './components/AuthScreen';
import DashboardScreen from './components/DashboardScreen';
import SettingsScreen from './components/SettingsScreen';
import CommunityScreen from './components/CommunityScreen';
import LearningPathScreen from './components/LearningPathScreen';
import TopicLadderScreen from './components/TopicLadderScreen';
import LessonScreen from './components/LessonScreen';
import CourseScreen from './components/CourseScreen';
import LeaderboardScreen from './components/LeaderboardScreen';
import CustomQuizScreen from './components/CustomQuizScreen';
import Quiz from './components/Quiz';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Intro"
        screenOptions={{
          headerShown: false,
          animation: 'fade',
          gestureEnabled: false,
          presentation: 'card',
        }}
      >
        <Stack.Screen 
          name="Intro" 
          component={IntroScreen}
          options={{
            animation: 'fade',
          }}
        />
        <Stack.Screen 
          name="Auth" 
          component={AuthScreen}
          options={{
            animation: 'fade',
          }}
        />
        <Stack.Screen 
          name="Dashboard" 
          component={DashboardScreen}
          options={{
            animation: 'fade',
            gestureEnabled: false,
          }}
        />
        <Stack.Screen 
          name="Settings" 
          component={SettingsScreen}
          options={{
            animation: 'fade',
            gestureEnabled: true,
            presentation: 'card',
          }}
        />
        <Stack.Screen 
          name="Community" 
          component={CommunityScreen}
          options={{
            animation: 'fade',
            gestureEnabled: true,
            presentation: 'card',
          }}
        />
        <Stack.Screen 
          name="LearningPath" 
          component={LearningPathScreen}
          options={{
            animation: 'fade',
            gestureEnabled: true,
            presentation: 'card',
          }}
        />
        <Stack.Screen 
          name="TopicLadder" 
          component={TopicLadderScreen}
          options={{
            animation: 'fade',
            gestureEnabled: true,
            presentation: 'card',
          }}
        />
        <Stack.Screen
          name="Lesson"
          component={LessonScreen}
          options={{
            headerShown: false,
            animation: 'slide_from_right',
            gestureEnabled: true,
            gestureDirection: 'horizontal',
            presentation: 'card',
          }}
        />
        <Stack.Screen
          name="Course"
          component={CourseScreen}
          options={{
            headerShown: false,
            animation: 'slide_from_right',
            gestureEnabled: true,
            gestureDirection: 'horizontal',
            presentation: 'card',
          }}
        />
        <Stack.Screen name="Leaderboard" component={LeaderboardScreen} />
        <Stack.Screen name="CustomQuiz" component={CustomQuizScreen} />
        <Stack.Screen name="Quiz" component={Quiz} />
      </Stack.Navigator>
    </NavigationContainer>
  );
} 