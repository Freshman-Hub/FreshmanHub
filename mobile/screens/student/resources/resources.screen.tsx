import React, { useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Animated,
  Image,
  RefreshControl,
  ViewStyle,
  TextStyle,
  ImageStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Search,
  Filter,
  BookOpen,
  FileText,
  Video,
  Download,
  Star,
  Clock,
  X,
  GraduationCap,
  Calculator,
  TrendingUp,
  Heart,
  Zap,
  Code,
  Calendar,
  Briefcase,
} from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";

// Mock resources data
const resourceCategories = [
  { name: "All", icon: BookOpen, color: "#64748b" },
  { name: "Academic", icon: GraduationCap, color: "#3b82f6" },
  { name: "Study Guides", icon: FileText, color: "#059669" },
  { name: "Videos", icon: Video, color: "#dc2626" },
  { name: "Tools", icon: Calculator, color: "#7c3aed" },
  { name: "Career", icon: Briefcase, color: "#f59e0b" },
];

const featuredResources = [
  {
    id: 1,
    title: "Complete Study Guide: Calculus I",
    description:
      "Comprehensive guide covering all topics in Calculus I with examples and practice problems",
    category: "Study Guides",
    type: "PDF",
    rating: 4.8,
    downloads: 1234,
    duration: "45 min read",
    author: "Dr. Sarah Johnson",
    image:
      "https://images.pexels.com/photos/6256/mathematics-computation-mathe-algebra.jpg?auto=compress&cs=tinysrgb&w=400",
    tags: ["Mathematics", "Calculus", "Study Guide"],
    isFavorite: false,
    isPremium: false,
  },
  {
    id: 2,
    title: "Programming Fundamentals Video Series",
    description:
      "Learn the basics of programming with Python through interactive video lessons",
    category: "Videos",
    type: "Video Series",
    rating: 4.9,
    downloads: 2156,
    duration: "8 hours",
    author: "Prof. Michael Chen",
    image:
      "https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=400",
    tags: ["Programming", "Python", "Beginner"],
    isFavorite: true,
    isPremium: false,
  },
  {
    id: 3,
    title: "Academic Writing Toolkit",
    description:
      "Essential tools and templates for academic writing, citations, and research",
    category: "Tools",
    type: "Toolkit",
    rating: 4.7,
    downloads: 987,
    duration: "30 min setup",
    author: "Writing Center",
    image:
      "https://images.pexels.com/photos/261763/pexels-photo-261763.jpeg?auto=compress&cs=tinysrgb&w=400",
    tags: ["Writing", "Research", "Citations"],
    isFavorite: false,
    isPremium: true,
  },
];

const quickAccess = [
  {
    id: 1,
    title: "Library Catalog",
    description: "Search books and resources",
    icon: BookOpen,
    color: "#3b82f6",
    bgColor: "#eff6ff",
  },
  {
    id: 2,
    title: "Study Planner",
    description: "Plan your study schedule",
    icon: Calendar,
    color: "#059669",
    bgColor: "#ecfdf5",
  },
  {
    id: 3,
    title: "Grade Calculator",
    description: "Calculate your GPA",
    icon: Calculator,
    color: "#dc2626",
    bgColor: "#fef2f2",
  },
  {
    id: 4,
    title: "Citation Generator",
    description: "Generate citations easily",
    icon: FileText,
    color: "#7c3aed",
    bgColor: "#f3e8ff",
  },
];

