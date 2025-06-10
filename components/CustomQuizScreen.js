import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const CustomQuizScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [difficulty, setDifficulty] = useState(null);

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

  const topics = [
    { id: 'css', title: 'CSS', icon: 'language-css3' },
    { id: 'javascript', title: 'JavaScript', icon: 'language-javascript' },
  ];

  const difficulties = [
    { id: 'easy', title: 'Easy', icon: 'emoticon-happy' },
    { id: 'medium', title: 'Medium', icon: 'emoticon-neutral' },
    { id: 'hard', title: 'Hard', icon: 'emoticon-sad' },
  ];

  const handleStartQuiz = () => {
    if (!selectedTopic || !difficulty) {
      Alert.alert('Selection Required', 'Please select both a topic and difficulty level');
      return;
    }
    // Navigate to the actual quiz screen with selected options
    navigation.navigate('Quiz', {
      topic: selectedTopic,
      difficulty: difficulty,
    });
  };

  const renderOption = (item, isSelected, onSelect) => (
    <TouchableOpacity
      key={item.id}
      style={[
        styles.optionCard,
        { backgroundColor: currentTheme.bubbleBg },
        isSelected && styles.selectedOption,
      ]}
      onPress={() => onSelect(item.id)}
    >
      <Icon name={item.icon} size={32} color="white" style={styles.optionIcon} />
      <Text style={styles.optionTitle}>{item.title}</Text>
      {isSelected && (
        <Icon name="check-circle" size={24} color="white" style={styles.checkIcon} />
      )}
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
          <Text style={styles.headerTitle}>Custom Quiz</Text>
        </View>
      </View>

      {/* Content */}
      <ScrollView style={styles.content}>
        {/* Topic Selection */}
        <Text style={styles.sectionTitle}>Select Topic</Text>
        <View style={styles.optionsGrid}>
          {topics.map(topic => renderOption(
            topic,
            selectedTopic === topic.id,
            setSelectedTopic
          ))}
        </View>

        {/* Difficulty Selection */}
        <Text style={styles.sectionTitle}>Select Difficulty</Text>
        <View style={styles.optionsGrid}>
          {difficulties.map(diff => renderOption(
            diff,
            difficulty === diff.id,
            setDifficulty
          ))}
        </View>

        {/* Start Quiz Button */}
        <TouchableOpacity
          style={[styles.startButton, { backgroundColor: currentTheme.bubbleBg }]}
          onPress={handleStartQuiz}
        >
          <Icon name="play-circle" size={24} color="white" />
          <Text style={styles.startButtonText}>Start Quiz</Text>
        </TouchableOpacity>
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
  headerTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
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
    marginTop: 20,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  optionCard: {
    width: '48%',
    aspectRatio: 1.5,
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  selectedOption: {
    borderWidth: 2,
    borderColor: '#4ECDC4',
  },
  optionIcon: {
    marginBottom: 10,
  },
  optionTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  checkIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 12,
    marginTop: 20,
    marginBottom: 40,
  },
  startButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default CustomQuizScreen; 