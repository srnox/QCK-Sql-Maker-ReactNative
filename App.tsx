import React, { useState, useEffect } from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar, View, Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens';
import './global.css';

// Enable screens for improved navigation performance
enableScreens();

// Import screens
import SplashScreen from './src/screens/SplashScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import HomeScreen from './src/screens/HomeScreen';

// Define the type for stack navigation
type RootStackParamList = {
  Onboarding: undefined;
  Home: undefined;
};

// Define navigation theme by extending DefaultTheme
const navigationTheme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    primary: '#6366f1', // indigo-600
    background: '#111827', // gray-900
    card: '#1f2937', // gray-800
    text: '#ffffff', // white
    border: '#374151', // gray-700
    notification: '#6366f1', // indigo-600
  },
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isFirstLaunch, setIsFirstLaunch] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Simulate splash screen loading
    const timer = setTimeout(() => {
      setIsLoading(false);
      
      // In a production app, you would use AsyncStorage to check if this is first launch
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  // Error boundary UI
  if (hasError) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-900 p-4">
        <Text className="text-red-400 text-xl font-bold mb-2">Something went wrong</Text>
        <Text className="text-gray-300 text-center mb-4">There was an error loading the application</Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor="#111827" />
      {isLoading ? (
        // Show splash screen as a component, wrapping it inside the SafeAreaProvider
        <SplashScreen />
      ) : (
        <NavigationContainer theme={navigationTheme}>
          <Stack.Navigator 
            initialRouteName={isFirstLaunch ? 'Onboarding' : 'Home'}
            screenOptions={{ 
              headerShown: false,
              animation: 'fade',
              contentStyle: { backgroundColor: '#111827' } // gray-900
            }}
          >
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            <Stack.Screen name="Home" component={HomeScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      )}
    </SafeAreaProvider>
  );
};

export default App;