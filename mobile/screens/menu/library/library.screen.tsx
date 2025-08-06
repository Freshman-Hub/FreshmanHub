import { useTheme } from "@/contexts/ThemeContext";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  ChevronRight,
  Clock,
  Computer,
  ExternalLink,
  Mail,
  MapPin,
  Printer,
  Search,
  Volume2,
  VolumeX,
  X,
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
 * Interface for gallery images
 */
interface GalleryImage {
  id: number;
  title: string;
  image: string;
}

/**
 * Todd and Ruth Warren Library information
 */
const libraryInfo = {
  name: "Todd and Ruth Warren Library",
  description:
    "The Warren Library supports student learning through a range of physical and digital resources, quiet and group study areas, and help with research and academic assignments.",
  image: require("../../../assets/menu/support-center.png"),
  location: "Central Campus",
  email: "warrenlibrary@ashesi.edu.gh",
  website: "https://ashesi.edu.gh/library/",
  catalogueLink: "https://ashesi.edu.gh/library/",
  printingLink:
    "https://invence.ashesi.local:9192/app?service=page/UserWebPrint",
  hours: "24/7 Access to Main Areas",
  studyRoomsAvailable: 3,
  studyAreasAvailable: 4,
};

/**
 * Available library services
 */
const libraryServices = [
  {
    id: 1,
    name: "Physical & Digital Resources",
    description:
      "Access to physical and digital academic resources to support learning",
    icon: BookOpen,
    color: "#3b82f6",
    available: true,
    link: libraryInfo.website,
  },
  {
    id: 2,
    name: "Research Help",
    description:
      "Providing quiet spaces, research help, and academic tools for assignments",
    icon: Search,
    color: "#7c3aed",
    available: true,
  },
  {
    id: 3,
    name: "Lost & Found",
    description: "Helping students recover misplaced items on campus",
    icon: MapPin,
    color: "#f59e0b",
    available: true,
  },
  {
    id: 4,
    name: "Study Room Reservations",
    description: "Reserve one of our 3 available study rooms",
    icon: Calendar,
    color: "#059669",
    available: true,
    link: "https://opac.ashesi.edu.gh/",
  },
  {
    id: 5,
    name: "Computer Lab",
    description: "Access computers with software for academic work",
    icon: Computer,
    color: "#dc2626",
    available: true,
  },
  {
    id: 6,
    name: "Printing Services",
    description:
      "Print documents, assignments, and research papers (Requires Ashesi WiFi)",
    icon: Printer,
    color: "#0891b2",
    available: true,
    link: libraryInfo.printingLink,
  },
];

/**
 * Study room booking options
 */
const studyRooms = [
  {
    id: 1,
    name: "Joseph and Miyuki Dadzie Seminar Room",
    roomNumber: "301",
    description: "Seminar room perfect for group discussions and presentations",
    bookingLink:
      "https://warrenlibraryseminarroom.simplybook.me/v2/#book/service/2/count/1/",
    capacity: "12-15 people",
    features: ["Projector", "Whiteboard", "Conference Table"],
  },
  {
    id: 2,
    name: "Catherine and Patrick Awuah Snr. Seminar Room",
    roomNumber: "302",
    description: "Comfortable seminar space for collaborative work",
    bookingLink:
      "https://warrenlibraryseminarroom.simplybook.me/v2/#book/service/3/count/1/",
    capacity: "12-15 people",
    features: ["Projector", "Whiteboard", "Conference Table"],
  },
  {
    id: 3,
    name: "Literature Search Training",
    roomNumber: "Training",
    description:
      "Learn to navigate electronic resources and use Zotero for research",
    bookingLink:
      "https://warrenlibraryseminarroom.simplybook.me/v2/#book/service/1/count/1/",
    capacity: "Training Session",
    features: ["Computer Access", "Research Training", "Zotero Support"],
  },
];

/**
 * Study areas available without reservation
 */
const studyAreas = [
  {
    id: 1,
    name: "Silent Study Zone",
    floor: "Ground Floor",
    description: "Quiet individual study area",
    features: ["No Talking", "Individual Desks", "Power Outlets"],
    icon: VolumeX,
    color: "#dc2626",
  },
  {
    id: 2,
    name: "Collaborative Study Area",
    floor: "1st Floor",
    description: "Group discussion and collaborative work space",
    features: ["Group Discussion", "Whiteboards", "Comfortable Seating"],
    icon: Volume2,
    color: "#059669",
  },
  {
    id: 3,
    name: "Computer Lab",
    floor: "2nd Floor",
    description: "Computer access and digital resources",
    features: ["Desktop Computers", "Software Access", "Printing"],
    icon: Computer,
    color: "#3b82f6",
  },
  {
    id: 4,
    name: "Reading Lounge",
    floor: "3rd Floor",
    description: "Comfortable reading and study environment",
    features: ["Comfortable Chairs", "Natural Light", "Quiet Environment"],
    icon: BookOpen,
    color: "#7c3aed",
  },
];

