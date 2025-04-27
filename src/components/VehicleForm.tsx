import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Animated, Platform } from 'react-native';
// Remove the Picker import and add our CategorySelection component
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Vehicle, CATEGORIES } from '../types/vehicle';
import CategorySelection from './CategorySelection';

interface VehicleFormProps {
  onAddVehicle: (vehicle: Vehicle) => void;
}

const VehicleForm: React.FC<VehicleFormProps> = ({ onAddVehicle }) => {
  const [model, setModel] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0].value);
  const [error, setError] = useState('');
  // Add state for category selection modal
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  
  // Animation values
  const buttonScale = useRef(new Animated.Value(1)).current;
  const errorAnim = useRef(new Animated.Value(0)).current;
  
  // Button press animation
  const animateButtonPress = () => {
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.95,
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
  
  // Error animation
  const animateError = () => {
    errorAnim.setValue(0);
    Animated.timing(errorAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true
    }).start();
  };

  // Get category label for display
  const getCategoryLabel = () => {
    const found = CATEGORIES.find(cat => cat.value === category);
    return found ? found.label : category;
  };

  const handleAddVehicle = () => {
    // Validate inputs
    if (!model.trim()) {
      setError('Spawn name (model) is required');
      animateError();
      return;
    }
    
    if (!name.trim()) {
      setError('Vehicle label (name) is required');
      animateError();
      return;
    }
    
    if (!price.trim() || isNaN(Number(price)) || Number(price) <= 0) {
      setError('Price must be a valid positive number');
      animateError();
      return;
    }
    
    // Create new vehicle object
    const newVehicle: Vehicle = {
      id: Date.now().toString(),
      model: model.trim().toLowerCase(),
      name: name.trim(),
      price: Number(price),
      category,
    };
    
    // Animate button
    animateButtonPress();
    
    // Pass the new vehicle to parent component
    onAddVehicle(newVehicle);
    
    // Reset form
    setModel('');
    setName('');
    setPrice('');
    setCategory(CATEGORIES[0].value);
    setError('');
  };
  
  // Animation styles
  const buttonAnimStyle = {
    transform: [{ scale: buttonScale }]
  };
  
  const errorAnimStyle = {
    opacity: errorAnim,
    transform: [
      {
        translateX: errorAnim.interpolate({
          inputRange: [0, 0.2, 0.4, 0.6, 0.8, 1],
          outputRange: [0, -5, 5, -5, 5, 0]
        })
      }
    ]
  };

  return (
    <View className="bg-gray-800 rounded-3xl shadow-lg p-6 mb-5">
      <View className="flex-row items-center justify-center mb-5">
        <View className="w-10 h-10 bg-indigo-600 rounded-xl items-center justify-center mr-3 shadow-md">
          <MaterialCommunityIcons name="car-plus" size={22} color="#fff" />
        </View>
        <Text className="text-xl font-bold text-white">Add New Vehicle</Text>
      </View>
      
      {error ? (
        <Animated.View 
          className="bg-red-900/40 p-3 rounded-xl mb-5 border border-red-500"
          style={errorAnimStyle}
        >
          <View className="flex-row items-center">
            <MaterialCommunityIcons name="alert-circle" size={18} color="#f87171" className="mr-2" />
            <Text className="text-red-400">{error}</Text>
          </View>
        </Animated.View>
      ) : null}
      
      <View className="mb-4">
        <Text className="text-gray-300 mb-2 font-medium">Spawn Name (model)</Text>
        <View className="flex-row items-center bg-gray-900 rounded-xl p-3 border border-gray-700">
          <MaterialCommunityIcons name="code-tags" size={20} color="#6366f1" className="ml-1 mr-2" />
          <TextInput
            className="flex-1 text-white"
            value={model}
            onChangeText={setModel}
            placeholder="e.g. buccaneer"
            placeholderTextColor="#6b7280"
          />
        </View>
      </View>
      
      <View className="mb-4">
        <Text className="text-gray-300 mb-2 font-medium">Label (display name)</Text>
        <View className="flex-row items-center bg-gray-900 rounded-xl p-3 border border-gray-700">
          <MaterialCommunityIcons name="tag-text" size={20} color="#6366f1" className="ml-1 mr-2" />
          <TextInput
            className="flex-1 text-white"
            value={name}
            onChangeText={setName}
            placeholder="e.g. Buccaneer"
            placeholderTextColor="#6b7280"
          />
        </View>
      </View>
      
      <View className="mb-4">
        <Text className="text-gray-300 mb-2 font-medium">Price</Text>
        <View className="flex-row items-center bg-gray-900 rounded-xl p-3 border border-gray-700">
          <MaterialCommunityIcons name="currency-usd" size={20} color="#6366f1" className="ml-1 mr-2" />
          <TextInput
            className="flex-1 text-white"
            value={price}
            onChangeText={setPrice}
            placeholder="e.g. 18000"
            placeholderTextColor="#6b7280"
            keyboardType="numeric"
          />
        </View>
      </View>
      
      <View className="mb-6">
        <Text className="text-gray-300 mb-2 font-medium">Category</Text>
        <TouchableOpacity 
          className="flex-row items-center justify-between bg-gray-900 rounded-xl p-3 border border-gray-700"
          onPress={() => setShowCategoryModal(true)}
        >
          <View className="flex-row items-center">
            <MaterialCommunityIcons name="shape" size={20} color="#6366f1" className="mr-2" />
            <Text className="text-white">{getCategoryLabel()}</Text>
          </View>
          <MaterialCommunityIcons name="chevron-down" size={20} color="#6366f1" />
        </TouchableOpacity>
        
        <CategorySelection 
          selectedCategory={category}
          onSelectCategory={setCategory}
          visible={showCategoryModal}
          onClose={() => setShowCategoryModal(false)}
        />
      </View>
      
      <Animated.View style={buttonAnimStyle}>
        <TouchableOpacity
          className="bg-indigo-600 py-3.5 rounded-xl shadow-lg flex-row justify-center items-center"
          onPress={handleAddVehicle}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons name="plus-circle" size={22} color="#fff" style={{ marginRight: 8 }} />
          <Text className="text-white font-bold text-center">Add Vehicle</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

export default VehicleForm;