import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import "@/global.css";

export default function ProfileScreen() {
  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-purple-600 px-4 py-6 pt-12">
        <View className="items-center">
          <View className="w-20 h-20 bg-white rounded-full items-center justify-center mb-3">
            <Text className="text-purple-600 text-2xl">👤</Text>
          </View>
          <Text className="text-white text-xl font-bold">John Doe</Text>
          <Text className="text-purple-100 text-base">
            Computer Science Major
          </Text>
          <Text className="text-purple-100 text-sm">Class of 2028</Text>
        </View>
      </View>

      {/* Stats */}
      <View className="px-4 py-6">
        <View className="flex-row gap-3">
          <View className="bg-white rounded-lg p-4 flex-1 border border-gray-200">
            <Text className="text-gray-800 text-lg font-bold">3.7</Text>
            <Text className="text-gray-500 text-sm">GPA</Text>
          </View>
          <View className="bg-white rounded-lg p-4 flex-1 border border-gray-200">
            <Text className="text-gray-800 text-lg font-bold">15</Text>
            <Text className="text-gray-500 text-sm">Credits</Text>
          </View>
          <View className="bg-white rounded-lg p-4 flex-1 border border-gray-200">
            <Text className="text-gray-800 text-lg font-bold">2nd</Text>
            <Text className="text-gray-500 text-sm">Semester</Text>
          </View>
        </View>
      </View>

      {/* Settings */}
      <View className="px-4 pb-6">
        <Text className="text-gray-800 text-lg font-semibold mb-4">
          Settings
        </Text>
        <View className="bg-white rounded-lg border border-gray-200">
          <TouchableOpacity className="p-4 border-b border-gray-100 flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Text className="text-gray-800 font-medium ml-3">
                📝 Edit Profile
              </Text>
            </View>
            <Text className="text-gray-400">›</Text>
          </TouchableOpacity>

          <TouchableOpacity className="p-4 border-b border-gray-100 flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Text className="text-gray-800 font-medium ml-3">
                🔔 Notifications
              </Text>
            </View>
            <Text className="text-gray-400">›</Text>
          </TouchableOpacity>

          <TouchableOpacity className="p-4 border-b border-gray-100 flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Text className="text-gray-800 font-medium ml-3">
                🎨 Appearance
              </Text>
            </View>
            <Text className="text-gray-400">›</Text>
          </TouchableOpacity>

          <TouchableOpacity className="p-4 border-b border-gray-100 flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Text className="text-gray-800 font-medium ml-3">🔒 Privacy</Text>
            </View>
            <Text className="text-gray-400">›</Text>
          </TouchableOpacity>

          <TouchableOpacity className="p-4 border-b border-gray-100 flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Text className="text-gray-800 font-medium ml-3">ℹ️ About</Text>
            </View>
            <Text className="text-gray-400">›</Text>
          </TouchableOpacity>

          <TouchableOpacity className="p-4 flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Text className="text-red-600 font-medium ml-3">🚪 Sign Out</Text>
            </View>
            <Text className="text-gray-400">›</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
