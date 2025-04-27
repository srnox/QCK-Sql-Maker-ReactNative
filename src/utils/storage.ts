import AsyncStorage from '@react-native-async-storage/async-storage';
import { CategoryOption } from '../types/vehicle';

const CUSTOM_CATEGORIES_KEY = '@vexim_custom_categories';

export const saveCustomCategories = async (categories: CategoryOption[]): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(categories);
    await AsyncStorage.setItem(CUSTOM_CATEGORIES_KEY, jsonValue);
  } catch (e) {
    console.error('Failed to save custom categories', e);
  }
};

export const getCustomCategories = async (): Promise<CategoryOption[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(CUSTOM_CATEGORIES_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Failed to get custom categories', e);
    return [];
  }
};

export const addCustomCategory = async (category: CategoryOption): Promise<void> => {
  try {
    const existingCategories = await getCustomCategories();
    
    // Check if category already exists
    if (!existingCategories.some(cat => cat.value === category.value)) {
      existingCategories.push(category);
      await saveCustomCategories(existingCategories);
    }
  } catch (e) {
    console.error('Failed to add custom category', e);
  }
}; 