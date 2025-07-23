import { ThemeProvider } from "@/contexts/ThemeContext";
import { UserProvider, useUser } from "@/contexts/UserContext";
import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import AsyncStorage from "@react-native-async-storage/async-storage";

function LayoutContent() {
  const { isAuthenticated, loading, user } = useUser();
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState<boolean | null>(
    null
  );
  const router = useRouter();

  console.log("Role-=================", user?.role);
  console.log("Email-=================", user?.email);
  

  useEffect(() => {
    checkOnboardingStatus();
  }, []);



  const checkOnboardingStatus = async () => {
    try {
      const hasSeenOnboardingValue =
        await AsyncStorage.getItem("hasSeenOnboarding");
      setHasSeenOnboarding(hasSeenOnboardingValue === "true");
        console.log("Onboarding ==============",hasSeenOnboardingValue);
    } catch (error) {
      setHasSeenOnboarding(false);
      console.error("Failed to check onboarding status:", error);
    }
    
  };
  // Navigation logic based on auth status
  useEffect(() => {
    if (!loading && hasSeenOnboarding !== null) {
      if (isAuthenticated && user) {
        // Route based on user role
        switch (user.role) {
          case "admin":
          case "head_of_coaches":
          case "odip":
          case "sle":
            router.replace("/(head-coach)");
            break;
          case "peer_coach":
          case "peer_advisor":
          case "buddy":
            router.replace("/(head-coach)");
            break;
          case "freshman":
            router.replace("/(student-tabs)");
            break;
          case "continuous":
            router.replace("/(student-tabs)");
            break;
          default:
            router.replace("/(student-tabs)");
        }
      } else {
        // Not authenticated - show onboarding if first time, login if returning
        if (!hasSeenOnboarding) {
          router.replace("/(onboarding)");
        } else {
          router.replace("/(auth)/login");
        }
      }
    }
  }, [loading, isAuthenticated, user, hasSeenOnboarding, router]);

  // Show splash while loading
  if (loading || hasSeenOnboarding === null) {
    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(splash)" options={{ headerShown: false }} />
      </Stack>
    );
  }

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "fade_from_bottom",
          contentStyle: { backgroundColor: "transparent" },
        }}
      >
        <Stack.Screen name="(splash)" options={{ headerShown: false }} />
        <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(student-tabs)" options={{ headerShown: false }} />
        {/* <Stack.Screen name="(freshman-tabs)" options={{ headerShown: false }} /> */}
        {/* <Stack.Screen name="(coach-tabs)" options={{ headerShown: false }} /> */}
        {/* <Stack.Screen name="(admin-tabs)" options={{ headerShown: false }} /> */}
        <Stack.Screen name="(head-coach)" options={{ headerShown: false }} />
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
