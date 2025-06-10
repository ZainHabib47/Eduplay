import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  Animated,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Animated Alert Component
const AnimatedAlert = ({ visible, message, type, onHide }) => {
  const translateY = useState(new Animated.Value(-100))[0];
  const opacity = useState(new Animated.Value(0))[0];

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          tension: 50,
          friction: 7,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto hide after 3 seconds
      const timer = setTimeout(() => {
        hideAlert();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  const hideAlert = () => {
    Animated.parallel([
      Animated.spring(translateY, {
        toValue: -100,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (onHide) onHide();
    });
  };

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.alertContainer,
        {
          transform: [{ translateY }],
          opacity,
          backgroundColor: type === 'success' ? '#4CAF50' : '#F44336',
        },
      ]}
    >
      <Icon
        name={type === 'success' ? 'check-circle' : 'alert-circle'}
        size={24}
        color="white"
        style={styles.alertIcon}
      />
      <Text style={styles.alertText}>{message}</Text>
    </Animated.View>
  );
};

const AVATAR_OPTIONS = [
  { face: 'emoticon', hair: 'hair-dryer', mouth: 'emoticon-happy', color: '#FF6B6B' },
  { face: 'emoticon-cool', hair: 'hair-dryer', mouth: 'emoticon-excited', color: '#4ECDC4' },
  { face: 'emoticon-happy', hair: 'hair-dryer', mouth: 'emoticon-cool', color: '#45B7D1' },
  { face: 'emoticon-excited', hair: 'hair-dryer', mouth: 'emoticon', color: '#FFD93D' },
  { face: 'emoticon-cool', hair: 'hair-dryer', mouth: 'emoticon-happy', color: '#95E1D3' },
  { face: 'emoticon-happy', hair: 'hair-dryer', mouth: 'emoticon-cool', color: '#FF8B94' },
];

const SettingsScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(null);
  const [showAvatarOptions, setShowAvatarOptions] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [alert, setAlert] = useState({ visible: false, message: '', type: '' });
  const rotateAnim = useState(new Animated.Value(0))[0];

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

  useEffect(() => {
    loadUserData();
    loadThemePreference();
  }, []);

  const loadThemePreference = async () => {
    try {
      const themePreference = await AsyncStorage.getItem('isDarkTheme');
      if (themePreference !== null) {
        setIsDarkTheme(JSON.parse(themePreference));
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
      setEditedUser(userData);
    } catch (error) {
      console.error('Error loading user data:', error);
      navigation.replace('Auth');
    }
  };

  const handleThemeToggle = async () => {
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
    const newTheme = !isDarkTheme;
    setIsDarkTheme(newTheme);
    try {
      await AsyncStorage.setItem('isDarkTheme', JSON.stringify(newTheme));
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const handleSave = async () => {
    try {
      if (!editedUser.fullName.trim()) {
        setAlert({
          visible: true,
          message: 'Full name cannot be empty',
          type: 'error'
        });
        return;
      }

      if (!editedUser.email.trim()) {
        setAlert({
          visible: true,
          message: 'Email cannot be empty',
          type: 'error'
        });
        return;
      }

      if (newPassword) {
        if (newPassword.length < 6) {
          setAlert({
            visible: true,
            message: 'Password must be at least 6 characters long',
            type: 'error'
          });
          return;
        }
        if (newPassword !== confirmPassword) {
          setAlert({
            visible: true,
            message: 'Passwords do not match',
            type: 'error'
          });
          return;
        }
        editedUser.password = newPassword;
      }

      // Update user data in AsyncStorage
      const usersJson = await AsyncStorage.getItem('users');
      const users = usersJson ? JSON.parse(usersJson) : [];
      
      const userIndex = users.findIndex(u => u.email === user.email);
      if (userIndex !== -1) {
        users[userIndex] = editedUser;
        await AsyncStorage.setItem('users', JSON.stringify(users));
        await AsyncStorage.setItem('currentUser', JSON.stringify(editedUser));
        setUser(editedUser);
        setIsEditing(false);
        setNewPassword('');
        setConfirmPassword('');
        setAlert({
          visible: true,
          message: 'Profile updated successfully',
          type: 'success'
        });

        // Update the Dashboard screen with new user data
        navigation.navigate('Dashboard', {
          updatedUser: editedUser,
          refresh: true
        });
      }
    } catch (error) {
      setAlert({
        visible: true,
        message: 'Failed to update profile',
        type: 'error'
      });
    }
  };

  const handleAvatarSelect = (avatar) => {
    setEditedUser({ ...editedUser, avatar });
    setShowAvatarOptions(false);
  };

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

  const renderAvatarOption = (avatar, index) => (
    <TouchableOpacity
      key={index}
      style={[styles.avatarOption, { backgroundColor: avatar.color }]}
      onPress={() => handleAvatarSelect(avatar)}
    >
      <Icon name={avatar.face} size={35} color="white" style={styles.avatarFace} />
      <Icon name={avatar.hair} size={25} color="white" style={styles.avatarHair} />
      <Icon name={avatar.mouth} size={20} color="white" style={styles.avatarMouth} />
      <Icon name="eye" size={15} color="white" style={[styles.avatarEye, styles.avatarEyeLeft]} />
      <Icon name="eye" size={15} color="white" style={[styles.avatarEye, styles.avatarEyeRight]} />
    </TouchableOpacity>
  );

  return (
    <LinearGradient
      colors={currentTheme.gradient}
      style={styles.container}
    >
      <AnimatedAlert
        visible={alert.visible}
        message={alert.message}
        type={alert.type}
        onHide={() => setAlert({ visible: false, message: '', type: '' })}
      />
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: currentTheme.bubbleBg }]}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {user?.fullName?.toUpperCase() || 'USER'}
        </Text>
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

      <ScrollView style={styles.content}>
        <View style={[styles.section, { backgroundColor: currentTheme.bubbleBg }]}>
          <View style={styles.avatarSection}>
            {renderAvatar()}
            <TouchableOpacity
              style={[styles.editButton, { backgroundColor: currentTheme.bubbleBg }]}
              onPress={() => setShowAvatarOptions(!showAvatarOptions)}
            >
              <Icon name="pencil" size={20} color="white" />
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={[styles.input, { backgroundColor: currentTheme.bubbleBg }]}
              value={editedUser?.fullName}
              onChangeText={(text) => setEditedUser({ ...editedUser, fullName: text })}
              placeholder="Full Name"
              placeholderTextColor="rgba(255, 255, 255, 0.7)"
              editable={isEditing}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[styles.input, { backgroundColor: currentTheme.bubbleBg }]}
              value={editedUser?.email}
              onChangeText={(text) => setEditedUser({ ...editedUser, email: text })}
              placeholder="Email"
              placeholderTextColor="rgba(255, 255, 255, 0.7)"
              editable={isEditing}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {isEditing && (
            <>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>New Password</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: currentTheme.bubbleBg }]}
                  placeholder="Enter new password"
                  placeholderTextColor="rgba(255, 255, 255, 0.7)"
                  secureTextEntry
                  value={newPassword}
                  onChangeText={setNewPassword}
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Confirm Password</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: currentTheme.bubbleBg }]}
                  placeholder="Confirm new password"
                  placeholderTextColor="rgba(255, 255, 255, 0.7)"
                  secureTextEntry
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
              </View>
            </>
          )}

          <TouchableOpacity
            style={[styles.saveButton, { backgroundColor: currentTheme.bubbleBg }]}
            onPress={() => isEditing ? handleSave() : setIsEditing(true)}
          >
            <Text style={styles.saveButtonText}>
              {isEditing ? 'Save Changes' : 'Edit Profile'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal
        visible={showAvatarOptions}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowAvatarOptions(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: currentTheme.bubbleBg }]}>
            <Text style={styles.modalTitle}>Choose Avatar</Text>
            <View style={styles.avatarGrid}>
              {AVATAR_OPTIONS.map((avatar, index) => renderAvatarOption(avatar, index))}
            </View>
            <TouchableOpacity
              style={[styles.closeButton, { backgroundColor: currentTheme.bubbleBg }]}
              onPress={() => setShowAvatarOptions(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  backButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
    marginHorizontal: 10,
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
  section: {
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarBackground: {
    width: 80,
    height: 80,
    borderRadius: 40,
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
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    color: '#ffffff',
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    borderRadius: 10,
    padding: 15,
    color: '#ffffff',
    fontSize: 16,
  },
  saveButton: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  avatarOption: {
    width: 70,
    height: 70,
    borderRadius: 35,
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  closeButton: {
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  alertContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  alertIcon: {
    marginRight: 10,
  },
  alertText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SettingsScreen; 