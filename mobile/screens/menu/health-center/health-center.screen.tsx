import React, { JSX, useState } from "react";
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
  Linking,
  Modal,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  Heart,
  Stethoscope,
  UserCheck,
  Clock,
  MapPin,
  Phone,
  TriangleAlert as AlertTriangle,
  Shield,
  Activity,
  ExternalLink,
  Mail,
  ChevronRight,
  X,
  ZoomIn,
} from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";

/**
 * Interface for gallery images
 */
interface GalleryImage {
  id: number;
  title: string;
  image: string;
}

/**
 * Natembea Health Centre information
 */
const healthCenter = {
  name: "Natembea Health Centre",
  description:
    "The Natembea Health Centre provides basic medical care, health education, and first aid to the Ashesi community. It supports students with preventive care, minor treatments, and helps connect them with external clinics or hospitals when needed.",
  image: require("../../../assets/menu/support-center.png"),
  location: "Campus Health Building",
  phone: "+233 50 133 1668",
  emergencyPhone: "+233 50 133 1668",
  email: "healthcentre@ashesi.edu.gh",
  website: "https://ashesi.edu.gh/health-and-wellbeing/",
  hours: "24/7",
  currentStatus: "Open",
  director: {
    name: "Bridget Addo",
    position: "Director, Health Services",
    email: "babakah@ashesi.edu.gh",
  },
};

/**
 * Available health services at Natembea Health Centre
 */
const healthServices = [
  {
    id: 1,
    name: "First Aid & Basic Treatment",
    description: "Quick medical attention for minor injuries or illnesses",
    icon: Stethoscope,
    color: "#3b82f6",
    available: true,
  },
  {
    id: 2,
    name: "Emergency Care",
    description: "Emergency medical care and immediate assistance",
    icon: AlertTriangle,
    color: "#ef4444",
    available: true,
  },
  {
    id: 3,
    name: "Health Guidance & Counseling",
    description: "Health advice, counselling, and wellness education",
    icon: Heart,
    color: "#7c3aed",
    available: true,
  },
  {
    id: 4,
    name: "Referrals & Insurance Help",
    description:
      "Referrals for serious conditions and health insurance registration",
    icon: Shield,
    color: "#059669",
    available: true,
  },
];

/**
 * Medical staff information
 */
const medicalStaff = [
  {
    id: 1,
    name: "Bridget Addo",
    title: "Director, Health Services",
    specialization: "Health Services Management",
    avatar:
      "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400",
    email: "babakah@ashesi.edu.gh",
    availability: "Available",
    experience: "10+ years",
  },
];

/**
 * Gallery images for the health center
 */
const healthGallery: GalleryImage[] = [
  {
    id: 1,
    title: "Reception Area",
    image:
      "https://images.pexels.com/photos/263402/pexels-photo-263402.jpeg?auto=compress&cs=tinysrgb&w=500",
  },
  {
    id: 2,
    title: "Consultation Room",
    image:
      "https://images.pexels.com/photos/356040/pexels-photo-356040.jpeg?auto=compress&cs=tinysrgb&w=500",
  },
  {
    id: 3,
    title: "Medical Equipment",
    image:
      "https://images.pexels.com/photos/40568/medical-appointment-doctor-healthcare-40568.jpeg?auto=compress&cs=tinysrgb&w=500",
  },
  {
    id: 4,
    title: "Waiting Area",
    image:
      "https://images.pexels.com/photos/7088495/pexels-photo-7088495.jpeg?auto=compress&cs=tinysrgb&w=500",
  },
  {
    id: 5,
    title: "First Aid Station",
    image:
      "https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=500",
  },
  {
    id: 6,
    title: "Health Education Area",
    image:
      "https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=500",
  },
];

/**
 * Quick statistics for the health center
 */
const quickStats = [
  {
    label: "Services Available",
    value: "4",
    icon: Heart,
    color: "#ef4444",
  },
  {
    label: "Operating Hours",
    value: "24/7",
    icon: Clock,
    color: "#f59e0b",
  },
  {
    label: "Emergency Line",
    value: "Available",
    icon: AlertTriangle,
    color: "#ef4444",
  },
  {
    label: "Health Staff",
    value: "1",
    icon: UserCheck,
    color: "#3b82f6",
  },
];

