import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import "@/global.css";

export default function ChatScreen() {
  const [activeTab, setActiveTab] = useState("private");

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-pink-600 px-4 py-6 pt-12">
        <Text className="text-white text-2xl font-bold">Chat</Text>
        <Text className="text-pink-100 text-base mt-1">
          Connect with your community
        </Text>
      </View>

      {/* Tab Navigation */}
      <View className="px-4 py-4 bg-white border-b border-gray-200">
        <View className="flex-row bg-gray-100 rounded-lg p-1">
          <TouchableOpacity
            className={`py-2 px-4 flex-1 rounded-md ${activeTab === "private" ? "bg-white" : ""}`}
            onPress={() => setActiveTab("private")}
          >
            <Text
              className={`text-center font-medium ${activeTab === "private" ? "text-gray-800" : "text-gray-600"}`}
            >
              💬 Private
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`py-2 px-4 flex-1 rounded-md ${activeTab === "community" ? "bg-white" : ""}`}
            onPress={() => setActiveTab("community")}
          >
            <Text
              className={`text-center font-medium ${activeTab === "community" ? "text-gray-800" : "text-gray-600"}`}
            >
              👥 Community
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`py-2 px-4 flex-1 rounded-md ${activeTab === "anonymous" ? "bg-white" : ""}`}
            onPress={() => setActiveTab("anonymous")}
          >
            <Text
              className={`text-center font-medium ${activeTab === "anonymous" ? "text-gray-800" : "text-gray-600"}`}
            >
              🎭 Anonymous
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1">
        {/* Private Chat Tab */}
        {activeTab === "private" && (
          <View className="px-4 py-6">
            <Text className="text-gray-800 text-lg font-semibold mb-4">
              Recent Conversations
            </Text>
            <View className="space-y-3">
              {/* Buddy Chat */}
              <TouchableOpacity className="bg-white rounded-lg p-4 border border-gray-200 flex-row items-center">
                <View className="w-12 h-12 bg-orange-100 rounded-full items-center justify-center mr-3">
                  <Text className="text-orange-600 text-lg">👩‍🎓</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-gray-800 font-medium">
                    Sarah Johnson (Your Buddy)
                  </Text>
                  <Text className="text-gray-500 text-sm mt-1">
                    Thanks for the study tips! See you tomorrow
                  </Text>
                  <Text className="text-gray-400 text-xs mt-1">
                    2 hours ago
                  </Text>
                </View>
                <View className="w-2 h-2 bg-pink-500 rounded-full"></View>
              </TouchableOpacity>

              {/* Academic Coach */}
              <TouchableOpacity className="bg-white rounded-lg p-4 border border-gray-200 flex-row items-center">
                <View className="w-12 h-12 bg-teal-100 rounded-full items-center justify-center mr-3">
                  <Text className="text-teal-600 text-lg">👨‍🏫</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-gray-800 font-medium">
                    Dr. Michael Chen
                  </Text>
                  <Text className="text-gray-500 text-sm mt-1">
                    Your study plan looks great! Keep it up
                  </Text>
                  <Text className="text-gray-400 text-xs mt-1">Yesterday</Text>
                </View>
              </TouchableOpacity>

              {/* Advisor */}
              <TouchableOpacity className="bg-white rounded-lg p-4 border border-gray-200 flex-row items-center">
                <View className="w-12 h-12 bg-cyan-100 rounded-full items-center justify-center mr-3">
                  <Text className="text-cyan-600 text-lg">👩‍💼</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-gray-800 font-medium">
                    Prof. Emily Rodriguez
                  </Text>
                  <Text className="text-gray-500 text-sm mt-1">
                    Don&apos;t forget about course registration next week
                  </Text>
                  <Text className="text-gray-400 text-xs mt-1">2 days ago</Text>
                </View>
              </TouchableOpacity>

              {/* Classmate */}
              <TouchableOpacity className="bg-white rounded-lg p-4 border border-gray-200 flex-row items-center">
                <View className="w-12 h-12 bg-blue-100 rounded-full items-center justify-center mr-3">
                  <Text className="text-blue-600 text-lg">👨‍🎓</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-gray-800 font-medium">Alex Chen</Text>
                  <Text className="text-gray-500 text-sm mt-1">
                    Study group tonight at 7 PM in the library?
                  </Text>
                  <Text className="text-gray-400 text-xs mt-1">3 days ago</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Community Chat Tab */}
        {activeTab === "community" && (
          <View className="px-4 py-6">
            <Text className="text-gray-800 text-lg font-semibold mb-4">
              Community Groups
            </Text>
            <View className="space-y-3">
              {/* Freshman Group */}
              <TouchableOpacity className="bg-white rounded-lg p-4 border border-gray-200">
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="text-gray-800 font-medium">
                    🎓 Freshman Class 2028
                  </Text>
                  <View className="bg-green-100 px-2 py-1 rounded-full">
                    <Text className="text-green-600 text-xs font-medium">
                      524 members
                    </Text>
                  </View>
                </View>
                <Text className="text-gray-500 text-sm mb-2">
                  General discussion for all freshmen
                </Text>
                <View className="flex-row justify-between items-center">
                  <Text className="text-gray-400 text-xs">
                    Last message: 5 min ago
                  </Text>
                  <View className="bg-pink-500 px-2 py-1 rounded-full">
                    <Text className="text-white text-xs font-medium">12</Text>
                  </View>
                </View>
              </TouchableOpacity>

              {/* CS Major Group */}
              <TouchableOpacity className="bg-white rounded-lg p-4 border border-gray-200">
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="text-gray-800 font-medium">
                    💻 Computer Science Majors
                  </Text>
                  <View className="bg-green-100 px-2 py-1 rounded-full">
                    <Text className="text-green-600 text-xs font-medium">
                      89 members
                    </Text>
                  </View>
                </View>
                <Text className="text-gray-500 text-sm mb-2">
                  CS coursework help and discussions
                </Text>
                <View className="flex-row justify-between items-center">
                  <Text className="text-gray-400 text-xs">
                    Last message: 1 hour ago
                  </Text>
                  <View className="bg-pink-500 px-2 py-1 rounded-full">
                    <Text className="text-white text-xs font-medium">3</Text>
                  </View>
                </View>
              </TouchableOpacity>

              {/* Study Groups */}
              <TouchableOpacity className="bg-white rounded-lg p-4 border border-gray-200">
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="text-gray-800 font-medium">
                    📚 Study Groups
                  </Text>
                  <View className="bg-green-100 px-2 py-1 rounded-full">
                    <Text className="text-green-600 text-xs font-medium">
                      156 members
                    </Text>
                  </View>
                </View>
                <Text className="text-gray-500 text-sm mb-2">
                  Find and organize study sessions
                </Text>
                <View className="flex-row justify-between items-center">
                  <Text className="text-gray-400 text-xs">
                    Last message: 3 hours ago
                  </Text>
                </View>
              </TouchableOpacity>

              {/* Campus Events */}
              <TouchableOpacity className="bg-white rounded-lg p-4 border border-gray-200">
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="text-gray-800 font-medium">
                    🎉 Campus Events
                  </Text>
                  <View className="bg-green-100 px-2 py-1 rounded-full">
                    <Text className="text-green-600 text-xs font-medium">
                      342 members
                    </Text>
                  </View>
                </View>
                <Text className="text-gray-500 text-sm mb-2">
                  Share and discuss campus activities
                </Text>
                <View className="flex-row justify-between items-center">
                  <Text className="text-gray-400 text-xs">
                    Last message: 6 hours ago
                  </Text>
                  <View className="bg-pink-500 px-2 py-1 rounded-full">
                    <Text className="text-white text-xs font-medium">7</Text>
                  </View>
                </View>
              </TouchableOpacity>

              {/* Mental Health Support */}
              <TouchableOpacity className="bg-white rounded-lg p-4 border border-gray-200">
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="text-gray-800 font-medium">
                    💚 Mental Health Support
                  </Text>
                  <View className="bg-green-100 px-2 py-1 rounded-full">
                    <Text className="text-green-600 text-xs font-medium">
                      78 members
                    </Text>
                  </View>
                </View>
                <Text className="text-gray-500 text-sm mb-2">
                  Safe space for wellness discussions
                </Text>
                <View className="flex-row justify-between items-center">
                  <Text className="text-gray-400 text-xs">
                    Last message: 1 day ago
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Anonymous Chat Tab */}
        {activeTab === "anonymous" && (
          <View className="px-4 py-6">
            <View className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <Text className="text-yellow-800 font-medium mb-1">
                🔒 Anonymous Chat Guidelines
              </Text>
              <Text className="text-yellow-700 text-sm">
                Your identity is protected. Be respectful and supportive. Report
                inappropriate content.
              </Text>
            </View>

            <Text className="text-gray-800 text-lg font-semibold mb-4">
              Anonymous Rooms
            </Text>
            <View className="space-y-3">
              {/* General Support */}
              <TouchableOpacity className="bg-white rounded-lg p-4 border border-gray-200">
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="text-gray-800 font-medium">
                    🤝 General Support
                  </Text>
                  <View className="flex-row items-center">
                    <View className="w-2 h-2 bg-green-500 rounded-full mr-2"></View>
                    <Text className="text-gray-500 text-xs">23 online</Text>
                  </View>
                </View>
                <Text className="text-gray-500 text-sm mb-2">
                  Share experiences and get support
                </Text>
                <Text className="text-gray-400 text-xs">
                  Anonymous User: &quot;Starting college feels overwhelming...&quot;
                </Text>
              </TouchableOpacity>

              {/* Academic Stress */}
              <TouchableOpacity className="bg-white rounded-lg p-4 border border-gray-200">
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="text-gray-800 font-medium">
                    📖 Academic Stress
                  </Text>
                  <View className="flex-row items-center">
                    <View className="w-2 h-2 bg-green-500 rounded-full mr-2"></View>
                    <Text className="text-gray-500 text-xs">15 online</Text>
                  </View>
                </View>
                <Text className="text-gray-500 text-sm mb-2">
                  Discuss academic challenges openly
                </Text>
                <Text className="text-gray-400 text-xs">
                  Anonymous User: &quot;How do you manage multiple deadlines?&quot;
                </Text>
              </TouchableOpacity>

              {/* Social Anxiety */}
              <TouchableOpacity className="bg-white rounded-lg p-4 border border-gray-200">
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="text-gray-800 font-medium">
                    😰 Social Anxiety
                  </Text>
                  <View className="flex-row items-center">
                    <View className="w-2 h-2 bg-green-500 rounded-full mr-2"></View>
                    <Text className="text-gray-500 text-xs">8 online</Text>
                  </View>
                </View>
                <Text className="text-gray-500 text-sm mb-2">
                  Safe space for social concerns
                </Text>
                <Text className="text-gray-400 text-xs">
                  Anonymous User: &quot;Tips for making friends in college?&quot;
                </Text>
              </TouchableOpacity>

              {/* Homesickness */}
              <TouchableOpacity className="bg-white rounded-lg p-4 border border-gray-200">
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="text-gray-800 font-medium">
                    🏠 Homesickness
                  </Text>
                  <View className="flex-row items-center">
                    <View className="w-2 h-2 bg-green-500 rounded-full mr-2"></View>
                    <Text className="text-gray-500 text-xs">12 online</Text>
                  </View>
                </View>
                <Text className="text-gray-500 text-sm mb-2">
                  Connect with others missing home
                </Text>
                <Text className="text-gray-400 text-xs">
                  Anonymous User: &quot;Missing family dinners so much...&quot;
                </Text>
              </TouchableOpacity>

              {/* Career Confusion */}
              <TouchableOpacity className="bg-white rounded-lg p-4 border border-gray-200">
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="text-gray-800 font-medium">
                    🤔 Career Confusion
                  </Text>
                  <View className="flex-row items-center">
                    <View className="w-2 h-2 bg-green-500 rounded-full mr-2"></View>
                    <Text className="text-gray-500 text-xs">18 online</Text>
                  </View>
                </View>
                <Text className="text-gray-500 text-sm mb-2">
                  Discuss career doubts and exploration
                </Text>
                <Text className="text-gray-400 text-xs">
                  Anonymous User: &quot;Not sure if I picked the right major...&quot;
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity className="absolute bottom-6 right-6 bg-pink-600 w-14 h-14 rounded-full items-center justify-center shadow-lg">
        <Text className="text-white text-xl">💬</Text>
      </TouchableOpacity>
    </View>
  );
}
