import React, { useEffect } from 'react';
import { View, Text, Animated } from 'react-native';
// Changed from @expo/vector-icons to react-native-vector-icons
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const SplashScreen = () => {
  // Animation values
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    // Start animations when component mounts
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View className="flex-1 items-center justify-center bg-gray-900">
      <Animated.View 
        className="items-center justify-center"
        style={{ 
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }]
        }}
      >
        <View className="w-32 h-32 bg-indigo-600 rounded-3xl items-center justify-center mb-8 shadow-lg">
          <MaterialCommunityIcons name="database" size={64} color="#fff" />
        </View>
        
        <Text className="text-white text-3xl font-bold">FiveM SQL Gen</Text>
        <Text className="text-indigo-300 text-base mt-2">Vehicle SQL Generation Made Easy</Text>
      </Animated.View>
    </View>
  );
};

export default SplashScreen;