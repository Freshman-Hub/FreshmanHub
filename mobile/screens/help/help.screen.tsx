import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import "@/global.css";

export default function HelpScreen() {
  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-indigo-600 px-4 py-6 pt-12">
        <Text className="text-white text-2xl font-bold">Help & Support</Text>
        <Text className="text-indigo-100 text-base mt-1">
          Get the help you need
        </Text>
      </View>

      {/* Quick Help */}
      <View className="px-4 py-6">
        <Text className="text-gray-800 text-lg font-semibold mb-4">
          Quick Help
        </Text>
        <View className="space-y-3">
          <TouchableOpacity className="bg-white rounded-lg p-4 border border-gray-200 flex-row items-center justify-between">
            <View>
              <Text className="text-gray-800 font-medium">
                🆘 Emergency Contact
              </Text>
              <Text className="text-gray-500 text-sm mt-1">
                Campus security & health services
              </Text>
            </View>
            <Text className="text-gray-400">›</Text>
          </TouchableOpacity>

          <TouchableOpacity className="bg-white rounded-lg p-4 border border-gray-200 flex-row items-center justify-between">
            <View>
              <Text className="text-gray-800 font-medium">
                💬 Chat with Support
              </Text>
              <Text className="text-gray-500 text-sm mt-1">
                Get instant help from our team
              </Text>
            </View>
            <Text className="text-gray-400">›</Text>
          </TouchableOpacity>

          <TouchableOpacity className="bg-white rounded-lg p-4 border border-gray-200 flex-row items-center justify-between">
            <View>
              <Text className="text-gray-800 font-medium">
                📧 Email Support
              </Text>
              <Text className="text-gray-500 text-sm mt-1">
                Send us a detailed message
              </Text>
            </View>
            <Text className="text-gray-400">›</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* FAQ Categories */}
      <View className="px-4 pb-6">
        <Text className="text-gray-800 text-lg font-semibold mb-4">
          Frequently Asked Questions
        </Text>
        <View className="space-y-3">
          <TouchableOpacity className="bg-white rounded-lg p-4 border border-gray-200 flex-row items-center justify-between">
            <View>
              <Text className="text-gray-800 font-medium">
                📚 Academic Help
              </Text>
              <Text className="text-gray-500 text-sm mt-1">
                Course registration, grades, assignments
              </Text>
            </View>
            <Text className="text-gray-400">›</Text>
          </TouchableOpacity>

          <TouchableOpacity className="bg-white rounded-lg p-4 border border-gray-200 flex-row items-center justify-between">
            <View>
              <Text className="text-gray-800 font-medium">🏠 Campus Life</Text>
              <Text className="text-gray-500 text-sm mt-1">
                Dorms, dining, facilities, events
              </Text>
            </View>
            <Text className="text-gray-400">›</Text>
          </TouchableOpacity>

          <TouchableOpacity className="bg-white rounded-lg p-4 border border-gray-200 flex-row items-center justify-between">
            <View>
              <Text className="text-gray-800 font-medium">
                💳 Financial Aid
              </Text>
              <Text className="text-gray-500 text-sm mt-1">
                Tuition, scholarships, payment plans
              </Text>
            </View>
            <Text className="text-gray-400">›</Text>
          </TouchableOpacity>

          <TouchableOpacity className="bg-white rounded-lg p-4 border border-gray-200 flex-row items-center justify-between">
            <View>
              <Text className="text-gray-800 font-medium">
                🔧 Technical Issues
              </Text>
              <Text className="text-gray-500 text-sm mt-1">
                App problems, login issues, bugs
              </Text>
            </View>
            <Text className="text-gray-400">›</Text>
          </TouchableOpacity>

          <TouchableOpacity className="bg-white rounded-lg p-4 border border-gray-200 flex-row items-center justify-between">
            <View>
              <Text className="text-gray-800 font-medium">👥 Buddy System</Text>
              <Text className="text-gray-500 text-sm mt-1">
                Connecting with your mentor
              </Text>
            </View>
            <Text className="text-gray-400">›</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Popular Questions */}
      <View className="px-4 pb-6">
        <Text className="text-gray-800 text-lg font-semibold mb-4">
          Popular Questions
        </Text>
        <View className="bg-white rounded-lg border border-gray-200">
          <TouchableOpacity className="p-4 border-b border-gray-100">
            <Text className="text-gray-800 font-medium">
              How do I register for classes?
            </Text>
            <Text className="text-gray-500 text-sm mt-1">
              Step-by-step course registration guide
            </Text>
          </TouchableOpacity>

          <TouchableOpacity className="p-4 border-b border-gray-100">
            <Text className="text-gray-800 font-medium">
              Where is the dining hall?
            </Text>
            <Text className="text-gray-500 text-sm mt-1">
              Campus dining locations and hours
            </Text>
          </TouchableOpacity>

          <TouchableOpacity className="p-4 border-b border-gray-100">
            <Text className="text-gray-800 font-medium">
              How do I contact my buddy?
            </Text>
            <Text className="text-gray-500 text-sm mt-1">
              Using the buddy system effectively
            </Text>
          </TouchableOpacity>

          <TouchableOpacity className="p-4 border-b border-gray-100">
            <Text className="text-gray-800 font-medium">
              What events are happening this week?
            </Text>
            <Text className="text-gray-500 text-sm mt-1">
              Finding and joining campus activities
            </Text>
          </TouchableOpacity>

          <TouchableOpacity className="p-4">
            <Text className="text-gray-800 font-medium">
              How do I book a study room?
            </Text>
            <Text className="text-gray-500 text-sm mt-1">
              Library and study space reservations
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Contact Information */}
      <View className="px-4 pb-6">
        <Text className="text-gray-800 text-lg font-semibold mb-4">
          Contact Information
        </Text>
        <View className="bg-white rounded-lg border border-gray-200 p-4">
          <View className="mb-3">
            <Text className="text-gray-800 font-medium">
              📞 Student Services
            </Text>
            <Text className="text-gray-600 text-sm mt-1">(555) 123-4567</Text>
          </View>
          <View className="mb-3">
            <Text className="text-gray-800 font-medium">📧 Email Support</Text>
            <Text className="text-gray-600 text-sm mt-1">
              support@freshmanhub.edu
            </Text>
          </View>
          <View className="mb-3">
            <Text className="text-gray-800 font-medium">🏢 Office Hours</Text>
            <Text className="text-gray-600 text-sm mt-1">
              Monday - Friday: 8:00 AM - 6:00 PM
            </Text>
          </View>
          <View>
            <Text className="text-gray-800 font-medium">📍 Location</Text>
            <Text className="text-gray-600 text-sm mt-1">
              Student Services Building, Room 101
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
