import { useTheme } from "@/contexts/ThemeContext";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Clock,
  Coffee,
  CreditCard,
  ExternalLink,
  Globe,
  MapPin,
  Phone,
  ShoppingBag,
  Store,
  Utensils,
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
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

/**
 * Interface for dining vendor information
 */
interface DiningVendor {
  id: number;
  name: string;
  type: string;
  description: string;
  image: string;
  hours: string;
  location: string;
  paymentMethods: string[];
  website?: string;
  specialties: string[];
  dishes: FoodItem[];
}

/**
 * Interface for food items with images
 */
interface FoodItem {
  id: number;
  name: string;
  category: string;
  image: string;
  description?: string;
}

/**
 * Interface for gallery images
 */
interface GalleryImage {
  id: number;
  title: string;
  image: string;
}

/**
 * Dining center overview information
 * Contains general information about the Ashesi dining services
 */
const diningCenter = {
  name: "Ashesi Dining Services",
  description:
    "Discover a variety of dining options on campus, from traditional Ghanaian cuisine to international favorites. Our dining services operate around the clock to serve the diverse tastes and preferences of our community.",
  image: require("../../../assets/menu/support-center.png"),
  totalVendors: 5,
  operatingHours: "Various hours - 24/7 options available",
  paymentOptions: ["Meal Plan", "Cash", "Mobile Money"],
};

/**
 * Gallery images for dining services
 * Showcases different dining areas and facilities on campus
 */
const diningGallery: GalleryImage[] = [
  {
    id: 1,
    title: "Dining Hall Overview",
    image:
      "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=500",
  },
  {
    id: 2,
    title: "Food Preparation Area",
    image:
      "https://images.pexels.com/photos/2747449/pexels-photo-2747449.jpeg?auto=compress&cs=tinysrgb&w=500",
  },
  {
    id: 3,
    title: "Student Dining Space",
    image:
      "https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=500",
  },
  {
    id: 4,
    title: "Coffee & Study Area",
    image:
      "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=500",
  },
];

/**
 * Complete dining vendors data with accurate information
 * Contains all dining options available on the Ashesi campus
 */
