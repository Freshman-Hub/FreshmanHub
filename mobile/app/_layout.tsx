import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { UserProvider, useUser } from "@/contexts/UserContext";

function LayoutContent() {
  const { role } = useUser();

  // Fallback if role not yet selected
  const getLayoutName = () => {
    if (!role) return "role-select"; // A screen where user picks a role
    switch (role) {
      case "freshman":
        return "(freshman-tabs)";
      case "student":
        return "(student-tabs)";
      case "peerCoach":
      case "peerAdvisor":
      case "buddy":
        return "(coach-tabs)";
      case "headCoach":
        return "(head-coach)";
      case "academicAdvisor":
        return "(academic-advisor)";
      case "odip":
      case "sle":
        return "(admin-tabs)";
      default:
        return "(student-tabs)";
    }
  };

  const layoutName = getLayoutName();

  return (
    <>
      <Stack>
        <Stack.Screen name={layoutName} options={{ headerShown: false }} />
        <Stack.Screen name="(routes)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded) return null;

  return (
    <UserProvider>
      <ThemeProvider>
        <LayoutContent />
      </ThemeProvider>
    </UserProvider>
  );
}
