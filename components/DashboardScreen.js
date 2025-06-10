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

const DashboardScreen = ({ navigation, route }) => {
  const [user, setUser] = useState(null);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [timer, setTimer] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [currentDate, setCurrentDate] = useState('');
  const rotateAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    loadUserData();
    loadThemePreference();
    startTimer();
    updateDate();
  }, []);

  useEffect(() => {
    if (route.params?.refresh) {
      loadUserData();
      navigation.setParams({ refresh: false });
    }
  }, [route.params?.refresh]);

  const updateDate = () => {
    const now = new Date();
    const options = { day: 'numeric', month: 'long' };
    setCurrentDate(now.toLocaleDateString('en-US', options));
  };

  const startTimer = () => {
    const startTime = new Date();
    
    setInterval(() => {
      const currentTime = new Date();
      const diff = currentTime - startTime;
      
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setTimer({ hours, minutes, seconds });
    }, 1000);
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

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('currentUser');
      navigation.replace('Auth');
    } catch (error) {
      Alert.alert('Error', 'Failed to logout');
    }
  };

  const renderDashboardItem = (icon, title, onPress) => (
    <TouchableOpacity
      style={styles.dashboardItem}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Icon name={icon} size={30} color="white" style={styles.dashboardIcon} />
      <Text style={styles.dashboardTitle}>{title}</Text>
    </TouchableOpacity>
  );

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

  const renderTimer = () => (
    <View style={[styles.timerContainer, { backgroundColor: currentTheme.bubbleBg }]}>
      <View style={styles.timerSection}>
        <Text style={styles.timerLabel}>Session Time</Text>
        <View style={styles.timerDisplay}>
          <View style={styles.timeUnit}>
            <Text style={styles.timeValue}>{String(timer.hours).padStart(2, '0')}</Text>
            <Text style={styles.timeLabel}>Hours</Text>
          </View>
          <Text style={styles.timeSeparator}>:</Text>
          <View style={styles.timeUnit}>
            <Text style={styles.timeValue}>{String(timer.minutes).padStart(2, '0')}</Text>
            <Text style={styles.timeLabel}>Minutes</Text>
          </View>
          <Text style={styles.timeSeparator}>:</Text>
          <View style={styles.timeUnit}>
            <Text style={styles.timeValue}>{String(timer.seconds).padStart(2, '0')}</Text>
            <Text style={styles.timeLabel}>Seconds</Text>
          </View>
        </View>
      </View>
      <View style={styles.dateSection}>
        <Icon name="calendar" size={24} color="white" style={styles.dateIcon} />
        <Text style={styles.dateText}>{currentDate}</Text>
      </View>
    </View>
  );

  return (
    <LinearGradient
      colors={currentTheme.gradient}
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.userInfo}>
            {renderAvatar()}
            <View style={styles.userTextContainer}>
              <Text style={styles.welcomeText}>Welcome back,</Text>
              <Text style={styles.userName}>{user?.fullName || 'User'}</Text>
            </View>
          </View>
        </View>
        <View style={styles.headerRight}>
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
      </View>

      {/* Timer */}
      {renderTimer()}

      {/* Dashboard Items */}
      <View style={styles.dashboardGrid}>
        {renderDashboardItem('book-open-page-variant', 'Learning Path', () => navigation.navigate('LearningPath'))}
        {renderDashboardItem('trophy', 'Leaderboard', () => navigation.navigate('Leaderboard'))}
        {renderDashboardItem('account-group', 'Community', () => navigation.navigate('Community'))}
        {renderDashboardItem('cog', 'Settings', () => navigation.navigate('Settings'))}
      </View>

      {/* Logout Button at Bottom */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[styles.logoutButton, { backgroundColor: currentTheme.bubbleBg }]}
          onPress={handleLogout}
        >
          <Icon name="logout" size={24} color="white" />
          <Text style={styles.logoutText}>Logout</Text>
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
    paddingHorizontal: 15,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 15,
    borderRadius: 15,
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    color: '#ffffff',
    fontSize: 14,
    opacity: 0.8,
    marginTop: 5,
  },
  dashboardGrid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 16,
    marginBottom: 80,
  },
  dashboardItem: {
    width: '48%',
    aspectRatio: 1.2,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 15,
    padding: 16,
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dashboardIcon: {
    marginBottom: 8,
  },
  dashboardTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    alignItems: 'center',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 12,
    width: '100%',
  },
  logoutText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  timerContainer: {
    margin: 20,
    borderRadius: 15,
    padding: 20,
  },
  timerSection: {
    marginBottom: 15,
  },
  timerLabel: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  timerDisplay: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeUnit: {
    alignItems: 'center',
  },
  timeValue: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: 'bold',
  },
  timeLabel: {
    color: '#ffffff',
    fontSize: 12,
    opacity: 0.8,
  },
  timeSeparator: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: 'bold',
    marginHorizontal: 10,
  },
  dateSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
    paddingTop: 15,
  },
  dateIcon: {
    marginRight: 10,
  },
  dateText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default DashboardScreen; 