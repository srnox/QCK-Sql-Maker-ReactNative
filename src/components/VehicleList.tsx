import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, Image } from 'react-native';
// Changed from @expo/vector-icons to react-native-vector-icons
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Vehicle } from '../types/vehicle';

interface VehicleListProps {
  vehicles: Vehicle[];
  onDeleteVehicle: (id: string) => void;
}

const VehicleList: React.FC<VehicleListProps> = ({ vehicles, onDeleteVehicle }) => {
  // Animation refs for delete button
  const buttonScale = useRef(new Animated.Value(1)).current;
  
  // Button press animation
  const animateButtonPress = () => {
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true
      })
    ]).start();
  };

  if (vehicles.length === 0) {
    return (
      <View className="bg-gray-800 rounded-3xl shadow-lg p-5 items-center justify-center py-12 mb-6">
        <View className="w-20 h-20 bg-gray-700/60 rounded-full items-center justify-center mb-4">
          <MaterialCommunityIcons name="car-off" size={36} color="#8b5cf6" />
        </View>
        <Text className="text-white text-lg font-medium mb-1">No vehicles added yet</Text>
        <Text className="text-gray-400 text-center max-w-[220px]">
          Add a vehicle using the form above to see it here
        </Text>
        
        {/* Visual elements to make it prettier */}
        <View className="absolute top-12 left-6 w-3 h-3 bg-indigo-500 rounded-full opacity-30" />
        <View className="absolute bottom-16 right-8 w-4 h-4 bg-purple-500 rounded-full opacity-40" />
        <View className="absolute top-24 right-12 w-2 h-2 bg-blue-500 rounded-full opacity-30" />
      </View>
    );
  }

  // Get a color for the vehicle category
  const getCategoryColor = (category: string) => {
    const colors: {[key: string]: string} = {
      'muscle': 'bg-red-500',
      'sports': 'bg-blue-500',
      'super': 'bg-purple-500',
      'sedan': 'bg-green-500',
      'coupe': 'bg-yellow-500',
      'compact': 'bg-pink-500',
      'suv': 'bg-orange-500',
      'offroad': 'bg-lime-500',
      'motorcycle': 'bg-indigo-500',
      'van': 'bg-cyan-500',
      'truck': 'bg-amber-500'
    };
    return colors[category] || 'bg-gray-500';
  };

  return (
    <View className="bg-gray-800 rounded-3xl shadow-lg p-5 mb-4">
      <View className="flex-row items-center justify-center mb-4">
        <View className="w-8 h-8 bg-indigo-600 rounded-lg items-center justify-center mr-2 shadow-md">
          <MaterialCommunityIcons name="format-list-bulleted" size={20} color="#fff" />
        </View>
        <Text className="text-xl font-bold text-white">
          Added Vehicles <Text className="text-indigo-400">({vehicles.length})</Text>
        </Text>
      </View>
      
      {vehicles.map((item) => {
        const categoryColor = getCategoryColor(item.category);
        
        const handleDelete = () => {
          animateButtonPress();
          // Add a small delay for animation
          setTimeout(() => onDeleteVehicle(item.id), 100);
        };
        
        return (
          <View key={item.id} className="bg-gray-700 rounded-2xl p-4 mb-3 shadow-md">
            <View className="flex-row justify-between items-center">
              <View className="flex-1">
                <Text className="font-bold text-white text-lg">{item.name}</Text>
                <Text className="text-gray-300">Model: <Text className="text-indigo-300">{item.model}</Text></Text>
                <View className="flex-row items-center mt-2">
                  <View className="flex-row items-center mr-4 bg-gray-800/80 px-2 py-1 rounded-lg">
                    <MaterialCommunityIcons name="currency-usd" size={16} color="#a5b4fc" />
                    <Text className="text-gray-200 ml-1 font-medium">{item.price.toLocaleString()}</Text>
                  </View>
                  <View className="flex-row items-center bg-gray-800/80 px-2 py-1 rounded-lg">
                    <View className={`w-3 h-3 rounded-full ${categoryColor} mr-2`} />
                    <Text className="text-gray-200 capitalize font-medium">{item.category}</Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity
                className="bg-red-500 p-2.5 rounded-xl ml-3"
                onPress={handleDelete}
                activeOpacity={0.8}
              >
                <MaterialCommunityIcons name="delete" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        );
      })}
    </View>
  );
};

export default VehicleList;