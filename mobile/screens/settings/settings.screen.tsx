import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Switch } from "react-native";
import "@/global.css";

export default function SettingsScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [privacyMode, setPrivacyMode] = useState(false);

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-gray-800 px-4 py-6 pt-12">
        <Text className="text-white text-2xl font-bold">Settings</Text>
        <Text className="text-gray-300 text-base mt-1">
          Customize your FreshmanHub experience
        </Text>
      </View>

      {/* Profile Section */}
      <View className="px-4 py-6">
        <Text className="text-gray-800 text-lg font-semibold mb-4">
          Profile
        </Text>
        <View className="bg-white rounded-lg border border-gray-200">
          <TouchableOpacity className="p-4 border-b border-gray-100 flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Text className="text-gray-800 font-medium ml-3">
                👤 Edit Profile
              </Text>
            </View>
            <Text className="text-gray-400">›</Text>
          </TouchableOpacity>

          <TouchableOpacity className="p-4 border-b border-gray-100 flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Text className="text-gray-800 font-medium ml-3">
                🔐 Change Password
              </Text>
            </View>
            <Text className="text-gray-400">›</Text>
          </TouchableOpacity>

          <TouchableOpacity className="p-4 flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Text className="text-gray-800 font-medium ml-3">
                📧 Email Preferences
              </Text>
            </View>
            <Text className="text-gray-400">›</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Notifications Section */}
      <View className="px-4 pb-6">
        <Text className="text-gray-800 text-lg font-semibold mb-4">
          Notifications
        </Text>
        <View className="bg-white rounded-lg border border-gray-200">
          <View className="p-4 border-b border-gray-100 flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Text className="text-gray-800 font-medium ml-3">
                🔔 Push Notifications
              </Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: "#e5e7eb", true: "#3b82f6" }}
              thumbColor={notificationsEnabled ? "#ffffff" : "#ffffff"}
            />
          </View>

          <TouchableOpacity className="p-4 border-b border-gray-100 flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Text className="text-gray-800 font-medium ml-3">
                📚 Academic Reminders
              </Text>
            </View>
            <Text className="text-gray-400">›</Text>
          </TouchableOpacity>

          <TouchableOpacity className="p-4 border-b border-gray-100 flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Text className="text-gray-800 font-medium ml-3">
                💬 Chat Notifications
              </Text>
            </View>
            <Text className="text-gray-400">›</Text>
          </TouchableOpacity>

          <TouchableOpacity className="p-4 flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Text className="text-gray-800 font-medium ml-3">
                🎉 Event Updates
              </Text>
            </View>
            <Text className="text-gray-400">›</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Appearance Section */}
      <View className="px-4 pb-6">
        <Text className="text-gray-800 text-lg font-semibold mb-4">
          Appearance
        </Text>
        <View className="bg-white rounded-lg border border-gray-200">
          <View className="p-4 border-b border-gray-100 flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Text className="text-gray-800 font-medium ml-3">
                🌙 Dark Mode
              </Text>
            </View>
            <Switch
              value={darkModeEnabled}
              onValueChange={setDarkModeEnabled}
              trackColor={{ false: "#e5e7eb", true: "#3b82f6" }}
              thumbColor={darkModeEnabled ? "#ffffff" : "#ffffff"}
            />
          </View>

          <TouchableOpacity className="p-4 border-b border-gray-100 flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Text className="text-gray-800 font-medium ml-3">
                🎨 Theme Colors
              </Text>
            </View>
            <Text className="text-gray-400">›</Text>
          </TouchableOpacity>

          <TouchableOpacity className="p-4 flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Text className="text-gray-800 font-medium ml-3">
                📱 App Icons
              </Text>
            </View>
            <Text className="text-gray-400">›</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Privacy & Security Section */}
      <View className="px-4 pb-6">
        <Text className="text-gray-800 text-lg font-semibold mb-4">
          Privacy & Security
        </Text>
        <View className="bg-white rounded-lg border border-gray-200">
          <View className="p-4 border-b border-gray-100 flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Text className="text-gray-800 font-medium ml-3">
                🔒 Privacy Mode
              </Text>
            </View>
            <Switch
              value={privacyMode}
              onValueChange={setPrivacyMode}
              trackColor={{ false: "#e5e7eb", true: "#3b82f6" }}
              thumbColor={privacyMode ? "#ffffff" : "#ffffff"}
            />
          </View>

          <TouchableOpacity className="p-4 border-b border-gray-100 flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Text className="text-gray-800 font-medium ml-3">
                👁️ Profile Visibility
              </Text>
            </View>
            <Text className="text-gray-400">›</Text>
          </TouchableOpacity>

          <TouchableOpacity className="p-4 border-b border-gray-100 flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Text className="text-gray-800 font-medium ml-3">
                🛡️ Block List
              </Text>
            </View>
            <Text className="text-gray-400">›</Text>
          </TouchableOpacity>

          <TouchableOpacity className="p-4 flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Text className="text-gray-800 font-medium ml-3">
                📊 Data & Analytics
              </Text>
            </View>
            <Text className="text-gray-400">›</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Support Section */}
      <View className="px-4 pb-6">
        <Text className="text-gray-800 text-lg font-semibold mb-4">
          Support
        </Text>
        <View className="bg-white rounded-lg border border-gray-200">
          <TouchableOpacity className="p-4 border-b border-gray-100 flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Text className="text-gray-800 font-medium ml-3">
                ❓ Help Center
              </Text>
            </View>
            <Text className="text-gray-400">›</Text>
          </TouchableOpacity>

          <TouchableOpacity className="p-4 border-b border-gray-100 flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Text className="text-gray-800 font-medium ml-3">
                📞 Contact Support
              </Text>
            </View>
            <Text className="text-gray-400">›</Text>
          </TouchableOpacity>

          <TouchableOpacity className="p-4 border-b border-gray-100 flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Text className="text-gray-800 font-medium ml-3">
                🐛 Report a Bug
              </Text>
            </View>
            <Text className="text-gray-400">›</Text>
          </TouchableOpacity>

          <TouchableOpacity className="p-4 flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Text className="text-gray-800 font-medium ml-3">
                ⭐ Rate App
              </Text>
            </View>
            <Text className="text-gray-400">›</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* About Section */}
      <View className="px-4 pb-6">
        <Text className="text-gray-800 text-lg font-semibold mb-4">About</Text>
        <View className="bg-white rounded-lg border border-gray-200">
          <TouchableOpacity className="p-4 border-b border-gray-100 flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Text className="text-gray-800 font-medium ml-3">
                ℹ️ App Version
              </Text>
            </View>
            <Text className="text-gray-500 text-sm">1.0.0</Text>
          </TouchableOpacity>

          <TouchableOpacity className="p-4 border-b border-gray-100 flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Text className="text-gray-800 font-medium ml-3">
                📋 Terms of Service
              </Text>
            </View>
            <Text className="text-gray-400">›</Text>
          </TouchableOpacity>

          <TouchableOpacity className="p-4 border-b border-gray-100 flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Text className="text-gray-800 font-medium ml-3">
                🔐 Privacy Policy
              </Text>
            </View>
            <Text className="text-gray-400">›</Text>
          </TouchableOpacity>

          <TouchableOpacity className="p-4 flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Text className="text-gray-800 font-medium ml-3">
                📜 Licenses
              </Text>
            </View>
            <Text className="text-gray-400">›</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Sign Out Section */}
      <View className="px-4 pb-8">
        <View className="bg-white rounded-lg border border-gray-200">
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
