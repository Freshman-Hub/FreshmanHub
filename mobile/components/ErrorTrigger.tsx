import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

// Test component that can throw an error on demand
const ErrorTrigger: React.FC = () => {
  const [shouldThrow, setShouldThrow] = useState(false);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  if (shouldThrow) {
    throw new Error(
      "This is a test error to demonstrate the beautiful error boundary!"
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>
        Error Boundary Test
      </Text>
      <Text style={[styles.description, { color: colors.text }]}>
        Tap the button below to trigger an error and see the beautiful error
        boundary in action.
      </Text>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.tint }]}
        onPress={() => setShouldThrow(true)}
      >
        <Text style={styles.buttonText}>Trigger Error</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 24,
  },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default ErrorTrigger;
