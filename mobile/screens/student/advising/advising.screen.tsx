import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  RefreshControl,
  TextStyle,
  ViewStyle,
  ImageStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  MessageCircle,
  Calendar,
  Star,
  Users,
  GraduationCap,
  Target,
} from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";

// Mock advising data
const academicAdvisor = {
  id: 1,
  name: "Dr. Sarah Johnson",
  title: "Academic Advisor",
  department: "Student Academic Affairs",
  experience: "12 years",
  avatar:
    "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400",
  bio: "Dedicated academic advisor helping students navigate their academic journey, course selection, and career planning.",
  specializations: [
    "Course Planning",
    "Academic Requirements",
    "Career Guidance",
    "Study Abroad",
  ],
  rating: 4.9,
  studentsAdvised: 450,
  isOnline: true,
  availability: "Available today",
  nextAvailableSlot: "Today at 3:00 PM",
  phone: "+233 30 610 340",
  email: "sarah.johnson@ashesi.edu.gh",
};

const peerAdvisors = [
  {
    id: 2,
    name: "Michael Asante",
    year: "Senior",
    major: "Computer Science",
    avatar:
      "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400",
    bio: "Senior student passionate about helping freshmen navigate their first year at Ashesi.",
    specializations: [
      "First Year Experience",
      "Computer Science Track",
      "Study Tips",
    ],
    rating: 4.7,
    studentsHelped: 25,
    isOnline: false,
    availability: "Available tomorrow",
  },
  {
    id: 3,
    name: "Ama Osei",
    year: "Junior",
    major: "Business Administration",
    avatar:
      "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400",
    bio: "Business student with experience in entrepreneurship and leadership development.",
    specializations: ["Business Track", "Leadership", "Internship Guidance"],
    rating: 4.8,
    studentsHelped: 18,
    isOnline: true,
    availability: "Available now",
  },
  {
    id: 4,
    name: "Kwame Nkrumah",
    year: "Senior",
    major: "Engineering",
    avatar:
      "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=400",
    bio: "Engineering student with strong academic background and mentoring experience.",
    specializations: [
      "Engineering Track",
      "Research Opportunities",
      "Graduate School",
    ],
    rating: 4.9,
    studentsHelped: 32,
    isOnline: true,
    availability: "Available this week",
  },
];

const upcomingAppointments = [
  {
    id: 1,
    title: "Course Selection Meeting",
    advisor: "Dr. Sarah Johnson",
    date: "Tomorrow",
    time: "2:00 PM",
    duration: "45 min",
    type: "In-Person",
    status: "confirmed",
    location: "Academic Affairs Office",
  },
  {
    id: 2,
    title: "Career Planning Session",
    advisor: "Michael Asante",
    date: "Friday",
    time: "10:00 AM",
    duration: "30 min",
    type: "Video Call",
    status: "pending",
    location: "Online",
  },
];

const advisingGoals = [
  {
    id: 1,
    title: "Complete Course Registration",
    progress: 85,
    status: "In Progress",
    dueDate: "End of Week",
    advisor: "Dr. Sarah Johnson",
  },
  {
    id: 2,
    title: "Explore Internship Opportunities",
    progress: 40,
    status: "In Progress",
    dueDate: "Next Month",
    advisor: "Ama Osei",
  },
  {
    id: 3,
    title: "Plan Study Abroad Program",
    progress: 100,
    status: "Completed",
    dueDate: "Last Week",
    advisor: "Dr. Sarah Johnson",
  },
];

const advisingStats = [
  {
    label: "Sessions This Semester",
    value: "8",
    icon: Calendar,
    color: "#3b82f6",
  },
  { label: "Goals Completed", value: "5", icon: Target, color: "#059669" },
  {
    label: "Academic Progress",
    value: "92%",
    icon: GraduationCap,
    color: "#dc2626",
  },
  { label: "Peer Advisors", value: "3", icon: Users, color: "#7c3aed" },
];

