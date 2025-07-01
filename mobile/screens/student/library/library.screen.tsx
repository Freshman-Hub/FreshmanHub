import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  RefreshControl,
  TextInput,
  TextStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  Search,
  BookOpen,
  Clock,
  MapPin,
  Users,
  Computer,
  Printer,
  Volume2,
  VolumeX,
  Phone,
  ExternalLink,
  Download,
} from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";

// Mock library data
const libraryInfo = {
  name: "Ashesi University Library",
  description:
    "State-of-the-art academic library providing comprehensive resources, study spaces, and research support for the Ashesi community.",
  image:
    "https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=400",
  hours: {
    monday: "24 Hours",
    tuesday: "24 Hours",
    wednesday: "24 Hours",
    thursday: "24 Hours",
    friday: "24 Hours",
    saturday: "6:00 AM - 10:00 PM",
    sunday: "8:00 AM - 10:00 PM",
  },
  location: "Central Campus",
  phone: "+233 30 610 350",
  email: "library@ashesi.edu.gh",
  website: "library.ashesi.edu.gh",
  currentOccupancy: 156,
  maxCapacity: 500,
  availableComputers: 12,
  totalComputers: 50,
};

const libraryServices = [
  {
    id: 1,
    name: "Book Catalog Search",
    description: "Search and reserve books from our extensive collection",
    icon: BookOpen,
    color: "#3b82f6",
    available: true,
  },
  {
    id: 2,
    name: "Computer Lab",
    description: "Access computers with software for academic work",
    icon: Computer,
    color: "#059669",
    available: true,
  },
  {
    id: 3,
    name: "Printing Services",
    description: "Print documents, assignments, and research papers",
    icon: Printer,
    color: "#dc2626",
    available: true,
  },
  {
    id: 4,
    name: "Study Rooms",
    description: "Book private study rooms for group work",
    icon: Users,
    color: "#7c3aed",
    available: false,
  },
  {
    id: 5,
    name: "Research Support",
    description: "Get help with research and citation guidance",
    icon: Search,
    color: "#f59e0b",
    available: true,
  },
  {
    id: 6,
    name: "Digital Resources",
    description: "Access online databases and digital collections",
    icon: Download,
    color: "#0891b2",
    available: true,
  },
];

const studyAreas = [
  {
    id: 1,
    name: "Silent Study Zone",
    floor: "Ground Floor",
    capacity: 80,
    currentOccupancy: 45,
    features: ["No Talking", "Individual Desks", "Power Outlets"],
    icon: VolumeX,
    color: "#dc2626",
  },
  {
    id: 2,
    name: "Collaborative Study Area",
    floor: "1st Floor",
    capacity: 120,
    currentOccupancy: 67,
    features: ["Group Discussion", "Whiteboards", "Comfortable Seating"],
    icon: Volume2,
    color: "#059669",
  },
  {
    id: 3,
    name: "Computer Lab",
    floor: "2nd Floor",
    capacity: 50,
    currentOccupancy: 38,
    features: ["Desktop Computers", "Software Access", "Printing"],
    icon: Computer,
    color: "#3b82f6",
  },
  {
    id: 4,
    name: "Reading Lounge",
    floor: "3rd Floor",
    capacity: 60,
    currentOccupancy: 23,
    features: ["Comfortable Chairs", "Natural Light", "Quiet Environment"],
    icon: BookOpen,
    color: "#7c3aed",
  },
];

const quickStats = [
  {
    label: "Current Occupancy",
    value: `${libraryInfo.currentOccupancy}/${libraryInfo.maxCapacity}`,
    icon: Users,
    color: "#3b82f6",
  },
  {
    label: "Available Computers",
    value: `${libraryInfo.availableComputers}/${libraryInfo.totalComputers}`,
    icon: Computer,
    color: "#059669",
  },
  { label: "Study Areas", value: "4", icon: MapPin, color: "#dc2626" },
  { label: "Open Hours", value: "24/7*", icon: Clock, color: "#7c3aed" },
];

