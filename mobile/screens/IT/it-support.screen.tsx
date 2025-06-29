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
  Linking,
  TextStyle,
  ViewStyle,
  ImageStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  Wifi,
  Laptop,
  Shield,
  Settings,
  Phone,
  Clock,
  CircleCheck as CheckCircle,
  Wrench,
  Bed,
  Droplets,
  Zap,
  Hammer,
  Mail,
} from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";

// Mock IT support data
const supportCenter = {
  name: "Ashesi Support Center",
  description:
    "Comprehensive support center managing IT services, hostel operations, maintenance, and all campus support needs for students, faculty, and staff.",
  image:
    "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400",
  location: "Student Center, 2nd Floor",
  phone: "+233 30 610 360",
  email: "support@ashesi.edu.gh",
  hours: {
    monday: "8:00 AM - 6:00 PM",
    tuesday: "8:00 AM - 6:00 PM",
    wednesday: "8:00 AM - 6:00 PM",
    thursday: "8:00 AM - 6:00 PM",
    friday: "8:00 AM - 6:00 PM",
    saturday: "10:00 AM - 4:00 PM",
    sunday: "Closed",
  },
  currentStatus: "Open",
  averageWaitTime: "15 minutes",
  ticketsToday: 23,
  resolvedToday: 18,
};

const supportServices = [
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

const quickStats = [
  { label: "Response Time", value: "15 min", icon: Clock, color: "#3b82f6" },
  {
    label: "Issues Resolved",
    value: "18",
    icon: CheckCircle,
    color: "#22c55e",
  },
  {
    label: "Support Rating",
    value: "4.8★",
    icon: CheckCircle,
    color: "#7c3aed",
  },
  { label: "Available Services", value: "8", icon: Wrench, color: "#f59e0b" },
];

const knowledgeBase = [
  {
    id: 1,
    title: "How to Connect to Campus WiFi",
    category: "IT Services",
    views: 1234,
    helpful: 89,
  },
  {
    id: 2,
    title: "Reporting Room Maintenance Issues",
    category: "Hostel Services",
    views: 987,
    helpful: 76,
  },
  {
    id: 3,
    title: "Installing Required Software",
    category: "IT Services",
    views: 756,
    helpful: 65,
  },
  {
    id: 4,
    title: "What to Do When Your Room Key Doesn't Work",
    category: "Hostel Services",
    views: 543,
    helpful: 48,
  },
];

export default function ITSupportScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "IT Services", "Hostel Services"];

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  };

  const handleServicePress = (serviceId: number) => {
    console.log("Requesting support service:", serviceId);
  };

  const handleCallSupport = () => {
    Linking.openURL(`tel:${supportCenter.phone}`);
  };

  const handleEmailSupport = () => {
    Linking.openURL(`mailto:${supportCenter.email}`);
  };

  const handleKnowledgeBasePress = (articleId: number) => {
    console.log("Opening knowledge base article:", articleId);
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

  const filteredServices = supportServices.filter((service) => {
    const matchesCategory =
      selectedCategory === "All" || service.category === selectedCategory;
    const matchesSearch =
      searchQuery === "" ||
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

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
      servicesGrid: ViewStyle;
      serviceCard: ViewStyle;
      serviceIcon: ViewStyle;
      serviceName: TextStyle;
      serviceDescription: TextStyle;
      serviceCategory: ViewStyle;
      serviceCategoryText: TextStyle;
      estimatedTime: ViewStyle;
      estimatedTimeText: TextStyle;
      knowledgeBaseCard: ViewStyle;
      articleTitle: TextStyle;
      articleMeta: ViewStyle;
      articleCategory: TextStyle;
      articleStats: TextStyle;
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
      knowledgeBaseCard: {
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
      articleTitle: {
        ...theme.typography.body,
        color: theme.colors.text,
        fontWeight: "600",
        marginBottom: theme.spacing.sm,
      },
      articleMeta: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      },
      articleCategory: {
        ...theme.typography.bodySmall,
        color: theme.colors.primary,
        fontWeight: "600",
      },
      articleStats: {
        ...theme.typography.bodySmall,
        color: theme.colors.textSecondary,
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
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft color={theme.colors.text} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Support Center</Text>
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
            source={{ uri: supportCenter.image }}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <View style={styles.heroOverlay}>
            <Text style={styles.heroTitle}>{supportCenter.name}</Text>
            <Text style={styles.heroDescription}>
              {supportCenter.description}
            </Text>
          </View>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>{supportCenter.currentStatus}</Text>
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
            placeholder="Search for help or describe your issue..."
            placeholderTextColor={theme.colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

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
                    <View style={styles.serviceCategory}>
                      <Text style={styles.serviceCategoryText}>
                        {service.category}
                      </Text>
                    </View>
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
            <View style={styles.noResultsContainer}>
              <Text style={styles.noResultsText}>
                No services found for &quot;{searchQuery}&quot;
              </Text>
            </View>
          )}
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Knowledge Base</Text>
          {knowledgeBase.map((article) => (
            <TouchableOpacity
              key={article.id}
              style={styles.knowledgeBaseCard}
              onPress={() => handleKnowledgeBasePress(article.id)}
            >
              <Text style={styles.articleTitle}>{article.title}</Text>
              <View style={styles.articleMeta}>
                <Text style={styles.articleCategory}>{article.category}</Text>
                <Text style={styles.articleStats}>
                  {article.views} views • {article.helpful}% helpful
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Contact & Hours</Text>
          <View style={styles.contactCard}>
            <View style={styles.hoursContainer}>
              {Object.entries(supportCenter.hours).map(([day, hours]) => {
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
                onPress={handleCallSupport}
              >
                <Phone color="white" size={20} />
                <Text style={styles.contactButtonText}>Call Support</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.contactButton, styles.contactButtonSecondary]}
                onPress={handleEmailSupport}
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
    </SafeAreaView>
  );
}
