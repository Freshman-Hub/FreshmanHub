import React from "react";
import { View, Text, ScrollView } from "react-native";
import "@/global.css"

export default function HomeScreen() {
  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-blue-600 px-4 py-6 pt-12">
        <Text className="text-white text-2xl font-bold">
          Welcome to FreshmanHub
        </Text>
        <Text className="text-blue-100 text-base mt-1">
          Your college companion
        </Text>
      </View>

      {/* Quick Actions */}
      <View className="px-4 py-6">
        <Text className="text-gray-800 text-lg font-semibold mb-4">
          Quick Actions
        </Text>
        <View className="flex-row flex-wrap gap-3">
          <View className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 flex-1 min-w-[140px]">
            <Text className="text-gray-800 font-medium">📚 Classes</Text>
            <Text className="text-gray-500 text-sm mt-1">View schedule</Text>
          </View>
          <View className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 flex-1 min-w-[140px]">
            <Text className="text-gray-800 font-medium">📝 Assignments</Text>
            <Text className="text-gray-500 text-sm mt-1">Track progress</Text>
          </View>
          <View className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 flex-1 min-w-[140px]">
            <Text className="text-gray-800 font-medium">🏫 Campus Map</Text>
            <Text className="text-gray-500 text-sm mt-1">Find locations</Text>
          </View>
          <View className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 flex-1 min-w-[140px]">
            <Text className="text-gray-800 font-medium">👥 Events</Text>
            <Text className="text-gray-500 text-sm mt-1">
              Discover activities
            </Text>
          </View>
        </View>
      </View>

      {/* Recent Activity */}
      <View className="px-4 pb-6">
        <Text className="text-gray-800 text-lg font-semibold mb-4">
          Recent Activity
        </Text>
        <View className="bg-white rounded-lg border border-gray-200">
          <View className="p-4 border-b border-gray-100">
            <Text className="text-gray-800 font-medium">
              Math 101 - Assignment Due
            </Text>
            <Text className="text-gray-500 text-sm mt-1">
              Due tomorrow at 11:59 PM
            </Text>
          </View>
          <View className="p-4 border-b border-gray-100">
            <Text className="text-gray-800 font-medium">
              Welcome Week Events
            </Text>
            <Text className="text-gray-500 text-sm mt-1">
              3 new events this week
            </Text>
          </View>
          <View className="p-4">
            <Text className="text-gray-800 font-medium">
              Library Study Room
            </Text>
            <Text className="text-gray-500 text-sm mt-1">
              Booking confirmed for today 2-4 PM
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