export default function AdvisingScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedAdvisorType, setSelectedAdvisorType] = useState<
    "academic" | "peer"
  >("academic");

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  };

  const handleBookMeeting = (advisorId: number) => {
    console.log("Booking meeting with advisor:", advisorId);
  };

  const handleMessage = (advisorId: number) => {
    console.log("Messaging advisor:", advisorId);
  };

  // const handleCall = (phone: string) => {
  //   console.log("Calling advisor:", phone);
  // };

  const styles = StyleSheet.create<{
    container: ViewStyle;
    header: ViewStyle;
    backButton: ViewStyle;
    headerTitle: TextStyle;
    advisorSelector: ViewStyle;
    selectorButton: ViewStyle;
    selectorButtonActive: ViewStyle;
    selectorText: TextStyle;
    selectorTextActive: TextStyle;
    scrollContent: ViewStyle;
    statsContainer: ViewStyle;
    statsRow: ViewStyle;
    statCard: ViewStyle;
    statIcon: ViewStyle;
    statValue: TextStyle;
    statLabel: TextStyle;
    academicAdvisorContainer: ViewStyle;
    sectionTitle: TextStyle;
    advisorCard: ViewStyle;
    academicAdvisorCard: ViewStyle;
    advisorHeader: ViewStyle;
    advisorAvatar: ImageStyle;
    onlineIndicator: ViewStyle;
    advisorInfo: ViewStyle;
    advisorName: TextStyle;
    advisorTitle: TextStyle;
    advisorDepartment: TextStyle;
    availabilityBadge: ViewStyle;
    availabilityText: TextStyle;
    advisorBio: TextStyle;
    advisorStats: ViewStyle;
    statItem: ViewStyle;
    statText: TextStyle;
    specializationsContainer: ViewStyle;
    specializationsTitle: TextStyle;
    specializationsList: ViewStyle;
    specializationTag: ViewStyle;
    specializationText: TextStyle;
    nextSlotInfo: ViewStyle;
    nextSlotText: TextStyle;
    advisorActions: ViewStyle;
    actionButton: ViewStyle;
    actionButtonSecondary: ViewStyle;
    actionButtonText: TextStyle;
    actionButtonTextSecondary: TextStyle;
    peerAdvisorsContainer: ViewStyle;
    peerAdvisorCard: ViewStyle;
    peerAdvisorHeader: ViewStyle;
    peerAdvisorAvatar: ImageStyle;
    peerAdvisorInfo: ViewStyle;
    peerAdvisorName: TextStyle;
    peerAdvisorDetails: TextStyle;
    appointmentsContainer: ViewStyle;
    appointmentCard: ViewStyle;
    appointmentHeader: ViewStyle;
    appointmentTitle: TextStyle;
    appointmentStatus: ViewStyle;
    appointmentStatusText: TextStyle;
    appointmentDetails: TextStyle;
    goalsContainer: ViewStyle;
    goalCard: ViewStyle;
    goalHeader: ViewStyle;
    goalTitle: TextStyle;
    goalStatus: TextStyle;
    progressBar: ViewStyle;
    progressFill: ViewStyle;
    goalMeta: ViewStyle;
    goalDueDate: TextStyle;
    goalAdvisor: TextStyle;
  }>({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.sm,
      backgroundColor: theme.colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    backButton: {
      padding: theme.spacing.sm,
      marginRight: theme.spacing.md,
      borderRadius: theme.borderRadius.lg,
      backgroundColor: theme.colors.background,
    },
    headerTitle: {
      ...theme.typography.h5,
      color: theme.colors.text,
      fontWeight: "700",
      flex: 1,
    },
    advisorSelector: {
      flexDirection: "row",
      backgroundColor: theme.colors.surface,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      gap: theme.spacing.sm,
    },
    selectorButton: {
      flex: 1,
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      borderRadius: theme.borderRadius.xxxl,
      backgroundColor: theme.colors.background,
      borderWidth: 1,
      borderColor: theme.colors.border,
      alignItems: "center",
    },
    selectorButtonActive: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    selectorText: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      fontWeight: "600",
    },
    selectorTextActive: {
      color: "white",
      fontWeight: "700",
    },
    scrollContent: {
      paddingBottom: theme.spacing.md,
    },
    statsContainer: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.md,
    },
    statsRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      gap: theme.spacing.xs,
    },
    statCard: {
      flex: 1,
      backgroundColor: theme.colors.surface,
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.lg,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.1,
      shadowRadius: 10,
      elevation: 5,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    statIcon: {
      marginBottom: theme.spacing.sm,
    },
    statValue: {
      ...theme.typography.body,
      color: theme.colors.text,
      fontWeight: "700",
      marginBottom: 2,
    },
    statLabel: {
      ...theme.typography.captionSmall,
      color: theme.colors.textSecondary,
      textAlign: "center",
      fontWeight: "600",
    },
    academicAdvisorContainer: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.md,
    },
    sectionTitle: {
      ...theme.typography.h4,
      color: theme.colors.text,
      fontWeight: "700",
      marginBottom: theme.spacing.md,
    },
    advisorCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.lg,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 6,
      },
      shadowOpacity: 0.15,
      shadowRadius: 10,
      elevation: 0,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    academicAdvisorCard: {
      backgroundColor: theme.colors.primary + "10",
      borderWidth: 1,
      borderColor: theme.colors.primary + "30",
    },
    advisorHeader: {
      flexDirection: "row",
      alignItems: "flex-start",
      marginBottom: theme.spacing.md,
    },
    advisorAvatar: {
      width: 80,
      height: 80,
      borderRadius: 40,
      marginRight: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.primary + "40",
      position: "relative",
    },
    onlineIndicator: {
      position: "absolute",
      bottom: 2,
      right: 2,
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: theme.colors.success,
      borderWidth: 1,
      borderColor: "white",
    },
    advisorInfo: {
      flex: 1,
    },
    advisorName: {
      ...theme.typography.h5,
      color: theme.colors.text,
      fontWeight: "700",
      marginBottom: 4,
    },
    advisorTitle: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      marginBottom: 4,
    } as TextStyle,
    advisorDepartment: {
      ...theme.typography.captionSmall,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.sm,
    } as TextStyle,
    availabilityBadge: {
      backgroundColor: theme.colors.accent + "20",
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.xxxl,
      alignSelf: "flex-start",
    },
    availabilityText: {
      ...theme.typography.bodySmall,
      color: theme.colors.accent,
      fontWeight: "700",
    },
    advisorBio: {
      ...theme.typography.body,
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
    } as TextStyle,
    advisorStats: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.lg,
      marginBottom: theme.spacing.lg,
    },
    statItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.xs,
    },
    statText: {
      ...theme.typography.caption,
      color: theme.colors.textSecondary,
      fontWeight: "600",
    },
    specializationsContainer: {
      marginBottom: theme.spacing.md,
    },
    specializationsTitle: {
      ...theme.typography.body,
      color: theme.colors.text,
      fontWeight: "600",
      marginBottom: theme.spacing.sm,
    },
    specializationsList: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: theme.spacing.xs,
    },
    specializationTag: {
      backgroundColor: theme.colors.background,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.xxxl,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    specializationText: {
      ...theme.typography.bodySmall,
      color: theme.colors.text,
      fontWeight: "600",
    },
    nextSlotInfo: {
      backgroundColor: theme.colors.accent + "20",
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.xxxl,
      marginBottom: theme.spacing.md,
    },
    nextSlotText: {
      ...theme.typography.body,
      color: theme.colors.accent,
      fontWeight: "700",
      textAlign: "center",
    },
    advisorActions: {
      flexDirection: "row",
      gap: theme.spacing.md,
    },
    actionButton: {
      flex: 1,
      backgroundColor: theme.colors.primary,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.xxxl,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: theme.spacing.sm,
    },
    actionButtonSecondary: {
      backgroundColor: theme.colors.background,
      borderWidth: 2,
      borderColor: theme.colors.border,
    },
    actionButtonText: {
      ...theme.typography.button,
      color: "white",
      fontWeight: "600",
    },
    actionButtonTextSecondary: {
      color: theme.colors.text,
    },
    peerAdvisorsContainer: {
      paddingHorizontal: theme.spacing.md,
    },
    peerAdvisorCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.md,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.1,
      shadowRadius: 10,
      elevation: 5,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    peerAdvisorHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: theme.spacing.md,
    },
    peerAdvisorAvatar: {
      width: 45,
      height: 45,
      borderRadius: 30,
      marginRight: theme.spacing.md,
      borderWidth: 2,
      borderColor: theme.colors.primary + "40",
      position: "relative",
    },
    peerAdvisorInfo: {
      flex: 1,
    },
    peerAdvisorName: {
      ...theme.typography.body,
      color: theme.colors.text,
      fontWeight: "700",
      marginBottom: 2,
    },
    peerAdvisorDetails: {
      ...theme.typography.caption,
      color: theme.colors.textSecondary,
      marginBottom: 4,
    } as TextStyle,
    appointmentsContainer: {
      paddingHorizontal: theme.spacing.md,
      marginBottom: theme.spacing.md,
    },
    appointmentCard: {
      backgroundColor: theme.colors.surface,
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.lg,
      marginBottom: theme.spacing.md,
      borderLeftWidth: 4,
      borderLeftColor: theme.colors.primary,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    appointmentHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: theme.spacing.sm,
    },
    appointmentTitle: {
      ...theme.typography.body,
      color: theme.colors.text,
      fontWeight: "600",
    },
    appointmentStatus: {
      backgroundColor: theme.colors.accent + "20",
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: 2,
      borderRadius: theme.borderRadius.sm,
    },
    appointmentStatusText: {
      ...theme.typography.bodySmall,
      color: theme.colors.accent,
      fontWeight: "600",
    },
    appointmentDetails: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      marginBottom: 4,
    } as TextStyle,
    goalsContainer: {
      paddingHorizontal: theme.spacing.md,
      marginBottom: theme.spacing.md,
    },
    goalCard: {
      backgroundColor: theme.colors.surface,
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.lg,
      marginBottom: theme.spacing.md,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    goalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: theme.spacing.sm,
    },
    goalTitle: {
      ...theme.typography.body,
      color: theme.colors.text,
      fontWeight: "600",
    },
    goalStatus: {
      ...theme.typography.bodySmall,
      color: theme.colors.accent,
      fontWeight: "600",
    },
    progressBar: {
      height: 5,
      backgroundColor: theme.colors.border,
      borderRadius: 4,
      marginBottom: theme.spacing.sm,
    },
    progressFill: {
      height: "100%",
      backgroundColor: theme.colors.primary,
      borderRadius: 4,
    },
    goalMeta: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    goalDueDate: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
    } as TextStyle,
    goalAdvisor: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
    } as TextStyle,
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft color={theme.colors.text} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Academic Advising</Text>
      </View>

      <View style={styles.advisorSelector}>
        <TouchableOpacity
          style={[
            styles.selectorButton,
            selectedAdvisorType === "academic" && styles.selectorButtonActive,
          ]}
          onPress={() => setSelectedAdvisorType("academic")}
        >
          <Text
            style={[
              styles.selectorText,
              selectedAdvisorType === "academic" && styles.selectorTextActive,
            ]}
          >
            Academic Advisor
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.selectorButton,
            selectedAdvisorType === "peer" && styles.selectorButtonActive,
          ]}
          onPress={() => setSelectedAdvisorType("peer")}
        >
          <Text
            style={[
              styles.selectorText,
              selectedAdvisorType === "peer" && styles.selectorTextActive,
            ]}
          >
            Peer Advisors
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.statsContainer}>
          <View style={styles.statsRow}>
            {advisingStats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <View key={index} style={styles.statCard}>
                  <IconComponent
                    color={stat.color}
                    size={24}
                    style={styles.statIcon}
                  />
                  <Text style={styles.statValue}>{stat.value}</Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {selectedAdvisorType === "academic" ? (
          <View style={styles.academicAdvisorContainer}>
            <Text style={styles.sectionTitle}>Your Academic Advisor</Text>
            <View style={[styles.advisorCard, styles.academicAdvisorCard]}>
              <View style={styles.advisorHeader}>
                <View style={{ position: "relative" }}>
                  <Image
                    source={{ uri: academicAdvisor.avatar }}
                    style={styles.advisorAvatar}
                  />
                  {academicAdvisor.isOnline && (
                    <View style={styles.onlineIndicator} />
                  )}
                </View>
                <View style={styles.advisorInfo}>
                  <Text style={styles.advisorName}>{academicAdvisor.name}</Text>
                  <Text style={styles.advisorTitle}>
                    {academicAdvisor.title}
                  </Text>
                  <Text style={styles.advisorDepartment}>
                    {academicAdvisor.department} • {academicAdvisor.experience}{" "}
                    experience
                  </Text>
                  <View style={styles.availabilityBadge}>
                    <Text style={styles.availabilityText}>
                      {academicAdvisor.availability}
                    </Text>
                  </View>
                </View>
              </View>

              <Text style={styles.advisorBio}>{academicAdvisor.bio}</Text>

              <View style={styles.advisorStats}>
                <View style={styles.statItem}>
                  <Star color="#f59e0b" size={16} fill="#f59e0b" />
                  <Text style={styles.statText}>{academicAdvisor.rating}</Text>
                </View>
                <View style={styles.statItem}>
                  <Users color={theme.colors.textSecondary} size={16} />
                  <Text style={styles.statText}>
                    {academicAdvisor.studentsAdvised} advised
                  </Text>
                </View>
              </View>

              <View style={styles.specializationsContainer}>
                <Text style={styles.specializationsTitle}>Specializations</Text>
                <View style={styles.specializationsList}>
                  {academicAdvisor.specializations.map((spec, index) => (
                    <View key={index} style={styles.specializationTag}>
                      <Text style={styles.specializationText}>{spec}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.nextSlotInfo}>
                <Text style={styles.nextSlotText}>
                  Next Available: {academicAdvisor.nextAvailableSlot}
                </Text>
              </View>

              <View style={styles.advisorActions}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleBookMeeting(academicAdvisor.id)}
                >
                  <Calendar color="white" size={20} />
                  <Text style={styles.actionButtonText}>Book Meeting</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, styles.actionButtonSecondary]}
                  onPress={() => handleMessage(academicAdvisor.id)}
                >
                  <MessageCircle color={theme.colors.text} size={20} />
                  <Text
                    style={[
                      styles.actionButtonText,
                      styles.actionButtonTextSecondary,
                    ]}
                  >
                    Message
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.peerAdvisorsContainer}>
            <Text style={styles.sectionTitle}>Peer Advisors</Text>
            {peerAdvisors.map((advisor) => (
              <View key={advisor.id} style={styles.peerAdvisorCard}>
                <View style={styles.peerAdvisorHeader}>
                  <View style={{ position: "relative" }}>
                    <Image
                      source={{ uri: advisor.avatar }}
                      style={styles.peerAdvisorAvatar}
                    />
                    {advisor.isOnline && (
                      <View style={styles.onlineIndicator} />
                    )}
                  </View>
                  <View style={styles.peerAdvisorInfo}>
                    <Text style={styles.peerAdvisorName}>{advisor.name}</Text>
                    <Text style={styles.peerAdvisorDetails}>
                      {advisor.year} • {advisor.major}
                    </Text>
                    <View style={styles.availabilityBadge}>
                      <Text style={styles.availabilityText}>
                        {advisor.availability}
                      </Text>
                    </View>
                  </View>
                </View>

                <Text style={styles.advisorBio}>{advisor.bio}</Text>

                <View style={styles.advisorStats}>
                  <View style={styles.statItem}>
                    <Star color="#f59e0b" size={16} fill="#f59e0b" />
                    <Text style={styles.statText}>{advisor.rating}</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Users color={theme.colors.textSecondary} size={16} />
                    <Text style={styles.statText}>
                      {advisor.studentsHelped} helped
                    </Text>
                  </View>
                </View>

                <View style={styles.specializationsContainer}>
                  <Text style={styles.specializationsTitle}>
                    Specializations
                  </Text>
                  <View style={styles.specializationsList}>
                    {advisor.specializations.map((spec, index) => (
                      <View key={index} style={styles.specializationTag}>
                        <Text style={styles.specializationText}>{spec}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                <View style={styles.advisorActions}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleBookMeeting(advisor.id)}
                  >
                    <Calendar color="white" size={18} />
                    <Text style={styles.actionButtonText}>Book Session</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.actionButtonSecondary]}
                    onPress={() => handleMessage(advisor.id)}
                  >
                    <MessageCircle color={theme.colors.text} size={18} />
                    <Text
                      style={[
                        styles.actionButtonText,
                        styles.actionButtonTextSecondary,
                      ]}
                    >
                      Message
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        <View style={styles.appointmentsContainer}>
          <Text style={styles.sectionTitle}>Upcoming Appointments</Text>
          {upcomingAppointments.map((appointment) => (
            <View key={appointment.id} style={styles.appointmentCard}>
              <View style={styles.appointmentHeader}>
                <Text style={styles.appointmentTitle}>{appointment.title}</Text>
                <View style={styles.appointmentStatus}>
                  <Text style={styles.appointmentStatusText}>
                    {appointment.status}
                  </Text>
                </View>
              </View>
              <Text style={styles.appointmentDetails}>
                {appointment.advisor} • {appointment.date} at {appointment.time}
              </Text>
              <Text style={styles.appointmentDetails}>
                {appointment.duration} • {appointment.type} •{" "}
                {appointment.location}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.goalsContainer}>
          <Text style={styles.sectionTitle}>Academic Goals</Text>
          {advisingGoals.map((goal) => (
            <View key={goal.id} style={styles.goalCard}>
              <View style={styles.goalHeader}>
                <Text style={styles.goalTitle}>{goal.title}</Text>
                <Text style={styles.goalStatus}>{goal.status}</Text>
              </View>
              <View style={styles.progressBar}>
                <View
                  style={[styles.progressFill, { width: `${goal.progress}%` }]}
                />
              </View>
              <View style={styles.goalMeta}>
                <Text style={styles.goalDueDate}>Due: {goal.dueDate}</Text>
                <Text style={styles.goalAdvisor}>Advisor: {goal.advisor}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
