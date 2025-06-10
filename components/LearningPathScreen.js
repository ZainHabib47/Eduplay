import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const LearningPathScreen = ({ navigation, route }) => {
  const [user, setUser] = useState(null);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const rotateAnim = useState(new Animated.Value(0))[0];

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

  const renderLearningPath = (title, icon, onPress) => (
    <TouchableOpacity
      style={[styles.pathCard, { backgroundColor: currentTheme.bubbleBg }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Icon name={icon} size={40} color="white" style={styles.pathIcon} />
      <Text style={styles.pathTitle}>{title}</Text>
      <Icon name="chevron-right" size={24} color="white" style={styles.arrowIcon} />
    </TouchableOpacity>
  );

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
          <Text style={styles.headerTitle}>Learning Path</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={[styles.leaderboardButton, { backgroundColor: currentTheme.bubbleBg }]}
            onPress={() => navigation.navigate('Leaderboard')}
          >
            <Icon name="trophy" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.quizButton, { backgroundColor: currentTheme.bubbleBg }]}
            onPress={() => navigation.navigate('CustomQuiz')}
          >
            <Icon name="help-circle" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Learning Paths */}
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Choose Your Learning Path</Text>
        {renderLearningPath('CSS Mastery', 'language-css3', () => navigation.navigate('TopicLadder', { path: 'css' }))}
        {renderLearningPath('JavaScript Journey', 'language-javascript', () => navigation.navigate('TopicLadder', { path: 'javascript' }))}
        
        {/* Quiz Section */}
        <Text style={[styles.sectionTitle, { marginTop: 30 }]}>Test Your Knowledge</Text>
        <TouchableOpacity
          style={[styles.quizCard, { backgroundColor: currentTheme.bubbleBg }]}
          onPress={() => navigation.navigate('CustomQuiz')}
          activeOpacity={0.8}
        >
          <View style={styles.quizContent}>
            <Icon name="help-circle" size={40} color="white" style={styles.quizIcon} />
            <View style={styles.quizTextContainer}>
              <Text style={styles.quizTitle}>Take a Quiz</Text>
              <Text style={styles.quizDescription}>Test your knowledge with interactive quizzes</Text>
            </View>
            <Icon name="chevron-right" size={24} color="white" style={styles.arrowIcon} />
          </View>
        </TouchableOpacity>
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
  headerRight: {
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
  sectionTitle: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  pathCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  pathIcon: {
    marginRight: 15,
  },
  pathTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  arrowIcon: {
    opacity: 0.7,
  },
  leaderboardButton: {
    padding: 8,
    borderRadius: 20,
    marginLeft: 12,
  },
  quizButton: {
    padding: 8,
    borderRadius: 20,
    marginLeft: 12,
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  quizCard: {
    borderRadius: 15,
    marginTop: 10,
    overflow: 'hidden',
  },
  quizContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  quizIcon: {
    marginRight: 15,
  },
  quizTextContainer: {
    flex: 1,
  },
  quizTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  quizDescription: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
  },
});

export default LearningPathScreen; 