/**
 * Gallery images for the library
 */
const libraryGallery: GalleryImage[] = [
  {
    id: 1,
    title: "Main Reading Hall",
    image:
      "https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=500",
  },
  {
    id: 2,
    title: "Study Areas",
    image:
      "https://images.pexels.com/photos/1925536/pexels-photo-1925536.jpeg?auto=compress&cs=tinysrgb&w=500",
  },
  {
    id: 3,
    title: "Computer Lab",
    image:
      "https://images.pexels.com/photos/2777898/pexels-photo-2777898.jpeg?auto=compress&cs=tinysrgb&w=500",
  },
  {
    id: 4,
    title: "Seminar Rooms",
    image:
      "https://images.pexels.com/photos/416320/pexels-photo-416320.jpeg?auto=compress&cs=tinysrgb&w=500",
  },
  {
    id: 5,
    title: "Book Collection",
    image:
      "https://images.pexels.com/photos/159832/book-reading-reading-book-open-159832.jpeg?auto=compress&cs=tinysrgb&w=500",
  },
  {
    id: 6,
    title: "Quiet Study Zones",
    image:
      "https://images.pexels.com/photos/1925536/pexels-photo-1925536.jpeg?auto=compress&cs=tinysrgb&w=500",
  },
];

/**
 * Quick statistics for the library
 */
const quickStats = [
  {
    label: "Study Rooms",
    value: "3",
    icon: Calendar,
    color: "#3b82f6",
  },
  {
    label: "Study Areas",
    value: "4",
    icon: MapPin,
    color: "#059669",
  },
  {
    label: "Services",
    value: "6",
    icon: BookOpen,
    color: "#7c3aed",
  },
  {
    label: "Access Hours",
    value: "24/7",
    icon: Clock,
    color: "#f59e0b",
  },
];

/**
 * Library Screen Component
 *
 * Displays information about the Todd and Ruth Warren Library including:
 * - Hero section with library overview
 * - Gallery of library facilities
 * - Available services and resources
 * - Study room reservations
 * - Study areas information
 * - Contact information
 *
 * @returns {JSX.Element} The library screen component
 */
