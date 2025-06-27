import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import "@/global.css";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    // Handle login logic here
    console.log("Login attempt:", { email, password });
  };

  const handleForgotPassword = () => {
    // Navigate to forgot password screen
    console.log("Forgot password pressed");
  };

  const handleSignUp = () => {
    // Navigate to registration screen
    console.log("Sign up pressed");
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-blue-600 px-4 py-6 pt-16">
        <Text className="text-white text-3xl font-bold text-center">
          Welcome Back
        </Text>
        <Text className="text-blue-100 text-base mt-2 text-center">
          Sign in to your FreshmanHub account
        </Text>
      </View>

      {/* Login Form */}
      <View className="px-6 py-8">
        <View className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          {/* Email Input */}
          <View className="mb-4">
            <Text className="text-gray-700 text-sm font-medium mb-2">
              Email Address
            </Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-3 bg-gray-50 text-gray-800"
              placeholder="Enter your college email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
          </View>

          {/* Password Input */}
          <View className="mb-4">
            <Text className="text-gray-700 text-sm font-medium mb-2">
              Password
            </Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-3 bg-gray-50 text-gray-800"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete="password"
            />
          </View>

          {/* Remember Me & Forgot Password */}
          <View className="flex-row items-center justify-between mb-6">
            <TouchableOpacity
              className="flex-row items-center"
              onPress={() => setRememberMe(!rememberMe)}
            >
              <View
                className={`w-5 h-5 border-2 rounded mr-2 items-center justify-center ${rememberMe ? "bg-blue-600 border-blue-600" : "border-gray-300"}`}
              >
                {rememberMe && <Text className="text-white text-xs">✓</Text>}
              </View>
              <Text className="text-gray-600 text-sm">Remember me</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleForgotPassword}>
              <Text className="text-blue-600 text-sm font-medium">
                Forgot Password?
              </Text>
            </TouchableOpacity>
          </View>

          {/* Login Button */}
          <TouchableOpacity
            className="bg-blue-600 rounded-lg py-3 mb-4"
            onPress={handleLogin}
          >
            <Text className="text-white text-center font-semibold text-lg">
              Sign In
            </Text>
          </TouchableOpacity>

          {/* Divider */}
          <View className="flex-row items-center my-6">
            <View className="flex-1 h-px bg-gray-300"></View>
            <Text className="mx-4 text-gray-500 text-sm">OR</Text>
            <View className="flex-1 h-px bg-gray-300"></View>
          </View>

          {/* Social Login Options */}
          <TouchableOpacity className="border border-gray-300 rounded-lg py-3 mb-3 flex-row items-center justify-center">
            <Text className="text-gray-700 font-medium mr-2">🎓</Text>
            <Text className="text-gray-700 font-medium">
              Continue with Student Portal
            </Text>
          </TouchableOpacity>

          <TouchableOpacity className="border border-gray-300 rounded-lg py-3 mb-6 flex-row items-center justify-center">
            <Text className="text-gray-700 font-medium mr-2">📧</Text>
            <Text className="text-gray-700 font-medium">
              Continue with Google
            </Text>
          </TouchableOpacity>

          {/* Sign Up Link */}
          <TouchableOpacity className="items-center" onPress={handleSignUp}>
            <Text className="text-gray-600 text-sm">
              Don&apos;t have an account?{" "}
              <Text className="text-blue-600 font-medium">Sign Up</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Quick Access */}
      <View className="px-6 pb-8">
        <Text className="text-gray-800 text-lg font-semibold mb-4">
          Quick Access
        </Text>
        <View className="bg-white rounded-lg border border-gray-200 p-4">
          <TouchableOpacity className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center">
              <Text className="text-blue-600 text-lg mr-3">🏫</Text>
              <Text className="text-gray-700 font-medium">Campus Map</Text>
            </View>
            <Text className="text-gray-400">›</Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center">
              <Text className="text-green-600 text-lg mr-3">📞</Text>
              <Text className="text-gray-700 font-medium">
                Emergency Contacts
              </Text>
            </View>
            <Text className="text-gray-400">›</Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Text className="text-purple-600 text-lg mr-3">ℹ️</Text>
              <Text className="text-gray-700 font-medium">
                Campus Information
              </Text>
            </View>
            <Text className="text-gray-400">›</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Support Section */}
      <View className="px-6 pb-8">
        <View className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <Text className="text-blue-800 font-medium mb-1">
            Need Help Getting Started?
          </Text>
          <Text className="text-blue-700 text-sm mb-3">
            Our support team is here to help you access your account and get
            started with FreshmanHub.
          </Text>
          <TouchableOpacity>
            <Text className="text-blue-600 font-medium">Contact Support →</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
