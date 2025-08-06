import { useTheme } from "@/contexts/ThemeContext";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  Briefcase,
  Building,
  Calendar,
  Clock,
  Download,
  ExternalLink,
  FileText,
  Globe,

  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Target,
  Users,
  ChevronRight,
} from "lucide-react-native";
import React, { JSX, useState } from "react";
import {
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

/**
 * Career Services Center information
 */
const careerCenter = {
  name: "Career Services",
  description:
    "Career Services prepares students for life after Ashesi by equipping them with tools for career exploration, readiness, and advancement.",
  image: require("../../../assets/menu/support-center.png"),
  location: "OSCA - Career Services",
  phone: "+233 50 155 6888",
  email: "snukpe@ashesi.edu.gh",
  hours: "8:00 AM - 5:00 PM (Mon-Fri)",
  website: "https://ashesi.edu.gh/career-services/",
  director: {
    name: "Selasi Nukpe",
    title: "Assistant Director, Career Services",
    avatar:
      "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400",
    email: "snukpe@ashesi.edu.gh",
    phone: "+233 50 155 6888",
  },
};

/**
 * Quick statistics for career services
 * Updated to remove specific numbers as requested
 */
const careerStats = [
  { label: "Career Services", value: "4", icon: Target, color: "#22c55e" },
  { label: "Job Platforms", value: "2", icon: Building, color: "#3b82f6" },
  { label: "Resources", value: "Available", icon: Download, color: "#f59e0b" },
  { label: "Career Fair", value: "2025", icon: Calendar, color: "#7c3aed" },
];

/**
 * Available career services with links and descriptions
 */
const careerServices = [
  {
    id: 1,
    name: "Career Counseling & Coaching",
    description:
      "One-on-one support to explore career paths, set goals, and make informed decisions",
    icon: Target,
    color: "#3b82f6",
    available: true,
    hasLink: false,
  },
  {
    id: 2,
    name: "Resume Review",
    description: "Professional resume and CV review and optimization",
    icon: FileText,
    color: "#059669",
    available: true,
    hasLink: false,
  },
  {
    id: 3,
    name: "Interview Preparation",
    description: "Mock interviews and interview skills training",
    icon: MessageCircle,
    color: "#7c3aed",
    available: true,
    hasLink: false,
  },
  {
    id: 4,
    name: "LinkedIn Profile",
    description: "Professional LinkedIn profile optimization",
    icon: Globe,
    color: "#0891b2",
    available: true,
    hasLink: false,
  },
  {
    id: 5,
    name: "Internships & Job Placement",
    description: "Connects students to local and international opportunities",
    icon: Briefcase,
    color: "#f59e0b",
    available: true,
    hasLink: false,
  },
  {
    id: 6,
    name: "Career Fairs & Networking",
    description: "Annual career fairs and employer sessions",
    icon: Users,
    color: "#ef4444",
    available: true,
    hasLink: true,
    link: "https://ashesi.edu.gh/career-fair-2025/",
  },
];

/**
 * Job opportunity platforms
 */
const jobPlatforms = [
  {
    id: 1,
    name: "College Central Network",
    description: "Ashesi's dedicated job portal with exclusive opportunities",
    url: "https://www.collegecentral.com/ashesi/",
    logo: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400",
    type: "Primary Platform",
  },
  {
    id: 2,
    name: "Baobab Platform",
    description: "African job platform connecting students with opportunities",
    url: "https://www.baobabplatform.org/landing",
    logo: "https://images.pexels.com/photos/590020/pexels-photo-590020.jpeg?auto=compress&cs=tinysrgb&w=400",
    type: "Secondary Platform",
  },
];

/**
 * Career Services Screen Component
 *
 * Displays comprehensive career services information including:
 * - Overview of career services
 * - Available services and resources
 * - Job opportunity platforms
 * - Career resources and links
 * - Contact information
 *
 * @returns {JSX.Element} The career services screen component
 */
export default function CareerServicesScreen(): JSX.Element {
  const { theme } = useTheme();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState<boolean>(false);

  /**
   * Handles pull-to-refresh functionality
   */
  const onRefresh = (): void => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  };

  /**
   * Handles service card press events
   */
  const handleServicePress = (service: any): void => {
    if (service.hasLink && service.link) {
      Linking.openURL(service.link);
    } else {
      console.log("Booking career service:", service.id);
      // TODO: Navigate to booking or contact screen
    }
  };

  /**
   * Handles job platform press events
   */
  const handlePlatformPress = (platform: any): void => {
    Linking.openURL(platform.url);
  };

  /**
   * Opens career resources website
   */
  const handleResourcesPress = (): void => {
    Linking.openURL(careerCenter.website);
  };

  /**
   * Initiates call to career center
   */
  const handleCallCenter = (): void => {
    Linking.openURL(`tel:${careerCenter.phone}`);
  };

  /**
   * Opens email client to contact career center
   */
  const handleEmailCenter = (): void => {
    Linking.openURL(`mailto:${careerCenter.email}`);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
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
      ...theme.typography.h4,
      color: theme.colors.text,
      fontWeight: "700",
      flex: 1,
    },
    scrollContent: {
      paddingBottom: theme.spacing.xl,
    },
    heroSection: {
      position: "relative",
      height: 200,
      margin: theme.spacing.md,
      borderRadius: theme.borderRadius.xl,
      overflow: "hidden",
    },
    heroImage: {
      width: "100%",
      height: "100%",
    },
    heroOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0,0,0,0.5)",
      justifyContent: "center",
      alignItems: "center",
      padding: theme.spacing.lg,
    },
    heroTitle: {
      ...theme.typography.h4,
      color: "white",
      fontWeight: "700",
      textAlign: "center",
      marginBottom: theme.spacing.sm,
    },
    heroDescription: {
      ...theme.typography.body,
      color: "rgba(255,255,255,0.9)",
      textAlign: "center",
      lineHeight: 22,
    } as TextStyle,
    statsContainer: {
      paddingHorizontal: theme.spacing.md,
      marginBottom: theme.spacing.md,
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
      textAlign: "center",
    },
    statLabel: {
      ...theme.typography.captionSmall,
      color: theme.colors.textSecondary,
      textAlign: "center",
      fontWeight: "600",
    },
    sectionContainer: {
      paddingHorizontal: theme.spacing.md,
      marginBottom: theme.spacing.md,
    },
    sectionTitle: {
      ...theme.typography.h5,
      color: theme.colors.text,
      fontWeight: "700",
      marginBottom: theme.spacing.lg,
    },
    servicesGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
      gap: theme.spacing.sm,
    },
    serviceCard: {
      width: "48%",
      backgroundColor: theme.colors.surface,
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.xl,
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
    serviceIcon: {
      marginBottom: theme.spacing.md,
    },
    serviceName: {
      ...theme.typography.body,
      color: theme.colors.text,
      fontWeight: "600",
      textAlign: "center",
      marginBottom: theme.spacing.sm,
    },
    serviceDescription: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      textAlign: "center",
      marginBottom: theme.spacing.sm,
    } as TextStyle,
    serviceDuration: {
      backgroundColor: theme.colors.accent + "20",
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: 2,
      borderRadius: theme.borderRadius.sm,
    },
    serviceDurationText: {
      ...theme.typography.captionSmall,
      color: theme.colors.accent,
      fontWeight: "600",
    },
    searchContainer: {
      marginBottom: theme.spacing.md,
    },
    searchInput: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xxxl,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.sm,
      borderWidth: 1,
      borderColor: theme.colors.border,
      ...theme.typography.body,
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
      fontWeight: "500",
    },
    filtersContainer: {
      flexDirection: "row",
      gap: theme.spacing.sm,
    },
    filterChip: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.xxxl,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    filterChipActive: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    filterChipText: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      fontWeight: "600",
    },
    filterChipTextActive: {
      color: "white",
      fontWeight: "700",
    },
    jobCard: {
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
      elevation: 5,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    jobHeader: {
      flexDirection: "row",
      alignItems: "flex-start",
      marginBottom: theme.spacing.md,
    },
    jobLogo: {
      width: 50,
      height: 50,
      borderRadius: theme.borderRadius.lg,
      marginRight: theme.spacing.md,
    },
    jobInfo: {
      flex: 1,
    },
    jobTitle: {
      ...theme.typography.h6,
      color: theme.colors.text,
      fontWeight: "700",
      marginBottom: 4,
    },
    jobCompany: {
      ...theme.typography.caption,
      color: theme.colors.textSecondary,
      marginBottom: 4,
      fontWeight: "600",
    },
    jobLocation: {
      ...theme.typography.captionSmall,
      color: theme.colors.textSecondary,
    } as TextStyle,
    bookmarkButton: {
      padding: theme.spacing.sm,
    },
    jobMeta: {
      flexDirection: "row",
      flexWrap: "wrap",
      alignItems: "center",
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.md,
    },
    metaItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.xs,
    },
    metaText: {
      ...theme.typography.captionSmall,
      color: theme.colors.textSecondary,
      fontWeight: "500",
    },
    jobDescription: {
      ...theme.typography.body,
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
      fontWeight: "500",
    },
    requirementsContainer: {
      marginBottom: theme.spacing.md,
    },
    requirementsList: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: theme.spacing.xs,
    },
    requirementTag: {
      backgroundColor: theme.colors.background,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    requirementText: {
      ...theme.typography.caption,
      color: theme.colors.text,
      fontWeight: "600",
    },
    jobActions: {
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
    eventCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.md,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 6,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    eventHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: theme.spacing.sm,
    },
    eventTitle: {
      ...theme.typography.body,
      color: theme.colors.text,
      fontWeight: "700",
      flex: 1,
    },
    eventType: {
      backgroundColor: theme.colors.primary + "20",
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: 2,
      borderRadius: theme.borderRadius.sm,
    },
    eventTypeText: {
      ...theme.typography.captionSmall,
      color: theme.colors.primary,
      fontWeight: "600",
    },
    eventDetails: {
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.md,
    },
    eventDetailRow: {
      flexDirection: "row",
      alignItems: "center",
    },
    eventDetailText: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      marginLeft: theme.spacing.sm,
      fontWeight: "500",
    },
    eventDescription: {
      ...theme.typography.bodySmall,
      color: theme.colors.text,
      lineHeight: 18,
    } as TextStyle,
    resourceCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.md,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 6,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    resourceHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: theme.spacing.sm,
    },
    resourceTitle: {
      ...theme.typography.body,
      color: theme.colors.text,
      fontWeight: "700",
      flex: 1,
    },
    resourceType: {
      backgroundColor: theme.colors.accent + "20",
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: 2,
      borderRadius: theme.borderRadius.sm,
    },
    resourceTypeText: {
      ...theme.typography.captionSmall,
      color: theme.colors.accent,
      fontWeight: "600",
    },
    resourceDescription: {
      ...theme.typography.bodySmall,
      color: theme.colors.text,
      lineHeight: 18,
      marginBottom: theme.spacing.md,
      fontWeight: "500",
    },
    resourceMeta: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    resourceStats: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.md,
    },
    resourceStat: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.xs,
    },
    resourceStatText: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
    } as TextStyle,
    downloadButton: {
      backgroundColor: theme.colors.primary,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.lg,
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.xs,
    },
    downloadButtonText: {
      ...theme.typography.bodySmall,
      color: "white",
      fontWeight: "600",
    },
    directorCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.md,
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
    directorHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: theme.spacing.md,
    },
    directorAvatar: {
      width: 80,
      height: 80,
      borderRadius: 40,
      marginRight: theme.spacing.lg,
      borderWidth: 3,
      borderColor: theme.colors.primary + "40",
    },
    directorInfo: {
      flex: 1,
    },
    directorName: {
      ...theme.typography.h5,
      color: theme.colors.text,
      fontWeight: "700",
      marginBottom: 4,
    },
    directorTitle: {
      ...theme.typography.caption,
      color: theme.colors.textSecondary,
      marginBottom: 4,
      fontWeight: "600",
    },
    directorExperience: {
      ...theme.typography.captionSmall,
      color: theme.colors.textSecondary,
    } as TextStyle,
    contactInfo: {
      gap: theme.spacing.md,
      marginBottom: theme.spacing.lg,
    },
    contactRow: {
      flexDirection: "row",
      alignItems: "center",
    },
    contactIcon: {
      marginRight: theme.spacing.md,
      width: 20,
    },
    contactText: {
      ...theme.typography.body,
      color: theme.colors.text,
      fontWeight: "500",
    },
    contactActions: {
      flexDirection: "row",
      gap: theme.spacing.md,
    },
    contactButton: {
      flex: 1,
      backgroundColor: theme.colors.primary,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.xxxl,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: theme.spacing.sm,
    },
    contactButtonSecondary: {
      backgroundColor: theme.colors.background,
      borderWidth: 2,
      borderColor: theme.colors.border,
    },
    contactButtonText: {
      ...theme.typography.button,
      color: "white",
      fontWeight: "600",
    },
    contactButtonTextSecondary: {
      color: theme.colors.text,
    },
    noResultsContainer: {
      alignItems: "center",
      paddingVertical: theme.spacing.xxl,
    },
    noResultsText: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
      textAlign: "center",
    } as TextStyle,
    platformCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.md,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 6,
      },
      shadowOpacity: 0.15,
      shadowRadius: 10,
      elevation: 5,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    platformHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: theme.spacing.md,
    },
    platformLogo: {
      width: 50,
      height: 50,
      borderRadius: theme.borderRadius.lg,
      marginRight: theme.spacing.md,
    },
    platformInfo: {
      flex: 1,
    },
    platformName: {
      ...theme.typography.h6,
      color: theme.colors.text,
      fontWeight: "700",
      marginBottom: 4,
    },
    platformType: {
      ...theme.typography.captionSmall,
      color: theme.colors.primary,
      fontWeight: "600",
    },
    platformDescription: {
      ...theme.typography.body,
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
      lineHeight: 22,
      fontWeight: "500",
    },
    visitButton: {
      backgroundColor: theme.colors.primary,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.xxxl,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: theme.spacing.sm,
    },
    visitButtonText: {
      ...theme.typography.button,
      color: "white",
      fontWeight: "600",
    },
    resourcesCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.lg,
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
    resourcesTitle: {
      ...theme.typography.h6,
      color: theme.colors.text,
      fontWeight: "700",
      marginBottom: theme.spacing.sm,
    },
    resourcesDescription: {
      ...theme.typography.body,
      color: theme.colors.text,
      lineHeight: 22,
      marginBottom: theme.spacing.md,
      fontWeight: "500",
    },
    resourcesButton: {
      backgroundColor: theme.colors.accent,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.xxxl,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: theme.spacing.sm,
    },
    resourcesButtonText: {
      ...theme.typography.button,
      color: "white",
      fontWeight: "600",
    },
    clickableIndicator: {
      position: "absolute",
      top: theme.spacing.sm,
      right: theme.spacing.sm,
      backgroundColor: theme.colors.primary + "20",
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.xs,
    },
    serviceCardWithLink: {
      borderColor: theme.colors.primary + "40",
      borderWidth: 2,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <ArrowLeft color={theme.colors.text} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Career Services</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Image
            source={require("../../../assets/menu/support-center.png")}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <View style={styles.heroOverlay}>
            <Text style={styles.heroTitle}>{careerCenter.name}</Text>
            <Text style={styles.heroDescription}>
              {careerCenter.description}
            </Text>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statsRow}>
            {careerStats.map((stat, index) => {
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

        {/* Career Services */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Career Services</Text>
          <View style={styles.servicesGrid}>
            {careerServices.map((service) => {
              const IconComponent = service.icon;
              return (
                <TouchableOpacity
                  key={service.id}
                  style={[
                    styles.serviceCard,
                    service.hasLink && styles.serviceCardWithLink,
                  ]}
                  onPress={() => handleServicePress(service)}
                  accessibilityLabel={`${service.name}: ${service.description}`}
                  accessibilityRole="button"
                >
                  <IconComponent
                    color={service.color}
                    size={32}
                    style={styles.serviceIcon}
                  />
                  <Text style={styles.serviceName}>{service.name}</Text>
                  <Text style={styles.serviceDescription}>
                    {service.description}
                  </Text>

                  {/* Clickable indicator */}
                  {service.hasLink && (
                    <View style={styles.clickableIndicator}>
                      <ExternalLink color={theme.colors.primary} size={16} />
                    </View>
                  )}
                  {!service.hasLink && (
                    <View style={styles.clickableIndicator}>
                      <ChevronRight color={theme.colors.primary} size={16} />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Job Opportunity Platforms */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Job Opportunity Platforms</Text>
          {jobPlatforms.map((platform) => (
            <TouchableOpacity
              key={platform.id}
              style={styles.platformCard}
              onPress={() => handlePlatformPress(platform)}
              activeOpacity={0.95}
              accessibilityLabel={`Visit ${platform.name}`}
              accessibilityRole="button"
            >
              <View style={styles.platformHeader}>
                <Image
                  source={{ uri: platform.logo }}
                  style={styles.platformLogo}
                />
                <View style={styles.platformInfo}>
                  <Text style={styles.platformName}>{platform.name}</Text>
                  <Text style={styles.platformType}>{platform.type}</Text>
                </View>
                <ExternalLink color={theme.colors.primary} size={24} />
              </View>

              <Text style={styles.platformDescription}>
                {platform.description}
              </Text>

              <TouchableOpacity
                style={styles.visitButton}
                onPress={() => handlePlatformPress(platform)}
                accessibilityLabel={`Visit ${platform.name} website`}
                accessibilityRole="button"
              >
                <ExternalLink color="white" size={18} />
                <Text style={styles.visitButtonText}>Visit Platform</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>

        {/* Career Resources */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Career Resources</Text>
          <View style={styles.resourcesCard}>
            <Text style={styles.resourcesTitle}>
              Comprehensive Career Resources
            </Text>
            <Text style={styles.resourcesDescription}>
              Access our extensive collection of career development resources,
              including guides, templates, and professional development materials
              to support your career journey.
            </Text>
            <TouchableOpacity
              style={styles.resourcesButton}
              onPress={handleResourcesPress}
              accessibilityLabel="Visit career resources website"
              accessibilityRole="button"
            >
              <ExternalLink color="white" size={18} />
              <Text style={styles.resourcesButtonText}>View Resources</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Meet the Director */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Meet the Assistant Director</Text>
          <View style={styles.directorCard}>
            <View style={styles.directorHeader}>
              <Image
                source={{ uri: careerCenter.director.avatar }}
                style={styles.directorAvatar}
              />
              <View style={styles.directorInfo}>
                <Text style={styles.directorName}>
                  {careerCenter.director.name}
                </Text>
                <Text style={styles.directorTitle}>
                  {careerCenter.director.title}
                </Text>
                <Text style={styles.directorExperience}>
                  {careerCenter.director.email}
                </Text>
              </View>
            </View>

            <View style={styles.contactInfo}>
              <View style={styles.contactRow}>
                <Clock
                  color={theme.colors.textSecondary}
                  size={20}
                  style={styles.contactIcon}
                />
                <Text style={styles.contactText}>{careerCenter.hours}</Text>
              </View>
              <View style={styles.contactRow}>
                <MapPin
                  color={theme.colors.textSecondary}
                  size={20}
                  style={styles.contactIcon}
                />
                <Text style={styles.contactText}>{careerCenter.location}</Text>
              </View>
              <View style={styles.contactRow}>
                <Phone
                  color={theme.colors.textSecondary}
                  size={20}
                  style={styles.contactIcon}
                />
                <Text style={styles.contactText}>{careerCenter.phone}</Text>
              </View>
              <View style={styles.contactRow}>
                <Mail
                  color={theme.colors.textSecondary}
                  size={20}
                  style={styles.contactIcon}
                />
                <Text style={styles.contactText}>{careerCenter.email}</Text>
              </View>
            </View>

            <View style={styles.contactActions}>
              <TouchableOpacity
                style={styles.contactButton}
                onPress={handleCallCenter}
                accessibilityLabel="Call career services"
                accessibilityRole="button"
              >
                <Phone color="white" size={20} />
                <Text style={styles.contactButtonText}>Call</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.contactButton, styles.contactButtonSecondary]}
                onPress={handleEmailCenter}
                accessibilityLabel="Email career services"
                accessibilityRole="button"
              >
                <Mail color={theme.colors.text} size={20} />
                <Text
                  style={[
                    styles.contactButtonText,
                    styles.contactButtonTextSecondary,
                  ]}
                >
                  Email
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
