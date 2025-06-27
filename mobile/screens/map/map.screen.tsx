import React from "react";
import { View, Text, ScrollView } from "react-native";
import "@/global.css";

export default function MapScreen() {
  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-green-600 px-4 py-6 pt-12">
        <Text className="text-white text-2xl font-bold">Campus Map</Text>
        <Text className="text-green-100 text-base mt-1">
          Find your way around campus
        </Text>
      </View>

      {/* Map Placeholder */}
      <View className="px-4 py-6">
        <View className="bg-white rounded-lg border border-gray-200 h-64 items-center justify-center">
          <Text className="text-gray-500 text-lg">🗺️</Text>
          <Text className="text-gray-500 text-base mt-2">
            Interactive map coming soon
          </Text>
        </View>
      </View>

      {/* Quick Locations */}
      <View className="px-4 pb-6">
        <Text className="text-gray-800 text-lg font-semibold mb-4">
          Quick Locations
        </Text>
        <View className="space-y-3">
          <View className="bg-white rounded-lg p-4 border border-gray-200">
            <Text className="text-gray-800 font-medium">🏛️ Main Library</Text>
            <Text className="text-gray-500 text-sm mt-1">
              Building A, Floor 2
            </Text>
          </View>
          <View className="bg-white rounded-lg p-4 border border-gray-200">
            <Text className="text-gray-800 font-medium">🍕 Student Center</Text>
            <Text className="text-gray-500 text-sm mt-1">
              Building B, Ground Floor
            </Text>
          </View>
          <View className="bg-white rounded-lg p-4 border border-gray-200">
            <Text className="text-gray-800 font-medium">
              🏃‍♂️ Recreation Center
            </Text>
            <Text className="text-gray-500 text-sm mt-1">
              Building C, All Floors
            </Text>
          </View>
          <View className="bg-white rounded-lg p-4 border border-gray-200">
            <Text className="text-gray-800 font-medium">🅿️ Parking Garage</Text>
            <Text className="text-gray-500 text-sm mt-1">North Campus</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