const recentBooks = [
  {
    id: 1,
    title: "Introduction to Algorithms",
    author: "Thomas H. Cormen",
    category: "Computer Science",
    available: true,
    location: "CS Section - 2nd Floor",
    image:
      "https://images.pexels.com/photos/159866/books-book-pages-read-159866.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    id: 2,
    title: "Principles of Economics",
    author: "N. Gregory Mankiw",
    category: "Business",
    available: false,
    location: "Business Section - 1st Floor",
    image:
      "https://images.pexels.com/photos/159832/book-reading-reading-book-open-159832.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    id: 3,
    title: "Engineering Mechanics",
    author: "R.C. Hibbeler",
    category: "Engineering",
    available: true,
    location: "Engineering Section - 2nd Floor",
    image:
      "https://images.pexels.com/photos/159621/open-book-library-education-read-159621.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
];

export default function LibraryScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  };

  const handleServicePress = (serviceId: number) => {
    console.log("Accessing service:", serviceId);
  };

  const handleBookRoom = (areaId: number) => {
    console.log("Booking study area:", areaId);
  };

  const handleCallLibrary = () => {
    console.log("Calling library:", libraryInfo.phone);
  };

  const handleWebsitePress = () => {
    console.log("Opening library website:", libraryInfo.website);
  };

  const getCurrentDay = () => {
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

  const getOccupancyColor = (occupancy: number, capacity: number) => {
    const percentage = (occupancy / capacity) * 100;
    if (percentage < 50) return "#22c55e";
    if (percentage < 80) return "#f59e0b";
    return "#ef4444";
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
      fontWeight: "500"
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
        <Text style={styles.headerTitle}>Library</Text>
        <TouchableOpacity
          style={styles.websiteButton}
          onPress={handleWebsitePress}
        >
          <ExternalLink color="white" size={16} />
          <Text style={styles.websiteButtonText}>Catalog</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.heroSection}>
          <Image
            source={{ uri: libraryInfo.image }}
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

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search books, authors, or topics..."
            placeholderTextColor={theme.colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Library Services</Text>
          <View style={styles.servicesGrid}>
            {libraryServices.map((service) => {
              const IconComponent = service.icon;
              return (
                <TouchableOpacity
                  key={service.id}
                  style={[
                    styles.serviceCard,
                    !service.available && styles.serviceCardDisabled,
                  ]}
                  onPress={() => handleServicePress(service.id)}
                  disabled={!service.available}
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
                  {!service.available && (
                    <View style={styles.unavailableBadge}>
                      <Text style={styles.unavailableText}>Unavailable</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Study Areas</Text>
          {studyAreas.map((area) => {
            // const IconComponent = area.icon;
            // const occupancyPercentage =
            //   (area.currentOccupancy / area.capacity) * 100;
            const occupancyColor = getOccupancyColor(
              area.currentOccupancy,
              area.capacity
            );

            return (
              <View key={area.id} style={styles.studyAreaCard}>
                <View style={styles.studyAreaHeader}>
                  <View style={styles.studyAreaInfo}>
                    <Text style={styles.studyAreaName}>{area.name}</Text>
                    <Text style={styles.studyAreaFloor}>{area.floor}</Text>
                  </View>
                  <View
                    style={[
                      styles.occupancyBadge,
                      { backgroundColor: occupancyColor },
                    ]}
                  >
                    <Text style={styles.occupancyText}>
                      {area.currentOccupancy}/{area.capacity}
                    </Text>
                  </View>
                </View>

                <View style={styles.featuresContainer}>
                  {area.features.map((feature, index) => (
                    <View key={index} style={styles.featureTag}>
                      <Text style={styles.featureText}>{feature}</Text>
                    </View>
                  ))}
                </View>

                <TouchableOpacity
                  style={styles.bookButton}
                  onPress={() => handleBookRoom(area.id)}
                >
                  <Text style={styles.bookButtonText}>Reserve Space</Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Popular Books</Text>
          {recentBooks.map((book) => (
            <View key={book.id} style={styles.bookCard}>
              <View style={styles.bookHeader}>
                <Image
                  source={{ uri: book.image }}
                  style={styles.bookImage}
                  resizeMode="cover"
                />
                <View style={styles.bookInfo}>
                  <Text style={styles.bookTitle}>{book.title}</Text>
                  <Text style={styles.bookAuthor}>by {book.author}</Text>
                  <Text style={styles.bookCategory}>{book.category}</Text>
                </View>
              </View>
              <View style={styles.bookMeta}>
                <Text style={styles.bookLocation}>{book.location}</Text>
                <View
                  style={[
                    styles.availabilityBadge,
                    { backgroundColor: book.available ? "#22c55e" : "#ef4444" },
                  ]}
                >
                  <Text style={styles.availableText}>
                    {book.available ? "Available" : "Checked Out"}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Hours & Contact</Text>
          <View style={styles.hoursCard}>
            <View style={styles.hoursContainer}>
              {Object.entries(libraryInfo.hours).map(([day, hours]) => {
                const currentDay = getCurrentDay();
                return (
                  <View
                    key={day}
                    style={[
                      styles.hoursRow,
                      day === currentDay && styles.currentDay,
                    ]}
                  >
                    <Text style={styles.dayText}>{day}</Text>
                    <Text style={styles.hoursText}>{hours}</Text>
                  </View>
                );
              })}
            </View>

            <View style={styles.contactActions}>
              <TouchableOpacity
                style={styles.contactButton}
                onPress={handleCallLibrary}
              >
                <Phone color="white" size={20} />
                <Text style={styles.contactButtonText}>Call</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.contactButton, styles.contactButtonSecondary]}
              >
                <MapPin color={theme.colors.text} size={20} />
                <Text
                  style={[
                    styles.contactButtonText,
                    styles.contactButtonTextSecondary,
                  ]}
                >
                  Directions
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
