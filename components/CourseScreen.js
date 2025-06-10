import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const CourseScreen = ({ navigation, route }) => {
  const [user, setUser] = useState(null);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [selectedPath, setSelectedPath] = useState(null);
  const rotateAnim = useState(new Animated.Value(0))[0];

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
      'CSS Height/Width',
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
      'CSS Advanced',
    ],
    javascript: [
      'JavaScript Introduction',
      'JavaScript Where To',
      'JavaScript Output',
      'JavaScript Statements',
      'JavaScript Syntax',
      'JavaScript Comments',
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
      'JavaScript Numbers',
      'JavaScript Number Methods',
      'JavaScript Arrays',
      'JavaScript Array Methods',
      'JavaScript Array Sort',
      'JavaScript Array Iteration',
      'JavaScript Date Objects',
      'JavaScript Date Formats',
      'JavaScript Date Get Methods',
      'JavaScript Date Set Methods',
      'JavaScript Math Object',
      'JavaScript Random',
      'JavaScript Booleans',
      'JavaScript Comparisons',
      'JavaScript Conditions',
      'JavaScript Switch',
      'JavaScript Loop For',
      'JavaScript Loop While',
      'JavaScript Break',
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
      'JavaScript Advanced',
    ],
  };

  useEffect(() => {
    loadUserData();
    loadThemePreference();
  }, []);

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
        return;
      }
      const userData = JSON.parse(userJson);
      setUser(userData);
    } catch (error) {
      console.error('Error loading user data:', error);
      navigation.replace('Auth');
    }
  };

  const handleThemeToggle = async () => {
    const newTheme = !isDarkTheme;
    setIsDarkTheme(newTheme);
    
    try {
      await AsyncStorage.setItem('themePreference', JSON.stringify(newTheme));
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }

    Animated.sequence([
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: 0,
        duration: 0,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

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

  const renderAvatar = () => {
    if (!user?.avatar) {
      return (
        <View style={styles.avatarContainer}>
          <View style={[styles.avatarBackground, { backgroundColor: 'rgba(255, 255, 255, 0.2)' }]}>
            <Icon name="account" size={35} color="white" />
          </View>
        </View>
      );
    }

    return (
      <View style={styles.avatarContainer}>
        <View style={[styles.avatarBackground, { backgroundColor: user.avatar.color }]}>
          <Icon name={user.avatar.face} size={35} color="white" style={styles.avatarFace} />
          <Icon name={user.avatar.hair} size={25} color="white" style={styles.avatarHair} />
          <Icon name={user.avatar.mouth} size={20} color="white" style={styles.avatarMouth} />
          <Icon name="eye" size={15} color="white" style={[styles.avatarEye, styles.avatarEyeLeft]} />
          <Icon name="eye" size={15} color="white" style={[styles.avatarEye, styles.avatarEyeRight]} />
        </View>
      </View>
    );
  };

  const renderPathSelection = () => {
    return (
      <View style={styles.pathSelectionContainer}>
        <Text style={styles.pathTitle}>Choose Your Learning Path</Text>
        <View style={styles.pathButtonsContainer}>
          <TouchableOpacity
            style={[styles.pathButton, { backgroundColor: currentTheme.bubbleBg }]}
            onPress={() => setSelectedPath('css')}
          >
            <Icon name="language-css3" size={40} color="white" />
            <Text style={styles.pathButtonText}>CSS Course</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.pathButton, { backgroundColor: currentTheme.bubbleBg }]}
            onPress={() => setSelectedPath('javascript')}
          >
            <Icon name="language-javascript" size={40} color="white" />
            <Text style={styles.pathButtonText}>JavaScript Course</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderTopicBubbles = () => {
    if (!selectedPath) return null;

    return (
      <View style={styles.topicsContainer}>
        <Text style={styles.pathTitle}>
          {selectedPath === 'css' ? 'CSS Course Topics' : 'JavaScript Course Topics'}
        </Text>
        <ScrollView style={styles.topicsScroll}>
          <View style={styles.topicsGrid}>
            {topics[selectedPath].map((topic, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.topicBubble, { backgroundColor: currentTheme.bubbleBg }]}
                onPress={() => {
                  navigation.navigate('Lesson', { topic, path: selectedPath });
                }}
              >
                <Text style={styles.topicText}>{topic}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
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
          <View style={styles.userInfo}>
            {renderAvatar()}
            <View style={styles.userTextContainer}>
              <Text style={styles.welcomeText}>Welcome back,</Text>
              <Text style={styles.userName}>{user?.fullName || 'User'}</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity
          style={[styles.themeButton, { backgroundColor: currentTheme.bubbleBg }]}
          onPress={handleThemeToggle}
        >
          <Animated.View style={{ transform: [{ rotate: spin }] }}>
            <Icon 
              name={isDarkTheme ? 'weather-night' : 'weather-sunny'} 
              size={24} 
              color="white" 
            />
          </Animated.View>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {!selectedPath ? renderPathSelection() : renderTopicBubbles()}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    marginRight: 10,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarBackground: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  avatarFace: {
    position: 'absolute',
    top: 5,
  },
  avatarHair: {
    position: 'absolute',
    top: -5,
  },
  avatarMouth: {
    position: 'absolute',
    bottom: 5,
  },
  avatarEye: {
    position: 'absolute',
    top: 15,
  },
  avatarEyeLeft: {
    left: 10,
  },
  avatarEyeRight: {
    right: 10,
  },
  userTextContainer: {
    justifyContent: 'center',
  },
  welcomeText: {
    color: '#ffffff',
    fontSize: 14,
    opacity: 0.8,
  },
  userName: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  themeButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  pathSelectionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pathTitle: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  pathButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 20,
  },
  pathButton: {
    width: '45%',
    aspectRatio: 1,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  pathButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
  },
  topicsContainer: {
    flex: 1,
  },
  topicsScroll: {
    flex: 1,
  },
  topicsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
  topicBubble: {
    width: '48%',
    aspectRatio: 1.5,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    marginBottom: 15,
  },
  topicText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default CourseScreen; 