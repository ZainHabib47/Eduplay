import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');
const FIREBASE_DB_URL = 'https://eduplay-f8ca7-default-rtdb.firebaseio.com';

// Avatar options
const AVATAR_OPTIONS = [
  { id: 1, face: 'face-woman', hair: 'hair-dryer', mouth: 'emoticon-happy', color: '#FF6B6B' },
  { id: 2, face: 'face-man', hair: 'hair-dryer', mouth: 'emoticon-happy', color: '#4ECDC4' },
  { id: 3, face: 'face-woman', hair: 'hair-dryer', mouth: 'emoticon-cool', color: '#45B7D1' },
  { id: 4, face: 'face-man', hair: 'hair-dryer', mouth: 'emoticon-cool', color: '#FFD93D' },
  { id: 5, face: 'face-woman', hair: 'hair-dryer', mouth: 'emoticon-excited', color: '#95E1D3' },
  { id: 6, face: 'face-man', hair: 'hair-dryer', mouth: 'emoticon-excited', color: '#FF8B94' },
];

// Alert component
const AnimatedAlert = ({ message, type, visible, onHide }) => {
  const translateY = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(translateY, { toValue: 0, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      ]).start();

      const timer = setTimeout(() => {
        hideAlert();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  const hideAlert = () => {
    Animated.parallel([
      Animated.spring(translateY, { toValue: -100, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start(onHide);
  };

  const backgroundColor = {
    success: '#4CAF50',
    error: '#F44336',
    info: '#2196F3',
  }[type] || '#4CAF50';

  const icon = {
    success: 'check-circle',
    error: 'alert-circle',
    info: 'information',
  }[type] || 'check-circle';

  if (!visible) return null;

  return (
    <Animated.View style={[styles.alertContainer, { transform: [{ translateY }], opacity, backgroundColor }]}>
      <View style={styles.alertContent}>
        <Icon name={icon} size={24} color="white" style={styles.alertIcon} />
        <Text style={styles.alertMessage}>{message}</Text>
      </View>
    </Animated.View>
  );
};

// Main Component
const AuthScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [alert, setAlert] = useState({ visible: false, message: '', type: '' });
  const [selectedAvatar, setSelectedAvatar] = useState(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 1000, useNativeDriver: true }),
      Animated.loop(
        Animated.sequence([
          Animated.timing(bounceAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
          Animated.timing(bounceAnim, { toValue: 0, duration: 1000, useNativeDriver: true }),
        ])
      ),
    ]).start();
  }, []);

  const bounceInterpolate = bounceAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 10] });

  const showAlert = (message, type) => {
    setAlert({ visible: true, message, type });
  };

  const hideAlert = () => {
    setAlert({ visible: false, message: '', type: '' });
  };

  const handleAuth = async () => {
    try {
      if (isLogin) {
        // Login
        const response = await fetch(`${FIREBASE_DB_URL}/users.json`);
        const data = await response.json();
        if (data) {
          const users = Object.values(data);
          const user = users.find(u => u.email === email && u.password === password);
          if (user) {
            // Store user data in AsyncStorage
            await AsyncStorage.setItem('currentUser', JSON.stringify(user));
            showAlert('Login successful! Welcome back!', 'success');
            setTimeout(() => {
              navigation.replace('Dashboard');
            }, 1500);
          } else {
            showAlert('Invalid email or password', 'error');
          }
        } else {
          showAlert('No users found.', 'error');
        }
      } else {
        // Sign up
        if (password !== confirmPassword) return showAlert('Passwords do not match', 'error');
        if (!fullName.trim()) return showAlert('Enter full name', 'error');
        if (!selectedAvatar) return showAlert('Select an avatar', 'error');

        const res = await fetch(`${FIREBASE_DB_URL}/users.json`);
        const existing = await res.json();
        const users = existing ? Object.values(existing) : [];

        if (users.some(u => u.email === email)) return showAlert('Email already exists', 'error');

        const newUser = {
          email,
          password,
          fullName,
          avatar: selectedAvatar,
          createdAt: new Date().toISOString(),
          appUsageTime: 0, // Initialize app usage time
          totalTopics: 0,  // Initialize total topics
          totalProgress: 0, // Initialize total progress
        };

        const saveResponse = await fetch(`${FIREBASE_DB_URL}/users.json`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newUser),
        });

        if (saveResponse.ok) {
          showAlert('Account created! Please login.', 'success');
          setTimeout(() => {
            setEmail('');
            setPassword('');
            setFullName('');
            setConfirmPassword('');
            setSelectedAvatar(null);
            setIsLogin(true);
          }, 1500);
        } else {
          showAlert('Failed to create account', 'error');
        }
      }
    } catch (error) {
      console.error(error);
      showAlert('Something went wrong', 'error');
    }
  };

  const renderAvatarOption = (option) => (
    <TouchableOpacity
      key={option.id}
      style={[styles.avatarOption, { backgroundColor: option.color }, selectedAvatar?.id === option.id && styles.selectedAvatar]}
      onPress={() => setSelectedAvatar(option)}
    >
      <View style={styles.avatarContent}>
        <Icon name={option.face} size={25} color="white" style={styles.avatarFace} />
        <Icon name={option.hair} size={20} color="white" style={styles.avatarHair} />
        <Icon name={option.mouth} size={15} color="white" style={styles.avatarMouth} />
        <Icon name="eye" size={12} color="white" style={[styles.avatarEye, styles.avatarEyeLeft]} />
        <Icon name="eye" size={12} color="white" style={[styles.avatarEye, styles.avatarEyeRight]} />
      </View>
    </TouchableOpacity>
  );

  return (
    <LinearGradient colors={isLogin ? ['#FF6B6B', '#4ECDC4', '#45B7D1'] : ['#4ECDC4', '#FF6B6B', '#45B7D1']} style={styles.container}>
      <AnimatedAlert visible={alert.visible} message={alert.message} type={alert.type} onHide={hideAlert} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardAvoid}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }, { translateY: bounceInterpolate }] }]}>
            <Animated.View style={[styles.playfulElement, isLogin ? styles.loginElement : styles.signupElement]}>
              <Icon name={isLogin ? 'book-open-variant' : 'account-plus'} size={50} color="white" />
            </Animated.View>

            <Text style={styles.title}>{isLogin ? 'Welcome Back!' : 'Join EduPLay'}</Text>
            <Text style={styles.subtitle}>{isLogin ? "Let's Continue Learning!" : 'Start Your Learning Journey'}</Text>

            <View style={styles.formContainer}>
              {!isLogin && (
                <>
                  <TextInput style={styles.input} placeholder="Full Name" placeholderTextColor="rgba(255, 255, 255, 0.7)" value={fullName} onChangeText={setFullName} />
                  <Text style={styles.avatarTitle}>Choose Your Avatar</Text>
                  <View style={styles.avatarGrid}>{AVATAR_OPTIONS.map(renderAvatarOption)}</View>
                </>
              )}
              <TextInput style={styles.input} placeholder="Email" placeholderTextColor="rgba(255, 255, 255, 0.7)" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
              <TextInput style={styles.input} placeholder="Password" placeholderTextColor="rgba(255, 255, 255, 0.7)" value={password} onChangeText={setPassword} secureTextEntry />
              {!isLogin && <TextInput style={styles.input} placeholder="Confirm Password" placeholderTextColor="rgba(255, 255, 255, 0.7)" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry />}
            </View>

            <TouchableOpacity style={[styles.button, isLogin ? styles.loginButton : styles.signupButton]} onPress={handleAuth}>
              <Text style={[styles.buttonText, isLogin ? styles.loginButtonText : styles.signupButtonText]}>{isLogin ? 'Login' : 'Sign Up'}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.switchButton} onPress={() => {
              setIsLogin(!isLogin);
              setEmail('');
              setPassword('');
              setFullName('');
              setConfirmPassword('');
              setSelectedAvatar(null);
            }}>
              <Text style={styles.switchText}>{isLogin ? 'New to EduPLay? Sign Up' : 'Already have an account? Login'}</Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  content: {
    width: '90%',
    alignItems: 'center',
    padding: 20,
    alignSelf: 'center',
  },
  playfulElement: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  loginElement: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  signupElement: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    transform: [{ scale: 1.1 }],
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 18,
    color: '#ffffff',
    marginBottom: 30,
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 25,
    padding: 15,
    marginBottom: 15,
    color: '#ffffff',
    fontSize: 16,
  },
  avatarTitle: {
    color: '#ffffff',
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  avatarOption: {
    width: 60,
    height: 60,
    borderRadius: 30,
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedAvatar: {
    borderColor: '#ffffff',
    transform: [{ scale: 1.1 }],
  },
  avatarContent: {
    width: '100%',
    height: '100%',
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
  button: {
    paddingHorizontal: 50,
    paddingVertical: 15,
    borderRadius: 30,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    marginBottom: 15,
  },
  loginButton: {
    backgroundColor: '#ffffff',
  },
  signupButton: {
    backgroundColor: '#FF6B6B',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginButtonText: {
    color: '#FF6B6B',
  },
  signupButtonText: {
    color: '#ffffff',
  },
  switchButton: {
    padding: 10,
  },
  switchText: {
    color: '#ffffff',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  alertContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    padding: 16,
    zIndex: 1000,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  alertContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertIcon: {
    marginRight: 10,
  },
  alertMessage: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AuthScreen;
