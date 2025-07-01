// screens/RoleSelectorScreen.tsx
import React from "react";
import { Text, ScrollView } from "react-native";
import { Button } from "react-native-paper";
import { useUser } from "../contexts/UserContext";
import { router } from "expo-router";

const roles = [
  "freshman",
  "student",
  "peerCoach",
  "peerAdvisor",
  "buddy",
  "headCoach",
  "academicAdvisor",
  "odip",
  "sle",
];

const RoleSelectorScreen = () => {
  const { setRole } = useUser();

  const handleSelect = (role: string) => {
    setRole(role as any);

    // Navigate to the appropriate layout group
    switch (role) {
      case "freshman":
        router.replace("/(freshman-tabs)");
        break;
      case "student":
        router.replace("/(student-tabs)");
        break;
      case "peerCoach":
      case "peerAdvisor":
      case "buddy":
        router.replace("/(coach-tabs)");
        break;
      case "headCoach":
        router.replace("/(head-coach)");
        break;
      case "academicAdvisor":
        router.replace("/(academic-advisor)");
        break;
      case "odip":
      case "sle":
        router.replace("/(admin-tabs)");
        break;
      default:
        router.replace("/(student-tabs)");
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 20 }}>
        Select a Role for Development
      </Text>
      {roles.map((role) => (
        <Button
          key={role}
          mode="contained"
          onPress={() => handleSelect(role)}
          style={{ marginBottom: 10 }}
        >
          {role}
        </Button>
      ))}
    </ScrollView>
  );
};

export default RoleSelectorScreen;
