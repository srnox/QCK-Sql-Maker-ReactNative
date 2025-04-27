import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Modal, ScrollView } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { CATEGORIES, CategoryOption } from '../types/vehicle';
import { getCustomCategories, addCustomCategory } from '../utils/storage';

interface CategorySelectionProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  visible: boolean;
  onClose: () => void;
}

const CategorySelection: React.FC<CategorySelectionProps> = ({
  selectedCategory,
  onSelectCategory,
  visible,
  onClose
}) => {
  const [customCategory, setCustomCategory] = useState('');
  const [showAddCustom, setShowAddCustom] = useState(false);
  const [categories, setCategories] = useState<CategoryOption[]>(CATEGORIES);
  
  // Load custom categories when component mounts
  useEffect(() => {
    const loadCustomCategories = async () => {
      try {
        const customCats = await getCustomCategories();
        if (customCats.length > 0) {
          // Create a new combined array with default and custom categories
          setCategories([...CATEGORIES, ...customCats]);
        }
      } catch (err) {
        console.error('Error loading custom categories:', err);
      }
    };
    
    loadCustomCategories();
  }, []);

  const handleSelectCategory = (value: string) => {
    onSelectCategory(value);
    onClose();
  };
  
  const handleAddCustomCategory = async () => {
    if (customCategory.trim()) {
      // Create a new category with proper formatting
      const value = customCategory.trim().toLowerCase().replace(/\s+/g, '_');
      const newCategory: CategoryOption = {
        label: customCategory.trim(),
        value
      };
      
      // Add to categories list
      setCategories(prevCategories => [...prevCategories, newCategory]);
      
      // Save to AsyncStorage
      await addCustomCategory(newCategory);
      
      // Select the new category
      onSelectCategory(value);
      
      // Reset and close
      setCustomCategory('');
      setShowAddCustom(false);
      onClose();
    }
  };
  
  const renderCategoryItem = ({ item }: { item: CategoryOption }) => {
    const isSelected = selectedCategory === item.value;
    
    // Get a color for the category badge
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
      <TouchableOpacity
        className={`p-4 flex-row items-center justify-between ${
          isSelected ? 'bg-indigo-900/30' : ''
        }`}
        onPress={() => handleSelectCategory(item.value)}
      >
        <View className="flex-row items-center">
          <View className={`w-3 h-3 rounded-full ${getCategoryColor(item.value)} mr-3`} />
          <Text className="text-white font-medium">{item.label}</Text>
        </View>
        {isSelected && (
          <MaterialCommunityIcons name="check-circle" size={20} color="#8b5cf6" />
        )}
      </TouchableOpacity>
    );
  };
  
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/70 justify-center items-center">
        <View className="bg-gray-800 w-11/12 rounded-2xl max-h-[80%] overflow-hidden shadow-xl">
          <View className="flex-row items-center justify-between border-b border-gray-700 p-5">
            <View className="flex-row items-center">
              <View className="w-8 h-8 bg-indigo-600 rounded-lg items-center justify-center mr-2">
                <MaterialCommunityIcons name="shape-plus" size={20} color="#fff" />
              </View>
              <Text className="text-white text-xl font-bold">Select Category</Text>
            </View>
            <TouchableOpacity
              className="w-8 h-8 items-center justify-center bg-gray-700 rounded-full"
              onPress={onClose}
            >
              <MaterialCommunityIcons name="close" size={18} color="#9ca3af" />
            </TouchableOpacity>
          </View>
          
          <ScrollView className="max-h-[400px]">
            {categories.map((item, index) => (
              <React.Fragment key={item.value}>
                {index > 0 && <View className="h-[1px] bg-gray-700/50" />}
                {renderCategoryItem({ item })}
              </React.Fragment>
            ))}
          </ScrollView>
          
          {showAddCustom ? (
            <View className="p-5 border-t border-gray-700">
              <View className="flex-row mb-3">
                <TextInput
                  className="flex-1 bg-gray-900 text-white p-3 rounded-l-xl border border-gray-700"
                  placeholder="Enter custom category"
                  placeholderTextColor="#6b7280"
                  value={customCategory}
                  onChangeText={setCustomCategory}
                />
                <TouchableOpacity
                  className="bg-indigo-600 rounded-r-xl justify-center items-center px-5"
                  onPress={handleAddCustomCategory}
                >
                  <Text className="text-white font-bold">Add</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                className="py-2"
                onPress={() => setShowAddCustom(false)}
              >
                <Text className="text-gray-400 text-center">Cancel</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View className="p-5 border-t border-gray-700">
              <TouchableOpacity
                className="bg-gray-700 p-3.5 rounded-xl flex-row items-center justify-center"
                onPress={() => setShowAddCustom(true)}
              >
                <MaterialCommunityIcons name="plus" size={20} color="#8b5cf6" />
                <Text className="text-white font-medium ml-2">Add Custom Category</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default CategorySelection; 