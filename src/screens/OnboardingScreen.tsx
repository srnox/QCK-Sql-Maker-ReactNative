import React, { useState, useRef, useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList, useWindowDimensions, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import Animated, { 
  useSharedValue,
  useAnimatedStyle, 
  interpolate,
  withSpring
} from 'react-native-reanimated';
// Change the import to use react-native-vector-icons instead
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// Define the type for onboarding items
interface OnboardingItem {
  id: string;
  title: string;
  description: string;
  icon: string;
}

// Define the navigation types
type RootStackParamList = {
  Onboarding: undefined;
  Home: undefined;
};

type OnboardingScreenProps = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

// Static data
const onboardingData: OnboardingItem[] = [
  {
    id: '1',
    title: 'Welcome to FiveM SQL Generator',
    description: 'Create SQL statements for FiveM vehicles with just a few taps',
    icon: 'database-plus'
  },
  {
    id: '2',
    title: 'Add Vehicle Details',
    description: 'Enter spawn name, label, category, and price for each vehicle',
    icon: 'car'
  },
  {
    id: '3',
    title: 'Generate SQL',
    description: 'Generate SQL statements ready to be used in your database',
    icon: 'code-braces'
  },
];

const OnboardingScreen = ({ navigation }: OnboardingScreenProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { width } = useWindowDimensions();
  const translationX = useSharedValue(0);
  // Fix the FlatList type to include the item type
  const flatListRef = useRef<FlatList<OnboardingItem>>(null);
  
  // Button animation
  const buttonScale = useSharedValue(1);

  const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    // Update the shared value with the scroll position
    translationX.value = event.nativeEvent.contentOffset.x;
  }, []);

  const scrollTo = () => {
    // Button press animation
    buttonScale.value = withSpring(0.95, { damping: 15 }, () => {
      buttonScale.value = withSpring(1, { damping: 15 });
    });
    
    if (currentIndex < onboardingData.length - 1) {
      // Go to next screen
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      
      // Use this syntax for scrollToIndex to avoid TypeScript errors
      if (flatListRef.current) {
        flatListRef.current.scrollToIndex({ 
          index: nextIndex,
          animated: true 
        });
      }
    } else {
      // Go to home screen with animation delay
      setTimeout(() => {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        });
      }, 200);
    }
  };

  // Render a dot indicator
  const renderDot = (index: number) => {
    const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
    
    const dotStyle = useAnimatedStyle(() => {
      const dotWidth = interpolate(
        translationX.value,
        inputRange,
        [8, 24, 8],
        'clamp'
      );
      
      const opacity = interpolate(
        translationX.value,
        inputRange,
        [0.3, 1, 0.3],
        'clamp'
      );
      
      return {
        width: dotWidth,
        opacity,
      };
    });
    
    return (
      <Animated.View
        key={index.toString()}
        style={[
          {
            height: 8,
            borderRadius: 4,
            backgroundColor: '#6366f1',
            marginHorizontal: 4,
          },
          dotStyle
        ]}
      />
    );
  };

  const handleMomentumScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
  };
  
  // Button animation style
  const buttonAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: buttonScale.value }],
    };
  });

  return (
    <View className="flex-1 bg-gray-900">
      {/* Use regular FlatList with properly typed onScroll event */}
      <FlatList
        data={onboardingData}
        renderItem={({ item }) => (
          <View className="flex-1 items-center justify-center" style={{ width }}>
            <View className="w-32 h-32 bg-indigo-600 rounded-3xl items-center justify-center mb-8 shadow-lg">
              {/* Fix the TypeScript error by casting the icon name to string */}
              <MaterialCommunityIcons name={item.icon} size={64} color="#fff" />
            </View>
            <Text className="text-white text-2xl font-bold mb-2">{item.title}</Text>
            <Text className="text-gray-300 text-base text-center px-12">{item.description}</Text>
          </View>
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        bounces={false}
        keyExtractor={(item) => item.id}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        ref={flatListRef}
        className="flex-1"
      />

      <View className="flex-row justify-center my-6">
        {onboardingData.map((_, i) => renderDot(i))}
      </View>

      <View className="mb-12 mx-8">
        <Animated.View style={buttonAnimatedStyle}>
          <TouchableOpacity
            className="bg-indigo-600 rounded-2xl p-4 items-center justify-center shadow-lg"
            onPress={scrollTo}
            activeOpacity={0.8}
          >
            <Text className="text-white font-bold text-lg">
              {currentIndex === onboardingData.length - 1 ? "Get Started" : "Next"}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
};

export default OnboardingScreen;