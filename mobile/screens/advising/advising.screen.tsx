import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import "@/global.css";

export default function AdvisingScreen() {
  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-cyan-600 px-4 py-6 pt-12">
        <Text className="text-white text-2xl font-bold">Academic Advising</Text>
        <Text className="text-cyan-100 text-base mt-1">
          Plan your academic journey
        </Text>
      </View>

      {/* Your Advisor */}
      <View className="px-4 py-6">
        <Text className="text-gray-800 text-lg font-semibold mb-4">
          Your Academic Advisor
        </Text>
        <View className="bg-white rounded-lg border border-gray-200 p-6">
          <View className="items-center mb-4">
            <View className="w-24 h-24 bg-cyan-100 rounded-full items-center justify-center mb-3">
              <Text className="text-cyan-600 text-3xl">👩‍💼</Text>
            </View>
            <Text className="text-gray-800 text-xl font-bold">
              Prof. Emily Rodriguez
            </Text>
            <Text className="text-gray-600 text-base">
              Computer Science Department
            </Text>
            <Text className="text-gray-500 text-sm mt-1">
              Office: CS Building, Room 204
            </Text>
          </View>

          <View className="flex-row gap-3 mb-4">
            <TouchableOpacity className="bg-cyan-600 rounded-lg py-3 px-4 flex-1">
              <Text className="text-white text-center font-medium">
                📅 Book Appointment
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className="bg-gray-100 rounded-lg py-3 px-4 flex-1">
              <Text className="text-gray-700 text-center font-medium">
                📧 Email
              </Text>
            </TouchableOpacity>
          </View>

          <View className="border-t border-gray-100 pt-4">
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-600 text-sm">Office Hours:</Text>
              <Text className="text-gray-800 text-sm font-medium">
                Tue/Thu 2-4 PM
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-600 text-sm">Next Available:</Text>
              <Text className="text-cyan-600 text-sm font-medium">
                Tomorrow 3:00 PM
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Academic Planning Tools */}
      <View className="px-4 pb-6">
        <Text className="text-gray-800 text-lg font-semibold mb-4">
          Academic Planning
        </Text>
        <View className="space-y-3">
          <TouchableOpacity className="bg-white rounded-lg p-4 border border-gray-200 flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="text-gray-800 font-medium">
                📊 Degree Progress
              </Text>
              <Text className="text-gray-500 text-sm mt-1">
                Track your requirements and milestones
              </Text>
              <View className="flex-row items-center mt-2">
                <View className="bg-gray-200 rounded-full h-2 flex-1 mr-2">
                  <View
                    className="bg-cyan-600 h-2 rounded-full"
                    style={{ width: "25%" }}
                  ></View>
                </View>
                <Text className="text-cyan-600 text-xs font-medium">
                  25% Complete
                </Text>
              </View>
            </View>
            <Text className="text-gray-400">›</Text>
          </TouchableOpacity>

          <TouchableOpacity className="bg-white rounded-lg p-4 border border-gray-200 flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="text-gray-800 font-medium">
                📚 Course Planner
              </Text>
              <Text className="text-gray-500 text-sm mt-1">
                Plan your courses for upcoming semesters
              </Text>
              <Text className="text-orange-500 text-xs mt-2 font-medium">
                Spring 2026 planning available
              </Text>
            </View>
            <Text className="text-gray-400">›</Text>
          </TouchableOpacity>

          <TouchableOpacity className="bg-white rounded-lg p-4 border border-gray-200 flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="text-gray-800 font-medium">
                🎓 Graduation Audit
              </Text>
              <Text className="text-gray-500 text-sm mt-1">
                Check your graduation requirements status
              </Text>
              <Text className="text-green-600 text-xs mt-2 font-medium">
                Last updated: 2 days ago
              </Text>
            </View>
            <Text className="text-gray-400">›</Text>
          </TouchableOpacity>

          <TouchableOpacity className="bg-white rounded-lg p-4 border border-gray-200 flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="text-gray-800 font-medium">
                🔄 Change Major/Minor
              </Text>
              <Text className="text-gray-500 text-sm mt-1">
                Explore options and requirements
              </Text>
            </View>
            <Text className="text-gray-400">›</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Quick Stats */}
      <View className="px-4 pb-6">
        <Text className="text-gray-800 text-lg font-semibold mb-4">
          Academic Summary
        </Text>
        <View className="bg-white rounded-lg border border-gray-200 p-4">
          <View className="flex-row justify-between items-center mb-4">
            <View className="flex-1">
              <Text className="text-gray-500 text-sm">Current GPA</Text>
              <Text className="text-gray-800 text-xl font-bold">3.7</Text>
            </View>
            <View className="flex-1">
              <Text className="text-gray-500 text-sm">Credits Earned</Text>
              <Text className="text-gray-800 text-xl font-bold">15/120</Text>
            </View>
            <View className="flex-1">
              <Text className="text-gray-500 text-sm">Current Semester</Text>
              <Text className="text-gray-800 text-xl font-bold">Fall 2025</Text>
            </View>
          </View>

          <View className="border-t border-gray-100 pt-4">
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-600 text-sm">Major:</Text>
              <Text className="text-gray-800 text-sm font-medium">
                Computer Science
              </Text>
            </View>
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-600 text-sm">
                Expected Graduation:
              </Text>
              <Text className="text-gray-800 text-sm font-medium">
                May 2028
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-600 text-sm">Academic Standing:</Text>
              <Text className="text-green-600 text-sm font-medium">
                Good Standing
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Recent Activities */}
      <View className="px-4 pb-6">
        <Text className="text-gray-800 text-lg font-semibold mb-4">
          Recent Advising Activity
        </Text>
        <View className="bg-white rounded-lg border border-gray-200">
          <View className="p-4 border-b border-gray-100">
            <Text className="text-gray-800 font-medium">
              Course Registration Meeting
            </Text>
            <Text className="text-gray-500 text-sm mt-1">
              Discussed Spring 2026 course selections
            </Text>
            <Text className="text-gray-400 text-xs mt-2">October 15, 2025</Text>
          </View>

          <View className="p-4 border-b border-gray-100">
            <Text className="text-gray-800 font-medium">
              Degree Plan Review
            </Text>
            <Text className="text-gray-500 text-sm mt-1">
              Updated 4-year graduation plan
            </Text>
            <Text className="text-gray-400 text-xs mt-2">
              September 20, 2025
            </Text>
          </View>

          <View className="p-4">
            <Text className="text-gray-800 font-medium">Welcome Meeting</Text>
            <Text className="text-gray-500 text-sm mt-1">
              Initial advising session and goal setting
            </Text>
            <Text className="text-gray-400 text-xs mt-2">August 28, 2025</Text>
          </View>
        </View>
      </View>

      {/* Quick Resources */}
      <View className="px-4 pb-6">
        <Text className="text-gray-800 text-lg font-semibold mb-4">
          Quick Resources
        </Text>
        <View className="flex-row gap-3">
          <TouchableOpacity className="bg-cyan-600 rounded-lg p-4 flex-1">
            <Text className="text-white font-medium text-center">📋 Forms</Text>
            <Text className="text-cyan-100 text-xs text-center mt-1">
              Academic forms
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className="bg-gray-100 rounded-lg p-4 flex-1">
            <Text className="text-gray-700 font-medium text-center">
              📖 Catalog
            </Text>
            <Text className="text-gray-500 text-xs text-center mt-1">
              Course catalog
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className="bg-gray-100 rounded-lg p-4 flex-1">
            <Text className="text-gray-700 font-medium text-center">
              📞 Contact
            </Text>
            <Text className="text-gray-500 text-xs text-center mt-1">
              Advising office
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