const diningVendors: DiningVendor[] = [
  {
    id: 1,
    name: "Akorno Dining Services",
    type: "24-Hour Restaurant",
    description:
      "Versatile dining option offering 24-hour service with traditional Ghanaian tastes and continental options.",
    image:
      "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=500",
    hours: "24 hours",
    location: "Main Campus",
    paymentMethods: ["Meal Plan", "Cash", "Mobile Money"],
    website: "https://www.akorno.com/",
    specialties: [
      "24-Hour Service",
      "Local Dishes",
      "International Options",
      "Breakfast Available",
    ],
    dishes: [
      {
        id: 1,
        name: "Banku & Fish Gravy",
        category: "Local Dishes",
        image:
          "https://images.pexels.com/photos/5966630/pexels-photo-5966630.jpeg?auto=compress&cs=tinysrgb&w=300",
      },
      {
        id: 2,
        name: "Banku & Tilapia",
        category: "Local Dishes",
        image:
          "https://images.pexels.com/photos/7218641/pexels-photo-7218641.jpeg?auto=compress&cs=tinysrgb&w=300",
      },
      {
        id: 3,
        name: "Beans Stew with Plantain",
        category: "Local Dishes",
        image:
          "https://images.pexels.com/photos/4449068/pexels-photo-4449068.jpeg?auto=compress&cs=tinysrgb&w=300",
      },
      {
        id: 4,
        name: "Fufu with Light Soup",
        category: "Local Dishes",
        image:
          "https://images.pexels.com/photos/8629865/pexels-photo-8629865.jpeg?auto=compress&cs=tinysrgb&w=300",
      },
      {
        id: 5,
        name: "Kenkey with Pepper",
        category: "Local Dishes",
        image:
          "https://images.pexels.com/photos/7218619/pexels-photo-7218619.jpeg?auto=compress&cs=tinysrgb&w=300",
      },
      {
        id: 6,
        name: "Jollof Rice",
        category: "Rice-Based",
        image:
          "https://images.pexels.com/photos/5638671/pexels-photo-5638671.jpeg?auto=compress&cs=tinysrgb&w=300",
      },
      {
        id: 7,
        name: "Fried Rice",
        category: "Rice-Based",
        image:
          "https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=300",
      },
      {
        id: 8,
        name: "Waakye",
        category: "Rice-Based",
        image:
          "https://images.pexels.com/photos/7218641/pexels-photo-7218641.jpeg?auto=compress&cs=tinysrgb&w=300",
      },
      {
        id: 9,
        name: "Pancakes",
        category: "Breakfast",
        image:
          "https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=300",
      },
      {
        id: 10,
        name: "Oats Porridge",
        category: "Breakfast",
        image:
          "https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?auto=compress&cs=tinysrgb&w=300",
      },
      {
        id: 11,
        name: "Chapati",
        category: "Snacks",
        image:
          "https://images.pexels.com/photos/2135677/pexels-photo-2135677.jpeg?auto=compress&cs=tinysrgb&w=300",
      },
      {
        id: 12,
        name: "Fried Chicken",
        category: "Proteins",
        image:
          "https://images.pexels.com/photos/2741448/pexels-photo-2741448.jpeg?auto=compress&cs=tinysrgb&w=300",
      },
    ],
  },
  {
    id: 2,
    name: "Hallmark Dining Services",
    type: "Café & Restaurant",
    description:
      "Balanced fusion of Ghanaian staples and international menu items with cozy dining atmosphere.",
    image:
      "https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=500",
    hours: "7:00 AM - 11:00 PM",
    location: "Student Center",
    paymentMethods: ["Meal Plan", "Cash", "Mobile Money"],
    website: "https://hallmarkashesi.com/",
    specialties: [
      "International Fusion",
      "Fresh Pastries",
      "Coffee & Beverages",
      "Daily Specials",
    ],
    dishes: [
      {
        id: 13,
        name: "Waakye Special",
        category: "Lunch Specials",
        image:
          "https://images.pexels.com/photos/7218641/pexels-photo-7218641.jpeg?auto=compress&cs=tinysrgb&w=300",
      },
      {
        id: 14,
        name: "Kenkey Special",
        category: "Lunch Specials",
        image:
          "https://images.pexels.com/photos/7218619/pexels-photo-7218619.jpeg?auto=compress&cs=tinysrgb&w=300",
      },
      {
        id: 15,
        name: "Chicken Yassa",
        category: "International",
        image:
          "https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=300",
      },
      {
        id: 16,
        name: "Spaghetti Bolognese",
        category: "International",
        image:
          "https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=300",
      },
      {
        id: 17,
        name: "Tuna Sandwich",
        category: "Sandwiches",
        image:
          "https://images.pexels.com/photos/1603901/pexels-photo-1603901.jpeg?auto=compress&cs=tinysrgb&w=300",
      },
      {
        id: 18,
        name: "Croissant",
        category: "Pastries",
        image:
          "https://images.pexels.com/photos/2135677/pexels-photo-2135677.jpeg?auto=compress&cs=tinysrgb&w=300",
      },
      {
        id: 19,
        name: "Coffee & Latte",
        category: "Beverages",
        image:
          "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=300",
      },
      {
        id: 20,
        name: "French Fries",
        category: "Sides",
        image:
          "https://images.pexels.com/photos/1583884/pexels-photo-1583884.jpeg?auto=compress&cs=tinysrgb&w=300",
      },
    ],
  },
  {
    id: 3,
    name: "Munchies",
    type: "Student Restaurant",
    description:
      "Hearty blend of local favorites and student meals, known for generous portions and late-night dining.",
    image:
      "https://images.pexels.com/photos/1199957/pexels-photo-1199957.jpeg?auto=compress&cs=tinysrgb&w=500",
    hours: "11:00 AM - 3:00 AM",
    location: "Academic Block",
    paymentMethods: ["Meal Plan", "Cash", "Mobile Money"],
    specialties: [
      "Generous Portions",
      "Student Favorites",
      "Late Night Dining",
      "Local Cuisine",
    ],
    dishes: [
      {
        id: 21,
        name: "Eba with Egusi",
        category: "Local Meals",
        image:
          "https://images.pexels.com/photos/7218619/pexels-photo-7218619.jpeg?auto=compress&cs=tinysrgb&w=300",
      },
      {
        id: 22,
        name: "Ugali",
        category: "Local Meals",
        image:
          "https://images.pexels.com/photos/5966630/pexels-photo-5966630.jpeg?auto=compress&cs=tinysrgb&w=300",
      },
      {
        id: 23,
        name: "Sweet & Sour Chicken",
        category: "Proteins",
        image:
          "https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=300",
      },
      {
        id: 24,
        name: "Chicken Wings",
        category: "Proteins",
        image:
          "https://images.pexels.com/photos/2741448/pexels-photo-2741448.jpeg?auto=compress&cs=tinysrgb&w=300",
      },
    ],
  },
  {
    id: 4,
    name: "Essentials Convenience Store",
    type: "Convenience Store",
    description:
      "One-stop campus store for everyday necessities, groceries, toiletries, and quick snacks.",
    image:
      "https://images.pexels.com/photos/2292919/pexels-photo-2292919.jpeg?auto=compress&cs=tinysrgb&w=500",
    hours: "Weekdays: 8:00 AM - 7:00 PM, Weekends: 3:00 PM - 6:00 PM",
    location: "Academic Block A",
    paymentMethods: ["Cash", "Mobile Money"],
    specialties: ["Groceries", "Toiletries", "Stationery", "Quick Shopping"],
    dishes: [
      {
        id: 25,
        name: "Fresh Fruits",
        category: "Fruits",
        image:
          "https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?auto=compress&cs=tinysrgb&w=300",
      },
      {
        id: 26,
        name: "Snacks & Biscuits",
        category: "Snacks",
        image:
          "https://images.pexels.com/photos/230325/pexels-photo-230325.jpeg?auto=compress&cs=tinysrgb&w=300",
      },
    ],
  },
  {
    id: 5,
    name: "Bliss Lounge",
    type: "24-Hour Snack Bar",
    description:
      "24-hour access to quick snacks, beverages, and fresh fruits for late-night cravings.",
    image:
      "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=500",
    hours: "24 hours",
    location: "Near Hostels",
    paymentMethods: ["Meal Plan", "Mobile Money"],
    specialties: [
      "24-Hour Access",
      "Quick Snacks",
      "Fresh Fruits",
      "Beverages",
    ],
    dishes: [
      {
        id: 27,
        name: "Meat Pies",
        category: "Snacks",
        image:
          "https://images.pexels.com/photos/4449068/pexels-photo-4449068.jpeg?auto=compress&cs=tinysrgb&w=300",
      },
      {
        id: 28,
        name: "Croissant",
        category: "Pastries",
        image:
          "https://images.pexels.com/photos/2135677/pexels-photo-2135677.jpeg?auto=compress&cs=tinysrgb&w=300",
      },
    ],
  },
];

