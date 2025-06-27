import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import "@/global.css";

export default function CoachingScreen() {
  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-teal-600 px-4 py-6 pt-12">
        <Text className="text-white text-2xl font-bold">Academic Coaching</Text>
        <Text className="text-teal-100 text-base mt-1">Get personalized academic support</Text>
      </View>

      {/* Your Coach */}
      <View className="px-4 py-6">
        <Text className="text-gray-800 text-lg font-semibold mb-4">Your Academic Coach</Text>
        <View className="bg-white rounded-lg border border-gray-200 p-6">
          <View className="items-center mb-4">
            <View className="w-20 h-20 bg-teal-100 rounded-full items-center justify-center mb-3">
              <Text className="text-teal-600 text-2xl">👨‍🏫</Text>
            </View>
            <Text className="text-gray-800 text-xl font-bold">Dr. Michael Chen</Text>
            <Text className="text-gray-600 text-base">Academic Success Coordinator</Text>
            <Text className="text-gray-500 text-sm mt-1">Available Mon-Fri, 9 AM - 5 PM</Text>
          </View>

          <View className="flex-row gap-3 mb-4">
            <TouchableOpacity className="bg-teal-600 rounded-lg py-3 px-4 flex-1">
              <Text className="text-white text-center font-medium">📅 Schedule Session</Text>
            </TouchableOpacity>
            <TouchableOpacity className="bg-gray-100 rounded-lg py-3 px-4 flex-1">
              <Text className="text-gray-700 text-center font-medium">💬 Message</Text>
            </TouchableOpacity>
          </View>

          <View className="border-t border-gray-100 pt-4">
            <Text className="text-gray-800 font-medium mb-2">Specializations</Text>
            <Text className="text-gray-600 text-sm leading-5">
              Study strategies, time management, exam preparation, academic planning, and stress management
            </Text>
          </View>
        </View>
      </View>

      {/* Coaching Services */}
      <View className="px-4 pb-6">
        <Text className="text-gray-800 text-lg font-semibold mb-4">Coaching Services</Text>
        <View className="space-y-3">
          <TouchableOpacity className="bg-white rounded-lg p-4 border border-gray-200 flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="text-gray-800 font-medium">📖 Study Skills Workshop</Text>
              <Text className="text-gray-500 text-sm mt-1">Learn effective study techniques and note-taking methods</Text>
              <Text className="text-teal-600 text-xs mt-2 font-medium">Next session: Tomorrow 2:00 PM</Text>
            </View>
            <Text className="text-gray-400">›</Text>
          </TouchableOpacity>

          <TouchableOpacity className="bg-white rounded-lg p-4 border border-gray-200 flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="text-gray-800 font-medium">⏰ Time Management</Text>
              <Text className="text-gray-500 text-sm mt-1">Master your schedule and prioritize tasks effectively</Text>
              <Text className="text-teal-600 text-xs mt-2 font-medium">1-on-1 session available</Text>
            </View>
            <Text className="text-gray-400">›</Text>
          </TouchableOpacity>

          <TouchableOpacity className="bg-white rounded-lg p-4 border border-gray-200 flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="text-gray-800 font-medium">📝 Exam Preparation</Text>
              <Text className="text-gray-500 text-sm mt-1">Strategies for test-taking and managing exam anxiety</Text>
              <Text className="text-teal-600 text-xs mt-2 font-medium">Group session this Friday</Text>
            </View>
            <Text className="text-gray-400">›</Text>
          </TouchableOpacity>

          <TouchableOpacity className="bg-white rounded-lg p-4 border border-gray-200 flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="text-gray-800 font-medium">🎯 Goal Setting</Text>
              <Text className="text-gray-500 text-sm mt-1">Set and achieve your academic and career goals</Text>
              <Text className="text-teal-600 text-xs mt-2 font-medium">Book individual session</Text>
            </View>
            <Text className="text-gray-400">›</Text>
          </TouchableOpacity>

          <TouchableOpacity className="bg-white rounded-lg p-4 border border-gray-200 flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="text-gray-800 font-medium">🧠 Stress Management</Text>
              <Text className="text-gray-500 text-sm mt-1">Learn healthy coping strategies for academic pressure</Text>
              <Text className="text-teal-600 text-xs mt-2 font-medium">Weekly support group</Text>
            </View>
            <Text className="text-gray-400">›</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Progress Tracking */}
      <View className="px-4 pb-6">
        <Text className="text-gray-800 text-lg font-semibold mb-4">Your Progress</Text>
        <View className="bg-white rounded-lg border border-gray-200 p-4">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-gray-800 font-medium">Sessions Completed</Text>
            <Text className="text-teal-600 font-bold">3/8</Text>
          </View>
          <View className="bg-gray-200 rounded-full h-2 mb-4">
            <View className="bg-teal-600 h-2 rounded-full" style={{width: '37.5%'}}></View>
          </View>
          
          <View className="space-y-3">
            <View className="flex-row justify-between">
              <Text className="text-gray-600 text-sm">Study Skills Assessment</Text>
              <Text className="text-green-600 text-sm font-medium">✓ Completed</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-600 text-sm">Time Management Plan</Text>
              <Text className="text-green-600 text-sm font-medium">✓ Completed</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-600 text-sm">Goal Setting Workshop</Text>
              <Text className="text-green-600 text-sm font-medium">✓ Completed</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-600 text-sm">Mid-term Review Session</Text>
              <Text className="text-orange-500 text-sm font-medium">📅 Scheduled</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View className="px-4 pb-6">
        <Text className="text-gray-800 text-lg font-semibold mb-4">Quick Actions</Text>
        <View className="flex-row gap-3">
          <TouchableOpacity className="bg-teal-600 rounded-lg p-4 flex-1">
            <Text className="text-white font-medium text-center">📋 Assessment</Text>
            <Text className="text-teal-100 text-xs text-center mt-1">Take skill assessment</Text>
          </TouchableOpacity>
          <TouchableOpacity className="bg-gray-100 rounded-lg p-4 flex-1">
            <Text className="text-gray-700 font-medium text-center">📚 Resources</Text>
            <Text className="text-gray-500 text-xs text-center mt-1">Study materials</Text>
          </TouchableOpacity>
          <TouchableOpacity className="bg-gray-100 rounded-lg p-4 flex-1">
            <Text className="text-gray-700 font-medium text-center">📊 Reports</Text>
            <Text className="text-gray-500 text-xs text-center mt-1">View progress</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}