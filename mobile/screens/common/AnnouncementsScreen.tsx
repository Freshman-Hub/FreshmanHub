"use client";

import { useState, useCallback } from "react";
import {
  ScrollView,
  RefreshControl,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, Search, Megaphone } from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { useRouter } from "expo-router";
import { Header } from "@/components/ui/Header";
import { AnnouncementModal } from "@/components/modals/announcement-modal";

interface Announcement {
  id: number;
  title: string;
  content: string;
  time: string;
}

// Mock Data for Announcements Screen
const allAnnouncements: Announcement[] = [
  {
    id: 1,
    title: "Campus-wide Power Outage Drill",
    content:
      "A campus-wide power outage drill is scheduled for October 26th, from 10:00 AM to 11:00 AM. Please ensure all critical equipment is safely shut down and be prepared for temporary disruption. This drill is essential for emergency preparedness.",
    time: "10m ago",
  },
  {
    id: 2,
    title: "New Shuttle Bus Schedule",
    content:
      "The updated shuttle bus schedule will be effective starting November 1st. New routes and times have been implemented to improve efficiency and coverage. Please check the transport portal on the student information system for detailed information and planning your commute.",
    time: "1h ago",
  },
  {
    id: 3,
    title: "Student Government Elections Open!",
    content:
      "Voting for the next student government leaders is now open! Your voice is crucial in shaping our campus community. Cast your vote for your preferred candidates through the online portal. Voting closes on October 30th at 5:00 PM.",
    time: "3h ago",
  },
  {
    id: 4,
    title: "Career Fair Registration Now Open",
    content:
      "Students interested in internships and job opportunities are encouraged to register for the annual Career Fair. Meet representatives from leading companies across various industries. Limited slots available, register early!",
    time: "1d ago",
  },
  {
    id: 5,
    title: "Library Extended Hours for Exam Period",
    content:
      "The university library will have extended operating hours during the upcoming exam period, starting November 15th. Check the library website for specific timings and available resources to support your studies.",
    time: "2d ago",
  },
  {
    id: 6,
    title: "Guest Lecture: The Future of AI",
    content:
      "Join us for a special guest lecture on 'The Future of Artificial Intelligence' by Dr. Anya Sharma, a renowned AI researcher. The event will take place on November 5th at 3:00 PM in the Auditorium. All are welcome!",
    time: "3d ago",
  },
];

export default function AnnouncementsScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] =
    useState<Announcement | null>(null);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  }, []);

  const handleAnnouncementPress = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
    setModalVisible(true);
  };

  const filteredAnnouncements = allAnnouncements.filter(
    (announcement) =>
      announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      announcement.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollContent: {
      paddingBottom: theme.spacing.xl,
      paddingHorizontal: theme.spacing.lg,
    },
    searchContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      marginHorizontal: theme.spacing.lg,
      marginTop: theme.spacing.md,
      marginBottom: theme.spacing.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    searchInput: {
      flex: 1,
      ...theme.typography.body,
      color: theme.colors.text,
        marginLeft: theme.spacing.sm,
      fontWeight: "500",
    },
    announcementCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.lg,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 4,
      borderWidth: 1,
      borderColor: theme.colors.border,
      marginBottom: theme.spacing.md,
    },
    announcementHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: theme.spacing.sm,
    },
    announcementTitle: {
      ...theme.typography.body,
      color: theme.colors.text,
      fontWeight: "700",
      marginLeft: theme.spacing.md,
      flex: 1,
    },
    announcementTime: {
      ...theme.typography.captionSmall,
      color: theme.colors.textSecondary,
      fontWeight: "500",
    },
    announcementContent: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      fontWeight: "500",
      lineHeight: 20,
    },
    noResultsText: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
      textAlign: "center",
        marginTop: theme.spacing.xl,
      fontWeight: "500",
    },
  });

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <Header
        title="Global Announcements"
        leftIcon={ArrowLeft}
        onLeftPress={() => router.back()}
        rightIcon={Search}
        onRightPress={() => console.log("Search Announcements")}
        style={{
          backgroundColor: theme.colors.background,
          borderBottomWidth: 0,
        }}
      />

      <View style={styles.searchContainer}>
        <Search color={theme.colors.textSecondary} size={20} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search announcements..."
          placeholderTextColor={theme.colors.textSecondary}
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
      </View>

      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.scrollContent}
      >
        {filteredAnnouncements.length > 0 ? (
          filteredAnnouncements.map((announcement) => (
            <TouchableOpacity
              key={announcement.id}
              style={styles.announcementCard}
              activeOpacity={0.8}
              onPress={() => handleAnnouncementPress(announcement)}
            >
              <View style={styles.announcementHeader}>
                <Megaphone color={theme.colors.primary} size={20} />
                <Text style={styles.announcementTitle}>
                  {announcement.title}
                </Text>
                <Text style={styles.announcementTime}>{announcement.time}</Text>
              </View>
              <Text style={styles.announcementContent}>
                {announcement.content}
              </Text>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.noResultsText}>
            No announcements found matching your search.
          </Text>
        )}
      </ScrollView>

      {selectedAnnouncement && (
        <AnnouncementModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          announcement={selectedAnnouncement}
        />
      )}
    </SafeAreaView>
  );
}