/**
 * Dining Screen Component
 *
 * A comprehensive screen displaying all dining options available on the Ashesi campus.
 * Features include:
 * - Hero section with overview information
 * - Image gallery with modal viewer
 * - Expandable vendor cards with menu items
 * - Contact and location integration
 * - Payment method information
 * - Search and filtering capabilities
 *
 * @returns {JSX.Element} The dining screen component
 */
export default function DiningScreen(): JSX.Element {
  const { theme } = useTheme();
  const router = useRouter();

  // Screen state management
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [selectedVendor, setSelectedVendor] = useState<number | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [showAllDishes, setShowAllDishes] = useState<Record<number, boolean>>(
    {}
  );
  const [showAllGallery, setShowAllGallery] = useState<boolean>(false);

  /**
   * Handles pull-to-refresh functionality
   * Simulates data refresh with a 2-second delay
   */
  const onRefresh = (): void => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  };

  /**
   * Toggles the expanded state of vendor cards
   * Shows/hides menu items for the selected vendor
   *
   * @param {number} vendorId - The ID of the vendor to toggle
   */
  const handleVendorPress = (vendorId: number): void => {
    setSelectedVendor(selectedVendor === vendorId ? null : vendorId);
  };

  /**
   * Opens the external meal plan website
   * Redirects users to the Ashesi meal plan portal
   */
  const handleMealPlanPress = (): void => {
    Linking.openURL(`https://subscriber.mplan.ashesi.edu.gh/`);
  };

  /**
   * Opens vendor website in external browser
   *
   * @param {string} url - The website URL to open
   */
  const handleWebsitePress = (url: string): void => {
    Linking.openURL(url);
  };

  /**
   * Initiates a phone call to the vendor
   * Uses placeholder number for vendors without websites
   *
   * TODO: Update with actual vendor phone numbers when available
   *
   * @param {string} vendorName - The name of the vendor to call
   */
  const handleCallPress = (vendorName: string): void => {
    // Placeholder phone number - TODO: Replace with actual vendor numbers
    const phoneNumber = "+233503673195";

    console.log(`Calling ${vendorName} at ${phoneNumber}`);
    Linking.openURL(`tel:${phoneNumber}`);
  };

  /**
   * Opens image in full-screen modal viewer
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

  /**
   * Toggles the display of all dishes for a specific vendor
   * Controls whether to show 4 dishes or all available dishes
   *
   * @param {number} vendorId - The ID of the vendor
   */
  const toggleShowAllDishes = (vendorId: number): void => {
    setShowAllDishes((prev) => ({
      ...prev,
      [vendorId]: !prev[vendorId],
    }));
  };

  /**
   * Returns the appropriate icon component based on vendor type
   *
   * @param {string} type - The type of vendor (Restaurant, Coffee Shop, Store, etc.)
   * @returns {React.ComponentType} The icon component to display
   */
  const getVendorIcon = (type: string) => {
    if (type.includes("Restaurant") || type.includes("Café")) return Utensils;
    if (type.includes("Coffee") || type.includes("Lounge")) return Coffee;
    if (type.includes("Store")) return Store;
    return ShoppingBag;
  };

  // Determine which gallery images to display based on showAllGallery state
  const displayedGalleryImages = showAllGallery
    ? diningGallery
    : diningGallery.slice(0, 2);

  const styles = StyleSheet.create<{
    container: ViewStyle;
    header: ViewStyle;
    backButton: ViewStyle;
    headerTitle: TextStyle;
    mealPlanButton: ViewStyle;
    mealPlanButtonText: TextStyle;
    scrollContent: ViewStyle;
    heroSection: ViewStyle;
    heroImage: ImageStyle;
    heroOverlay: ViewStyle;
    heroTitle: TextStyle;
    heroDescription: TextStyle;
    statusBadge: ViewStyle;
    statusText: TextStyle;
    sectionContainer: ViewStyle;
    sectionTitle: TextStyle;
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
    vendorCard: ViewStyle;
    vendorImage: ImageStyle;
    vendorContent: ViewStyle;
    vendorHeader: ViewStyle;
    vendorInfo: ViewStyle;
    vendorName: TextStyle;
    vendorType: TextStyle;
    vendorHours: ViewStyle;
    hoursText: TextStyle;
    vendorDescription: TextStyle;
    paymentMethods: ViewStyle;
    paymentChip: ViewStyle;
    paymentText: TextStyle;
    specialtiesContainer: ViewStyle;
    specialtyTag: ViewStyle;
    specialtyText: TextStyle;
    vendorActions: ViewStyle;
    actionButton: ViewStyle;
    actionButtonSecondary: ViewStyle;
    actionButtonText: TextStyle;
    actionButtonTextSecondary: TextStyle;
    expandedContent: ViewStyle;
    dishesGrid: ViewStyle;
    dishCard: ViewStyle;
    dishImage: ImageStyle;
    dishInfo: ViewStyle;
    dishName: TextStyle;
    dishCategory: TextStyle;
    modalContainer: ViewStyle;
    modalBackdrop: ViewStyle;
    modalContent: ViewStyle;
    modalHeader: ViewStyle;
    modalCloseButton: ViewStyle;
    modalImage: ImageStyle;
    modalTitle: TextStyle;
    expandIndicator: ViewStyle;
    expandText: TextStyle;
    tapHintContainer: ViewStyle;
    tapHintText: TextStyle;
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
    mealPlanButton: {
      backgroundColor: theme.colors.primary,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.xxxl,
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.xs,
    },
    mealPlanButtonText: {
      ...theme.typography.bodySmall,
      color: "white",
      fontWeight: "600",
    } as TextStyle,
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
    vendorCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      marginBottom: theme.spacing.lg,
      overflow: "hidden",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.15,
      shadowRadius: 10,
      elevation: 5,
      borderWidth: 1,
      borderColor: theme.colors.border,
      position: "relative",
    },
    vendorImage: {
      width: "100%",
      height: 200,
    },
    vendorContent: {
      padding: theme.spacing.md,
    },
    vendorHeader: {
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "space-between",
      marginBottom: theme.spacing.md,
    },
    vendorInfo: {
      flex: 1,
    },
    vendorName: {
      ...theme.typography.h5,
      color: theme.colors.text,
      fontWeight: "700",
      marginBottom: 4,
    } as TextStyle,
    vendorType: {
      ...theme.typography.bodySmall,
      color: theme.colors.primary,
      fontWeight: "600",
      marginBottom: theme.spacing.sm,
    } as TextStyle,
    vendorHours: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.xs,
      marginBottom: theme.spacing.sm,
    },
    hoursText: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      fontWeight: "500",
    },
    vendorDescription: {
      ...theme.typography.body,
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
      lineHeight: 22,
    } as TextStyle,
    paymentMethods: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: theme.spacing.xs,
      marginBottom: theme.spacing.md,
    },
    paymentChip: {
      backgroundColor: theme.colors.accent + "20",
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.lg,
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.xs,
    },
    paymentText: {
      ...theme.typography.bodySmall,
      color: theme.colors.accent,
      fontWeight: "600",
    },
    specialtiesContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: theme.spacing.xs,
      marginBottom: theme.spacing.md,
    },
    specialtyTag: {
      backgroundColor: theme.colors.background,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    specialtyText: {
      ...theme.typography.bodySmall,
      color: theme.colors.text,
      fontWeight: "500",
    },
    vendorActions: {
      flexDirection: "row",
      gap: theme.spacing.md,
      marginBottom: theme.spacing.sm,
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
    expandedContent: {
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
      paddingTop: theme.spacing.lg,
      marginTop: theme.spacing.lg,
    },
    dishesGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.lg,
    },
    dishCard: {
      width: "48%",
      backgroundColor: theme.colors.background,
      borderRadius: theme.borderRadius.lg,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    dishImage: {
      width: "100%",
      height: 80,
    },
    dishInfo: {
      padding: theme.spacing.sm,
    },
    dishName: {
      ...theme.typography.bodySmall,
      color: theme.colors.text,
      fontWeight: "600",
      marginBottom: 2,
    },
    dishCategory: {
      ...theme.typography.captionSmall,
      color: theme.colors.textSecondary,
      fontWeight: "500",
    },
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
    expandIndicator: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: theme.spacing.sm,
      backgroundColor: theme.colors.primary + "10",
      marginTop: theme.spacing.md,
      borderRadius: theme.borderRadius.lg,
      gap: theme.spacing.xs,
    },
    expandText: {
      ...theme.typography.bodySmall,
      color: theme.colors.primary,
      fontWeight: "600",
    },
    tapHintContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: theme.spacing.xs,
      gap: theme.spacing.xs,
    },
    tapHintText: {
      ...theme.typography.captionSmall,
      color: theme.colors.textSecondary,
      fontStyle: "italic",
      fontWeight: "500",
    },
  });

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      {/* Main Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          accessibilityLabel="Go back to previous screen"
          accessibilityRole="button"
        >
          <ArrowLeft color={theme.colors.text} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Dining Services</Text>
        <TouchableOpacity
          style={styles.mealPlanButton}
          onPress={handleMealPlanPress}
          accessibilityLabel="Open meal plan website"
          accessibilityRole="button"
        >
          <ExternalLink color="white" size={16} />
          <Text style={styles.mealPlanButtonText}>Meal Plan</Text>
        </TouchableOpacity>
      </View>

      {/* Main Content Scroll View */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Section - Dining Services Overview */}
        <View style={styles.heroSection}>
          <Image
            source={require("../../../assets/menu/support-center.png")}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <View style={styles.heroOverlay}>
            <Text style={styles.heroTitle}>{diningCenter.name}</Text>
            <Text style={styles.heroDescription}>
              {diningCenter.description}
            </Text>
          </View>
          {/* Status Badge */}
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>Open 24/7</Text>
          </View>
        </View>

        {/* Gallery Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Gallery</Text>
            {/* View More/Less Toggle for Gallery */}
            {!showAllGallery && diningGallery.length > 2 && (
              <TouchableOpacity
                style={styles.viewMoreButton}
                onPress={() => setShowAllGallery(true)}
                accessibilityLabel={`View ${diningGallery.length - 2} more images`}
                accessibilityRole="button"
              >
                <Text style={styles.viewMoreText}>
                  View More ({diningGallery.length - 2})
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

          {/* Gallery Grid */}
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

        {/* Dining Vendors Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Dining Options</Text>

          {diningVendors.map((vendor) => {
            const IconComponent = getVendorIcon(vendor.type);
            const isExpanded = selectedVendor === vendor.id;
            const displayedDishes = showAllDishes[vendor.id]
              ? vendor.dishes
              : vendor.dishes.slice(0, 4);

            /**
             * Handles location button press
             * Navigates to the map screen to show vendor location
             */
            function handleLocationPress() {
              router.push("/(routes)/map");
            }

            return (
              <TouchableOpacity
                key={vendor.id}
                style={styles.vendorCard}
                onPress={() => handleVendorPress(vendor.id)}
                activeOpacity={0.95}
                accessibilityLabel={`${vendor.name}: ${vendor.description}. Tap to view menu items.`}
                accessibilityRole="button"
              >
                {/* Vendor Hero Image */}
                <Image
                  source={{ uri: vendor.image }}
                  style={styles.vendorImage}
                  resizeMode="cover"
                />

                <View style={styles.vendorContent}>
                  {/* Vendor Header Information */}
                  <View style={styles.vendorHeader}>
                    <View style={styles.vendorInfo}>
                      <Text style={styles.vendorName}>{vendor.name}</Text>
                      <Text style={styles.vendorType}>{vendor.type}</Text>
                      {/* Operating Hours */}
                      <View style={styles.vendorHours}>
                        <Clock color={theme.colors.textSecondary} size={16} />
                        <Text style={styles.hoursText}>{vendor.hours}</Text>
                      </View>
                    </View>
                    <IconComponent color={theme.colors.primary} size={28} />
                  </View>

                  {/* Vendor Description */}
                  <Text style={styles.vendorDescription}>
                    {vendor.description}
                  </Text>

                  {/* Payment Methods */}
                  <View style={styles.paymentMethods}>
                    {vendor.paymentMethods.map((method, index) => (
                      <View key={index} style={styles.paymentChip}>
                        <CreditCard color={theme.colors.accent} size={14} />
                        <Text style={styles.paymentText}>{method}</Text>
                      </View>
                    ))}
                  </View>

                  {/* Vendor Specialties */}
                  <View style={styles.specialtiesContainer}>
                    {vendor.specialties.map((specialty, index) => (
                      <View key={index} style={styles.specialtyTag}>
                        <Text style={styles.specialtyText}>{specialty}</Text>
                      </View>
                    ))}
                  </View>

                  {/* Action Buttons */}
                  <View style={styles.vendorActions}>
                    {/* Website or Call Button */}
                    {vendor.website ? (
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={(e) => {
                          e.stopPropagation();
                          handleWebsitePress(vendor.website!);
                        }}
                        accessibilityLabel={`Visit ${vendor.name} website`}
                        accessibilityRole="button"
                      >
                        <Globe color="white" size={18} />
                        <Text style={styles.actionButtonText}>Website</Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={(e) => {
                          e.stopPropagation();
                          handleCallPress(vendor.name);
                        }}
                        accessibilityLabel={`Call ${vendor.name}`}
                        accessibilityRole="button"
                      >
                        <Phone color="white" size={18} />
                        <Text style={styles.actionButtonText}>Call</Text>
                      </TouchableOpacity>
                    )}
                    {/* Location Button */}
                    <TouchableOpacity
                      style={[
                        styles.actionButton,
                        styles.actionButtonSecondary,
                      ]}
                      onPress={(e) => {
                        e.stopPropagation();
                        handleLocationPress();
                      }}
                      accessibilityLabel={`View ${vendor.name} location on map`}
                      accessibilityRole="button"
                    >
                      <MapPin color={theme.colors.text} size={18} />
                      <Text
                        style={[
                          styles.actionButtonText,
                          styles.actionButtonTextSecondary,
                        ]}
                      >
                        Location
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {/* Expand/Collapse Indicator */}
                  {vendor.dishes.length > 0 && (
                    <>
                      {/* User Hint */}
                      <View style={styles.tapHintContainer}>
                        <Text style={styles.tapHintText}>
                          Tap card to view menu items
                        </Text>
                      </View>

                      {/* Expand/Collapse Button */}
                      <View style={styles.expandIndicator}>
                        {isExpanded ? (
                          <>
                            <ChevronUp color={theme.colors.primary} size={20} />
                            <Text style={styles.expandText}>Hide Menu</Text>
                          </>
                        ) : (
                          <>
                            <ChevronDown
                              color={theme.colors.primary}
                              size={20}
                            />
                            <Text style={styles.expandText}>
                              View Menu ({vendor.dishes.length} items)
                            </Text>
                          </>
                        )}
                      </View>
                    </>
                  )}

                  {/* Expanded Content - Menu Items */}
                  {isExpanded && vendor.dishes.length > 0 && (
                    <View style={styles.expandedContent}>
                      <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Menu Items</Text>
                        {/* View More Dishes Toggle */}
                        {vendor.dishes.length > 4 && (
                          <TouchableOpacity
                            style={styles.viewMoreButton}
                            onPress={(e) => {
                              e.stopPropagation();
                              toggleShowAllDishes(vendor.id);
                            }}
                            accessibilityLabel={
                              showAllDishes[vendor.id]
                                ? "Show fewer dishes"
                                : "Show more dishes"
                            }
                            accessibilityRole="button"
                          >
                            <Text style={styles.viewMoreText}>
                              {showAllDishes[vendor.id]
                                ? "Show Less"
                                : `View More (${vendor.dishes.length - 4})`}
                            </Text>
                            <ChevronRight
                              color={theme.colors.primary}
                              size={16}
                              style={{
                                transform: [
                                  {
                                    rotate: showAllDishes[vendor.id]
                                      ? "270deg"
                                      : "0deg",
                                  },
                                ],
                              }}
                            />
                          </TouchableOpacity>
                        )}
                      </View>

                      {/* Dishes Grid */}
                      <View style={styles.dishesGrid}>
                        {displayedDishes.map((dish) => (
                          <View key={dish.id} style={styles.dishCard}>
                            <Image
                              source={{ uri: dish.image }}
                              style={styles.dishImage}
                              resizeMode="cover"
                            />
                            <View style={styles.dishInfo}>
                              <Text style={styles.dishName}>{dish.name}</Text>
                              <Text style={styles.dishCategory}>
                                {dish.category}
                              </Text>
                            </View>
                          </View>
                        ))}
                      </View>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
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
          {/* Modal Backdrop */}
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
