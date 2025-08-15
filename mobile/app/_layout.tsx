import { StreamChatProvider } from "@/contexts/StreamChatContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { UserProvider, useUser } from "@/contexts/UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Provider as PaperProvider } from "react-native-paper";
import "react-native-reanimated";
// import TempUserSync from "@/components/TempUserSync";
import { SQLiteProvider, type SQLiteDatabase } from "expo-sqlite";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { OverlayProvider } from "stream-chat-expo";

import { useSQLiteContext } from "expo-sqlite";
import { EventsService } from "@/services/events.service";
import { UserService } from "@/services/user.service";

import { NotificationService } from "@/services/notifications.service";
import * as Sentry from "@sentry/react-native";
// import { NotificationTestWidget } from "@/components/test/NotificationTestWidget";

Sentry.init({
  dsn: "https://9042024d9bf23b56646f9d037a0326d4@o4509836470386688.ingest.us.sentry.io/4509836472614912", // Get this from your Sentry project settings
  debug: true, // Optional: verbose logging for setup
  sendDefaultPii: true,
});

async function migrateDbIfNeeded(db: SQLiteDatabase) {
  const DATABASE_VERSION = 1;
  const result = await db.getFirstAsync<{ user_version: number }>(
    "PRAGMA user_version"
  );
  let currentDbVersion = result?.user_version ?? 0;
  if (currentDbVersion >= DATABASE_VERSION) {
    return;
  }
  if (currentDbVersion === 0) {
    await db.execAsync(`
PRAGMA journal_mode = 'wal';

-- Users table
CREATE TABLE users (
  id TEXT PRIMARY KEY NOT NULL,
  firstName TEXT NOT NULL,
  lastName TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  bio TEXT,
  role TEXT NOT NULL,
  studentId TEXT,
  yearGroup TEXT,
  major TEXT,
  country TEXT NOT NULL,
  gender TEXT NOT NULL,
  department TEXT,
  phoneNumber TEXT,
  profileImage TEXT,
  isActive INTEGER NOT NULL DEFAULT 1,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL,
  createdBy TEXT,
  lastLoginAt TEXT,
  assignedStudents TEXT, -- JSON array as string
  assignedCoach TEXT,
  permissions TEXT, -- JSON object as string
  online INTEGER NOT NULL DEFAULT 0
);

-- Events table
CREATE TABLE events (
  id TEXT PRIMARY KEY NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  date TEXT NOT NULL,
  startTime TEXT,
  endTime TEXT,
  allDay INTEGER NOT NULL DEFAULT 0,
  location TEXT,
  category TEXT NOT NULL,
  sourceCollection TEXT NOT NULL DEFAULT 'events',
  color TEXT NOT NULL,
  repeat TEXT NOT NULL,
  status TEXT DEFAULT 'upcoming',
  userId TEXT NOT NULL,
  userDisplayName TEXT NOT NULL,
  userAvatar TEXT,
  userVerified INTEGER DEFAULT 0,
  attendees TEXT, -- JSON array as string
  attendeeCount INTEGER DEFAULT 0,
  invitedUsers TEXT, -- JSON array as string
  rsvpYes TEXT, -- JSON array as string
  rsvpNo TEXT, -- JSON array as string
  rsvpMaybe TEXT, -- JSON array as string
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL,
  isDeleted INTEGER DEFAULT 0,
deletedAt TEXT,
  isPublic INTEGER NOT NULL DEFAULT 1,
  FOREIGN KEY (userId) REFERENCES users (id)
);

-- Events sync queue table
CREATE TABLE event_sync_queue (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  eventId TEXT,
  operation TEXT NOT NULL, -- 'create', 'update', 'delete'
  data TEXT, -- JSON string
  timestamp TEXT NOT NULL
);

-- Posts table
CREATE TABLE posts (
  id TEXT PRIMARY KEY NOT NULL,
  content TEXT NOT NULL,
  image TEXT,
  category TEXT NOT NULL,
  userId TEXT NOT NULL,
  userDisplayName TEXT NOT NULL,
  userAvatar TEXT,
  userYear TEXT,
  userVerified INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  likedBy TEXT, -- JSON array as string
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL,
  FOREIGN KEY (userId) REFERENCES users (id)
);

-- Comments table
CREATE TABLE comments (
  id TEXT PRIMARY KEY NOT NULL,
  postId TEXT NOT NULL,
  content TEXT NOT NULL,
  userId TEXT NOT NULL,
  userDisplayName TEXT NOT NULL,
  userAvatar TEXT,
  likes INTEGER DEFAULT 0,
  likedBy TEXT, -- JSON array as string
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL,
  FOREIGN KEY (postId) REFERENCES posts (id),
  FOREIGN KEY (userId) REFERENCES users (id)
);

-- Replies table
CREATE TABLE replies (
  id TEXT PRIMARY KEY NOT NULL,
  commentId TEXT NOT NULL,
  content TEXT NOT NULL,
  userId TEXT NOT NULL,
  userDisplayName TEXT NOT NULL,
  userAvatar TEXT,
  likes INTEGER DEFAULT 0,
  isLiked INTEGER DEFAULT 0,
  createdAt TEXT NOT NULL,
  FOREIGN KEY (commentId) REFERENCES comments (id),
  FOREIGN KEY (userId) REFERENCES users (id)
);

-- Chat channels table
CREATE TABLE chat_channels (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT,
  type TEXT NOT NULL DEFAULT 'direct',
  participants TEXT, -- JSON array as string
  isVerified INTEGER DEFAULT 0,
  isAnonymous INTEGER DEFAULT 0,
  lastMessage TEXT,
  timestamp INTEGER,
  unreadCount INTEGER DEFAULT 0,
  avatar TEXT,
  isOnline INTEGER DEFAULT 0,
  memberCount INTEGER DEFAULT 0,
  image TEXT,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL
);

-- Chat messages table
CREATE TABLE chat_messages (
  id TEXT PRIMARY KEY NOT NULL,
  chatId TEXT NOT NULL,
  senderId TEXT NOT NULL,
  text TEXT NOT NULL,
  timestamp INTEGER NOT NULL,
  status TEXT DEFAULT 'pending',
  isOwn INTEGER NOT NULL DEFAULT 0,
  synced INTEGER NOT NULL DEFAULT 0,
  isRead INTEGER NOT NULL DEFAULT 0,
  deletedFor TEXT, -- JSON array as string
  isDeletedForEveryone INTEGER DEFAULT 0,
  forwardedFrom TEXT,
  isSystemMessage INTEGER DEFAULT 0,
  createdAt TEXT NOT NULL,
  FOREIGN KEY (chatId) REFERENCES chat_channels (id),
  FOREIGN KEY (senderId) REFERENCES users (id)
);

-- User requests table
CREATE TABLE user_requests (
  id TEXT PRIMARY KEY NOT NULL,
  firstName TEXT NOT NULL,
  lastName TEXT NOT NULL,
  email TEXT NOT NULL,
  studentId TEXT NOT NULL,
  yearGroup TEXT NOT NULL,
  major TEXT NOT NULL,
  country TEXT NOT NULL,
  gender TEXT NOT NULL,
  phoneNumber TEXT,
  additionalInfo TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL,
  reviewedBy TEXT,
  reviewedAt TEXT,
  rejectionReason TEXT
);

-- Admin logs table
CREATE TABLE admin_logs (
  id TEXT PRIMARY KEY NOT NULL,
  action TEXT NOT NULL,
  adminId TEXT NOT NULL,
  adminEmail TEXT,
  targetUserId TEXT,
  targetUserEmail TEXT,
  details TEXT, -- JSON object as string
  timestamp TEXT NOT NULL,
  ipAddress TEXT,
  FOREIGN KEY (adminId) REFERENCES users (id)
);

-- System logs table
CREATE TABLE system_logs (
  id TEXT PRIMARY KEY NOT NULL,
  action TEXT NOT NULL,
  userId TEXT,
  email TEXT,
  details TEXT, -- JSON object as string
  timestamp TEXT NOT NULL,
  ipAddress TEXT,
  FOREIGN KEY (userId) REFERENCES users (id)
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_events_date ON events(date);
CREATE INDEX idx_events_userId ON events(userId);
CREATE INDEX idx_posts_userId ON posts(userId);
CREATE INDEX idx_posts_createdAt ON posts(createdAt);
CREATE INDEX idx_comments_postId ON comments(postId);
CREATE INDEX idx_replies_commentId ON replies(commentId);
CREATE INDEX idx_chat_messages_chatId ON chat_messages(chatId);
CREATE INDEX idx_chat_messages_timestamp ON chat_messages(timestamp);
CREATE INDEX idx_user_requests_status ON user_requests(status);
`);
    currentDbVersion = 1;
  }
  // if (currentDbVersion === 1) {
  //   Add more migrations
  // }
  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}

