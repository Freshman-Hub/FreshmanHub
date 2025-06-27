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

export default function RegisterScreen() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    studentId: "",
    password: "",
    confirmPassword: "",
    major: "",
    graduationYear: "",
  });

  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleRegister = () => {
    // Basic validation
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.password
    ) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    if (!acceptedTerms) {
      Alert.alert("Error", "Please accept the terms and conditions");
      return;
    }

    // Handle registration logic here
    console.log("Registration data:", formData);
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-blue-600 px-4 py-6 pt-12">
        <Text className="text-white text-2xl font-bold">Create Account</Text>
        <Text className="text-blue-100 text-base mt-1">
          Join the FreshmanHub community
        </Text>
      </View>

      {/* Registration Form */}
      <View className="px-4 py-6">
        <View className="bg-white rounded-lg border border-gray-200 p-6">
          {/* Personal Information */}
          <Text className="text-gray-800 text-lg font-semibold mb-4">
            Personal Information
          </Text>

          <View className="flex-row gap-3 mb-4">
            <View className="flex-1">
              <Text className="text-gray-700 text-sm font-medium mb-2">
                First Name *
              </Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-3 py-2 bg-gray-50"
                placeholder="Enter first name"
                value={formData.firstName}
                onChangeText={(value) => handleInputChange("firstName", value)}
              />
            </View>
            <View className="flex-1">
              <Text className="text-gray-700 text-sm font-medium mb-2">
                Last Name *
              </Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-3 py-2 bg-gray-50"
                placeholder="Enter last name"
                value={formData.lastName}
                onChangeText={(value) => handleInputChange("lastName", value)}
              />
            </View>
          </View>

          <View className="mb-4">
            <Text className="text-gray-700 text-sm font-medium mb-2">
              Email Address *
            </Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-3 py-2 bg-gray-50"
              placeholder="Enter your college email"
              value={formData.email}
              onChangeText={(value) => handleInputChange("email", value)}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View className="mb-6">
            <Text className="text-gray-700 text-sm font-medium mb-2">
              Student ID
            </Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-3 py-2 bg-gray-50"
              placeholder="Enter student ID"
              value={formData.studentId}
              onChangeText={(value) => handleInputChange("studentId", value)}
            />
          </View>

          {/* Academic Information */}
          <Text className="text-gray-800 text-lg font-semibold mb-4">
            Academic Information
          </Text>

          <View className="mb-4">
            <Text className="text-gray-700 text-sm font-medium mb-2">
              Major
            </Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-3 py-2 bg-gray-50"
              placeholder="Enter your major"
              value={formData.major}
              onChangeText={(value) => handleInputChange("major", value)}
            />
          </View>

          <View className="mb-6">
            <Text className="text-gray-700 text-sm font-medium mb-2">
              Expected Graduation Year
            </Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-3 py-2 bg-gray-50"
              placeholder="e.g. 2028"
              value={formData.graduationYear}
              onChangeText={(value) =>
                handleInputChange("graduationYear", value)
              }
              keyboardType="numeric"
            />
          </View>

          {/* Password Section */}
          <Text className="text-gray-800 text-lg font-semibold mb-4">
            Create Password
          </Text>

          <View className="mb-4">
            <Text className="text-gray-700 text-sm font-medium mb-2">
              Password *
            </Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-3 py-2 bg-gray-50"
              placeholder="Create a strong password"
              value={formData.password}
              onChangeText={(value) => handleInputChange("password", value)}
              secureTextEntry
            />
          </View>

          <View className="mb-6">
            <Text className="text-gray-700 text-sm font-medium mb-2">
              Confirm Password *
            </Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-3 py-2 bg-gray-50"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChangeText={(value) =>
                handleInputChange("confirmPassword", value)
              }
              secureTextEntry
            />
          </View>

          {/* Terms and Conditions */}
          <TouchableOpacity
            className="flex-row items-center mb-6"
            onPress={() => setAcceptedTerms(!acceptedTerms)}
          >
            <View
              className={`w-5 h-5 border-2 rounded mr-3 items-center justify-center ${acceptedTerms ? "bg-blue-600 border-blue-600" : "border-gray-300"}`}
            >
              {acceptedTerms && <Text className="text-white text-xs">✓</Text>}
            </View>
            <Text className="text-gray-700 text-sm flex-1">
              I agree to the{" "}
              <Text className="text-blue-600 underline">Terms of Service</Text>{" "}
              and{" "}
              <Text className="text-blue-600 underline">Privacy Policy</Text>
            </Text>
          </TouchableOpacity>

          {/* Register Button */}
          <TouchableOpacity
            className="bg-blue-600 rounded-lg py-3 mb-4"
            onPress={handleRegister}
          >
            <Text className="text-white text-center font-semibold text-lg">
              Create Account
            </Text>
          </TouchableOpacity>

          {/* Sign In Link */}
          <TouchableOpacity className="items-center">
            <Text className="text-gray-600 text-sm">
              Already have an account?{" "}
              <Text className="text-blue-600 font-medium underline">
                Sign In
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Features Preview */}
      <View className="px-4 pb-6">
        <Text className="text-gray-800 text-lg font-semibold mb-4">
          What you&apos;ll get:
        </Text>
        <View className="bg-white rounded-lg border border-gray-200 p-4">
          <View className="flex-row items-center mb-3">
            <Text className="text-blue-600 text-lg mr-3">👥</Text>
            <Text className="text-gray-700 text-sm flex-1">
              Connect with your assigned buddy
            </Text>
          </View>
          <View className="flex-row items-center mb-3">
            <Text className="text-green-600 text-lg mr-3">📚</Text>
            <Text className="text-gray-700 text-sm flex-1">
              Academic coaching and advising support
            </Text>
          </View>
          <View className="flex-row items-center mb-3">
            <Text className="text-purple-600 text-lg mr-3">🗺️</Text>
            <Text className="text-gray-700 text-sm flex-1">
              Interactive campus map and navigation
            </Text>
          </View>
          <View className="flex-row items-center mb-3">
            <Text className="text-orange-600 text-lg mr-3">🎉</Text>
            <Text className="text-gray-700 text-sm flex-1">
              Discover campus events and activities
            </Text>
          </View>
          <View className="flex-row items-center">
            <Text className="text-pink-600 text-lg mr-3">💬</Text>
            <Text className="text-gray-700 text-sm flex-1">
              Anonymous support chats and community groups
            </Text>
          </View>
        </View>
      </View>

      {/* Help Section */}
      <View className="px-4 pb-8">
        <View className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <Text className="text-blue-800 font-medium mb-1">Need Help?</Text>
          <Text className="text-blue-700 text-sm mb-3">
            Contact our support team if you have any questions during
            registration.
          </Text>
          <TouchableOpacity>
            <Text className="text-blue-600 font-medium underline">
              Contact Support
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
