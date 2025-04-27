import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Modal, 
  Alert,
  Platform,
  Animated
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import { Share } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// Changed from @expo/vector-icons to react-native-vector-icons
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import VehicleForm from '../components/VehicleForm';
import VehicleList from '../components/VehicleList';
import { Vehicle } from '../types/vehicle';
import { generateSQL } from '../utils/sqlGenerator';

const HomeScreen = () => {
  const insets = useSafeAreaInsets();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [sqlModalVisible, setSqlModalVisible] = useState(false);
  const [sqlQuery, setSqlQuery] = useState('');
  
  // Animation values
  const modalAnimation = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  
  // Add a new vehicle to the list
  const handleAddVehicle = (vehicle: Vehicle) => {
    setVehicles([...vehicles, vehicle]);
  };
  
  // Remove a vehicle from the list
  const handleDeleteVehicle = (id: string) => {
    setVehicles(vehicles.filter(vehicle => vehicle.id !== id));
  };
  
  // Generate SQL and show modal
  const handleGenerateSQL = () => {
    if (vehicles.length === 0) {
      Alert.alert('No Vehicles', 'Please add at least one vehicle first.');
      return;
    }
    
    const sql = generateSQL(vehicles);
    setSqlQuery(sql);
    setSqlModalVisible(true);
    
    // Animate modal in
    Animated.spring(modalAnimation, {
      toValue: 1,
      useNativeDriver: true,
      friction: 8,
      tension: 40
    }).start();
  };
  
  // Clear all vehicles
  const handleClearAll = () => {
    if (vehicles.length === 0) return;
    
    Alert.alert(
      'Clear All Vehicles',
      'Are you sure you want to clear all vehicles? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear All', 
          style: 'destructive',
          onPress: () => setVehicles([])
        }
      ]
    );
  };
  
  // Copy SQL to clipboard
  const handleCopySQL = () => {
    Clipboard.setString(sqlQuery);
    Alert.alert('Copied', 'SQL query copied to clipboard');
    animateButtonPress(buttonScale);
  };
  
  // Share SQL
  const handleShareSQL = async () => {
    try {
      animateButtonPress(buttonScale);
      await Share.share({
        message: sqlQuery,
        title: 'FiveM Vehicle SQL'
      });
    } catch (error) {
      console.error('Error sharing SQL:', error);
      Alert.alert('Error', 'Could not share the SQL statement');
    }
  };
  
  // Button press animation
  const animateButtonPress = (animValue: Animated.Value) => {
    Animated.sequence([
      Animated.timing(animValue, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true
      }),
      Animated.timing(animValue, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true
      })
    ]).start();
  };
  
  // Close modal with animation
  const closeModal = () => {
    Animated.timing(modalAnimation, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true
    }).start(() => {
      setSqlModalVisible(false);
    });
  };
  
  // Modal animation styles
  const modalContainerStyle = {
    opacity: modalAnimation,
    transform: [
      {
        translateY: modalAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [300, 0]
        })
      }
    ]
  };

  return (
    <View 
      className="flex-1 bg-gray-900"
      style={{ 
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right
      }}
    >
      {/* Header */}
      <View className="bg-gray-800 pt-5 pb-5 px-5 rounded-b-3xl mb-4 shadow-lg">
        <View className="flex-row items-center justify-center">
          <View className="w-12 h-12 bg-indigo-600 rounded-xl items-center justify-center shadow-md mr-3">
            <MaterialCommunityIcons name="database" size={28} color="#fff" />
          </View>
          <View>
            <Text className="text-white text-xl font-bold">FiveM SQL Generator</Text>
            <Text className="text-indigo-300">Add vehicles and generate SQL</Text>
          </View>
        </View>
      </View>
      
      <ScrollView className="flex-1 px-4">
        {/* Vehicle Form */}
        <VehicleForm onAddVehicle={handleAddVehicle} />
        
        {/* Vehicle List */}
        <VehicleList 
          vehicles={vehicles} 
          onDeleteVehicle={handleDeleteVehicle} 
        />
        
        {/* Button spacer - add margin when there are no vehicles */}
        {vehicles.length === 0 && <View className="h-4" />}
        
        {/* Action Buttons */}
        <View className="flex-row justify-between mb-8">
          <TouchableOpacity
            className="bg-red-500/90 p-4 rounded-2xl flex-1 mr-2 shadow-lg"
            onPress={handleClearAll}
            activeOpacity={0.7}
            style={{ 
              shadowColor: '#ef4444',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 4,
              elevation: 6
            }}
          >
            <View className="flex-row items-center justify-center">
              <MaterialCommunityIcons name="trash-can-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
              <Text className="text-white font-bold">Clear All</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity
            className="bg-indigo-600 p-4 rounded-2xl flex-1 ml-2 shadow-lg"
            onPress={handleGenerateSQL}
            activeOpacity={0.7}
            style={{ 
              shadowColor: '#6366f1',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 4,
              elevation: 6
            }}
          >
            <View className="flex-row items-center justify-center">
              <MaterialCommunityIcons name="database-export" size={20} color="#fff" style={{ marginRight: 8 }} />
              <Text className="text-white font-bold">Generate SQL</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
      
      {/* SQL Modal */}
      <Modal
        animationType="none"
        transparent={true}
        visible={sqlModalVisible}
        onRequestClose={closeModal}
      >
        <View className="flex-1 justify-end bg-black/70">
          <Animated.View 
            className="bg-gray-800 rounded-t-3xl p-6" 
            style={[modalContainerStyle, { paddingBottom: insets.bottom || 16 }]}
          >
            <View className="w-12 h-1 bg-gray-600 rounded-full self-center mb-6" />
            
            <View className="flex-row justify-between items-center mb-5">
              <View className="flex-row items-center">
                <View className="w-8 h-8 bg-indigo-600 rounded-lg items-center justify-center mr-2">
                  <MaterialCommunityIcons name="code-json" size={20} color="#fff" />
                </View>
                <Text className="text-xl font-bold text-white">Generated SQL</Text>
              </View>
              <TouchableOpacity 
                className="w-8 h-8 items-center justify-center bg-gray-700 rounded-full"
                onPress={closeModal}
              >
                <MaterialCommunityIcons name="close" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
            
            <ScrollView 
              className="max-h-64 border border-gray-700 rounded-2xl bg-gray-900/80 p-4 mb-5"
              showsVerticalScrollIndicator={false}
            >
              <Text className="font-mono text-indigo-300 leading-5">{sqlQuery}</Text>
            </ScrollView>
            
            <View className="flex-row justify-between mb-6">
              <TouchableOpacity
                className="bg-indigo-600 p-4 rounded-2xl flex-1 mr-2 shadow-lg"
                onPress={handleCopySQL}
                activeOpacity={0.8}
              >
                <View className="flex-row items-center justify-center">
                  <MaterialCommunityIcons name="content-copy" size={20} color="#fff" style={{ marginRight: 8 }} />
                  <Text className="text-white font-bold">Copy</Text>
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity
                className="bg-indigo-600 p-4 rounded-2xl flex-1 ml-2 shadow-lg"
                onPress={handleShareSQL}
                activeOpacity={0.8}
              >
                <View className="flex-row items-center justify-center">
                  <MaterialCommunityIcons name="share-variant" size={20} color="#fff" style={{ marginRight: 8 }} />
                  <Text className="text-white font-bold">Share</Text>
                </View>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
};

export default HomeScreen;