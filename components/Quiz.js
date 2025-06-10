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

const Quiz = ({ navigation, route }) => {
  const [user, setUser] = useState(null);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);
  const [currentQuestions, setCurrentQuestions] = useState([]);

  const { topic, difficulty } = route.params;

  useEffect(() => {
    loadUserData();
    loadThemePreference();
    initializeQuiz();
  }, []);

  const initializeQuiz = () => {
    const randomQuestions = getRandomQuestions(topic, difficulty);
    setCurrentQuestions(randomQuestions);
  };

  const getRandomQuestions = (topic, difficulty, count = 5) => {
    const allQuestions = questions[topic][difficulty];
    const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
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

  const questions = {
    css: {
      easy: [
        {
          question: "What does CSS stand for?",
          options: [
            "Cascading Style Sheets",
            "Computer Style Sheets",
            "Creative Style Sheets",
            "Colorful Style Sheets"
          ],
          correctAnswer: "Cascading Style Sheets"
        },
        {
          question: "Which property is used to change the text color?",
          options: [
            "text-color",
            "font-color",
            "color",
            "text-style"
          ],
          correctAnswer: "color"
        },
        {
          question: "Which CSS property is used to change the background color?",
          options: [
            "bgcolor",
            "background-color",
            "color-background",
            "background"
          ],
          correctAnswer: "background-color"
        },
        {
          question: "How do you add a comment in CSS?",
          options: [
            "// This is a comment",
            "/* This is a comment */",
            "<!-- This is a comment -->",
            "# This is a comment"
          ],
          correctAnswer: "/* This is a comment */"
        },
        {
          question: "Which property is used to change the font of an element?",
          options: [
            "font-family",
            "font-style",
            "font-type",
            "font-face"
          ],
          correctAnswer: "font-family"
        }
      ],
      medium: [
        {
          question: "What is the CSS Box Model?",
          options: [
            "A way to create 3D effects",
            "A model that describes how elements are laid out",
            "A way to create animations",
            "A method for responsive design"
          ],
          correctAnswer: "A model that describes how elements are laid out"
        },
        {
          question: "Which property is used to create space between elements?",
          options: [
            "spacing",
            "margin",
            "padding",
            "gap"
          ],
          correctAnswer: "margin"
        },
        {
          question: "What is the purpose of z-index in CSS?",
          options: [
            "To control element size",
            "To set element position",
            "To control element stacking order",
            "To create animations"
          ],
          correctAnswer: "To control element stacking order"
        },
        {
          question: "Which property is used to make text bold?",
          options: [
            "text-weight",
            "font-weight",
            "text-style",
            "font-style"
          ],
          correctAnswer: "font-weight"
        },
        {
          question: "What is the purpose of the float property?",
          options: [
            "To make elements float in the air",
            "To position elements to the left or right",
            "To create animations",
            "To make text bold"
          ],
          correctAnswer: "To position elements to the left or right"
        }
      ],
      hard: [
        {
          question: "What is the purpose of CSS Grid?",
          options: [
            "A way to create tables",
            "A two-dimensional layout system",
            "A way to create animations",
            "A method for responsive images"
          ],
          correctAnswer: "A two-dimensional layout system"
        },
        {
          question: "What is the difference between display: none and visibility: hidden?",
          options: [
            "There is no difference",
            "display: none removes the element from the layout, visibility: hidden hides it but keeps the space",
            "visibility: hidden removes the element from the layout, display: none hides it but keeps the space",
            "They are used for different types of elements"
          ],
          correctAnswer: "display: none removes the element from the layout, visibility: hidden hides it but keeps the space"
        },
        {
          question: "What is the purpose of CSS variables (custom properties)?",
          options: [
            "To store JavaScript values",
            "To create animations",
            "To store reusable values throughout a stylesheet",
            "To create responsive designs"
          ],
          correctAnswer: "To store reusable values throughout a stylesheet"
        },
        {
          question: "What is the purpose of the @media rule in CSS?",
          options: [
            "To import external stylesheets",
            "To create animations",
            "To apply different styles for different devices and screen sizes",
            "To define custom fonts"
          ],
          correctAnswer: "To apply different styles for different devices and screen sizes"
        },
        {
          question: "What is the purpose of the transform property in CSS?",
          options: [
            "To change element colors",
            "To modify element size",
            "To apply 2D or 3D transformations to elements",
            "To create animations"
          ],
          correctAnswer: "To apply 2D or 3D transformations to elements"
        }
      ]
    },
    javascript: {
      easy: [
        {
          question: "What is JavaScript?",
          options: [
            "A markup language",
            "A styling language",
            "A programming language",
            "A database language"
          ],
          correctAnswer: "A programming language"
        },
        {
          question: "How do you declare a variable in JavaScript?",
          options: [
            "variable x = 5",
            "v x = 5",
            "let x = 5",
            "x = 5"
          ],
          correctAnswer: "let x = 5"
        },
        {
          question: "Which operator is used for assignment in JavaScript?",
          options: [
            "==",
            "===",
            "=",
            "=>"
          ],
          correctAnswer: "="
        },
        {
          question: "How do you write a comment in JavaScript?",
          options: [
            "<!-- This is a comment -->",
            "/* This is a comment */",
            "// This is a comment",
            "# This is a comment"
          ],
          correctAnswer: "// This is a comment"
        },
        {
          question: "What is the correct way to write an array in JavaScript?",
          options: [
            "array(1,2,3)",
            "[1,2,3]",
            "{1,2,3}",
            "(1,2,3)"
          ],
          correctAnswer: "[1,2,3]"
        }
      ],
      medium: [
        {
          question: "What is the purpose of the 'this' keyword in JavaScript?",
          options: [
            "To refer to the current object",
            "To create a new object",
            "To delete an object",
            "To modify an object"
          ],
          correctAnswer: "To refer to the current object"
        },
        {
          question: "What is a closure in JavaScript?",
          options: [
            "A way to close a program",
            "A function that has access to variables from its outer scope",
            "A way to end a loop",
            "A method to close a file"
          ],
          correctAnswer: "A function that has access to variables from its outer scope"
        },
        {
          question: "What is the difference between let and const?",
          options: [
            "There is no difference",
            "let can be reassigned, const cannot",
            "const can be reassigned, let cannot",
            "let is for numbers, const is for strings"
          ],
          correctAnswer: "let can be reassigned, const cannot"
        },
        {
          question: "What is the purpose of the map() function?",
          options: [
            "To create a new array with the results of calling a function for every array element",
            "To create a map object",
            "To navigate through an array",
            "To sort an array"
          ],
          correctAnswer: "To create a new array with the results of calling a function for every array element"
        },
        {
          question: "What is the purpose of the filter() function?",
          options: [
            "To create a new array with elements that pass a test",
            "To remove all elements from an array",
            "To sort an array",
            "To combine arrays"
          ],
          correctAnswer: "To create a new array with elements that pass a test"
        }
      ],
      hard: [
        {
          question: "What is the purpose of the Proxy object in JavaScript?",
          options: [
            "To create animations",
            "To create custom behavior for object operations",
            "To create loops",
            "To create variables"
          ],
          correctAnswer: "To create custom behavior for object operations"
        },
        {
          question: "What is the difference between synchronous and asynchronous code?",
          options: [
            "There is no difference",
            "Synchronous code runs in sequence, asynchronous code can run in parallel",
            "Asynchronous code is faster",
            "Synchronous code is more modern"
          ],
          correctAnswer: "Synchronous code runs in sequence, asynchronous code can run in parallel"
        },
        {
          question: "What is the purpose of the async/await syntax?",
          options: [
            "To create animations",
            "To write asynchronous code in a synchronous style",
            "To create loops",
            "To handle errors"
          ],
          correctAnswer: "To write asynchronous code in a synchronous style"
        },
        {
          question: "What is the purpose of the Symbol type in JavaScript?",
          options: [
            "To create unique identifiers",
            "To create animations",
            "To handle numbers",
            "To create strings"
          ],
          correctAnswer: "To create unique identifiers"
        },
        {
          question: "What is the purpose of the WeakMap object?",
          options: [
            "To create a map with weak references",
            "To create animations",
            "To sort arrays",
            "To handle errors"
          ],
          correctAnswer: "To create a map with weak references"
        }
      ]
    }
  };

  const currentQuestionData = currentQuestions[currentQuestion];

  const handleAnswer = (answer) => {
    const isCorrect = answer === currentQuestionData.correctAnswer;
    if (isCorrect) {
      setScore(score + 1);
    }

    setUserAnswers([...userAnswers, { question: currentQuestion, answer, isCorrect }]);

    if (currentQuestion < currentQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const handleRestart = () => {
    navigation.goBack();
  };

  const renderQuiz = () => {
    if (!currentQuestionData) return null;

    return (
      <View style={styles.quizContainer}>
        <Text style={styles.questionNumber}>
          Question {currentQuestion + 1} of {currentQuestions.length}
        </Text>
        <Text style={styles.questionText}>{currentQuestionData.question}</Text>
        <View style={styles.answersContainer}>
          {currentQuestionData.options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.answerButton, { backgroundColor: currentTheme.bubbleBg }]}
              onPress={() => handleAnswer(option)}
            >
              <Text style={styles.answerText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  const renderResults = () => (
    <View style={styles.resultsContainer}>
      <Text style={styles.resultsTitle}>Quiz Results</Text>
      <Text style={styles.scoreText}>
        Score: {score} out of {currentQuestions.length}
      </Text>
      <ScrollView style={styles.resultsList}>
        {currentQuestions.map((question, index) => {
          const userAnswer = userAnswers[index];
          return (
            <View key={index} style={styles.resultItem}>
              <Text style={styles.questionText}>{question.question}</Text>
              <Text style={styles.answerText}>
                Your answer: {userAnswer.answer}
                {userAnswer.isCorrect ? ' ✓' : ' ✗'}
              </Text>
              {!userAnswer.isCorrect && (
                <Text style={styles.correctAnswer}>
                  Correct answer: {question.correctAnswer}
                </Text>
              )}
            </View>
          );
        })}
      </ScrollView>
      <TouchableOpacity
        style={[styles.restartButton, { backgroundColor: currentTheme.bubbleBg }]}
        onPress={handleRestart}
      >
        <Text style={styles.buttonText}>Back to Quiz Selection</Text>
      </TouchableOpacity>
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
          <Text style={styles.headerTitle}>Quiz</Text>
        </View>
      </View>

      {/* Content */}
      <ScrollView style={styles.content}>
        {!showResults ? renderQuiz() : renderResults()}
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
  quizContainer: {
    flex: 1,
    padding: 16,
  },
  questionNumber: {
    color: '#ffffff',
    fontSize: 16,
    marginBottom: 8,
  },
  questionText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  answersContainer: {
    gap: 12,
  },
  answerButton: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  answerText: {
    color: '#ffffff',
    fontSize: 16,
  },
  resultsContainer: {
    flex: 1,
    padding: 16,
  },
  resultsTitle: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  scoreText: {
    color: '#ffffff',
    fontSize: 20,
    marginBottom: 24,
  },
  resultsList: {
    flex: 1,
  },
  resultItem: {
    marginBottom: 24,
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  correctAnswer: {
    color: '#4ECDC4',
    fontSize: 16,
    marginTop: 8,
  },
  restartButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Quiz; 