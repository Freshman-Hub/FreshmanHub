import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import "@/global.css";

export default function BuddyScreen() {
  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-orange-600 px-4 py-6 pt-12">
        <Text className="text-white text-2xl font-bold">Your Buddy</Text>
        <Text className="text-orange-100 text-base mt-1">
          Connect with your assigned mentor
        </Text>
      </View>

      {/* Buddy Profile */}
      <View className="px-4 py-6">
        <View className="bg-white rounded-lg border border-gray-200 p-6">
          <View className="items-center mb-4">
            <View className="w-24 h-24 bg-orange-100 rounded-full items-center justify-center mb-3">
              <Text className="text-orange-600 text-3xl">👩‍🎓</Text>
            </View>
            <Text className="text-gray-800 text-xl font-bold">
              Sarah Johnson
            </Text>
            <Text className="text-gray-600 text-base">
              3rd Year - Computer Science
            </Text>
            <Text className="text-gray-500 text-sm mt-1">
              Your assigned buddy
            </Text>
          </View>

          <View className="flex-row gap-3 mb-4">
            <TouchableOpacity className="bg-orange-600 rounded-lg py-3 px-4 flex-1">
              <Text className="text-white text-center font-medium">
                💬 Message
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className="bg-gray-100 rounded-lg py-3 px-4 flex-1">
              <Text className="text-gray-700 text-center font-medium">
                📞 Call
              </Text>
            </TouchableOpacity>
          </View>

          <View className="border-t border-gray-100 pt-4">
            <Text className="text-gray-800 font-medium mb-2">About Sarah</Text>
            <Text className="text-gray-600 text-sm leading-5">
              &quot;Hi! I&apos;m Sarah, a 3rd-year CS student. I love coding,
              playing guitar, and exploring the city. I&apos;m here to help you
              navigate your first year and make the most of your college
              experience!&quot;
            </Text>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View className="px-4 pb-6">
        <Text className="text-gray-800 text-lg font-semibold mb-4">
          Quick Help
        </Text>
        <View className="space-y-3">
          <TouchableOpacity className="bg-white rounded-lg p-4 border border-gray-200 flex-row items-center justify-between">
            <View>
              <Text className="text-gray-800 font-medium">
                🗓️ Schedule a Meet
              </Text>
              <Text className="text-gray-500 text-sm mt-1">
                Book time with your buddy
              </Text>
            </View>
            <Text className="text-gray-400">›</Text>
          </TouchableOpacity>

          <TouchableOpacity className="bg-white rounded-lg p-4 border border-gray-200 flex-row items-center justify-between">
            <View>
              <Text className="text-gray-800 font-medium">
                ❓ Ask Questions
              </Text>
              <Text className="text-gray-500 text-sm mt-1">
                Get help with anything
              </Text>
            </View>
            <Text className="text-gray-400">›</Text>
          </TouchableOpacity>

          <TouchableOpacity className="bg-white rounded-lg p-4 border border-gray-200 flex-row items-center justify-between">
            <View>
              <Text className="text-gray-800 font-medium">
                📚 Study Together
              </Text>
              <Text className="text-gray-500 text-sm mt-1">
                Join study sessions
              </Text>
            </View>
            <Text className="text-gray-400">›</Text>
          </TouchableOpacity>

          <TouchableOpacity className="bg-white rounded-lg p-4 border border-gray-200 flex-row items-center justify-between">
            <View>
              <Text className="text-gray-800 font-medium">
                🎉 Campus Events
              </Text>
              <Text className="text-gray-500 text-sm mt-1">
                Explore events together
              </Text>
            </View>
            <Text className="text-gray-400">›</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Recent Conversations */}
      <View className="px-4 pb-6">
        <Text className="text-gray-800 text-lg font-semibold mb-4">
          Recent Conversations
        </Text>
        <View className="bg-white rounded-lg border border-gray-200">
          <View className="p-4 border-b border-gray-100">
            <Text className="text-gray-800 font-medium">
              Course Registration Help
            </Text>
            <Text className="text-gray-500 text-sm mt-1">
              Yesterday, 2:30 PM
            </Text>
            <Text className="text-gray-600 text-sm mt-2">
              &quot;Thanks for helping me pick my electives!&quot;
            </Text>
          </View>
          <View className="p-4 border-b border-gray-100">
            <Text className="text-gray-800 font-medium">Library Tour</Text>
            <Text className="text-gray-500 text-sm mt-1">3 days ago</Text>
            <Text className="text-gray-600 text-sm mt-2">
              &quot;Meet you at the main entrance at 3 PM&quot;
            </Text>
          </View>
          <View className="p-4">
            <Text className="text-gray-800 font-medium">Welcome Message</Text>
            <Text className="text-gray-500 text-sm mt-1">1 week ago</Text>
            <Text className="text-gray-600 text-sm mt-2">
              &quot;Welcome to college! I&apos;m excited to be your buddy
              🎉&quot;
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