function LayoutContent() {
  const { isAuthenticated, loading, user } = useUser();
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState<boolean | null>(
    null
  );
  const router = useRouter();

  console.log("Role-=================", user?.role);
  console.log("Email-=================", user?.email);

  const db = useSQLiteContext();

  // Set SQLite context once for all services
  useEffect(() => {
    if (db) {
      EventsService.setSQLiteContext(db);
      UserService.setSQLiteContext(db);
      console.log("✅ SQLite context set globally for all services");
    }
  }, [db]);

  const initializePushNotifications = async () => {
    try {
      const token = await NotificationService.registerForPushNotifications();
      if (token && user?.id) {
        await NotificationService.saveTokenToUser(user.id, token);
      }
    } catch (error) {
      console.error("Error initializing push notifications:", error);
    }
  };


  useEffect(() => {
    // Initialize notifications
    NotificationService.setupNotificationListeners();

    // Register for push notifications when user logs in
    if (user?.id) {
      initializePushNotifications();
    }
  }, [user]);

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const hasSeenOnboardingValue =
        await AsyncStorage.getItem("hasSeenOnboarding");
      setHasSeenOnboarding(hasSeenOnboardingValue === "true");
      console.log("Onboarding ==============", hasSeenOnboardingValue);
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
          case "peer_advisor":
          case "buddy":
            router.replace("/(student-tabs)");
            break;
          case "freshman":
            router.replace("/(student-tabs)");
            break;
          case "peer_coach": // TODO: will fix this later
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
      {/* <TempUserSync /> */}
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
      {user && __DEV__ && <NotificationTestWidget />}
    </>
  );
}

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded) return null;

  return (
    <OverlayProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <PaperProvider>
          <SQLiteProvider
            databaseName="freshmanhub.db"
            onInit={migrateDbIfNeeded}
          >
            <UserProvider>
              <ThemeProvider>
                <StreamChatProvider>
                  <LayoutContent />
                </StreamChatProvider>
              </ThemeProvider>
            </UserProvider>
          </SQLiteProvider>
        </PaperProvider>
      </GestureHandlerRootView>
    </OverlayProvider>
  );
}
