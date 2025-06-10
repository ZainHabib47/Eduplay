import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const CommunityScreen = ({ navigation }) => {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [user, setUser] = useState(null);
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

  const renderDeveloperCard = (name, role, email, phone) => (
    <View style={[styles.developerCard, { backgroundColor: currentTheme.bubbleBg }]}>
      <View style={styles.developerHeader}>
        <Icon name="account-circle" size={50} color="white" />
        <View style={styles.developerInfo}>
          <Text style={styles.developerName}>{name}</Text>
          <Text style={styles.developerRole}>{role}</Text>
        </View>
      </View>
      <View style={styles.developerContact}>
        <View style={styles.contactItem}>
          <Icon name="email" size={20} color="white" style={styles.contactIcon} />
          <Text style={styles.contactText}>{email}</Text>
        </View>
        <View style={styles.contactItem}>
          <Icon name="phone" size={20} color="white" style={styles.contactIcon} />
          <Text style={styles.contactText}>{phone}</Text>
        </View>
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
      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>Our Team</Text>
        {renderDeveloperCard(
          'Zain Habib',
          'Frontend Developer,UI/UX Designer',
          'zainhabib047@gmail.com',
          '03189043757'
        )}
        {renderDeveloperCard(
          'Humaira Kauser',
          'Backend Developer'
        )}
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
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
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
  developerCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  developerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  developerInfo: {
    marginLeft: 15,
  },
  developerName: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  developerRole: {
    color: '#ffffff',
    fontSize: 16,
    opacity: 0.8,
  },
  developerContact: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
    paddingTop: 15,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  contactIcon: {
    marginRight: 10,
  },
  contactText: {
    color: '#ffffff',
    fontSize: 16,
  },
});

export default CommunityScreen; 