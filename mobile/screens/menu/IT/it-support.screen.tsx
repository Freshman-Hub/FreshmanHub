import { useTheme } from "@/contexts/ThemeContext";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  Bed,
  ChevronRight,
  Droplets,
  Hammer,
  Laptop,
  Mail,
  Phone,
  Settings,
  Shield,
  Wifi,
  X,
  Zap,
  ZoomIn,
} from "lucide-react-native";
import React, { JSX, useState } from "react";
import {
  Dimensions,
  Image,
  ImageStyle,
  Linking,
  Modal,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

/**
 * Interface for support center contact information and operational details
 */
interface SupportCenter {
  name: string;
  description: string;
  image: any;
  location: string;
  phone: string;
  email: string;
  hours: Record<string, string>;
  currentStatus: string;
  averageWaitTime: string;
  ticketsToday: number;
  resolvedToday: number;
}

/**
 * Interface for support service items
 */
interface SupportService {
  id: number;
  name: string;
  description: string;
  icon: any;
  color: string;
  available: boolean;
  estimatedTime: string;
  category: "IT Services" | "Hostel Services";
}

/**
 * Interface for gallery image items
 */
interface GalleryImage {
  id: number;
  title: string;
  image: any;
}

/**
 * Support center configuration data
 * Contains all the operational information for the Ashesi Support Center
 */
const supportCenter: SupportCenter = {
  name: "Ashesi Support Center",
  description:
    "The Ashesi Support Centre helps students with all technology-related issues on campus. From setting up email accounts and fixing Wi-Fi problems to assisting with laptops and school platforms like Outlook or Canvas.",
  image: require("../../../assets/menu/support-center.png"),
  location: "Support Center",
  phone: "+233 302 610 330",
  email: "supportcentre@ashesi.edu.gh",
  hours: {
    monday: "8:00 AM - 5:00 PM",
    tuesday: "8:00 AM - 5:00 PM",
    wednesday: "8:00 AM - 5:00 PM",
    thursday: "8:00 AM - 5:00 PM",
    friday: "8:00 AM - 5:00 PM",
    saturday: "Closed",
    sunday: "Closed",
  },
  currentStatus: "Open",
  averageWaitTime: "30 minutes",
  ticketsToday: 23,
  resolvedToday: 18,
};

/**
 * Available support services configuration
 * Includes both IT and Hostel services with their respective details
 */
const supportServices: SupportService[] = [
  {
    id: 1,
    name: "Laptop Repair",
    description: "Hardware and software repair for laptops and notebooks",
    icon: Laptop,
    color: "#3b82f6",
    available: true,
    estimatedTime: "2-3 days",
    category: "IT Services",
  },
  {
    id: 2,
    name: "Internet Connection",
    description: "WiFi setup, network troubleshooting, and connectivity issues",
    icon: Wifi,
    color: "#059669",
    available: true,
    estimatedTime: "30 minutes",
    category: "IT Services",
  },
  {
    id: 3,
    name: "Software Installation",
    description: "Install and configure software for academic use",
    icon: Settings,
    color: "#dc2626",
    available: true,
    estimatedTime: "1 hour",
    category: "IT Services",
  },
  {
    id: 4,
    name: "Room Maintenance",
    description:
      "Hostel room repairs, plumbing, electrical, and furniture issues",
    icon: Hammer,
    color: "#f59e0b",
    available: true,
    estimatedTime: "1-2 days",
    category: "Hostel Services",
  },
  {
    id: 5,
    name: "Electrical Issues",
    description: "Power outlets, lighting, and electrical problems in rooms",
    icon: Zap,
    color: "#7c3aed",
    available: true,
    estimatedTime: "4-6 hours",
    category: "Hostel Services",
  },
  {
    id: 6,
    name: "Plumbing Services",
    description: "Water supply, drainage, and bathroom maintenance",
    icon: Droplets,
    color: "#0891b2",
    available: true,
    estimatedTime: "2-4 hours",
    category: "Hostel Services",
  },
  {
    id: 7,
    name: "Furniture Repair",
    description: "Bed, desk, chair, and other furniture maintenance",
    icon: Bed,
    color: "#059669",
    available: true,
    estimatedTime: "1-2 days",
    category: "Hostel Services",
  },
  {
    id: 8,
    name: "Security Issues",
    description: "Malware removal, antivirus setup, and security concerns",
    icon: Shield,
    color: "#ef4444",
    available: true,
    estimatedTime: "1-2 hours",
    category: "IT Services",
  },
];

/**
 * Gallery images for the support center
 * Showcases different areas and facilities of the support center
 */
const galleryImages: GalleryImage[] = [
  {
    id: 1,
    title: "Support Center Main Desk",
    image: require("../../../assets/menu/support-center.png"),
  },
  {
    id: 2,
    title: "IT Help Station",
    image: require("../../../assets/menu/ashesi-1.jpeg"),
  },
  {
    id: 3,
    title: "Laptop Repair Area",
    image: require("../../../assets/menu/support-center.png"),
  },
  {
    id: 4,
    title: "Student Assistance Zone",
    image: require("../../../assets/menu/support-center.png"),
  },
  {
    id: 5,
    title: "Network Operations Center",
    image: require("../../../assets/menu/support-center.png"),
  },
  {
    id: 6,
    title: "Software Installation Bay",
    image: require("../../../assets/menu/support-center.png"),
  },
  {
    id: 7,
    title: "Hardware Testing Lab",
    image: require("../../../assets/menu/support-center.png"),
  },
  {
    id: 8,
    title: "Student Waiting Area",
    image: require("../../../assets/menu/support-center.png"),
  },
];

/**
 * IT Support Screen Component
 *
 * A comprehensive screen that displays information about the Ashesi Support Center,
 * including available services, gallery, contact information, and operational hours.
 * Features include:
 * - Service filtering by category and search
 * - Image gallery with modal viewer
 * - Contact integration (phone/email)
 * - External help documentation link
 *
 * @returns {JSX.Element} The IT Support screen component
 */
export default function ITSupportScreen(): JSX.Element {
  const { theme } = useTheme();
  const router = useRouter();

  // Screen state management
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [showAllImages, setShowAllImages] = useState<boolean>(false);

  // Service categories for filtering
  const categories = ["All", "IT Services", "Hostel Services"];

  /**
   * Handles pull-to-refresh functionality
   * Simulates data refresh with a 2-second delay
   */
  const onRefresh = (): void => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  };

  /**
   * Handles service card press events
   * TODO: Implement actual service request functionality
   *
   * @param {number} serviceId - The ID of the selected service
   */
  const handleServicePress = (serviceId: number): void => {
    console.log("Requesting support service:", serviceId);
    // TODO: Navigate to service request form or open contact modal
  };

  /**
   * Initiates a phone call to the support center
   * Uses the device's default phone app
   */
  const handleCallSupport = (): void => {
    Linking.openURL(`tel:${supportCenter.phone}`);
  };

  /**
   * Opens the default email client with the support center email
   */
  const handleEmailSupport = (): void => {
    Linking.openURL(`mailto:${supportCenter.email}`);
  };

  /**
   * Opens the external help documentation website
   */
  const handleHelpDocsPress = (): void => {
    Linking.openURL(`https://ashesi.helpscoutdocs.com/`);
  };

  /**
   * Gets the current day of the week in lowercase
   * Used to highlight current day in operating hours
   *
   * @returns {string} Current day of the week
   */
  const getCurrentDay = (): string => {
    const days = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];
    return days[new Date().getDay()];
  };

  /**
   * Opens the image modal viewer
   *
   * @param {GalleryImage} image - The image object to display
   */
  const handleImagePress = (image: GalleryImage): void => {
    setSelectedImage(image);
    setModalVisible(true);
  };

  /**
   * Closes the image modal viewer and resets state
   */
  const closeModal = (): void => {
    setModalVisible(false);
    setSelectedImage(null);
  };

  // Filter services based on category and search query
  const filteredServices = supportServices.filter((service) => {
    const matchesCategory =
      selectedCategory === "All" || service.category === selectedCategory;
    const matchesSearch =
      searchQuery === "" ||
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  // Determine which images to display based on showAllImages state
  const displayedImages = showAllImages
    ? galleryImages
    : galleryImages.slice(0, 2);

  const styles = StyleSheet.create<{
    container: ViewStyle;
    header: ViewStyle;
    backButton: ViewStyle;
    headerTitle: TextStyle;
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
    searchContainer: ViewStyle;
    searchInput: TextStyle;
    categoriesContainer: ViewStyle;
    categoriesScroll: ViewStyle;
    categoryChip: ViewStyle;
    categoryChipActive: ViewStyle;
    categoryChipText: TextStyle;
    categoryChipTextActive: TextStyle;
    sectionContainer: ViewStyle;
    sectionTitle: TextStyle;
    sectionHeader: ViewStyle;
    viewMoreButton: ViewStyle;
    viewMoreText: TextStyle;
    servicesGrid: ViewStyle;
    serviceCard: ViewStyle;
    serviceIcon: ViewStyle;
    serviceName: TextStyle;
    serviceDescription: TextStyle;
    serviceCategory: ViewStyle;
    serviceCategoryText: TextStyle;
    estimatedTime: ViewStyle;
    estimatedTimeText: TextStyle;
    galleryScroll: ViewStyle;
    galleryGrid: ViewStyle;
    galleryItem: ViewStyle;
    galleryImageContainer: ViewStyle;
    galleryImage: ImageStyle;
    galleryImageOverlay: ViewStyle;
    galleryZoomIcon: ViewStyle;
    galleryTitle: TextStyle;
    modalContainer: ViewStyle;
    modalBackdrop: ViewStyle;
    modalContent: ViewStyle;
    modalHeader: ViewStyle;
    modalCloseButton: ViewStyle;
    modalImage: ImageStyle;
    modalTitle: TextStyle;
    helpDocsButton: ViewStyle;
    helpDocsContent: ViewStyle;
    helpDocsIcon: ViewStyle;
    helpDocsText: ViewStyle;
    helpDocsTitle: TextStyle;
    helpDocsDescription: TextStyle;
    contactCard: ViewStyle;
    hoursContainer: ViewStyle;
    hoursRow: ViewStyle;
    dayText: TextStyle;
    hoursText: TextStyle;
    currentDay: ViewStyle;
    contactActions: ViewStyle;
    contactButton: ViewStyle;
    contactButtonSecondary: ViewStyle;
    contactButtonText: TextStyle;
    contactButtonTextSecondary: TextStyle;
    noResultsContainer: ViewStyle;
    noResultsText: TextStyle;
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
      ...theme.typography.h5,
      color: theme.colors.text,
      fontWeight: "700",
      flex: 1,
    },
    scrollContent: {
      paddingBottom: theme.spacing.md,
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
    searchContainer: {
      paddingHorizontal: theme.spacing.lg,
      marginBottom: theme.spacing.md,
    },
    searchInput: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xxl,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.sm,
      borderWidth: 1,
      borderColor: theme.colors.border,
      ...theme.typography.body,
      color: theme.colors.text,
    } as TextStyle,
    categoriesContainer: {
      paddingHorizontal: theme.spacing.lg,
      marginBottom: theme.spacing.lg,
    },
    categoriesScroll: {
      flexDirection: "row",
      gap: theme.spacing.sm,
    },
    categoryChip: {
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.xxxl,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    categoryChipActive: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    categoryChipText: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      fontWeight: "600",
    },
    categoryChipTextActive: {
      color: "white",
      fontWeight: "700",
    },
    sectionContainer: {
      paddingHorizontal: theme.spacing.md,
      marginBottom: theme.spacing.md,
    },
    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: theme.spacing.lg,
    },
    sectionTitle: {
      ...theme.typography.h5,
      color: theme.colors.text,
      fontWeight: "700",
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
    serviceCategory: {
      backgroundColor: theme.colors.primary + "20",
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: 2,
      borderRadius: theme.borderRadius.sm,
      marginBottom: theme.spacing.sm,
    },
    serviceCategoryText: {
      ...theme.typography.captionSmall,
      color: theme.colors.primary,
      fontWeight: "600",
    },
    estimatedTime: {
      backgroundColor: theme.colors.accent + "20",
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: 2,
      borderRadius: theme.borderRadius.sm,
    },
    estimatedTimeText: {
      ...theme.typography.captionSmall,
      color: theme.colors.accent,
      fontWeight: "600",
    },
    galleryScroll: {
      paddingRight: theme.spacing.md,
      gap: theme.spacing.md,
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
    modalContent: {
      flex: 1,
      backgroundColor: "black",
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
    helpDocsButton: {
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
    helpDocsContent: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.md,
    },
    helpDocsIcon: {
      width: 48,
      height: 48,
      borderRadius: theme.borderRadius.lg,
      backgroundColor: theme.colors.primary + "20",
      alignItems: "center",
      justifyContent: "center",
    },
    helpDocsText: {
      flex: 1,
    },
    helpDocsTitle: {
      ...theme.typography.body,
      color: theme.colors.text,
      fontWeight: "600",
      marginBottom: 4,
    },
    helpDocsDescription: {
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
    hoursContainer: {
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.lg,
    },
    hoursRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingVertical: theme.spacing.xs,
    },
    dayText: {
      ...theme.typography.bodySmall,
      color: theme.colors.text,
      fontWeight: "600",
      textTransform: "capitalize",
    },
    hoursText: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
    } as TextStyle,
    currentDay: {
      backgroundColor: theme.colors.primary + "20",
      paddingHorizontal: theme.spacing.sm,
      borderRadius: theme.borderRadius.sm,
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
    noResultsContainer: {
      alignItems: "center",
      paddingVertical: theme.spacing.xxl,
    },
    noResultsText: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
      textAlign: "center",
    } as TextStyle,
  });

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      
      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <ArrowLeft color={theme.colors.text} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Support Center</Text>
      </View>

      {/* Main Content Scroll View */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Section - Support Center Overview */}
        <View style={styles.heroSection}>
          <Image
            source={supportCenter.image}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <View style={styles.heroOverlay}>
            <Text style={styles.heroTitle}>{supportCenter.name}</Text>
            <Text style={styles.heroDescription}>
              {supportCenter.description}
            </Text>
          </View>

          {/* Status Badge */}
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>{supportCenter.currentStatus}</Text>
          </View>
        </View>

        {/* Search Section */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search for help or describe your issue..."
            placeholderTextColor={theme.colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            accessibilityLabel="Search services"
          />
        </View>

        {/* Category Filter Section */}
        <View style={styles.categoriesContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesScroll}
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryChip,
                  selectedCategory === category && styles.categoryChipActive,
                ]}
                onPress={() => setSelectedCategory(category)}
                accessibilityLabel={`Filter by ${category}`}
                accessibilityRole="button"
              >
                <Text
                  style={[
                    styles.categoryChipText,
                    selectedCategory === category &&
                      styles.categoryChipTextActive,
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Support Services Grid */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Support Services</Text>
          {filteredServices.length > 0 ? (
            <View style={styles.servicesGrid}>
              {filteredServices.map((service) => {
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
                    {/* Service Category Badge */}
                    <View style={styles.serviceCategory}>
                      <Text style={styles.serviceCategoryText}>
                        {service.category}
                      </Text>
                    </View>
                    {/* Estimated Time Badge */}
                    <View style={styles.estimatedTime}>
                      <Text style={styles.estimatedTimeText}>
                        {service.estimatedTime}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : (
            // No Results State
            <View style={styles.noResultsContainer}>
              <Text style={styles.noResultsText}>
                No services found for &quot;{searchQuery}&quot;
              </Text>
            </View>
          )}
        </View>

        {/* Gallery Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Gallery</Text>
            
            {/* View More/Less Toggle Button */}
            {!showAllImages && galleryImages.length > 2 && (
              <TouchableOpacity
                style={styles.viewMoreButton}
                onPress={() => setShowAllImages(true)}
                accessibilityLabel={`View ${galleryImages.length - 2} more images`}
                accessibilityRole="button"
              >
                <Text style={styles.viewMoreText}>
                  View More ({galleryImages.length - 2})
                </Text>
                <ChevronRight color={theme.colors.primary} size={16} />
              </TouchableOpacity>
            )}
            {showAllImages && (
              <TouchableOpacity
                style={styles.viewMoreButton}
                onPress={() => setShowAllImages(false)}
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

          {/* Gallery Grid */}
          <View style={styles.galleryGrid}>
            {displayedImages.map((item) => (
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
                    source={item.image}
                    style={styles.galleryImage}
                    resizeMode="cover"
                  />
                  {/* Zoom Overlay */}
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

        {/* Help Documentation Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Help Documentation</Text>
          <TouchableOpacity
            style={styles.helpDocsButton}
            onPress={handleHelpDocsPress}
            accessibilityLabel="Browse help articles and documentation"
            accessibilityRole="button"
          >
            <View style={styles.helpDocsContent}>
              <View style={styles.helpDocsIcon}>
                <Mail color={theme.colors.primary} size={24} />
              </View>
              <View style={styles.helpDocsText}>
                <Text style={styles.helpDocsTitle}>Browse Help Articles</Text>
                <Text style={styles.helpDocsDescription}>
                  Access our comprehensive knowledge base with step-by-step
                  guides and FAQs
                </Text>
              </View>
              <ArrowLeft
                color={theme.colors.textSecondary}
                size={20}
                style={{ transform: [{ rotate: "180deg" }] }}
              />
            </View>
          </TouchableOpacity>
        </View>

        {/* Contact Information and Operating Hours */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Contact & Hours</Text>
          <View style={styles.contactCard}>

            {/* Operating Hours */}
            <View style={styles.hoursContainer}>
              {Object.entries(supportCenter.hours).map(([day, hours]) => {
                const currentDay = getCurrentDay();
                return (
                  <View
                    key={day}
                    style={[
                      styles.hoursRow,
                      day === currentDay && styles.currentDay, // Highlight current day
                    ]}
                  >
                    <Text style={styles.dayText}>{day}</Text>
                    <Text style={styles.hoursText}>{hours}</Text>
                  </View>
                );
              })}
            </View>

            {/* Contact Action Buttons */}
            <View style={styles.contactActions}>
              <TouchableOpacity
                style={styles.contactButton}
                onPress={handleCallSupport}
                accessibilityLabel={`Call support at ${supportCenter.phone}`}
                accessibilityRole="button"
              >
                <Phone color="white" size={20} />
                <Text style={styles.contactButtonText}>Call Support</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.contactButton, styles.contactButtonSecondary]}
                onPress={handleEmailSupport}
                accessibilityLabel={`Email support at ${supportCenter.email}`}
                accessibilityRole="button"
              >
                <Mail color={theme.colors.text} size={20} />
                <Text
                  style={[
                    styles.contactButtonText,
                    styles.contactButtonTextSecondary,
                  ]}
                >
                  Email Support
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

          {/* Backdrop Touch Area */}
          <TouchableOpacity
            style={styles.modalBackdrop}
            onPress={closeModal}
            activeOpacity={1}
            accessibilityLabel="Close image viewer"
            accessibilityRole="button"
          />

          {/* Modal Header */}
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
          
          {/* Full-Screen Image */}
          {selectedImage && (
            <Image
              source={selectedImage.image}
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
