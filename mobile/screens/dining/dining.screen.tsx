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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  Clock,
  MapPin,
  Star,
  CreditCard,
  Utensils,
//   Coffee,
//   ShoppingBag,
  ExternalLink,
  Phone,
  Wallet,
  DollarSign,
} from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";

// Mock dining data with correct vendors
const diningVendors = [
  {
    id: 1,
    name: "HallMark Restaurant",
    type: "Restaurant",
    description:
      "Premium dining experience offering traditional Ghanaian cuisine and international dishes with excellent service.",
    image:
      "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400",
    hours: {
      monday: "6:00 AM - 10:00 PM",
      tuesday: "6:00 AM - 10:00 PM",
      wednesday: "6:00 AM - 10:00 PM",
      thursday: "6:00 AM - 10:00 PM",
      friday: "6:00 AM - 10:00 PM",
      saturday: "7:00 AM - 9:00 PM",
      sunday: "7:00 AM - 9:00 PM",
    },
    location: "Student Center, Ground Floor",
    rating: 4.5,
    reviews: 189,
    acceptsMealPlan: true,
    phone: "+233 30 610 330",
    features: [
      "Traditional Ghanaian",
      "International Cuisine",
      "Vegetarian Options",
      "Takeout Available",
    ],
    currentStatus: "Open",
    nextMeal: "Dinner at 5:00 PM",
  },
  {
    id: 2,
    name: "Munchies Restaurant",
    type: "Restaurant",
    description:
      "Casual dining spot perfect for quick meals, snacks, and comfort food favorites among students.",
    image:
      "https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=400",
    hours: {
      monday: "7:00 AM - 9:00 PM",
      tuesday: "7:00 AM - 9:00 PM",
      wednesday: "7:00 AM - 9:00 PM",
      thursday: "7:00 AM - 9:00 PM",
      friday: "7:00 AM - 9:00 PM",
      saturday: "8:00 AM - 8:00 PM",
      sunday: "8:00 AM - 8:00 PM",
    },
    location: "Academic Block B, Ground Floor",
    rating: 4.2,
    reviews: 156,
    acceptsMealPlan: true,
    phone: "+233 30 610 331",
    features: [
      "Quick Service",
      "Comfort Food",
      "Student Favorites",
      "Affordable Prices",
    ],
    currentStatus: "Open",
    nextMeal: "Lunch specials at 12:00 PM",
  },
  {
    id: 3,
    name: "Akorno Restaurant",
    type: "Restaurant",
    description:
      "Authentic local cuisine restaurant specializing in traditional Ghanaian dishes and regional specialties.",
    image:
      "https://images.pexels.com/photos/1199957/pexels-photo-1199957.jpeg?auto=compress&cs=tinysrgb&w=400",
    hours: {
      monday: "11:00 AM - 8:00 PM",
      tuesday: "11:00 AM - 8:00 PM",
      wednesday: "11:00 AM - 8:00 PM",
      thursday: "11:00 AM - 8:00 PM",
      friday: "11:00 AM - 8:00 PM",
      saturday: "11:00 AM - 7:00 PM",
      sunday: "12:00 PM - 7:00 PM",
    },
    location: "Near Sports Complex",
    rating: 4.7,
    reviews: 203,
    acceptsMealPlan: true,
    phone: "+233 30 610 332",
    features: [
      "Authentic Local Cuisine",
      "Traditional Recipes",
      "Fresh Ingredients",
      "Cultural Experience",
    ],
    currentStatus: "Open",
    nextMeal: null,
  },
  {
    id: 4,
    name: "Essential Shop",
    type: "Convenience Store",
    description:
      "Campus convenience store offering snacks, beverages, toiletries, and essential items for students.",
    image:
      "https://images.pexels.com/photos/2292919/pexels-photo-2292919.jpeg?auto=compress&cs=tinysrgb&w=400",
    hours: {
      monday: "7:00 AM - 11:00 PM",
      tuesday: "7:00 AM - 11:00 PM",
      wednesday: "7:00 AM - 11:00 PM",
      thursday: "7:00 AM - 11:00 PM",
      friday: "7:00 AM - 11:00 PM",
      saturday: "8:00 AM - 10:00 PM",
      sunday: "8:00 AM - 10:00 PM",
    },
    location: "Academic Block A, Ground Floor",
    rating: 4.3,
    reviews: 89,
    acceptsMealPlan: true,
    phone: "+233 30 610 333",
    features: [
      "24/7 Vending",
      "Mobile Payment",
      "Student Discounts",
      "Quick Service",
    ],
    currentStatus: "Open",
    nextMeal: null,
  },
  {
    id: 5,
    name: "Hakuna Cafe",
    type: "Coffee Shop",
    description:
      "Cozy coffee shop serving premium coffee, pastries, light meals, and providing a perfect study atmosphere.",
    image:
      "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=400",
    hours: {
      monday: "6:30 AM - 8:00 PM",
      tuesday: "6:30 AM - 8:00 PM",
      wednesday: "6:30 AM - 8:00 PM",
      thursday: "6:30 AM - 8:00 PM",
      friday: "6:30 AM - 8:00 PM",
      saturday: "8:00 AM - 6:00 PM",
      sunday: "8:00 AM - 6:00 PM",
    },
    location: "Library Building, 1st Floor",
    rating: 4.8,
    reviews: 267,
    acceptsMealPlan: true,
    phone: "+233 30 610 334",
    features: [
      "Specialty Coffee",
      "Free WiFi",
      "Study Space",
      "Fresh Pastries",
    ],
    currentStatus: "Open",
    nextMeal: null,
  },
];