export default function LibraryScreen(): JSX.Element {
  const { theme } = useTheme();
  const router = useRouter();

  // Screen state management
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
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
   */
  const handleServicePress = (service: any): void => {
    if (service.link) {
      Linking.openURL(service.link);
    } else {
      console.log("Accessing service:", service.id);
    }
  };

  /**
   * Handles study room booking
   */
  const handleBookRoom = (room: any): void => {
    Linking.openURL(room.bookingLink);
  };

  /**
   * Opens email client to contact library
   */
  const handleEmailLibrary = (): void => {
    Linking.openURL(`mailto:${libraryInfo.email}`);
  };

  /**
   * Opens library website
   */
  const handleWebsitePress = (): void => {
    Linking.openURL(libraryInfo.website);
  };

  /**
   * Opens library catalogue
   */
  const handleCataloguePress = (): void => {
    Linking.openURL(libraryInfo.catalogueLink);
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
    ? libraryGallery
    : libraryGallery.slice(0, 2);

  const styles = StyleSheet.create<{
    container: ViewStyle;
    header: ViewStyle;
    backButton: ViewStyle;
    headerTitle: TextStyle;
    websiteButton: ViewStyle;
    websiteButtonText: TextStyle;
    scrollContent: ViewStyle;
    heroSection: ViewStyle;
    heroImage: ImageStyle;
    heroOverlay: ViewStyle;
    heroTitle: TextStyle;
    heroDescription: TextStyle;
    statsContainer: ViewStyle;
    statsRow: ViewStyle;
    statCard: ViewStyle;
    statIcon: ViewStyle;
    statValue: TextStyle;
    statLabel: TextStyle;
    searchContainer: ViewStyle;
    searchInput: TextStyle;
    sectionContainer: ViewStyle;
    sectionTitle: TextStyle;
    servicesGrid: ViewStyle;
    serviceCard: ViewStyle;
    serviceCardDisabled: ViewStyle;
    serviceIcon: ViewStyle;
    serviceName: TextStyle;
    serviceDescription: TextStyle;
    unavailableBadge: ViewStyle;
    unavailableText: TextStyle;
    studyAreaCard: ViewStyle;
    studyAreaHeader: ViewStyle;
    studyAreaInfo: ViewStyle;
    studyAreaName: TextStyle;
    studyAreaFloor: TextStyle;
    occupancyBadge: ViewStyle;
    occupancyText: TextStyle;
    featuresContainer: ViewStyle;
    featureTag: ViewStyle;
    featureText: TextStyle;
    bookButton: ViewStyle;
    bookButtonText: TextStyle;
    bookCard: ViewStyle;
    bookHeader: ViewStyle;
    bookImage: ImageStyle;
    bookInfo: ViewStyle;
    bookTitle: TextStyle;
    bookAuthor: TextStyle;
    bookCategory: TextStyle;
    bookMeta: ViewStyle;
    bookLocation: TextStyle;
    availabilityBadge: ViewStyle;
    availableText: TextStyle;
    hoursCard: ViewStyle;
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
    studyRoomCard: ViewStyle;
    roomHeader: ViewStyle;
    roomName: TextStyle;
    roomNumber: TextStyle;
    roomDescription: TextStyle;
    roomMeta: ViewStyle;
    roomCapacity: TextStyle;
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
    websiteButton: {
      backgroundColor: theme.colors.primary,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.xxxl,
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.xs,
    },
    websiteButtonText: {
      ...theme.typography.bodySmall,
      color: "white",
      fontWeight: "600",
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
    serviceCardDisabled: {
      opacity: 0.6,
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
      lineHeight: 18,
    } as TextStyle,
    unavailableBadge: {
      backgroundColor: "#ef4444",
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: 2,
      borderRadius: theme.borderRadius.sm,
      marginTop: theme.spacing.sm,
    },
    unavailableText: {
      ...theme.typography.captionSmall,
      color: "white",
      fontWeight: "600",
    },
    studyAreaCard: {
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
    studyAreaHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: theme.spacing.md,
    },
    studyAreaInfo: {
      flex: 1,
    },
    studyAreaName: {
      ...theme.typography.body,
      color: theme.colors.text,
      fontWeight: "700",
      marginBottom: 4,
    },
    studyAreaFloor: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
    } as TextStyle,
    occupancyBadge: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.lg,
    },
    occupancyText: {
      ...theme.typography.bodySmall,
      color: "white",
      fontWeight: "600",
    },
    featuresContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.md,
    },
    featureTag: {
      backgroundColor: theme.colors.background,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    featureText: {
      ...theme.typography.bodySmall,
      color: theme.colors.text,
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
    bookCard: {
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
    bookHeader: {
      flexDirection: "row",
      marginBottom: theme.spacing.md,
    },
    bookImage: {
      width: 60,
      height: 80,
      borderRadius: theme.borderRadius.md,
      marginRight: theme.spacing.md,
    },
    bookInfo: {
      flex: 1,
    },
    bookTitle: {
      ...theme.typography.body,
      color: theme.colors.text,
      fontWeight: "700",
      marginBottom: 4,
    },
    bookAuthor: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      marginBottom: 4,
      fontWeight: "500",
    },
    bookCategory: {
      ...theme.typography.bodySmall,
      color: theme.colors.primary,
      fontWeight: "600",
    },
    bookMeta: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    bookLocation: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
    } as TextStyle,
    availabilityBadge: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.lg,
    },
    availableText: {
      ...theme.typography.bodySmall,
      color: "white",
      fontWeight: "600",
    },
    hoursCard: {
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
    studyRoomCard: {
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
    roomHeader: {
      marginBottom: theme.spacing.md,
    },
    roomName: {
      ...theme.typography.body,
      color: theme.colors.text,
      fontWeight: "700",
      marginBottom: 4,
    },
    roomNumber: {
      ...theme.typography.bodySmall,
      color: theme.colors.primary,
      fontWeight: "600",
      marginBottom: theme.spacing.sm,
    },
    roomDescription: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      lineHeight: 18,
      marginBottom: theme.spacing.md,
    } as TextStyle,
    roomMeta: {
      marginBottom: theme.spacing.md,
    },
    roomCapacity: {
      ...theme.typography.bodySmall,
      color: theme.colors.text,
      fontWeight: "600",
      marginBottom: theme.spacing.sm,
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
        <Text style={styles.headerTitle}>Library</Text>
        <TouchableOpacity
          style={styles.websiteButton}
          onPress={handleCataloguePress}
          accessibilityLabel="Open library catalogue"
          accessibilityRole="button"
        >
          <ExternalLink color="white" size={16} />
          <Text style={styles.websiteButtonText}>Catalogue</Text>
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
            <Text style={styles.heroTitle}>{libraryInfo.name}</Text>
            <Text style={styles.heroDescription}>
              {libraryInfo.description}
            </Text>
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

        {/* Search Section */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search library resources..."
            placeholderTextColor={theme.colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            accessibilityLabel="Search library resources"
          />
        </View>

        {/* Gallery Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Gallery</Text>
            {!showAllGallery && libraryGallery.length > 2 && (
              <TouchableOpacity
                style={styles.viewMoreButton}
                onPress={() => setShowAllGallery(true)}
                accessibilityLabel={`View ${libraryGallery.length - 2} more images`}
                accessibilityRole="button"
              >
                <Text style={styles.viewMoreText}>
                  View More ({libraryGallery.length - 2})
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

        {/* Library Services */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Library Services</Text>
          <View style={styles.servicesGrid}>
            {libraryServices.map((service) => {
              const IconComponent = service.icon;
              return (
                <TouchableOpacity
                  key={service.id}
                  style={styles.serviceCard}
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
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Study Room Reservations */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Study Room Reservations</Text>
          {studyRooms.map((room) => (
            <View key={room.id} style={styles.studyRoomCard}>
              <View style={styles.roomHeader}>
                <Text style={styles.roomName}>{room.name}</Text>
                <Text style={styles.roomNumber}>Room {room.roomNumber}</Text>
                <Text style={styles.roomDescription}>{room.description}</Text>
              </View>

              <View style={styles.roomMeta}>
                <Text style={styles.roomCapacity}>
                  Capacity: {room.capacity}
                </Text>
              </View>

              <View style={styles.featuresContainer}>
                {room.features.map((feature, index) => (
                  <View key={index} style={styles.featureTag}>
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}
              </View>

              <TouchableOpacity
                style={styles.bookButton}
                onPress={() => handleBookRoom(room)}
                accessibilityLabel={`Book ${room.name}`}
                accessibilityRole="button"
              >
                <Text style={styles.bookButtonText}>Book Room</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Study Areas */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>
            Study Areas (No Reservation Required)
          </Text>
          {studyAreas.map((area) => {
            const IconComponent = area.icon;
            return (
              <View key={area.id} style={styles.studyAreaCard}>
                <View style={styles.studyAreaHeader}>
                  <View style={styles.studyAreaInfo}>
                    <Text style={styles.studyAreaName}>{area.name}</Text>
                    <Text style={styles.studyAreaFloor}>{area.floor}</Text>
                  </View>
                  <IconComponent color={area.color} size={28} />
                </View>

                <Text style={styles.roomDescription}>{area.description}</Text>

                <View style={styles.featuresContainer}>
                  {area.features.map((feature, index) => (
                    <View key={index} style={styles.featureTag}>
                      <Text style={styles.featureText}>{feature}</Text>
                    </View>
                  ))}
                </View>
              </View>
            );
          })}
        </View>

        {/* Contact Information */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Contact & Hours</Text>
          <View style={styles.hoursCard}>
            <View style={styles.hoursContainer}>
              <View style={styles.hoursRow}>
                <Text style={styles.dayText}>Access Hours</Text>
                <Text style={styles.hoursText}>{libraryInfo.hours}</Text>
              </View>
              <View style={styles.hoursRow}>
                <Text style={styles.dayText}>Location</Text>
                <Text style={styles.hoursText}>{libraryInfo.location}</Text>
              </View>
              <View style={styles.hoursRow}>
                <Text style={styles.dayText}>Email</Text>
                <Text style={styles.hoursText}>{libraryInfo.email}</Text>
              </View>
            </View>

            <View style={styles.contactActions}>
              <TouchableOpacity
                style={styles.contactButton}
                onPress={handleEmailLibrary}
                accessibilityLabel="Email library"
                accessibilityRole="button"
              >
                <Mail color="white" size={20} />
                <Text style={styles.contactButtonText}>Email</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.contactButton, styles.contactButtonSecondary]}
                onPress={handleWebsitePress}
                accessibilityLabel="Visit library website"
                accessibilityRole="button"
              >
                <ExternalLink color={theme.colors.text} size={20} />
                <Text
                  style={[
                    styles.contactButtonText,
                    styles.contactButtonTextSecondary,
                  ]}
                >
                  Website
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
