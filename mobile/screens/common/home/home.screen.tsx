"use client";

import React from "react";
import { ScrollView, RefreshControl, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WelcomeHeader } from "@/components/home/WelcomeHeader";
import { QuickActions } from "@/components/home/QuickActions";
import { EventCarousel } from "@/components/home/EventCarousel";
import { CommunityHighlights } from "@/components/home/CommunityHighlights";
import { OrientationProgress } from "@/components/home/OrientationProgress";
import { TodaySchedule } from "@/components/home/TodaySchedule";
import { useTheme } from "@/contexts/ThemeContext";

export default function HomeScreen() {
  const { theme } = useTheme();
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // TODO: Implement actual data refresh from backend
    // - Refresh user data
    // - Refresh events
    // - Refresh community posts
    // - Refresh orientation progress
    // - Refresh today's schedule
    setTimeout(() => setRefreshing(false), 2000);
  }, []);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollView: {
      flex: 1,
    },
  });

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <WelcomeHeader />
        <OrientationProgress />
        <QuickActions />
        <TodaySchedule />
        <EventCarousel />
        <CommunityHighlights />
      </ScrollView>
    </SafeAreaView>
  );
}
