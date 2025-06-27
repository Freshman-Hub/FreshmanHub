import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import "@/global.css";

export default function NotificationsScreen() {
  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-red-600 px-4 py-6 pt-12">
        <Text className="text-white text-2xl font-bold">Notifications</Text>
        <Text className="text-red-100 text-base mt-1">
          Stay updated with important alerts
        </Text>
      </View>

      {/* Filter Tabs */}
      <View className="px-4 py-4">
        <View className="flex-row bg-gray-100 rounded-lg p-1">
          <TouchableOpacity className="bg-white rounded-md py-2 px-4 flex-1">
            <Text className="text-gray-800 text-center font-medium">All</Text>
          </TouchableOpacity>
          <TouchableOpacity className="py-2 px-4 flex-1">
            <Text className="text-gray-600 text-center font-medium">
              Academic
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className="py-2 px-4 flex-1">
            <Text className="text-gray-600 text-center font-medium">
              Events
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Notifications List */}
      <View className="px-4 pb-6">
        <Text className="text-gray-800 text-lg font-semibold mb-4">
          Recent Notifications
        </Text>

        <View className="space-y-3">
          {/* Assignment Due */}
          <View className="bg-white rounded-lg border border-gray-200 p-4 border-l-4 border-l-red-500">
            <View className="flex-row items-start justify-between">
              <View className="flex-1 mr-3">
                <Text className="text-gray-800 font-medium">
                  📚 Assignment Due Tomorrow
                </Text>
                <Text className="text-gray-600 text-sm mt-1">
                  Math 101 - Calculus Problem Set #3 is due tomorrow at 11:59 PM
                </Text>
                <Text className="text-gray-500 text-xs mt-2">2 hours ago</Text>
              </View>
              <View className="w-2 h-2 bg-red-500 rounded-full mt-2"></View>
            </View>
          </View>

          {/* Buddy Message */}
          <View className="bg-white rounded-lg border border-gray-200 p-4 border-l-4 border-l-orange-500">
            <View className="flex-row items-start justify-between">
              <View className="flex-1 mr-3">
                <Text className="text-gray-800 font-medium">
                  💬 Message from Sarah
                </Text>
                <Text className="text-gray-600 text-sm mt-1">
                  Your buddy sent you a message about tomorrow&apos;s study session
                </Text>
                <Text className="text-gray-500 text-xs mt-2">4 hours ago</Text>
              </View>
              <View className="w-2 h-2 bg-orange-500 rounded-full mt-2"></View>
            </View>
          </View>

          {/* Event Reminder */}
          <View className="bg-white rounded-lg border border-gray-200 p-4 border-l-4 border-l-blue-500">
            <View className="flex-row items-start justify-between">
              <View className="flex-1 mr-3">
                <Text className="text-gray-800 font-medium">
                  🎉 Welcome Week Event
                </Text>
                <Text className="text-gray-600 text-sm mt-1">
                  Pizza Night at the Student Center starts in 1 hour!
                </Text>
                <Text className="text-gray-500 text-xs mt-2">1 day ago</Text>
              </View>
            </View>
          </View>

          {/* Grade Posted */}
          <View className="bg-white rounded-lg border border-gray-200 p-4 border-l-4 border-l-green-500">
            <View className="flex-row items-start justify-between">
              <View className="flex-1 mr-3">
                <Text className="text-gray-800 font-medium">
                  📊 Grade Posted
                </Text>
                <Text className="text-gray-600 text-sm mt-1">
                  Your grade for English 101 Essay #1 has been posted - Great
                  job!
                </Text>
                <Text className="text-gray-500 text-xs mt-2">2 days ago</Text>
              </View>
            </View>
          </View>

          {/* Library Booking */}
          <View className="bg-white rounded-lg border border-gray-200 p-4 border-l-4 border-l-purple-500">
            <View className="flex-row items-start justify-between">
              <View className="flex-1 mr-3">
                <Text className="text-gray-800 font-medium">
                  📖 Study Room Confirmed
                </Text>
                <Text className="text-gray-600 text-sm mt-1">
                  Your study room booking for today 2-4 PM has been confirmed
                </Text>
                <Text className="text-gray-500 text-xs mt-2">3 days ago</Text>
              </View>
            </View>
          </View>

          {/* Course Registration */}
          <View className="bg-white rounded-lg border border-gray-200 p-4 border-l-4 border-l-yellow-500">
            <View className="flex-row items-start justify-between">
              <View className="flex-1 mr-3">
                <Text className="text-gray-800 font-medium">
                  📝 Registration Opens Soon
                </Text>
                <Text className="text-gray-600 text-sm mt-1">
                  Spring semester course registration opens next Monday at 8:00
                  AM
                </Text>
                <Text className="text-gray-500 text-xs mt-2">1 week ago</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Mark All as Read */}
      <View className="px-4 pb-6">
        <TouchableOpacity className="bg-gray-100 rounded-lg py-3">
          <Text className="text-gray-700 text-center font-medium">
            Mark All as Read
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
