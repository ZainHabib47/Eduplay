import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Alert,
  Dimensions,
  TextInput,
  Linking,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width } = Dimensions.get('window');

const LessonScreen = ({ navigation, route }) => {
  const [user, setUser] = useState(null);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];

  const { topic, path } = route.params;

  // Update topics array to match exactly with topicContent
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
      'CSS Height',
      'CSS Outline',
      'CSS Text',
      'CSS Font',
      'CSS Icons'
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
      'JavaScript Arrays',
      'JavaScript Loops',
      'JavaScript If Else',
      'JavaScript Switch',
      'JavaScript Try Catch',
      'JavaScript Events',
      'JavaScript DOM',
      'JavaScript Async'
    ]
  };

  // Add new JavaScript topics to topicContent
  const topicContent = {
    // CSS Topics
    'CSS Introduction': {
      description: 'Learn the basics of CSS and how it transforms HTML into beautiful web pages.',
      keyPoints: [
        'What is CSS?',
        'How CSS works with HTML',
        'Basic syntax and rules',
        'Your first CSS style'
      ],
      examples: [
        {
          title: 'Basic CSS Syntax',
          code: 'selector {\n  property: value;\n}',
          explanation: 'Every CSS rule consists of a selector and a declaration block.'
        }
      ],
      resources: {
        websites: [
          {
            title: 'MDN Web Docs - CSS Basics',
            url: 'https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/CSS_basics',
            description: 'Comprehensive guide to CSS fundamentals'
          }
        ],
        videos: [
          {
            title: 'CSS Crash Course For Absolute Beginners',
            url: 'https://www.youtube.com/watch?v=yfoY53QXEnI',
            channel: 'Traversy Media',
            duration: '1:25:11'
          }
        ]
      }
    },
    'Inline CSS': {
      description: 'Master the art of applying styles directly to HTML elements.',
      keyPoints: [
        'Inline style syntax',
        'When to use inline styles',
        'Pros and cons',
        'Best practices'
      ],
      examples: [
        {
          title: 'Inline Style Example',
          code: '<p style="color: red; font-size: 18px;">\n  This text is red and 18px\n</p>',
          explanation: 'Inline styles are added directly to HTML elements.'
        }
      ],
      resources: {
        websites: [
          {
            title: 'W3Schools - Inline CSS',
            url: 'https://www.w3schools.com/css/css_howto.asp',
            description: 'Learn about inline CSS usage'
          }
        ],
        videos: [
          {
            title: 'Inline CSS Tutorial',
            url: 'https://www.youtube.com/watch?v=G1rOthIU-uo',
            channel: 'Kevin Powell',
            duration: '8:18'
          }
        ]
      }
    },
    'Internal CSS': {
      description: 'Learn how to style your entire webpage using internal CSS.',
      keyPoints: [
        'Style tag usage',
        'Document-wide styling',
        'Organization tips',
        'Maintenance best practices'
      ],
      examples: [
        {
          title: 'Style Tag Placement',
          code: '<head>\n  <style>\n    body {\n      font-family: Arial;\n      margin: 0;\n      padding: 20px;\n    }\n  </style>\n</head>',
          explanation: 'Internal CSS is placed within the <style> tag in the HTML document\'s head section.'
        }
      ],
      resources: {
        websites: [
          {
            title: 'W3Schools - Internal CSS',
            url: 'https://www.w3schools.com/css/css_howto.asp',
            description: 'Tutorial on using internal CSS'
          }
        ],
        videos: [
          {
            title: 'Internal CSS Tutorial',
            url: 'https://www.youtube.com/watch?v=J35jug1uHzE',
            channel: 'Dani Krossing',
            duration: '5:20'
          }
        ]
      }
    },
    'External CSS': {
      description: 'Discover the power of external stylesheets for maintaining consistent styling across multiple pages.',
      keyPoints: [
        'Creating external stylesheets',
        'Linking CSS files',
        'Multiple stylesheet management',
        'Performance considerations'
      ],
      examples: [
        {
          title: 'Linking External CSS',
          code: '<head>\n  <link rel="stylesheet" href="styles.css">\n</head>',
          explanation: 'External CSS files are linked to HTML documents using the link tag.'
        }
      ],
      resources: {
        websites: [
          {
            title: 'MDN - External Stylesheets',
            url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/Alternative_style_sheets',
            description: 'Guide to using external stylesheets'
          }
        ],
        videos: [
          {
            title: 'How to Link CSS to HTML',
            url: 'https://www.youtube.com/watch?v=wXUhTZpF_HQ',
            channel: 'Dani Krossing',
            duration: '6:14'
          }
        ]
      }
    },
    'CSS Selectors': {
      description: 'Master the art of targeting HTML elements with various CSS selectors.',
      keyPoints: [
        'Element selectors',
        'Class and ID selectors',
        'Attribute selectors',
        'Pseudo-classes and pseudo-elements'
      ],
      examples: [
        {
          title: 'Basic Selectors',
          code: '/* Element selector */\np { color: blue; }\n\n/* Class selector */\n.highlight { background: yellow; }\n\n/* ID selector */\n#header { font-size: 24px; }',
          explanation: 'Different types of selectors target elements in different ways.'
        }
      ],
      resources: {
        websites: [
          {
            title: 'CSS Selectors Reference',
            url: 'https://www.w3schools.com/cssref/css_selectors.php',
            description: 'Complete guide to CSS selectors'
          }
        ],
        videos: [
          {
            title: 'CSS Selectors Tutorial',
            url: 'https://www.youtube.com/watch?v=l1mER1bV0N0',
            channel: 'Web Dev Simplified',
            duration: '10:43'
          }
        ]
      }
    },
    'CSS Colors': {
      description: 'Learn about different ways to specify and work with colors in CSS.',
      keyPoints: [
        'Color names',
        'Hexadecimal values',
        'RGB and RGBA',
        'HSL and HSLA'
      ],
      examples: [
        {
          title: 'Color Values',
          code: '/* Color names */\n.text-red { color: red; }\n\n/* Hex values */\n.bg-blue { background: #0000FF; }\n\n/* RGB */\n.text-purple { color: rgb(128, 0, 128); }\n\n/* RGBA */\n.bg-transparent { background: rgba(0, 0, 0, 0.5); }',
          explanation: 'CSS offers multiple ways to specify colors, each with its own use case.'
        }
      ],
      resources: {
        websites: [
          {
            title: 'CSS Colors Guide',
            url: 'https://www.w3schools.com/css/css_colors.asp',
            description: 'Learn about CSS color values'
          }
        ],
        videos: [
          {
            title: 'CSS Colors Tutorial',
            url: 'https://www.youtube.com/watch?v=HxYFzqZ2JYE',
            channel: 'Kevin Powell',
            duration: '7:15'
          }
        ]
      }
    },
    'CSS Backgrounds': {
      description: 'Explore the various ways to style element backgrounds.',
      keyPoints: [
        'Background colors',
        'Background images',
        'Background positioning',
        'Background sizing and repeating'
      ],
      examples: [
        {
          title: 'Background Properties',
          code: '.box {\n  background-color: #f0f0f0;\n  background-image: url("image.jpg");\n  background-position: center;\n  background-size: cover;\n  background-repeat: no-repeat;\n}',
          explanation: 'CSS provides multiple properties to control element backgrounds.'
        }
      ],
      resources: {
        websites: [
          {
            title: 'CSS Backgrounds',
            url: 'https://www.w3schools.com/css/css_background.asp',
            description: 'Complete guide to CSS backgrounds'
          }
        ],
        videos: [
          {
            title: 'CSS Background Properties',
            url: 'https://www.youtube.com/watch?v=3T_Jy1CqH9k',
            channel: 'Traversy Media',
            duration: '8:45'
          }
        ]
      }
    },
    'CSS Borders': {
      description: 'Learn how to create and style borders around elements.',
      keyPoints: [
        'Border styles',
        'Border width',
        'Border color',
        'Border radius'
      ],
      examples: [
        {
          title: 'Border Properties',
          code: '.box {\n  border: 2px solid #333;\n  border-radius: 8px;\n  border-top: 1px dashed red;\n  border-bottom: 3px dotted blue;\n}',
          explanation: 'CSS borders can be styled in various ways to create different effects.'
        }
      ],
      resources: {
        websites: [
          {
            title: 'CSS Borders',
            url: 'https://www.w3schools.com/css/css_border.asp',
            description: 'Guide to CSS border properties'
          }
        ],
        videos: [
          {
            title: 'CSS Borders Tutorial',
            url: 'https://www.youtube.com/watch?v=zHZRFwNXdcY',
            channel: 'Kevin Powell',
            duration: '6:30'
          }
        ]
      }
    },
    'CSS Margins': {
      description: 'Learn how to create space around elements using CSS margins, including different margin properties and their effects on layout.',
      keyPoints: [
        'Margin properties (top, right, bottom, left)',
        'Shorthand margin syntax',
        'Auto margins for centering',
        'Negative margins',
        'Margin collapse behavior',
        'Responsive margin techniques'
      ],
      examples: [
        {
          title: 'Basic Margin Usage',
          code: '.box {\n  margin: 20px;\n  margin-top: 10px;\n  margin-right: auto;\n  margin-bottom: 30px;\n  margin-left: auto;\n}',
          explanation: 'Different ways to set margins on an element'
        },
        {
          title: 'Centering with Auto Margins',
          code: '.centered {\n  width: 80%;\n  margin: 0 auto;\n}',
          explanation: 'Using auto margins to center block elements'
        }
      ],
      resources: {
        websites: [
          {
            title: 'MDN - CSS Margin',
            url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/margin',
            description: 'Complete guide to CSS margins'
          },
          {
            title: 'W3Schools - CSS Margins',
            url: 'https://www.w3schools.com/css/css_margin.asp',
            description: 'Tutorial on CSS margins'
          }
        ],
        videos: [
          {
            title: 'CSS Margin Tutorial',
            url: 'https://www.youtube.com/watch?v=H7qMMCU3N84',
            channel: 'Web Dev Simplified',
            duration: '8:15'
          }
        ]
      }
    },
    'CSS Padding': {
      description: 'Master the use of padding in CSS to create space inside elements, between the content and border.',
      keyPoints: [
        'Padding properties',
        'Shorthand padding syntax',
        'Box model impact',
        'Responsive padding',
        'Padding vs Margin',
        'Common use cases'
      ],
      examples: [
        {
          title: 'Padding Properties',
          code: '.box {\n  padding: 20px;\n  padding-top: 10px;\n  padding-right: 15px;\n  padding-bottom: 25px;\n  padding-left: 15px;\n}',
          explanation: 'Different ways to set padding on an element'
        },
        {
          title: 'Responsive Padding',
          code: '.responsive {\n  padding: 5%;\n  max-padding: 50px;\n}',
          explanation: 'Using percentage-based padding with a maximum value'
        }
      ],
      resources: {
        websites: [
          {
            title: 'MDN - CSS Padding',
            url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/padding',
            description: 'Complete guide to CSS padding'
          },
          {
            title: 'W3Schools - CSS Padding',
            url: 'https://www.w3schools.com/css/css_padding.asp',
            description: 'Tutorial on CSS padding'
          }
        ],
        videos: [
          {
            title: 'CSS Padding Tutorial',
            url: 'https://www.youtube.com/watch?v=H7qMMCU3N84',
            channel: 'Web Dev Simplified',
            duration: '7:30'
          }
        ]
      }
    },
    'CSS Height and Width': {
      description: 'Master the control of element dimensions.',
      keyPoints: [
        'Fixed dimensions',
        'Percentage values',
        'Viewport units',
        'Min and max dimensions'
      ],
      examples: [
        {
          title: 'Dimension Properties',
          code: '.box {\n  width: 100%;\n  max-width: 1200px;\n  height: 200px;\n  min-height: 100px;\n}',
          explanation: 'CSS provides various ways to control element dimensions.'
        }
      ],
      resources: {
        websites: [
          {
            title: 'CSS Height and Width',
            url: 'https://www.w3schools.com/css/css_dimension.asp',
            description: 'Learn about CSS dimensions'
          }
        ],
        videos: [
          {
            title: 'CSS Dimensions Tutorial',
            url: 'https://www.youtube.com/watch?v=H7qMMCU3N84',
            channel: 'Web Dev Simplified',
            duration: '6:45'
          }
        ]
      }
    },
    'CSS Box Model': {
      description: 'Understand the fundamental concept of how elements are sized and spaced in CSS.',
      keyPoints: [
        'Content area',
        'Padding',
        'Border',
        'Margin',
        'Box-sizing property',
        'Box model calculations'
      ],
      examples: [
        {
          title: 'Box Model Example',
          code: '.box {\n  width: 300px;\n  padding: 20px;\n  border: 5px solid #333;\n  margin: 10px;\n  box-sizing: border-box;\n}',
          explanation: 'Complete box model example with all properties'
        },
        {
          title: 'Box Sizing',
          code: '* {\n  box-sizing: border-box;\n}\n\n.element {\n  width: 100%;\n  padding: 20px;\n  border: 1px solid;\n}',
          explanation: 'Using box-sizing to include padding and border in width'
        }
      ],
      resources: {
        websites: [
          {
            title: 'MDN - Box Model',
            url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Box_Model',
            description: 'Complete guide to CSS box model'
          },
          {
            title: 'W3Schools - Box Model',
            url: 'https://www.w3schools.com/css/css_boxmodel.asp',
            description: 'Tutorial on CSS box model'
          }
        ],
        videos: [
          {
            title: 'CSS Box Model Tutorial',
            url: 'https://www.youtube.com/watch?v=rIO5326FgPE',
            channel: 'Kevin Powell',
            duration: '12:30'
          }
        ]
      }
    },
    'CSS Height': {
      description: 'Learn how to control element height in CSS, including different units and responsive techniques.',
      keyPoints: [
        'Fixed height values',
        'Percentage heights',
        'Viewport height units',
        'Min and max height',
        'Height inheritance',
        'Responsive height techniques'
      ],
      examples: [
        {
          title: 'Height Properties',
          code: '.box {\n  height: 200px;\n  min-height: 100px;\n  max-height: 300px;\n}\n\n.full-height {\n  height: 100vh;\n}',
          explanation: 'Different ways to set element height'
        },
        {
          title: 'Responsive Height',
          code: '.responsive {\n  height: 50vh;\n  min-height: 200px;\n  max-height: 500px;\n}',
          explanation: 'Using viewport height with min/max constraints'
        }
      ],
      resources: {
        websites: [
          {
            title: 'MDN - Height',
            url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/height',
            description: 'Complete guide to CSS height property'
          },
          {
            title: 'CSS-Tricks - Height',
            url: 'https://css-tricks.com/almanac/properties/h/height/',
            description: 'In-depth guide to height property'
          }
        ],
        videos: [
          {
            title: 'CSS Height Tutorial',
            url: 'https://www.youtube.com/watch?v=H7qMMCU3N84',
            channel: 'Web Dev Simplified',
            duration: '9:45'
          }
        ]
      }
    },
    'CSS Outline': {
      description: 'Learn how to create and style outlines around elements, including different styles and effects.',
      keyPoints: [
        'Outline properties',
        'Outline styles',
        'Outline width',
        'Outline color',
        'Outline offset',
        'Focus states'
      ],
      examples: [
        {
          title: 'Outline Properties',
          code: '.box {\n  outline: 2px solid #333;\n  outline-offset: 4px;\n}\n\n.focus-element:focus {\n  outline: 3px dashed #0066cc;\n}',
          explanation: 'Using outlines for visual emphasis and focus states'
        }
      ],
      resources: {
        websites: [
          {
            title: 'MDN - Outline',
            url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/outline',
            description: 'Complete guide to CSS outlines'
          },
          {
            title: 'W3Schools - Outline',
            url: 'https://www.w3schools.com/css/css_outline.asp',
            description: 'Tutorial on CSS outlines'
          }
        ],
        videos: [
          {
            title: 'CSS Outline Tutorial',
            url: 'https://www.youtube.com/watch?v=zHZRFwNXdcY',
            channel: 'Kevin Powell',
            duration: '6:15'
          }
        ]
      }
    },
    'CSS Text': {
      description: 'Master text styling in CSS, including fonts, alignment, decoration, and spacing.',
      keyPoints: [
        'Font properties',
        'Text alignment',
        'Text decoration',
        'Text transformation',
        'Text spacing',
        'Text shadow'
      ],
      examples: [
        {
          title: 'Text Styling',
          code: '.text {\n  font-family: Arial, sans-serif;\n  font-size: 16px;\n  font-weight: bold;\n  text-align: center;\n  text-decoration: underline;\n  text-transform: uppercase;\n  letter-spacing: 1px;\n  line-height: 1.5;\n  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);\n}',
          explanation: 'Comprehensive text styling example'
        }
      ],
      resources: {
        websites: [
          {
            title: 'MDN - Text Styling',
            url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Text',
            description: 'Complete guide to CSS text styling'
          },
          {
            title: 'W3Schools - Text',
            url: 'https://www.w3schools.com/css/css_text.asp',
            description: 'Tutorial on CSS text properties'
          }
        ],
        videos: [
          {
            title: 'CSS Text Styling Tutorial',
            url: 'https://www.youtube.com/watch?v=H7qMMCU3N84',
            channel: 'Web Dev Simplified',
            duration: '15:20'
          }
        ]
      }
    },
    'CSS Font': {
      description: 'Learn how to work with fonts in CSS, including font families, sizes, weights, and web fonts.',
      keyPoints: [
        'Font families',
        'Font sizes',
        'Font weights',
        'Font styles',
        'Web fonts',
        'Font optimization'
      ],
      examples: [
        {
          title: 'Font Properties',
          code: '@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap");\n\n.text {\n  font-family: "Roboto", sans-serif;\n  font-size: 18px;\n  font-weight: 700;\n  font-style: italic;\n  line-height: 1.6;\n}',
          explanation: 'Using Google Fonts and font properties'
        }
      ],
      resources: {
        websites: [
          {
            title: 'MDN - Fonts',
            url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Fonts',
            description: 'Complete guide to CSS fonts'
          },
          {
            title: 'Google Fonts',
            url: 'https://fonts.google.com',
            description: 'Web font library'
          }
        ],
        videos: [
          {
            title: 'CSS Fonts Tutorial',
            url: 'https://www.youtube.com/watch?v=H7qMMCU3N84',
            channel: 'Web Dev Simplified',
            duration: '11:45'
          }
        ]
      }
    },
    'CSS Icons': {
      description: 'Learn how to add and style icons in your web pages using various icon libraries and techniques.',
      keyPoints: [
        'Icon libraries',
        'Font Awesome',
        'Material Icons',
        'Custom icons',
        'Icon styling',
        'Icon animations'
      ],
      examples: [
        {
          title: 'Using Font Awesome',
          code: '<!-- Add Font Awesome -->\n<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">\n\n<!-- Using icons -->\n<i class="fas fa-heart"></i>\n<i class="fas fa-star"></i>\n<i class="fas fa-user"></i>',
          explanation: 'Adding and using Font Awesome icons'
        },
        {
          title: 'Icon Styling',
          code: '.icon {\n    font-size: 24px;\n    color: #333;\n    transition: color 0.3s;\n  }\n\n  .icon:hover {\n    color: #0066cc;\n    transform: scale(1.2);\n  }',
          explanation: 'Styling and animating icons'
        }
      ],
      resources: {
        websites: [
          {
            title: 'Font Awesome',
            url: 'https://fontawesome.com',
            description: 'Popular icon library'
          },
          {
            title: 'Material Icons',
            url: 'https://material.io/resources/icons',
            description: 'Google Material Design icons'
          }
        ],
        videos: [
          {
            title: 'CSS Icons Tutorial',
            url: 'https://www.youtube.com/watch?v=H7qMMCU3N84',
            channel: 'Web Dev Simplified',
            duration: '10:30'
          }
        ]
      }
    },
    // JavaScript Topics
    'JavaScript Introduction': {
      description: 'Learn the fundamentals of JavaScript, the programming language of the web.',
      keyPoints: [
        'What is JavaScript?',
        'How JavaScript works in browsers',
        'Basic syntax and rules',
        'Your first JavaScript program'
      ],
      examples: [
        {
          title: 'Basic JavaScript Syntax',
          code: 'console.log("Hello, World!");\n\nlet name = "John";\nconst age = 25;\n\nfunction greet(name) {\n  return `Hello, ${name}!`;\n}',
          explanation: 'Basic JavaScript syntax including variables, constants, and functions.'
        }
      ],
      resources: {
        websites: [
          {
            title: 'MDN Web Docs - JavaScript Guide',
            url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide',
            description: 'Comprehensive guide to JavaScript fundamentals'
          }
        ],
        videos: [
          {
            title: 'JavaScript Crash Course For Beginners',
            url: 'https://www.youtube.com/watch?v=W6NZfCO5SIk',
            channel: 'Traversy Media',
            duration: '1:40:30'
          }
        ]
      }
    },
    'JavaScript Where To': {
      description: 'Learn where and how to include JavaScript in your web pages.',
      keyPoints: [
        'Internal JavaScript',
        'External JavaScript files',
        'Script placement',
        'Async and defer attributes'
      ],
      examples: [
        {
          title: 'Adding JavaScript to HTML',
          code: '<!-- Internal JavaScript -->\n<script>\n  console.log("Internal JavaScript");\n</script>\n\n<!-- External JavaScript -->\n<script src="script.js"></script>\n\n<!-- Async loading -->\n<script src="script.js" async></script>',
          explanation: 'Different ways to include JavaScript in your HTML documents.'
        }
      ],
      resources: {
        websites: [
          {
            title: 'W3Schools - JavaScript Where To',
            url: 'https://www.w3schools.com/js/js_whereto.asp',
            description: 'Guide to JavaScript placement in HTML'
          }
        ],
        videos: [
          {
            title: 'JavaScript Placement Tutorial',
            url: 'https://www.youtube.com/watch?v=H7qMMCU3N84',
            channel: 'Web Dev Simplified',
            duration: '8:15'
          }
        ]
      }
    },
    'JavaScript Output': {
      description: 'Learn different ways to output data in JavaScript.',
      keyPoints: [
        'Using console.log()',
        'Writing to HTML elements',
        'Using window.alert()',
        'Using document.write()'
      ],
      examples: [
        {
          title: 'JavaScript Output Methods',
          code: '// Console output\nconsole.log("Hello from console");\n\n// Alert box\nwindow.alert("Hello from alert");\n\n// Writing to HTML\ndocument.getElementById("demo").innerHTML = "Hello from HTML";\n\n// Document write\ndocument.write("Hello from document.write");',
          explanation: 'Various methods to output data in JavaScript.'
        }
      ],
      resources: {
        websites: [
          {
            title: 'W3Schools - JavaScript Output',
            url: 'https://www.w3schools.com/js/js_output.asp',
            description: 'Guide to JavaScript output methods'
          }
        ],
        videos: [
          {
            title: 'JavaScript Output Tutorial',
            url: 'https://www.youtube.com/watch?v=H7qMMCU3N84',
            channel: 'Web Dev Simplified',
            duration: '7:45'
          }
        ]
      }
    }
  }; // End of topicContent object

  // Add safety check for topic content
  const getTopicContent = () => {
    console.log('Requested topic:', topic); // Debug log
    if (!topicContent || !topicContent[topic]) {
      console.log('Topic not found:', topic); // Debug log
      return {
        description: 'Content for this topic is being prepared.',
        keyPoints: ['Content coming soon'],
        examples: [],
        resources: {
          websites: [],
          videos: []
        }
      };
    }
    return topicContent[topic];
  };

  useEffect(() => {
    if (!topic || !path || !topics[path] || !topics[path].includes(topic)) {
      console.log('Invalid topic or path:', { topic, path }); // Debug log
      Alert.alert(
        'Error',
        'Invalid topic or path selected. Please try again.',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack()
          }
        ]
      );
      return;
    }

    loadUserData();
    loadThemePreference();
    loadProgress();
    startAnimation();
  }, [topic, path]);

  const startAnimation = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
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

  const loadProgress = async () => {
    try {
      const progressData = await AsyncStorage.getItem(`${path}Progress`);
      if (progressData !== null) {
        const data = JSON.parse(progressData);
        setProgress(data.progress || 0);
        setIsCompleted(data.completedTopics?.includes(topic) || false);
      }
    } catch (error) {
      console.error('Error loading progress:', error);
    }
  };

  const handleComplete = async () => {
    try {
      const progressData = await AsyncStorage.getItem(`${path}Progress`);
      const data = progressData ? JSON.parse(progressData) : { progress: 0, completedTopics: [] };
      
      if (data.completedTopics.includes(topic)) {
        // Remove topic from completed topics
        data.completedTopics = data.completedTopics.filter(t => t !== topic);
        data.progress = (data.completedTopics.length / topics[path].length) * 100;
        setIsCompleted(false);
      } else {
        // Add topic to completed topics
        data.completedTopics = [...data.completedTopics, topic];
        data.progress = (data.completedTopics.length / topics[path].length) * 100;
        setIsCompleted(true);
      }
      
      await AsyncStorage.setItem(`${path}Progress`, JSON.stringify(data));
      setProgress(data.progress);
      
      Alert.alert(
        'Topic Updated',
        isCompleted ? 'Topic marked as incomplete' : 'Topic marked as complete!',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Error saving progress:', error);
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
          <Text style={styles.headerTitle}>{topic}</Text>
        </View>
      </View>

      {/* Content */}
      <Animated.View 
        style={[
          styles.content,
          { opacity: fadeAnim }
        ]}
      >
        <ScrollView style={styles.scrollView}>
          {/* Description */}
          <View style={[styles.section, { backgroundColor: currentTheme.bubbleBg }]}>
            <Text style={styles.sectionTitle}>About this Topic</Text>
            <Text style={styles.description}>
              {getTopicContent().description || 'No description available'}
            </Text>
          </View>

          {/* Key Points */}
          <View style={[styles.section, { backgroundColor: currentTheme.bubbleBg }]}>
            <Text style={styles.sectionTitle}>Key Points</Text>
            {getTopicContent().keyPoints && getTopicContent().keyPoints.length > 0 ? (
              getTopicContent().keyPoints.map((point, index) => (
                <View key={index} style={styles.keyPoint}>
                  <Icon name="check-circle" size={20} color="white" style={styles.keyPointIcon} />
                  <Text style={styles.keyPointText}>{point}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.description}>No key points available</Text>
            )}
          </View>

          {/* Examples */}
          {getTopicContent().examples && getTopicContent().examples.length > 0 ? (
            <View style={[styles.section, { backgroundColor: currentTheme.bubbleBg }]}>
              <Text style={styles.sectionTitle}>Examples</Text>
              {getTopicContent().examples.map((example, index) => (
                <View key={index} style={styles.example}>
                  <Text style={styles.exampleTitle}>{example.title}</Text>
                  <View style={styles.codeBlock}>
                    <Text style={styles.codeText}>{example.code}</Text>
                  </View>
                  <Text style={styles.exampleExplanation}>{example.explanation}</Text>
                </View>
              ))}
            </View>
          ) : null}

          {/* Resources Section */}
          {getTopicContent().resources && (
            <View style={[styles.section, { backgroundColor: currentTheme.bubbleBg }]}>
              <Text style={styles.sectionTitle}>Learning Resources</Text>
              
              {/* Websites */}
              {getTopicContent().resources.websites && getTopicContent().resources.websites.length > 0 ? (
                <View style={styles.resourceSection}>
                  <Text style={styles.resourceSubtitle}>Websites</Text>
                  {getTopicContent().resources.websites.map((site, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.resourceItem}
                      onPress={() => Linking.openURL(site.url)}
                    >
                      <Icon name="web" size={24} color="white" style={styles.resourceIcon} />
                      <View style={styles.resourceContent}>
                        <Text style={styles.resourceTitle}>{site.title}</Text>
                        <Text style={styles.resourceDescription}>{site.description}</Text>
                      </View>
                      <Icon name="open-in-new" size={20} color="white" />
                    </TouchableOpacity>
                  ))}
                </View>
              ) : null}

              {/* Videos */}
              {getTopicContent().resources.videos && getTopicContent().resources.videos.length > 0 ? (
                <View style={styles.resourceSection}>
                  <Text style={styles.resourceSubtitle}>Video Tutorials</Text>
                  {getTopicContent().resources.videos.map((video, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.resourceItem}
                      onPress={() => Linking.openURL(video.url)}
                    >
                      <Icon name="youtube" size={24} color="white" style={styles.resourceIcon} />
                      <View style={styles.resourceContent}>
                        <Text style={styles.resourceTitle}>{video.title}</Text>
                        <Text style={styles.resourceDescription}>
                          {video.channel} • {video.duration}
                        </Text>
                      </View>
                      <Icon name="play-circle" size={20} color="white" />
                    </TouchableOpacity>
                  ))}
                </View>
              ) : null}
            </View>
          )}

          {/* Complete Button */}
          <TouchableOpacity
            style={[
              styles.completeButton,
              { 
                backgroundColor: isCompleted ? '#4CAF50' : currentTheme.bubbleBg,
                borderWidth: 2,
                borderColor: isCompleted ? '#4CAF50' : 'transparent'
              }
            ]}
            onPress={handleComplete}
          >
            <Icon 
              name={isCompleted ? 'check-circle' : 'circle-outline'} 
              size={24} 
              color="white" 
            />
            <Text style={styles.completeButtonText}>
              {isCompleted ? 'Completed' : 'Mark as Complete'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </Animated.View>
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
  headerTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  description: {
    color: '#ffffff',
    fontSize: 16,
    lineHeight: 24,
  },
  keyPoint: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  keyPointIcon: {
    marginRight: 10,
  },
  keyPointText: {
    color: '#ffffff',
    fontSize: 16,
    flex: 1,
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 25,
    marginTop: 20,
    marginBottom: 40,
  },
  completeButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  errorContainer: {
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  errorIcon: {
    marginBottom: 20,
  },
  errorTitle: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  errorText: {
    color: '#ffffff',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  backToTopicsButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    marginTop: 10,
  },
  backToTopicsText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  example: {
    marginBottom: 20,
  },
  exampleTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  codeBlock: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  codeText: {
    color: '#ffffff',
    fontFamily: 'monospace',
    fontSize: 14,
  },
  exampleExplanation: {
    color: '#ffffff',
    fontSize: 14,
    lineHeight: 20,
  },
  playgroundContainer: {
    marginTop: 10,
  },
  playgroundSection: {
    marginBottom: 20,
  },
  playgroundLabel: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  outputBlock: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: 15,
    borderRadius: 10,
    minHeight: 100,
  },
  outputText: {
    color: '#ffffff',
    fontSize: 14,
  },
  codeInput: {
    minHeight: 100,
    textAlignVertical: 'top',
    color: '#ffffff',
    fontFamily: 'monospace',
    fontSize: 14,
  },
  resourceSection: {
    marginBottom: 20,
  },
  resourceSubtitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  resourceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  resourceIcon: {
    marginRight: 15,
  },
  resourceContent: {
    flex: 1,
  },
  resourceTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  resourceDescription: {
    color: '#ffffff',
    fontSize: 14,
    opacity: 0.8,
  },
  lockedContainer: {
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  lockedIcon: {
    marginBottom: 20,
  },
  lockedTitle: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  lockedText: {
    color: '#ffffff',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  topicStep: {
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  stepContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  stepNumberText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  stepInfo: {
    flex: 1,
  },
  stepTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  stepStatus: {
    color: '#ffffff',
    fontSize: 14,
  },
  stepArrow: {
    marginLeft: 10,
  },
  completedStep: {
    backgroundColor: '#4CAF50',
  },
  lockedStep: {
    backgroundColor: '#FF6B6B',
  },
});

export default LessonScreen; 