const mealPlanInfo = {
  balance: "GH₵ 450.00",
  weeklySpent: "GH₵ 85.50",
  weeklyLimit: "GH₵ 120.00",
  lastTransaction: "Hakuna Cafe - GH₵ 12.50",
  transactionTime: "2 hours ago",
};

const quickStats = [
  {
    label: "Meal Plan Balance",
    value: mealPlanInfo.balance,
    icon: Wallet,
    color: "#3b82f6",
  },
  {
    label: "Weekly Spent",
    value: mealPlanInfo.weeklySpent,
    icon: DollarSign,
    color: "#059669",
  },
  { label: "Available Vendors", value: "5", icon: Utensils, color: "#dc2626" },
  { label: "Open Now", value: "5", icon: Clock, color: "#7c3aed" },
];

export default function DiningScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<number | null>(null);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  };

  const handleVendorPress = (vendorId: number) => {
    setSelectedVendor(selectedVendor === vendorId ? null : vendorId);
  };

  const handleMealPlanPress = () => {
    // Open meal plan website
    console.log("Opening meal plan website: www.ashesi.edu.gh/meal-plan");
  };

  const handleCallVendor = (phone: string) => {
    console.log("Calling vendor:", phone);
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

//   const getVendorIcon = (type: string) => {
//     switch (type) {
//       case "Restaurant":
//         return Utensils;
//       case "Coffee Shop":
//         return Coffee;
//       case "Convenience Store":
//         return ShoppingBag;
//       default:
//         return Utensils;
//     }
//   };

  const styles = StyleSheet.create({
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
      padding: theme.spacing.xs,
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
    mealPlanCard: {
      backgroundColor: theme.colors.primary + "10",
      margin: theme.spacing.md,
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.xl,
      borderWidth: 1,
      borderColor: theme.colors.primary + "30",
    },
    mealPlanTitle: {
      ...theme.typography.h5,
      color: theme.colors.text,
      fontWeight: "700",
      marginBottom: theme.spacing.sm,
    },
    mealPlanBalance: {
      ...theme.typography.h4,
      color: theme.colors.primary,
      fontWeight: "800",
      marginBottom: theme.spacing.sm,
    },
    mealPlanDetails: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: theme.spacing.sm,
    } as ViewStyle,
    mealPlanDetail: {
      flex: 1,
    },
    mealPlanDetailLabel: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      marginBottom: 2,
    } as TextStyle,
    mealPlanDetailValue: {
      ...theme.typography.body,
      color: theme.colors.text,
      fontWeight: "600",
    },
    lastTransaction: {
      backgroundColor: theme.colors.background,
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.lg,
      marginTop: theme.spacing.md,
    },
    lastTransactionTitle: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.xs,
    } as TextStyle,
    lastTransactionText: {
      ...theme.typography.body,
      color: theme.colors.text,
      fontWeight: "600",
    },
    vendorsContainer: {
      paddingHorizontal: theme.spacing.md,
    },
    sectionTitle: {
      ...theme.typography.h4,
      color: theme.colors.text,
      fontWeight: "700",
      marginBottom: theme.spacing.lg,
    },
    vendorCard: {
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
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    vendorImage: {
      width: "100%",
      height: 180,
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
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.sm,
    } as TextStyle,
    statusBadge: {
      backgroundColor: theme.colors.success,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.xxxl,
    },
    statusText: {
      ...theme.typography.captionSmall,
      color: "white",
      fontWeight: "700",
    },
    vendorDescription: {
      ...theme.typography.body,
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
    } as TextStyle,
    vendorMeta: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.lg,
      marginBottom: theme.spacing.md,
    },
    metaItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.xs,
    },
    metaText: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      fontWeight: "500",
    },
    ratingContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.xs,
    },
    mealPlanAccepted: {
      backgroundColor: theme.colors.accent + "20",
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.lg,
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.xs,
      marginBottom: theme.spacing.sm,
    },
    mealPlanAcceptedText: {
      ...theme.typography.bodySmall,
      color: theme.colors.accent,
      fontWeight: "600",
    },
    vendorActions: {
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
    expandedContent: {
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
      paddingTop: theme.spacing.lg,
      marginTop: theme.spacing.lg,
    },
    hoursTitle: {
      ...theme.typography.body,
      color: theme.colors.text,
      fontWeight: "600",
      marginBottom: theme.spacing.md,
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
    featuresTitle: {
      ...theme.typography.body,
      color: theme.colors.text,
      fontWeight: "600",
      marginBottom: theme.spacing.md,
    },
    featuresContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: theme.spacing.sm,
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
        <Text style={styles.headerTitle}>Dining</Text>
        <TouchableOpacity
          style={styles.mealPlanButton}
          onPress={handleMealPlanPress}
        >
          <ExternalLink color="white" size={16} />
          <Text style={styles.mealPlanButtonText}>Meal Plan</Text>
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

        <View style={styles.mealPlanCard}>
          <Text style={styles.mealPlanTitle}>Meal Plan Balance</Text>
          <Text style={styles.mealPlanBalance}>{mealPlanInfo.balance}</Text>

          <View style={styles.mealPlanDetails}>
            <View style={styles.mealPlanDetail}>
              <Text style={styles.mealPlanDetailLabel}>Weekly Spent</Text>
              <Text style={styles.mealPlanDetailValue}>
                {mealPlanInfo.weeklySpent}
              </Text>
            </View>
            <View style={styles.mealPlanDetail}>
              <Text style={styles.mealPlanDetailLabel}>Weekly Limit</Text>
              <Text style={styles.mealPlanDetailValue}>
                {mealPlanInfo.weeklyLimit}
              </Text>
            </View>
          </View>

          <View style={styles.lastTransaction}>
            <Text style={styles.lastTransactionTitle}>Last Transaction</Text>
            <Text style={styles.lastTransactionText}>
              {mealPlanInfo.lastTransaction} • {mealPlanInfo.transactionTime}
            </Text>
          </View>
        </View>

        <View style={styles.vendorsContainer}>
          <Text style={styles.sectionTitle}>Dining Options</Text>

          {diningVendors.map((vendor) => {
            // const IconComponent = getVendorIcon(vendor.type);
            const isExpanded = selectedVendor === vendor.id;
            const currentDay = getCurrentDay();

            return (
              <TouchableOpacity
                key={vendor.id}
                style={styles.vendorCard}
                onPress={() => handleVendorPress(vendor.id)}
                activeOpacity={0.95}
              >
                <Image
                  source={{ uri: vendor.image }}
                  style={styles.vendorImage}
                  resizeMode="cover"
                />

                <View style={styles.vendorContent}>
                  <View style={styles.vendorHeader}>
                    <View style={styles.vendorInfo}>
                      <Text style={styles.vendorName}>{vendor.name}</Text>
                      <Text style={styles.vendorType}>{vendor.type}</Text>
                    </View>
                    <View style={styles.statusBadge}>
                      <Text style={styles.statusText}>
                        {vendor.currentStatus}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.vendorDescription}>
                    {vendor.description}
                  </Text>

                  <View style={styles.vendorMeta}>
                    <View style={styles.metaItem}>
                      <MapPin color={theme.colors.textSecondary} size={16} />
                      <Text style={styles.metaText}>{vendor.location}</Text>
                    </View>
                    <View style={styles.ratingContainer}>
                      <Star color="#f59e0b" size={16} fill="#f59e0b" />
                      <Text style={styles.metaText}>
                        {vendor.rating} ({vendor.reviews})
                      </Text>
                    </View>
                  </View>

                  {vendor.acceptsMealPlan && (
                    <View style={styles.mealPlanAccepted}>
                      <CreditCard color={theme.colors.accent} size={16} />
                      <Text style={styles.mealPlanAcceptedText}>
                        Accepts Meal Plan
                      </Text>
                    </View>
                  )}

                  {vendor.nextMeal && (
                    <View style={styles.mealPlanAccepted}>
                      <Clock color={theme.colors.accent} size={16} />
                      <Text style={styles.mealPlanAcceptedText}>
                        {vendor.nextMeal}
                      </Text>
                    </View>
                  )}

                  <View style={styles.vendorActions}>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleCallVendor(vendor.phone)}
                    >
                      <Phone color="white" size={18} />
                      <Text style={styles.actionButtonText}>Call</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.actionButton,
                        styles.actionButtonSecondary,
                      ]}
                    >
                      <MapPin color={theme.colors.text} size={18} />
                      <Text
                        style={[
                          styles.actionButtonText,
                          styles.actionButtonTextSecondary,
                        ]}
                      >
                        Directions
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {isExpanded && (
                    <View style={styles.expandedContent}>
                      <Text style={styles.hoursTitle}>Opening Hours</Text>
                      <View style={styles.hoursContainer}>
                        {Object.entries(vendor.hours).map(([day, hours]) => (
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
                        ))}
                      </View>

                      <Text style={styles.featuresTitle}>Features</Text>
                      <View style={styles.featuresContainer}>
                        {vendor.features.map((feature, index) => (
                          <View key={index} style={styles.featureTag}>
                            <Text style={styles.featureText}>{feature}</Text>
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
    </SafeAreaView>
  );
}
