import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const FIREBASE_DB_URL = 'https://eduplay-f8ca7-default-rtdb.firebaseio.com';

const LeaderboardScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const fadeAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    const initialize = async () => {
      await loadUserData();
      await loadThemePreference();
      await fetchLeaderboardData();
    };
    initialize();

    // Add focus listener to refresh data when screen comes into focus
    const unsubscribe = navigation.addListener('focus', () => {
      fetchLeaderboardData();
    });

    return unsubscribe;
  }, [navigation]);

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

  const fetchLeaderboardData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${FIREBASE_DB_URL}/users.json`);
      const data = await response.json();
      
      if (data) {
        // Convert object to array and add user IDs
        const users = Object.entries(data).map(([id, userData]) => ({
          id,
          ...userData,
          totalTopics: userData.totalTopics || 0,
          totalProgress: userData.totalProgress || 0
        }));

        // Sort users by total topics only
        const sortedUsers = users.sort((a, b) => b.totalTopics - a.totalTopics);
        
        setLeaderboardData(sortedUsers);
      }
    } catch (error) {
      console.error('Error fetching leaderboard data:', error);
      Alert.alert('Error', 'Failed to load leaderboard data');
    } finally {
      setIsLoading(false);
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

  const renderLeaderboardItem = (user, index) => {
    const isCurrentUser = user.email === user?.email;
    const rank = index + 1;

    return (
      <View
        key={user.id}
        style={[
          styles.leaderboardItem,
          { backgroundColor: currentTheme.bubbleBg },
          isCurrentUser && styles.currentUserItem,
        ]}
      >
        <View style={styles.rankContainer}>
          {rank <= 3 ? (
            <Icon
              name={`numeric-${rank}-circle`}
              size={30}
              color={rank === 1 ? '#FFD700' : rank === 2 ? '#C0C0C0' : '#CD7F32'}
            />
          ) : (
            <Text style={styles.rankText}>{rank}</Text>
          )}
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user.fullName}</Text>
          <Text style={styles.userStats}>
            {user.totalTopics || 0} Topics Completed
          </Text>
        </View>
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreText}>{Math.round(user.totalProgress || 0)}%</Text>
        </View>
      </View>
    );
  };

  return (
    <LinearGradient
      colors={currentTheme.gradient}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: currentTheme.bubbleBg }]}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Leaderboard</Text>
        <TouchableOpacity
          style={[styles.refreshButton, { backgroundColor: currentTheme.bubbleBg }]}
          onPress={fetchLeaderboardData}
        >
          <Icon name="refresh" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="white" />
        </View>
      ) : (
        <ScrollView style={styles.leaderboardList}>
          {leaderboardData.map((user, index) => renderLeaderboardItem(user, index))}
        </ScrollView>
      )}
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
  backButton: {
    padding: 8,
    borderRadius: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  refreshButton: {
    padding: 8,
    borderRadius: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  leaderboardList: {
    flex: 1,
    padding: 16,
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  currentUserItem: {
    borderWidth: 2,
    borderColor: '#4ECDC4',
  },
  rankContainer: {
    width: 40,
    alignItems: 'center',
  },
  rankText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  userInfo: {
    flex: 1,
    marginLeft: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  userStats: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 4,
  },
  scoreContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  scoreText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default LeaderboardScreen; 