/**
 * Health Center Screen Component
 *
 * Displays information about the Natembea Health Centre including:
 * - Hero section with overview
 * - Gallery of health center facilities
 * - Available health services
 * - Medical staff information
 * - Contact information and quick actions
 *
 * @returns {JSX.Element} The health center screen component
 */
export default function HealthCenterScreen(): JSX.Element {
  const { theme } = useTheme();
  const router = useRouter();

  // Screen state management
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [showAllGallery, setShowAllGallery] = useState<boolean>(false);

  /**
   * Handles pull-to-refresh functionality
   */
  const onRefresh = (): void => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  };

  /**
   * Handles service card press events
   * TODO: Implement actual service request functionality
   */
  const handleServicePress = (serviceId: number): void => {
    console.log("Requesting health service:", serviceId);
  };

  /**
   * Initiates emergency call
   */
  const handleEmergencyCall = (): void => {
    Linking.openURL(`tel:${healthCenter.emergencyPhone}`);
  };

  /**
   * Initiates call to health center
   */
  const handleCallCenter = (): void => {
    Linking.openURL(`tel:${healthCenter.phone}`);
  };

  /**
   * Opens email client to send email to health center
   */
  const handleEmailCenter = (): void => {
    Linking.openURL(`mailto:${healthCenter.email}`);
  };

  /**
   * Opens the health and wellbeing website
   */
  const handleWebsitePress = (): void => {
    Linking.openURL(healthCenter.website);
  };

  /**
   * Opens image in full-screen modal viewer
   */
  const handleImagePress = (image: GalleryImage): void => {
    setSelectedImage(image);
    setModalVisible(true);
  };

  /**
   * Closes the image modal viewer
   */
  const closeModal = (): void => {
    setModalVisible(false);
    setSelectedImage(null);
  };

  // Determine which gallery images to display
  const displayedGalleryImages = showAllGallery
    ? healthGallery
    : healthGallery.slice(0, 2);

  const styles = StyleSheet.create<{
    container: ViewStyle;
    header: ViewStyle;
    backButton: ViewStyle;
    headerTitle: TextStyle;
    emergencyButton: ViewStyle;
    emergencyButtonText: TextStyle;
    scrollContent: ViewStyle;
    heroSection: ViewStyle;
    heroImage: ImageStyle;
    heroOverlay: ViewStyle;
    heroTitle: TextStyle;
    heroDescription: TextStyle;
    statusBadge: ViewStyle;
    statusText: TextStyle;
    statsContainer: ViewStyle;
    statsRow: ViewStyle;
    statCard: ViewStyle;
    statIcon: ViewStyle;
    statValue: TextStyle;
    statLabel: TextStyle;
    sectionContainer: ViewStyle;
    sectionTitle: TextStyle;
    servicesGrid: ViewStyle;
    serviceCard: ViewStyle;
    serviceIcon: ViewStyle;
    serviceName: TextStyle;
    serviceDescription: TextStyle;
    waitTime: ViewStyle;
    waitTimeText: TextStyle;
    staffCard: ViewStyle;
    staffHeader: ViewStyle;
    staffAvatar: ImageStyle;
    staffInfo: ViewStyle;
    staffName: TextStyle;
    staffTitle: TextStyle;
    staffSpecialization: TextStyle;
    availabilityBadge: ViewStyle;
    availabilityText: TextStyle;
    staffMeta: ViewStyle;
    staffExperience: TextStyle;
    staffRating: ViewStyle;
    ratingText: TextStyle;
    bookButton: ViewStyle;
    bookButtonText: TextStyle;
    appointmentCard: ViewStyle;
    appointmentHeader: ViewStyle;
    appointmentTitle: TextStyle;
    appointmentStatus: ViewStyle;
    appointmentStatusText: TextStyle;
    appointmentDetails: TextStyle;
    healthTipCard: ViewStyle;
    tipHeader: ViewStyle;
    tipIcon: ViewStyle;
    tipTitle: TextStyle;
    tipDescription: TextStyle;
    contactCard: ViewStyle;
    contactInfo: ViewStyle;
    contactRow: ViewStyle;
    contactIcon: ViewStyle;
    contactText: TextStyle;
    contactActions: ViewStyle;
    contactButton: ViewStyle;
    contactButtonSecondary: ViewStyle;
    contactButtonText: TextStyle;
    contactButtonTextSecondary: TextStyle;
    sectionHeader: ViewStyle;
    viewMoreButton: ViewStyle;
    viewMoreText: TextStyle;
    galleryGrid: ViewStyle;
    galleryItem: ViewStyle;
    galleryImageContainer: ViewStyle;
    galleryImage: ImageStyle;
    galleryImageOverlay: ViewStyle;
    galleryZoomIcon: ViewStyle;
    galleryTitle: TextStyle;
    modalContainer: ViewStyle;
    modalBackdrop: ViewStyle;
    modalHeader: ViewStyle;
    modalCloseButton: ViewStyle;
    modalImage: ImageStyle;
    modalTitle: TextStyle;
    websiteButton: ViewStyle;
    websiteButtonText: TextStyle;
    staffEmail: TextStyle;
  }>({
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
    emergencyButton: {
      backgroundColor: "#ef4444",
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.xxxl,
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.xs,
    },
    emergencyButtonText: {
      ...theme.typography.bodySmall,
      color: "white",
      fontWeight: "700",
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
    statusBadge: {
      position: "absolute",
      top: theme.spacing.lg,
      right: theme.spacing.lg,
      backgroundColor: "#22c55e",
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.xxxl,
    },
    statusText: {
      ...theme.typography.captionSmall,
      color: "white",
      fontWeight: "700",
    },
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
    waitTime: {
      backgroundColor: theme.colors.accent + "20",
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: 2,
      borderRadius: theme.borderRadius.sm,
    },
    waitTimeText: {
      ...theme.typography.captionSmall,
      color: theme.colors.accent,
      fontWeight: "600",
    },
    staffCard: {
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
    staffHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: theme.spacing.md,
    },
    staffAvatar: {
      width: 45,
      height: 45,
      borderRadius: 30,
      marginRight: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.primary + "40",
    },
    staffInfo: {
      flex: 1,
    },
    staffName: {
      ...theme.typography.body,
      color: theme.colors.text,
      fontWeight: "700",
      marginBottom: 2,
    },
    staffTitle: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      marginBottom: 2,
    } as TextStyle,
    staffSpecialization: {
      ...theme.typography.bodySmall,
      color: theme.colors.primary,
      fontWeight: "600",
    },
    availabilityBadge: {
      backgroundColor: theme.colors.accent + "20",
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.lg,
      alignSelf: "flex-start",
      marginBottom: theme.spacing.md,
    },
    availabilityText: {
      ...theme.typography.bodySmall,
      color: theme.colors.accent,
      fontWeight: "600",
    },
    staffMeta: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: theme.spacing.md,
    },
    staffExperience: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
    } as TextStyle,
    staffRating: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.xs,
    },
    ratingText: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      fontWeight: "600",
    },
    bookButton: {
      backgroundColor: theme.colors.primary,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.lg,
      alignItems: "center",
    },
    bookButtonText: {
      ...theme.typography.button,
      color: "white",
      fontWeight: "600",
    },
    appointmentCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
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
    healthTipCard: {
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
    tipHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: theme.spacing.sm,
    },
    tipIcon: {
      marginRight: theme.spacing.md,
    },
    tipTitle: {
      ...theme.typography.body,
      color: theme.colors.text,
      fontWeight: "600",
    },
    tipDescription: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      lineHeight: 18,
    } as TextStyle,
    contactCard: {
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
    contactInfo: {
      marginBottom: theme.spacing.md,
    },
    contactRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: theme.spacing.md,
    },
    contactIcon: {
      marginRight: theme.spacing.md,
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
      paddingVertical: theme.spacing.md,
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
    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: theme.spacing.lg,
    },
    viewMoreButton: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.xs,
    },
    viewMoreText: {
      ...theme.typography.bodySmall,
      color: theme.colors.primary,
      fontWeight: "600",
    },
    galleryGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
      gap: theme.spacing.sm,
    },
    galleryItem: {
      width: "48%",
      marginBottom: theme.spacing.md,
    },
    galleryImageContainer: {
      position: "relative",
      borderRadius: theme.borderRadius.lg,
      overflow: "hidden",
    },
    galleryImage: {
      width: "100%",
      height: 120,
      borderRadius: theme.borderRadius.lg,
    },
    galleryImageOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0,0,0,0.3)",
      justifyContent: "center",
      alignItems: "center",
      opacity: 0,
    },
    galleryZoomIcon: {
      backgroundColor: "rgba(255,255,255,0.9)",
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.sm,
    },
    galleryTitle: {
      ...theme.typography.bodySmall,
      color: theme.colors.text,
      fontWeight: "600",
      textAlign: "center",
      marginTop: theme.spacing.sm,
      lineHeight: 18,
    } as TextStyle,
    modalContainer: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,1)",
    },
    modalBackdrop: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    modalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: theme.spacing.md,
      backgroundColor: "rgba(0,0,0,0.8)",
      position: "absolute",
      top: 50,
      left: 0,
      right: 0,
      zIndex: 1,
    },
    modalCloseButton: {
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.lg,
      backgroundColor: "rgba(255,255,255,0.2)",
    },
    modalImage: {
      width: Dimensions.get("window").width,
      height: Dimensions.get("window").height,
      resizeMode: "contain",
    },
    modalTitle: {
      ...theme.typography.h6,
      color: "white",
      fontWeight: "600",
      flex: 1,
      marginRight: theme.spacing.md,
    },
    websiteButton: {
      backgroundColor: theme.colors.accent,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.xxxl,
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.xs,
      marginBottom: theme.spacing.md,
    },
    websiteButtonText: {
      ...theme.typography.bodySmall,
      color: "white",
      fontWeight: "600",
    },
    staffEmail: {
      ...theme.typography.bodySmall,
      color: theme.colors.primary,
      fontWeight: "500",
    }
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
        <Text style={styles.headerTitle}>Health Center</Text>
        <TouchableOpacity
          style={styles.emergencyButton}
          onPress={handleEmergencyCall}
          accessibilityLabel="Emergency call"
          accessibilityRole="button"
        >
          <AlertTriangle color="white" size={16} />
          <Text style={styles.emergencyButtonText}>Emergency</Text>
        </TouchableOpacity>
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
            <Text style={styles.heroTitle}>{healthCenter.name}</Text>
            <Text style={styles.heroDescription}>
              {healthCenter.description}
            </Text>
          </View>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>{healthCenter.currentStatus}</Text>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statsRow}>
            {quickStats.map((stat, index) => {
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

        {/* Gallery Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Gallery</Text>
            {!showAllGallery && healthGallery.length > 2 && (
              <TouchableOpacity
                style={styles.viewMoreButton}
                onPress={() => setShowAllGallery(true)}
                accessibilityLabel={`View ${healthGallery.length - 2} more images`}
                accessibilityRole="button"
              >
                <Text style={styles.viewMoreText}>
                  View More ({healthGallery.length - 2})
                </Text>
                <ChevronRight color={theme.colors.primary} size={16} />
              </TouchableOpacity>
            )}
            {showAllGallery && (
              <TouchableOpacity
                style={styles.viewMoreButton}
                onPress={() => setShowAllGallery(false)}
                accessibilityLabel="Show fewer images"
                accessibilityRole="button"
              >
                <Text style={styles.viewMoreText}>Show Less</Text>
                <ChevronRight
                  color={theme.colors.primary}
                  size={16}
                  style={{ transform: [{ rotate: "270deg" }] }}
                />
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.galleryGrid}>
            {displayedGalleryImages.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.galleryItem}
                onPress={() => handleImagePress(item)}
                activeOpacity={0.8}
                accessibilityLabel={`View ${item.title} image`}
                accessibilityRole="button"
              >
                <View style={styles.galleryImageContainer}>
                  <Image
                    source={{ uri: item.image }}
                    style={styles.galleryImage}
                    resizeMode="cover"
                  />
                  <View style={styles.galleryImageOverlay}>
                    <View style={styles.galleryZoomIcon}>
                      <ZoomIn color={theme.colors.text} size={20} />
                    </View>
                  </View>
                </View>
                <Text style={styles.galleryTitle}>{item.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Health Services */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Health Services</Text>
          <View style={styles.servicesGrid}>
            {healthServices.map((service) => {
              const IconComponent = service.icon;
              return (
                <TouchableOpacity
                  key={service.id}
                  style={styles.serviceCard}
                  onPress={() => handleServicePress(service.id)}
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
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Medical Staff */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Medical Staff</Text>
          {medicalStaff.map((staff) => (
            <View key={staff.id} style={styles.staffCard}>
              <View style={styles.staffHeader}>
                <Image
                  source={{ uri: staff.avatar }}
                  style={styles.staffAvatar}
                />
                <View style={styles.staffInfo}>
                  <Text style={styles.staffName}>{staff.name}</Text>
                  <Text style={styles.staffTitle}>{staff.title}</Text>
                  <Text style={styles.staffSpecialization}>
                    {staff.specialization}
                  </Text>
                  <Text style={styles.staffEmail}>{staff.email}</Text>
                </View>
              </View>

              <View style={styles.availabilityBadge}>
                <Text style={styles.availabilityText}>
                  {staff.availability}
                </Text>
              </View>

              <View style={styles.staffMeta}>
                <Text style={styles.staffExperience}>
                  {staff.experience} experience
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Health & Wellbeing Resources */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Health & Wellbeing Resources</Text>
          <TouchableOpacity
            style={styles.websiteButton}
            onPress={handleWebsitePress}
            accessibilityLabel="Visit health and wellbeing website"
            accessibilityRole="button"
          >
            <ExternalLink color="white" size={16} />
            <Text style={styles.websiteButtonText}>Health & Wellbeing Portal</Text>
          </TouchableOpacity>
        </View>

        {/* Contact Information */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          <View style={styles.contactCard}>
            <View style={styles.contactInfo}>
              <View style={styles.contactRow}>
                <Clock
                  color={theme.colors.textSecondary}
                  size={20}
                  style={styles.contactIcon}
                />
                <Text style={styles.contactText}>{healthCenter.hours}</Text>
              </View>
              <View style={styles.contactRow}>
                <MapPin
                  color={theme.colors.textSecondary}
                  size={20}
                  style={styles.contactIcon}
                />
                <Text style={styles.contactText}>{healthCenter.location}</Text>
              </View>
              <View style={styles.contactRow}>
                <Phone
                  color={theme.colors.textSecondary}
                  size={20}
                  style={styles.contactIcon}
                />
                <Text style={styles.contactText}>{healthCenter.phone}</Text>
              </View>
              <View style={styles.contactRow}>
                <Mail
                  color={theme.colors.textSecondary}
                  size={20}
                  style={styles.contactIcon}
                />
                <Text style={styles.contactText}>{healthCenter.email}</Text>
              </View>
            </View>

            <View style={styles.contactActions}>
              <TouchableOpacity
                style={styles.contactButton}
                onPress={handleCallCenter}
                accessibilityLabel="Call health center"
                accessibilityRole="button"
              >
                <Phone color="white" size={20} />
                <Text style={styles.contactButtonText}>Call</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.contactButton, styles.contactButtonSecondary]}
                onPress={handleEmailCenter}
                accessibilityLabel="Email health center"
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

      {/* Full-Screen Image Modal */}
      <Modal
        visible={modalVisible}
        transparent={false}
        animationType="fade"
        onRequestClose={closeModal}
        accessibilityViewIsModal={true}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.modalBackdrop}
            onPress={closeModal}
            activeOpacity={1}
            accessibilityLabel="Close image viewer"
            accessibilityRole="button"
          />
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {selectedImage?.title || "Gallery Image"}
            </Text>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={closeModal}
              accessibilityLabel="Close image viewer"
              accessibilityRole="button"
            >
              <X color="white" size={24} />
            </TouchableOpacity>
          </View>
          {selectedImage && (
            <Image
              source={{ uri: selectedImage.image }}
              style={styles.modalImage}
              resizeMode="contain"
              accessibilityLabel={selectedImage.title}
            />
          )}
        </View>
      </Modal>
    </SafeAreaView>
  );
}
