import { useTheme } from "@/contexts/ThemeContext";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  BookOpen,
  Building,
  Clock,
  GraduationCap,
  Heart,
  Chrome as Home,
  MapPin,
  Navigation,
  Phone,
  Search,
  TreePine,
  Users,
  Utensils,
  Waves,
  X,
  Zap,
} from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Enhanced campus locations with better positioning
const campusLocations = [
  {
    id: 1,
    name: "Main Library",
    category: "Academic",
    description:
      "Central library with study spaces, computer labs, and research facilities",
    coordinates: { x: 0.4, y: 0.35 },
    icon: BookOpen,
    color: "#3b82f6",
    hours: "24/7",
    phone: "+233 30 610 330",
    capacity: "500 students",
    amenities: ["WiFi", "Study Rooms", "Computers", "Printing"],
    image:
      "https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    id: 2,
    name: "Student Center",
    category: "Social",
    description: "Hub for student activities, dining, and social gatherings",
    coordinates: { x: 0.6, y: 0.5 },
    icon: Users,
    color: "#059669",
    hours: "6:00 AM - 11:00 PM",
    phone: "+233 30 610 331",
    capacity: "800 students",
    amenities: ["Dining", "Lounge", "Events", "WiFi"],
    image:
      "https://images.pexels.com/photos/1454360/pexels-photo-1454360.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    id: 3,
    name: "Academic Block A",
    category: "Academic",
    description:
      "Main academic building with lecture halls and faculty offices",
    coordinates: { x: 0.25, y: 0.4 },
    icon: GraduationCap,
    color: "#dc2626",
    hours: "6:00 AM - 10:00 PM",
    phone: "+233 30 610 332",
    capacity: "1200 students",
    amenities: ["Lecture Halls", "Labs", "Offices", "WiFi"],
    image:
      "https://images.pexels.com/photos/207692/pexels-photo-207692.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    id: 4,
    name: "Health Center",
    category: "Services",
    description: "Medical services and health support for students and staff",
    coordinates: { x: 0.75, y: 0.3 },
    icon: Heart,
    color: "#e11d48",
    hours: "8:00 AM - 6:00 PM",
    phone: "+233 30 610 333",
    capacity: "50 patients",
    amenities: ["Medical Care", "Pharmacy", "Counseling"],
    image:
      "https://images.pexels.com/photos/263402/pexels-photo-263402.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    id: 5,
    name: "Dining Hall",
    category: "Dining",
    description: "Main dining facility with diverse food options",
    coordinates: { x: 0.55, y: 0.65 },
    icon: Utensils,
    color: "#0891b2",
    hours: "6:00 AM - 10:00 PM",
    phone: "+233 30 610 334",
    capacity: "600 diners",
    amenities: ["Multiple Cuisines", "Vegetarian", "Halal", "Takeout"],
    image:
      "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    id: 6,
    name: "Sports Complex",
    category: "Recreation",
    description: "Fitness center, courts, and recreational facilities",
    coordinates: { x: 0.15, y: 0.7 },
    icon: Zap,
    color: "#7c3aed",
    hours: "5:00 AM - 11:00 PM",
    phone: "+233 30 610 335",
    capacity: "300 users",
    amenities: ["Gym", "Courts", "Pool", "Locker Rooms"],
    image:
      "https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    id: 7,
    name: "Innovation Hub",
    category: "Academic",
    description: "Technology center for innovation and entrepreneurship",
    coordinates: { x: 0.7, y: 0.45 },
    icon: Building,
    color: "#f59e0b",
    hours: "24/7",
    phone: "+233 30 610 336",
    capacity: "200 students",
    amenities: ["Maker Space", "Incubator", "Meeting Rooms", "WiFi"],
    image:
      "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    id: 8,
    name: "Residence Halls",
    category: "Housing",
    description: "Student dormitories and residential facilities",
    coordinates: { x: 0.85, y: 0.6 },
    icon: Home,
    color: "#64748b",
    hours: "24/7",
    phone: "+233 30 610 337",
    capacity: "800 residents",
    amenities: ["WiFi", "Laundry", "Common Areas", "Security"],
    image:
      "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
];

const categories = [
  { name: "All", icon: MapPin, color: "#64748b" },
  { name: "Academic", icon: GraduationCap, color: "#3b82f6" },
  { name: "Social", icon: Users, color: "#059669" },
  { name: "Dining", icon: Utensils, color: "#0891b2" },
  { name: "Services", icon: Heart, color: "#e11d48" },
  { name: "Recreation", icon: Zap, color: "#7c3aed" },
  { name: "Housing", icon: Home, color: "#64748b" },
];

export default function CampusMapScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const [selectedLocation, setSelectedLocation] = useState<
    (typeof campusLocations)[0] | null
  >(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  const searchWidth = useRef(new Animated.Value(44)).current;
  const searchOpacity = useRef(new Animated.Value(0)).current;
  const pulseAnimations = useRef(
    campusLocations.reduce(
      (acc, location) => {
        acc[location.id] = new Animated.Value(1);
        return acc;
      },
      {} as Record<number, Animated.Value>
    )
  ).current;

  // Pulse animation for markers
  useEffect(() => {
    const animations = Object.values(pulseAnimations).map((anim) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 1.3,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
        ])
      )
    );

    animations.forEach((anim) => anim.start());

    return () => {
      animations.forEach((anim) => anim.stop());
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const expandSearch = () => {
    setIsSearchExpanded(true);
    Animated.parallel([
      Animated.timing(searchWidth, {
        toValue: 250,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(searchOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const collapseSearch = () => {
    Animated.parallel([
      Animated.timing(searchWidth, {
        toValue: 44,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(searchOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start(() => {
      setIsSearchExpanded(false);
      setSearchQuery("");
    });
  };

  const filteredLocations = campusLocations.filter((location) => {
    const matchesCategory =
      selectedCategory === "All" || location.category === selectedCategory;
    const matchesSearch =
      searchQuery === "" ||
      location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      location.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const handleLocationPress = (location: (typeof campusLocations)[0]) => {
    setSelectedLocation(location);
  };

  const handleGetDirections = (location: (typeof campusLocations)[0]) => {
    console.log("Getting directions to:", location.name);
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
      paddingVertical: theme.spacing.lg,
      backgroundColor: theme.colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    backButton: {
      padding: theme.spacing.sm,
      marginRight: theme.spacing.lg,
      borderRadius: theme.borderRadius.lg,
      backgroundColor: theme.colors.background,
    },
    headerTitle: {
      ...theme.typography.h5,
      color: theme.colors.text,
      fontWeight: "700",
      flex: 1,
    },
    headerActions: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.sm,
    },
    searchContainer: {
      backgroundColor: theme.colors.background,
      borderRadius: theme.borderRadius.xxxl,
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: theme.spacing.sm,
      height: 44,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    searchInput: {
      flex: 1,
      color: theme.colors.text,
      fontSize: 16,
      paddingHorizontal: theme.spacing.sm,
      fontWeight: "500",
    },
    searchButton: {
      padding: theme.spacing.sm,
    },
    categoriesContainer: {
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      backgroundColor: theme.colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    categoriesScroll: {
      flexDirection: "row",
      gap: theme.spacing.md,
    },
    categoryChip: {
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      borderRadius: theme.borderRadius.xxxl,
      backgroundColor: theme.colors.background,
      borderWidth: 1,
      borderColor: theme.colors.border,
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.sm,
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
    mapContainer: {
      flex: 1,
      position: "relative",
    },
    mapCanvas: {
      width: "100%",
      height: "100%",
      backgroundColor: "#f0f9ff",
      position: "relative",
    },
    // Campus Infrastructure
    road: {
      position: "absolute",
      backgroundColor: "#94a3b8",
    },
    mainRoad: {
      width: "80%",
      height: 12,
      top: "50%",
      left: "10%",
      borderRadius: 6,
    },
    verticalRoad: {
      width: 8,
      height: "60%",
      top: "20%",
      left: "45%",
      borderRadius: 4,
    },
    crossRoad: {
      width: "40%",
      height: 8,
      top: "30%",
      left: "30%",
      borderRadius: 4,
    },
    // Buildings
    building: {
      position: "absolute",
      backgroundColor: "#e2e8f0",
      borderRadius: theme.borderRadius.lg,
      borderWidth: 2,
      borderColor: "#cbd5e1",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    academicBuilding: {
      width: 80,
      height: 60,
      top: "35%",
      left: "20%",
      backgroundColor: "#dbeafe",
      borderColor: "#93c5fd",
    },
    library: {
      width: 90,
      height: 70,
      top: "30%",
      left: "35%",
      backgroundColor: "#dcfce7",
      borderColor: "#86efac",
    },
    studentCenter: {
      width: 100,
      height: 80,
      top: "45%",
      left: "55%",
      backgroundColor: "#fef3c7",
      borderColor: "#fcd34d",
    },
    // Green Spaces
    greenSpace: {
      position: "absolute",
      backgroundColor: "#dcfce7",
      borderRadius: theme.borderRadius.xl,
      borderWidth: 2,
      borderColor: "#bbf7d0",
    },
    centralPark: {
      width: 120,
      height: 100,
      top: "15%",
      left: "35%",
      alignItems: "center",
      justifyContent: "center",
    },
    sideGarden: {
      width: 80,
      height: 60,
      top: "65%",
      left: "75%",
      alignItems: "center",
      justifyContent: "center",
    },
    // Water Features
    lake: {
      position: "absolute",
      width: 100,
      height: 60,
      top: "75%",
      left: "25%",
      backgroundColor: "#bfdbfe",
      borderRadius: theme.borderRadius.xxl,
      borderWidth: 2,
      borderColor: "#93c5fd",
      alignItems: "center",
      justifyContent: "center",
    },
    // Location Markers
    locationMarker: {
      position: "absolute",
      width: 48,
      height: 48,
      borderRadius: 24,
      alignItems: "center",
      justifyContent: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
      borderWidth: 3,
      borderColor: "white",
    },
    markerPulse: {
      position: "absolute",
      width: 72,
      height: 72,
      borderRadius: 36,
      opacity: 0.3,
    },
    // Location Detail Modal
    locationDetail: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: theme.colors.surface,
      borderTopLeftRadius: theme.borderRadius.xl,
      borderTopRightRadius: theme.borderRadius.xl,
      maxHeight: "70%",
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: -4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 8,
    },
    detailHeader: {
      position: "relative",
      height: 200,
    },
    detailImage: {
      width: "100%",
      height: "100%",
      borderTopLeftRadius: theme.borderRadius.xl,
      borderTopRightRadius: theme.borderRadius.xl,
    },
    detailOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0,0,0,0.4)",
      borderTopLeftRadius: theme.borderRadius.xl,
      borderTopRightRadius: theme.borderRadius.xl,
    },
    closeButton: {
      position: "absolute",
      top: theme.spacing.lg,
      right: theme.spacing.lg,
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.xxxl,
    },
    detailContent: {
      padding: theme.spacing.lg,
    },
    detailTitle: {
      ...theme.typography.h4,
      color: theme.colors.text,
      fontWeight: "700",
      marginBottom: theme.spacing.sm,
    },
    detailCategory: {
      backgroundColor: theme.colors.primary + "20",
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.lg,
      alignSelf: "flex-start",
      marginBottom: theme.spacing.lg,
    },
    detailCategoryText: {
      ...theme.typography.bodySmall,
      color: theme.colors.primary,
      fontWeight: "700",
    },
    detailDescription: {
      ...theme.typography.body,
      color: theme.colors.text,
      lineHeight: 26,
      marginBottom: theme.spacing.xl,
      fontWeight: "500",
    },
    detailInfo: {
      gap: theme.spacing.lg,
      marginBottom: theme.spacing.xl,
    },
    infoRow: {
      flexDirection: "row",
      alignItems: "center",
    },
    infoText: {
      ...theme.typography.body,
      color: theme.colors.text,
      marginLeft: theme.spacing.md,
      fontWeight: "500",
    },
    amenitiesContainer: {
      marginBottom: theme.spacing.xl,
    },
    amenitiesTitle: {
      ...theme.typography.h6,
      color: theme.colors.text,
      fontWeight: "700",
      marginBottom: theme.spacing.md,
    },
    amenitiesList: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: theme.spacing.sm,
    },
    amenityTag: {
      backgroundColor: theme.colors.background,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    amenityText: {
      ...theme.typography.bodySmall,
      color: theme.colors.text,
      fontWeight: "600",
    },
    actionButtons: {
      flexDirection: "row",
      gap: theme.spacing.md,
    },
    actionButton: {
      flex: 1,
      backgroundColor: theme.colors.primary,
      paddingVertical: theme.spacing.lg,
      borderRadius: theme.borderRadius.lg,
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
      fontWeight: "700",
    },
    actionButtonTextSecondary: {
      color: theme.colors.text,
    },
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
        <Text style={styles.headerTitle}>Campus Map</Text>
        <View style={styles.headerActions}>
          <Animated.View
            style={[styles.searchContainer, { width: searchWidth }]}
          >
            {!isSearchExpanded ? (
              <TouchableOpacity
                style={styles.searchButton}
                onPress={expandSearch}
              >
                <Search color={theme.colors.textSecondary} size={22} />
              </TouchableOpacity>
            ) : (
              <>
                <Animated.View style={{ opacity: searchOpacity, flex: 1 }}>
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Search locations..."
                    placeholderTextColor={theme.colors.textSecondary}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    autoFocus
                  />
                </Animated.View>
                <TouchableOpacity
                  style={styles.searchButton}
                  onPress={collapseSearch}
                >
                  <X color={theme.colors.textSecondary} size={20} />
                </TouchableOpacity>
              </>
            )}
          </Animated.View>
        </View>
      </View>

      <View style={styles.categoriesContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesScroll}
        >
          {categories.map((category) => {
            const IconComponent = category.icon;
            const isActive = selectedCategory === category.name;
            return (
              <TouchableOpacity
                key={category.name}
                style={[
                  styles.categoryChip,
                  isActive && styles.categoryChipActive,
                ]}
                onPress={() => setSelectedCategory(category.name)}
              >
                <IconComponent
                  color={isActive ? "white" : category.color}
                  size={16}
                />
                <Text
                  style={[
                    styles.categoryChipText,
                    isActive && styles.categoryChipTextActive,
                  ]}
                >
                  {category.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <View style={styles.mapContainer}>
        <View style={styles.mapCanvas}>
          {/* Roads */}
          <View style={[styles.road, styles.mainRoad]} />
          <View style={[styles.road, styles.verticalRoad]} />
          <View style={[styles.road, styles.crossRoad]} />

          {/* Buildings */}
          <View style={[styles.building, styles.academicBuilding]} />
          <View style={[styles.building, styles.library]} />
          <View style={[styles.building, styles.studentCenter]} />

          {/* Green Spaces */}
          <View style={[styles.greenSpace, styles.centralPark]}>
            <TreePine color="#22c55e" size={32} />
            <Text
              style={{
                color: "#22c55e",
                fontSize: 10,
                fontWeight: "600",
                marginTop: 4,
              }}
            >
              Central Park
            </Text>
          </View>
          <View style={[styles.greenSpace, styles.sideGarden]}>
            <TreePine color="#22c55e" size={24} />
          </View>

          {/* Water Feature */}
          <View style={styles.lake}>
            <Waves color="#3b82f6" size={28} />
            <Text
              style={{
                color: "#3b82f6",
                fontSize: 10,
                fontWeight: "600",
                marginTop: 4,
              }}
            >
              Lake
            </Text>
          </View>

          {/* Location Markers */}
          {filteredLocations.map((location) => {
            const IconComponent = location.icon;
            const pulseAnim = pulseAnimations[location.id];

            return (
              <TouchableOpacity
                key={location.id}
                style={[
                  styles.locationMarker,
                  {
                    backgroundColor: location.color,
                    top: `${location.coordinates.y * 100}%`,
                    left: `${location.coordinates.x * 100}%`,
                    marginTop: -24,
                    marginLeft: -24,
                  },
                ]}
                onPress={() => handleLocationPress(location)}
                activeOpacity={0.8}
              >
                <Animated.View
                  style={[
                    styles.markerPulse,
                    {
                      backgroundColor: location.color,
                      transform: [{ scale: pulseAnim }],
                    },
                  ]}
                />
                <IconComponent color="white" size={24} />
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {selectedLocation && (
        <View style={styles.locationDetail}>
          <View style={styles.detailHeader}>
            <Image
              source={{ uri: selectedLocation.image }}
              style={styles.detailImage}
              resizeMode="cover"
            />
            <View style={styles.detailOverlay} />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setSelectedLocation(null)}
            >
              <X color={theme.colors.text} size={20} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.detailContent}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.detailTitle}>{selectedLocation.name}</Text>
            <View style={styles.detailCategory}>
              <Text style={styles.detailCategoryText}>
                {selectedLocation.category}
              </Text>
            </View>

            <Text style={styles.detailDescription}>
              {selectedLocation.description}
            </Text>

            <View style={styles.detailInfo}>
              <View style={styles.infoRow}>
                <Clock color={theme.colors.textSecondary} size={20} />
                <Text style={styles.infoText}>{selectedLocation.hours}</Text>
              </View>
              {selectedLocation.phone !== "N/A" && (
                <View style={styles.infoRow}>
                  <Phone color={theme.colors.textSecondary} size={20} />
                  <Text style={styles.infoText}>{selectedLocation.phone}</Text>
                </View>
              )}
              <View style={styles.infoRow}>
                <Users color={theme.colors.textSecondary} size={20} />
                <Text style={styles.infoText}>{selectedLocation.capacity}</Text>
              </View>
            </View>

            <View style={styles.amenitiesContainer}>
              <Text style={styles.amenitiesTitle}>Amenities</Text>
              <View style={styles.amenitiesList}>
                {selectedLocation.amenities.map((amenity, index) => (
                  <View key={index} style={styles.amenityTag}>
                    <Text style={styles.amenityText}>{amenity}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleGetDirections(selectedLocation)}
              >
                <Navigation color="white" size={20} />
                <Text style={styles.actionButtonText}>Get Directions</Text>
              </TouchableOpacity>
              {selectedLocation.phone !== "N/A" && (
                <TouchableOpacity
                  style={[styles.actionButton, styles.actionButtonSecondary]}
                >
                  <Phone color={theme.colors.text} size={20} />
                  <Text
                    style={[
                      styles.actionButtonText,
                      styles.actionButtonTextSecondary,
                    ]}
                  >
                    Call
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </ScrollView>
        </View>
      )}
    </SafeAreaView>
  );
}
