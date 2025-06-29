import { Stack } from "expo-router";
import { useTheme } from "@/contexts/ThemeContext";

export default function RoutesLayout() {
  const { theme } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: theme.colors.background,
        },
        headerTintColor: theme.colors.text,
        headerTitleStyle: {
          fontFamily: theme.typography.h5.fontFamily,
          fontSize: theme.typography.h5.fontSize,
          fontWeight: theme.typography.h5.fontWeight as any,
        },
        headerShadowVisible: false,
        headerBackVisible: true,
        animation: "slide_from_right",
      }}
    >
      {/* User Profile Screens */}
      {/* <Stack.Screen
        name="edit-profile"
        options={{
          title: "Edit Profile",
          presentation: "modal",
        }}
      /> */}
      <Stack.Screen
        name="settings/index"
        options={{
          title: "Settings",
          headerShown: false,
        }}
      />

      {/* Social Features */}
      <Stack.Screen
        name="post/[id]"
        options={{
          title: "Post Details",
          headerShown: false, // Custom header with image
        }}
      />
      {/* <Stack.Screen
        name="create-post/index"
        options={{
          title: "Create Post",
          presentation: "modal",
        }}
      /> */}
      {/* <Stack.Screen
        name="user/[id]"
        options={{
          title: "User Profile",
        }}
      /> */}
      {/* <Stack.Screen
        name="followers/[id]"
        options={{
          title: "Followers",
        }}
      /> */}
      {/* <Stack.Screen
        name="following/[id]"
        options={{
          title: "Following",
        }}
      /> */}

      {/* Events */}
      <Stack.Screen
        name="event/[id]"
        options={{
          title: "Event Details",
          headerShown: false, // Custom header with image
        }}
      />
      {/* <Stack.Screen
        name="create-event"
        options={{
          title: "Create Event",
          presentation: "modal",
        }}
      /> */}
      {/* <Stack.Screen
        name="my-events"
        options={{
          title: "My Events",
        }}
      /> */}
      {/* <Stack.Screen
        name="event-attendees/[id]"
        options={{
          title: "Attendees",
        }}
      /> */}

      {/* Notifications */}
      <Stack.Screen
        name="notifications/index"
        options={{
          title: "Notifications",
          headerShown: false,
        }}
      />
      {/* <Stack.Screen
        name="notification-settings"
        options={{
          title: "Notification Settings",
        }}
      /> */}

      {/* Campus Resources */}
      {/* <Stack.Screen
        name="resource/[id]"
        options={{
          title: "Resource Details",
        }}
      /> */}
      <Stack.Screen
        name="dining/index"
        options={{
          title: "Dining Hall",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="library/index"
        options={{
          title: "Library",
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="coaching/index"
        options={{
          title: "Library",
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="advising/index"
        options={{
          title: "Library",
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="buddy/index"
        options={{
          title: "Library",
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="IT/index"
        options={{
          title: "Library",
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="health-center/index"
        options={{
          title: "Health Center",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="career-services/index"
        options={{
          title: "Career Services",
          headerShown: false,
        }}
      /> 

      {/* Academic */}
      {/* <Stack.Screen
        name="course/[id]"
        options={{
          title: "Course Details",
        }}
      />
      <Stack.Screen
        name="schedule"
        options={{
          title: "My Schedule",
        }}
      /> */}

      {/* Community & Groups */}
      {/* <Stack.Screen
        name="group/[id]"
        options={{
          title: "Group Details",
        }}
      />
      <Stack.Screen
        name="create-group"
        options={{
          title: "Create Group",
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="my-groups"
        options={{
          title: "My Groups",
        }}
      />
      <Stack.Screen
        name="group-members/[id]"
        options={{
          title: "Group Members",
        }}
      /> */}

      {/* Messaging */}
      <Stack.Screen
        name="chat/index"
        options={{
          title: "Messages",
          headerShown: false,
        }}
      />
      {/* <Stack.Screen
        name="chat/[id]"
        options={{
          title: "Chat",
          headerShown: false, // Custom chat header
        }}
      />
      <Stack.Screen
        name="new-message"
        options={{
          title: "New Message",
          presentation: "modal",
        }}
      /> */}

      {/* Orientation & Onboarding */}
      {/* <Stack.Screen
        name="orientation"
        options={{
          title: "Orientation Guide",
        }}
      />
      <Stack.Screen
        name="campus-tour"
        options={{
          title: "Campus Tour",
          headerShown: false, // Immersive experience
        }}
      /> */}

      {/* Search & Discovery */}
      <Stack.Screen
        name="map/index"
        options={{
          title: "Campus Map",
          headerShown: false, // Full-screen map
        }}
      />

      {/* Help & Support */}
      <Stack.Screen
        name="help/index"
        options={{
          title: "Help & Support",
          headerShown: false,
        }}
      />

      {/* Media & Files */}
      {/* <Stack.Screen
        name="photo-viewer"
        options={{
          title: "",
          headerShown: false, // Full-screen photo viewer
          presentation: "transparentModal",
        }}
      />
      <Stack.Screen
        name="document-viewer/[id]"
        options={{
          title: "Document",
        }}
      /> */}

      {/* Miscellaneous */}
      {/* <Stack.Screen
        name="about"
        options={{
          title: "About FreshmanHub",
        }}
      />
      <Stack.Screen
        name="privacy-policy"
        options={{
          title: "Privacy Policy",
        }}
      />
      <Stack.Screen
        name="terms-of-service"
        options={{
          title: "Terms of Service",
        }}
      /> */}
    </Stack>
  );
}
