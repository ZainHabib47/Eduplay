import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const FIREBASE_DB_URL = 'https://eduplay-f8ca7-default-rtdb.firebaseio.com';

const TopicLadderScreen = ({ navigation, route }) => {
  const [user, setUser] = useState(null);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [progress, setProgress] = useState(0);
  const [completedTopics, setCompletedTopics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const rotateAnim = useState(new Animated.Value(0))[0];
  const fadeAnim = useState(new Animated.Value(0))[0];

  const { path } = route.params || { path: 'css' };

  const topics = {
    css: [
      'CSS Introduction',
      'Inline CSS',
      'Internal CSS',
      'External CSS',
      'CSS Selectors',
      'CSS Colors',
      'CSS Backgrounds',
      'CSS Borders',
      'CSS Margins',
      'CSS Padding',
      'CSS Height and Width',
      'CSS Box Model',
      'CSS Outline',
      'CSS Text',
      'CSS Fonts',
      'CSS Icons',
      'CSS Links',
      'CSS Lists',
      'CSS Tables',
      'CSS Display',
      'CSS Max-width',
      'CSS Position',
      'CSS Z-index',
      'CSS Overflow',
      'CSS Float',
      'CSS Inline-block',
      'CSS Align',
      'CSS Combinators',
      'CSS Pseudo-class',
      'CSS Pseudo-element',
      'CSS Opacity',
      'CSS Navigation Bar',
      'CSS Dropdowns',
      'CSS Image Gallery',
      'CSS Image Sprites',
      'CSS Attr Selectors',
      'CSS Forms',
      'CSS Counters',
      'CSS Website Layout',
      'CSS Units',
      'CSS Specificity',
      'CSS !important',
      'CSS Math Functions',
      'CSS Variables',
      'CSS Box Sizing',
      'CSS Media Queries',
      'CSS MQ Examples',
      'CSS Flexbox',
      'CSS Responsive',
      'CSS Grid',
      'CSS SASS',
      'CSS Examples',
    ],
    javascript: [
      'JavaScript Introduction',
      'JavaScript Where To',
      'JavaScript Output',
      'JavaScript Variables',
      'JavaScript Let',
      'JavaScript Const',
      'JavaScript Operators',
      'JavaScript Arithmetic',
      'JavaScript Assignment',
      'JavaScript Data Types',
      'JavaScript Functions',
      'JavaScript Objects',
      'JavaScript Events',
      'JavaScript Strings',
      'JavaScript String Methods',
      'JavaScript String Search',
      'JavaScript String Templates',
      'JavaScript Numbers',
      'JavaScript Number Methods',
      'JavaScript Arrays',
      'JavaScript Array Methods',
      'JavaScript Array Sort',
      'JavaScript Array Iteration',
      'JavaScript Array Const',
      'JavaScript Dates',
      'JavaScript Date Formats',
      'JavaScript Date Get Methods',
      'JavaScript Date Set Methods',
      'JavaScript Math',
      'JavaScript Random',
      'JavaScript Booleans',
      'JavaScript Comparisons',
      'JavaScript If Else',
      'JavaScript Switch',
      'JavaScript For Loop',
      'JavaScript For In',
      'JavaScript For Of',
      'JavaScript While Loop',
      'JavaScript Break',
      'JavaScript Iterables',
      'JavaScript Sets',
      'JavaScript Maps',
      'JavaScript Typeof',
      'JavaScript Type Conversion',
      'JavaScript Bitwise',
      'JavaScript RegExp',
      'JavaScript Errors',
      'JavaScript Scope',
      'JavaScript Hoisting',
      'JavaScript Strict Mode',
      'JavaScript this Keyword',
      'JavaScript Arrow Function',
      'JavaScript Classes',
      'JavaScript Modules',
      'JavaScript JSON',
      'JavaScript Debugging',
      'JavaScript Style Guide',
      'JavaScript Best Practices',
      'JavaScript Mistakes',
      'JavaScript Performance',
      'JavaScript Reserved Words',
      'JavaScript Versions',
      'JavaScript ES5',
      'JavaScript ES6',
      'JavaScript JSON',
      'JavaScript Forms',
      'JavaScript Objects',
      'JavaScript Functions',
      'JavaScript HTML DOM',
      'JavaScript Browser BOM',
      'JavaScript AJAX',
      'JavaScript vs jQuery',
      'JavaScript Graphics',
      'JavaScript Canvas',
      'JavaScript Plotly',
      'JavaScript Chart.js',
      'JavaScript Google Chart',
      'JavaScript Examples',
    ],
  };

  // Load user data and progress when component mounts
  useEffect(() => {
    let isMounted = true;
    const initialize = async () => {
      try {
        const userData = await loadUserData();
        if (isMounted && userData) {
          await loadThemePreference();
          await loadProgress(userData);
        }
      } catch (error) {
        console.error('Initialization error:', error);
      }
    };
    initialize();
    return () => { isMounted = false; };
  }, []);

  // Reload progress when screen comes into focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      if (user?.email) {
        await loadProgress(user);
      }
    });
    return unsubscribe;
  }, [navigation, user]);

  // Reload progress when path changes
  useEffect(() => {
    if (user?.email) {
      loadProgress(user);
    }
  }, [path]);

  const startAnimation = () => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    ]).start();
  };

  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('themePreference');
      if (savedTheme !== null) {
        setIsDarkTheme(JSON.parse(savedTheme));
      }
    } catch (error) {
      console.error('Error loading theme preference:', error);
    }
  };

  const loadUserData = async () => {
    try {
      const userJson = await AsyncStorage.getItem('currentUser');
      if (!userJson) {
        navigation.replace('Auth');
        return null;
      }
      const userData = JSON.parse(userJson);
      setUser(userData);
      console.log('Loaded user data:', userData.email);
      return userData;
    } catch (error) {
      console.error('Error loading user data:', error);
      navigation.replace('Auth');
      return null;
    }
  };

  const initializeUserProgress = async (userData) => {
    try {
      if (!userData?.completedTopics) {
        const initialData = {
          completedTopics: {
            css: [],
            javascript: []
          },
          totalTopics: 0,
          totalProgress: 0,
          lastUpdated: new Date().toISOString()
        };

        // Update Firebase
        const response = await fetch(`${FIREBASE_DB_URL}/users.json`);
        const data = await response.json();
        const userEntry = Object.entries(data).find(([_, user]) => user.email === userData.email);
        
        if (userEntry) {
          const [firebaseId] = userEntry;
          await fetch(`${FIREBASE_DB_URL}/users/${firebaseId}.json`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(initialData)
          });

          // Update local user data
          const updatedUserData = {
            ...userData,
            ...initialData
          };
          await AsyncStorage.setItem('currentUser', JSON.stringify(updatedUserData));
          setUser(updatedUserData);
          return updatedUserData;
        }
      }
      return userData;
    } catch (error) {
      console.error('Error initializing user progress:', error);
      return userData;
    }
  };

  const loadProgress = async (currentUser) => {
    try {
      setIsLoading(true);
      
      if (!currentUser?.email) {
        console.log('No user email found');
        return;
      }

      console.log('Loading progress for user:', currentUser.email);

      // Initialize user progress if needed
      const initializedUser = await initializeUserProgress(currentUser);

      // Get user data from Firebase
      const response = await fetch(`${FIREBASE_DB_URL}/users.json`);
      const data = await response.json();
      
      // Find user by email
      const userEntry = Object.entries(data).find(([_, userData]) => userData.email === initializedUser.email);
      
      if (userEntry) {
        const [firebaseId, firebaseUserData] = userEntry;
        console.log('Found user in Firebase:', firebaseId);
        
        // Ensure completedTopics structure exists
        const completedTopicsData = firebaseUserData.completedTopics || {
          css: [],
          javascript: []
        };

        // Get completed topics for current path
        const pathTopics = completedTopicsData[path] || [];
        console.log('Completed topics from Firebase:', pathTopics);
        
        // Update local storage
        const storageKey = `${initializedUser.email}_${path}Progress`;
        const progressData = {
          progress: (pathTopics.length / topics[path].length) * 100,
          completedTopics: pathTopics
        };
        await AsyncStorage.setItem(storageKey, JSON.stringify(progressData));
        
        // Update state
        setProgress(progressData.progress);
        setCompletedTopics(pathTopics);

        // Update local user data
        const updatedUserData = {
          ...initializedUser,
          ...firebaseUserData,
          completedTopics: completedTopicsData
        };
        await AsyncStorage.setItem('currentUser', JSON.stringify(updatedUserData));
        setUser(updatedUserData);
      } else {
        console.log('User not found in Firebase');
        setProgress(0);
        setCompletedTopics([]);
      }
    } catch (error) {
      console.error('Error loading progress:', error);
      setProgress(0);
      setCompletedTopics([]);
    } finally {
      setIsLoading(false);
    }
  };

  const updateFirebaseProgress = async (newCompletedTopics) => {
    try {
      if (!user?.email) return;

      // Get current user data from Firebase
      const response = await fetch(`${FIREBASE_DB_URL}/users.json`);
      const data = await response.json();
      
      const userEntry = Object.entries(data).find(([_, userData]) => userData.email === user.email);
      
      if (userEntry) {
        const [firebaseId, firebaseUserData] = userEntry;
        
        // Get completed topics from both paths
        const cssProgress = await AsyncStorage.getItem(`${user.email}_cssProgress`);
        const jsProgress = await AsyncStorage.getItem(`${user.email}_javascriptProgress`);
        
        const cssData = cssProgress ? JSON.parse(cssProgress) : { completedTopics: [] };
        const jsData = jsProgress ? JSON.parse(jsProgress) : { completedTopics: [] };
        
        // Ensure no duplicate topics
        const uniqueCssTopics = [...new Set(cssData.completedTopics)];
        const uniqueJsTopics = [...new Set(jsData.completedTopics)];
        
        // Calculate totals
        const totalTopics = uniqueCssTopics.length + uniqueJsTopics.length;
        const totalProgress = (totalTopics / (topics.css.length + topics.javascript.length)) * 100;

        // Update Firebase
        const updateData = {
          totalTopics,
          totalProgress,
          completedTopics: {
            css: uniqueCssTopics,
            javascript: uniqueJsTopics
          },
          lastUpdated: new Date().toISOString()
        };

        // Ensure Firebase update completes
        const updateResponse = await fetch(`${FIREBASE_DB_URL}/users/${firebaseId}.json`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updateData)
        });

        if (!updateResponse.ok) {
          throw new Error('Failed to update Firebase');
        }

        // Update local user data
        const updatedUserData = {
          ...firebaseUserData,
          ...updateData
        };
        await AsyncStorage.setItem('currentUser', JSON.stringify(updatedUserData));
        setUser(updatedUserData);
        
        console.log('Firebase updated successfully:', updateData);
      }
    } catch (error) {
      console.error('Error updating Firebase:', error);
      throw error;
    }
  };

  const handleTopicPress = async (topic) => {
    try {
      if (!user?.email) return;

      let newCompletedTopics;
      let newProgress;

      // Toggle topic completion
      if (completedTopics.includes(topic)) {
        newCompletedTopics = completedTopics.filter(t => t !== topic);
      } else {
        // Ensure no duplicate topics
        if (!completedTopics.includes(topic)) {
          newCompletedTopics = [...completedTopics, topic];
        } else {
          newCompletedTopics = completedTopics;
        }
      }
      
      newProgress = (newCompletedTopics.length / topics[path].length) * 100;

      // Update local storage
      const storageKey = `${user.email}_${path}Progress`;
      await AsyncStorage.setItem(storageKey, JSON.stringify({
        progress: newProgress,
        completedTopics: newCompletedTopics
      }));

      // Update state
      setProgress(newProgress);
      setCompletedTopics(newCompletedTopics);

      // Update Firebase
      await updateFirebaseProgress(newCompletedTopics);

      // Navigate to lesson only if marking a new topic
      if (!completedTopics.includes(topic)) {
        navigation.navigate('Lesson', { topic, path });
      }
    } catch (error) {
      console.error('Error handling topic press:', error);
      Alert.alert('Error', 'Failed to update progress');
    }
  };

  const theme = {
    light: {
      gradient: ['#4ECDC4', '#FF6B6B', '#45B7D1'],
      bubbleBg: 'rgba(255, 255, 255, 0.2)',
      text: '#ffffff',
    },
    dark: {
      gradient: ['#1a1a1a', '#2C3E50', '#34495E'],
      bubbleBg: 'rgba(255, 255, 255, 0.15)',
      text: '#ffffff',
    },
  };

  const currentTheme = isDarkTheme ? theme.dark : theme.light;

  const isTopicLocked = (topicIndex) => {
    if (topicIndex === 0) return false; // First topic is always unlocked
    const previousTopic = topics[path][topicIndex - 1];
    return !completedTopics.includes(previousTopic);
  };

  const handleRefresh = () => {
    loadProgress(user);
  };

  useEffect(() => {
    if (route.params?.refresh || route.params?.forceReset || route.params?.resetProgress) {
      handleRefresh();
    }
  }, [route.params?.refresh, route.params?.forceReset, route.params?.resetProgress]);

  useEffect(() => {
    if (route.params?.forceReset || route.params?.resetProgress) {
      setProgress(0);
      setCompletedTopics([]);
      navigation.setParams({ 
        forceReset: false,
        resetProgress: false
      });
    }
  }, [route.params?.forceReset, route.params?.resetProgress]);

  const renderTopicStep = (topic, index) => {
    const isCompleted = completedTopics.includes(topic);
    const locked = isTopicLocked(index);

    return (
      <TouchableOpacity
        key={index}
        style={[
          styles.topicStep,
          { backgroundColor: currentTheme.bubbleBg },
          isCompleted && styles.completedStep,
          locked && styles.lockedStep
        ]}
        onPress={() => {
          if (!locked) {
            handleTopicPress(topic);
          }
        }}
        disabled={locked}
      >
        <View style={styles.stepContent}>
          <View style={styles.stepNumber}>
            {isCompleted ? (
              <Icon name="check-circle" size={24} color="white" />
            ) : locked ? (
              <Icon name="lock" size={24} color="white" />
            ) : (
              <Text style={styles.stepNumberText}>{index + 1}</Text>
            )}
          </View>
          <View style={styles.stepInfo}>
            <Text style={styles.stepTitle}>{topic}</Text>
            <Text style={styles.stepStatus}>
              {isCompleted ? 'Completed' : locked ? 'Locked' : 'Available'}
            </Text>
          </View>
          {!locked && (
            <Icon 
              name="chevron-right" 
              size={24} 
              color="white" 
              style={styles.stepArrow}
            />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <LinearGradient
      colors={currentTheme.gradient}
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={[styles.backButton, { backgroundColor: currentTheme.bubbleBg }]}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-left" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {path === 'css' ? 'CSS Learning Path' : 'JavaScript Learning Path'}
          </Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressTitle}>Your Progress</Text>
          <Text style={styles.progressPercentage}>{Math.round(progress)}%</Text>
        </View>
        <View style={[styles.progressBar, { backgroundColor: currentTheme.bubbleBg }]}>
          <Animated.View
            style={[
              styles.progressFill,
              { width: `${progress}%` }
            ]}
          />
        </View>
      </View>

      {/* Topics List */}
      <ScrollView style={styles.topicsList}>
        {topics[path].map((topic, index) => renderTopicStep(topic, index))}
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: 48,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  progressContainer: {
    padding: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressTitle: {
    fontSize: 16,
    color: 'white',
  },
  progressPercentage: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4ECDC4',
  },
  topicsList: {
    flex: 1,
    padding: 16,
  },
  topicStep: {
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
  },
  stepContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  stepInfo: {
    flex: 1,
  },
  stepTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  stepStatus: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
  },
  stepArrow: {
    marginLeft: 8,
  },
  completedStep: {
    backgroundColor: 'rgba(78, 205, 196, 0.3)',
  },
  lockedStep: {
    opacity: 0.7,
  },
});

export default TopicLadderScreen; 