const subjectResources = [
  {
    subject: "Computer Science",
    icon: Code,
    color: "#3b82f6",
    resources: 45,
    image:
      "https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    subject: "Mathematics",
    icon: Calculator,
    color: "#059669",
    resources: 38,
    image:
      "https://images.pexels.com/photos/6256/mathematics-computation-mathe-algebra.jpg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    subject: "Business",
    icon: TrendingUp,
    color: "#f59e0b",
    resources: 32,
    image:
      "https://images.pexels.com/photos/590020/pexels-photo-590020.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    subject: "Engineering",
    icon: Zap,
    color: "#dc2626",
    resources: 28,
    image:
      "https://images.pexels.com/photos/159298/gears-cogs-machine-machinery-159298.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
];

export default function ResourcesScreen() {
  const { theme } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [resources, setResources] = useState(featuredResources);

  const searchWidth = useRef(new Animated.Value(44)).current;
  const searchOpacity = useRef(new Animated.Value(0)).current;

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  };

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

  const handleFavorite = (resourceId: number) => {
    setResources((prev) =>
      prev.map((resource) =>
        resource.id === resourceId
          ? { ...resource, isFavorite: !resource.isFavorite }
          : resource
      )
    );
  };

  const filteredResources = resources.filter((resource) => {
    const matchesCategory =
      selectedCategory === "All" || resource.category === selectedCategory;
    const matchesSearch =
      searchQuery === "" ||
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );

    return matchesCategory && matchesSearch;
  });

  const styles = StyleSheet.create<{
    container: ViewStyle;
    headerContainer: ViewStyle;
    headerTop: ViewStyle;
    title: TextStyle;
    headerActions: ViewStyle;
    searchContainer: ViewStyle;
    searchInput: TextStyle;
    searchButton: ViewStyle;
    filterButton: ViewStyle;
    scrollContent: ViewStyle;
    categoriesContainer: ViewStyle;
    categoriesScroll: ViewStyle;
    categoryChip: ViewStyle;
    categoryChipActive: ViewStyle;
    categoryChipText: TextStyle;
    categoryChipTextActive: TextStyle;
    quickAccessContainer: ViewStyle;
    sectionTitle: TextStyle;
    quickAccessGrid: ViewStyle;
    quickAccessItem: ViewStyle;
    quickAccessIcon: ViewStyle;
    quickAccessTitle: TextStyle;
    quickAccessDescription: TextStyle;
    subjectsContainer: ViewStyle;
    subjectsScroll: ViewStyle;
    subjectCard: ViewStyle;
    subjectImage: ViewStyle;
    subjectOverlay: ViewStyle;
    subjectContent: ViewStyle;
    subjectName: TextStyle;
    subjectResources: TextStyle;
    resourcesContainer: ViewStyle;
    resourceCard: ViewStyle;
    resourceHeader: ViewStyle;
    resourceImage: ImageStyle;
    resourceImageOverlay: ViewStyle;
    resourceBadges: ViewStyle;
    typeBadge: ViewStyle;
    typeBadgeText: TextStyle;
    premiumBadge: ViewStyle;
    premiumBadgeText: TextStyle;
    favoriteButton: ViewStyle;
    resourceContent: ViewStyle;
    resourceTitle: TextStyle;
    resourceDescription: TextStyle;
    resourceMeta: ViewStyle;
    resourceMetaLeft: ViewStyle;
    metaItem: ViewStyle;
    metaText: TextStyle;
    resourceAuthor: TextStyle;
    resourceTags: ViewStyle;
    tag: ViewStyle;
    tagText: TextStyle;
    downloadButton: ViewStyle;
    downloadButtonText: TextStyle;
    noResultsContainer: ViewStyle;
    noResultsText: TextStyle;
  }>({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    headerContainer: {
      backgroundColor: theme.colors.surface,
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.sm,
      paddingBottom: 0,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    headerTop: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: theme.spacing.md,
    },
    title: {
      ...theme.typography.h4,
      color: theme.colors.text,
      fontWeight: "700",
      fontSize: 24,
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
      paddingHorizontal: theme.spacing.xs,
      height: 40,
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
    filterButton: {
      backgroundColor: theme.colors.background,
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.xxxl,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    scrollContent: {
      paddingBottom: theme.spacing.md,
    },
    categoriesContainer: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.md,
    },
    categoriesScroll: {
      flexDirection: "row",
      gap: theme.spacing.sm,
    },
    categoryChip: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.xxxl,
      backgroundColor: theme.colors.surface,
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
    quickAccessContainer: {
      paddingHorizontal: theme.spacing.md,
      marginBottom: theme.spacing.md,
    },
    sectionTitle: {
      ...theme.typography.h4,
      color: theme.colors.text,
      fontWeight: "700",
      marginBottom: theme.spacing.md,
    },
    quickAccessGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
      gap: theme.spacing.sm,
    },
    quickAccessItem: {
      width: "48%",
      backgroundColor: theme.colors.surface,
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: theme.spacing.md,
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
    },
    quickAccessIcon: {
      width: 45,
      height: 45,
      borderRadius: theme.borderRadius.xl,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: theme.spacing.md,
    },
    quickAccessTitle: {
      ...theme.typography.body,
      color: theme.colors.text,
      fontWeight: "600",
      textAlign: "center",
      marginBottom: 4,
    },
    quickAccessDescription: {
      ...theme.typography.caption,
      color: theme.colors.textSecondary,
      textAlign: "center",
    } as TextStyle,
    subjectsContainer: {
      paddingHorizontal: theme.spacing.md,
      marginBottom: theme.spacing.md,
    },
    subjectsScroll: {
      flexDirection: "row",
        gap: theme.spacing.sm,
        paddingBottom: theme.spacing.md,
    },
    subjectCard: {
      width: 200,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      overflow: "hidden",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 6,
      },
      shadowOpacity: 0.15,
      shadowRadius: 10,
      elevation: 5,
    },
    subjectImage: {
      width: "100%",
      height: 100,
    },
    subjectOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0,0,0,0.4)",
      alignItems: "center",
      justifyContent: "center",
    },
    subjectContent: {
      padding: theme.spacing.md,
    },
    subjectName: {
      ...theme.typography.h6,
      color: theme.colors.text,
      fontWeight: "700",
      marginBottom: 4,
    },
    subjectResources: {
      ...theme.typography.caption,
      color: theme.colors.textSecondary,
    } as TextStyle,
    resourcesContainer: {
      paddingHorizontal: theme.spacing.md,
    },
    resourceCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      marginBottom: theme.spacing.md,
      overflow: "hidden",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 6,
      },
      shadowOpacity: 0.15,
      shadowRadius: 10,
      elevation: 5,
    },
    resourceHeader: {
      position: "relative",
      height: 200,
    },
    resourceImage: {
      width: "100%",
      height: "100%",
    },
    resourceImageOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0,0,0,0.3)",
    },
    resourceBadges: {
      position: "absolute",
      top: theme.spacing.lg,
      left: theme.spacing.lg,
      right: theme.spacing.lg,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
    },
    typeBadge: {
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.lg,
    },
    typeBadgeText: {
      ...theme.typography.bodySmall,
      color: theme.colors.primary,
      fontWeight: "700",
    },
    premiumBadge: {
      backgroundColor: "#f59e0b",
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.lg,
    },
    premiumBadgeText: {
      ...theme.typography.bodySmall,
      color: "white",
      fontWeight: "700",
    },
    favoriteButton: {
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.xxxl,
    },
    resourceContent: {
      padding: theme.spacing.lg,
    },
    resourceTitle: {
      ...theme.typography.h6,
      color: theme.colors.text,
      fontWeight: "700",
      marginBottom: theme.spacing.sm,
    },
    resourceDescription: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.md,
    } as TextStyle,
    resourceMeta: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: theme.spacing.md,
    },
    resourceMetaLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.lg,
    },
    metaItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.xs,
    },
    metaText: {
      ...theme.typography.caption,
      color: theme.colors.textSecondary,
      fontWeight: "500",
    },
    resourceAuthor: {
      ...theme.typography.bodySmall,
      color: theme.colors.text,
      fontWeight: "600",
    },
    resourceTags: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: theme.spacing.xs,
      marginBottom: theme.spacing.md,
    },
    tag: {
      backgroundColor: theme.colors.background,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.xxxl,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    tagText: {
      ...theme.typography.captionSmall,
      color: theme.colors.textSecondary,
      fontWeight: "600",
    },
    downloadButton: {
      backgroundColor: theme.colors.primary,
      paddingVertical: theme.spacing.md,
      borderRadius: theme.borderRadius.xxxl,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: theme.spacing.sm,
    },
    downloadButtonText: {
      ...theme.typography.button,
      color: "white",
      fontWeight: "700",
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
      <View style={styles.headerContainer}>
        <View style={styles.headerTop}>
          <Text style={styles.title}>Resources</Text>
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
                      placeholder="Search resources..."
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
            <TouchableOpacity style={styles.filterButton}>
              <Filter color={theme.colors.textSecondary} size={22} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.categoriesContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesScroll}
          >
            {resourceCategories.map((category) => {
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

        <View style={styles.quickAccessContainer}>
          <Text style={styles.sectionTitle}>Quick Access</Text>
          <View style={styles.quickAccessGrid}>
            {quickAccess.map((item) => {
              const IconComponent = item.icon;
              return (
                <TouchableOpacity key={item.id} style={styles.quickAccessItem}>
                  <View
                    style={[
                      styles.quickAccessIcon,
                      { backgroundColor: item.bgColor },
                    ]}
                  >
                    <IconComponent color={item.color} size={28} />
                  </View>
                  <Text style={styles.quickAccessTitle}>{item.title}</Text>
                  <Text style={styles.quickAccessDescription}>
                    {item.description}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.subjectsContainer}>
          <Text style={styles.sectionTitle}>Browse by Subject</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.subjectsScroll}
          >
            {subjectResources.map((subject, index) => {
              const IconComponent = subject.icon;
              return (
                <TouchableOpacity key={index} style={styles.subjectCard}>
                  <View style={styles.subjectImage}>
                    <Image
                      source={{ uri: subject.image }}
                      style={{ width: "100%", height: "100%" }}
                      resizeMode="cover"
                    />
                    <View style={styles.subjectOverlay}>
                      <IconComponent color="white" size={32} />
                    </View>
                  </View>
                  <View style={styles.subjectContent}>
                    <Text style={styles.subjectName}>{subject.subject}</Text>
                    <Text style={styles.subjectResources}>
                      {subject.resources} resources
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        <View style={styles.resourcesContainer}>
          <Text style={styles.sectionTitle}>Featured Resources</Text>
          {filteredResources.length > 0 ? (
            filteredResources.map((resource) => (
              <View key={resource.id} style={styles.resourceCard}>
                <View style={styles.resourceHeader}>
                  <Image
                    source={{ uri: resource.image }}
                    style={styles.resourceImage}
                    resizeMode="cover"
                  />
                  <View style={styles.resourceImageOverlay} />
                  <View style={styles.resourceBadges}>
                    <View
                      style={{ flexDirection: "row", gap: theme.spacing.sm }}
                    >
                      <View style={styles.typeBadge}>
                        <Text style={styles.typeBadgeText}>
                          {resource.type}
                        </Text>
                      </View>
                      {resource.isPremium && (
                        <View style={styles.premiumBadge}>
                          <Text style={styles.premiumBadgeText}>Premium</Text>
                        </View>
                      )}
                    </View>
                    <TouchableOpacity
                      style={styles.favoriteButton}
                      onPress={() => handleFavorite(resource.id)}
                    >
                      <Heart
                        color={resource.isFavorite ? "#e11d48" : "#64748b"}
                        size={20}
                        fill={resource.isFavorite ? "#e11d48" : "none"}
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.resourceContent}>
                  <Text style={styles.resourceTitle}>{resource.title}</Text>
                  <Text style={styles.resourceDescription}>
                    {resource.description}
                  </Text>

                  <View style={styles.resourceMeta}>
                    <View style={styles.resourceMetaLeft}>
                      <View style={styles.metaItem}>
                        <Star color="#f59e0b" size={16} fill="#f59e0b" />
                        <Text style={styles.metaText}>{resource.rating}</Text>
                      </View>
                      <View style={styles.metaItem}>
                        <Download
                          color={theme.colors.textSecondary}
                          size={16}
                        />
                        <Text style={styles.metaText}>
                          {resource.downloads}
                        </Text>
                      </View>
                      <View style={styles.metaItem}>
                        <Clock color={theme.colors.textSecondary} size={16} />
                        <Text style={styles.metaText}>{resource.duration}</Text>
                      </View>
                    </View>
                  </View>

                  <Text style={styles.resourceAuthor}>
                    By {resource.author}
                  </Text>

                  <View style={styles.resourceTags}>
                    {resource.tags.map((tag, index) => (
                      <View key={index} style={styles.tag}>
                        <Text style={styles.tagText}>{tag}</Text>
                      </View>
                    ))}
                  </View>

                  <TouchableOpacity style={styles.downloadButton}>
                    <Download color="white" size={20} />
                    <Text style={styles.downloadButtonText}>
                      {resource.isPremium ? "Get Premium" : "Download"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.noResultsContainer}>
              <Text style={styles.noResultsText}>
                {searchQuery
                  ? `No resources found for "${searchQuery}"`
                  : `No resources found in ${selectedCategory} category`}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
