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
  ImageStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  Heart,
  Stethoscope,
  Pill,
  UserCheck,
  Clock,
  MapPin,
  Phone,
  TriangleAlert as AlertTriangle,
  Shield,
  Activity,
  Brain,
  Zap,
} from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";

// Mock health center data
const healthCenter = {
  name: "Ashesi Health Center",
  description:
    "Comprehensive healthcare services available 24/7 for the Ashesi community, providing medical care, counseling, and wellness support.",
  image:
    "https://images.pexels.com/photos/263402/pexels-photo-263402.jpeg?auto=compress&cs=tinysrgb&w=400",
  location: "Campus Health Building",
  phone: "+233 30 610 370",
  emergencyPhone: "+233 30 610 911",
  email: "health@ashesi.edu.gh",
  hours: "24/7 - Always Open",
  currentStatus: "Open",
  waitTime: "10 minutes",
  doctorsOnDuty: 2,
  nursesOnDuty: 4,
};

const healthServices = [
  {
    id: 1,
    name: "General Consultation",
    description: "General medical consultation and health checkups",
    icon: Stethoscope,
    color: "#3b82f6",
    available: true,
    waitTime: "10 min",
  },
  {
    id: 2,
    name: "Emergency Care",
    description: "24/7 emergency medical care and first aid",
    icon: AlertTriangle,
    color: "#ef4444",
    available: true,
    waitTime: "Immediate",
  },
  {
    id: 3,
    name: "Mental Health",
    description: "Counseling and mental health support services",
    icon: Brain,
    color: "#7c3aed",
    available: true,
    waitTime: "15 min",
  },
  {
    id: 4,
    name: "Pharmacy",
    description: "Prescription medications and over-the-counter drugs",
    icon: Pill,
    color: "#059669",
    available: true,
    waitTime: "5 min",
  },
  {
    id: 5,
    name: "Health Screening",
    description: "Regular health screenings and preventive care",
    icon: Activity,
    color: "#f59e0b",
    available: true,
    waitTime: "20 min",
  },
  {
    id: 6,
    name: "Vaccination",
    description: "Immunizations and vaccination services",
    icon: Shield,
    color: "#0891b2",
    available: true,
    waitTime: "8 min",
  },
];

const medicalStaff = [
  {
    id: 1,
    name: "Dr. Akosua Mensah",
    title: "Chief Medical Officer",
    specialization: "General Medicine",
    avatar:
      "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400",
    availability: "Available Now",
    experience: "15 years",
    rating: 4.9,
  },
  {
    id: 2,
    name: "Dr. Kwame Asante",
    title: "Physician",
    specialization: "Emergency Medicine",
    avatar:
      "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=400",
    availability: "Available Now",
    experience: "10 years",
    rating: 4.8,
  },
  {
    id: 3,
    name: "Sarah Johnson",
    title: "Mental Health Counselor",
    specialization: "Psychology",
    avatar:
      "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400",
    availability: "Available at 2:00 PM",
    experience: "8 years",
    rating: 4.9,
  },
];

const upcomingAppointments = [
  {
    id: 1,
    title: "Annual Health Checkup",
    doctor: "Dr. Akosua Mensah",
    date: "Tomorrow",
    time: "10:00 AM",
    type: "General Consultation",
    status: "confirmed",
  },
  {
    id: 2,
    title: "Mental Health Session",
    doctor: "Sarah Johnson",
    date: "Friday",
    time: "2:00 PM",
    type: "Counseling",
    status: "pending",
  },
];

const healthTips = [
  {
    id: 1,
    title: "Stay Hydrated",
    description:
      "Drink at least 8 glasses of water daily to maintain good health",
    icon: Activity,
    color: "#3b82f6",
  },
  {
    id: 2,
    title: "Get Enough Sleep",
    description:
      "Aim for 7-9 hours of quality sleep each night for optimal health",
    icon: Brain,
    color: "#7c3aed",
  },
  {
    id: 3,
    title: "Exercise Regularly",
    description: "Engage in at least 30 minutes of physical activity daily",
    icon: Heart,
    color: "#ef4444",
  },
  {
    id: 4,
    title: "Eat Balanced Meals",
    description: "Include fruits, vegetables, and whole grains in your diet",
    icon: Zap,
    color: "#059669",
  },
];

const quickStats = [
  {
    label: "Doctors on Duty",
    value: healthCenter.doctorsOnDuty.toString(),
    icon: UserCheck,
    color: "#3b82f6",
  },
  {
    label: "Current Wait Time",
    value: healthCenter.waitTime,
    icon: Clock,
    color: "#f59e0b",
  },
  { label: "Services Available", value: "6", icon: Heart, color: "#ef4444" },
  { label: "Open Hours", value: "24/7", icon: Shield, color: "#22c55e" },
];

export default function HealthCenterScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  };

  const handleServicePress = (serviceId: number) => {
    console.log("Requesting health service:", serviceId);
  };

  const handleBookAppointment = (doctorId: number) => {
    console.log("Booking appointment with doctor:", doctorId);
  };

  const handleEmergencyCall = () => {
    console.log("Calling emergency number:", healthCenter.emergencyPhone);
  };

  const handleCallCenter = () => {
    console.log("Calling health center:", healthCenter.phone);
  };

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
        <Text style={styles.headerTitle}>Health Center</Text>
        <TouchableOpacity
          style={styles.emergencyButton}
          onPress={handleEmergencyCall}
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
        <View style={styles.heroSection}>
          <Image
            source={{ uri: healthCenter.image }}
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
                  <View style={styles.waitTime}>
                    <Text style={styles.waitTimeText}>
                      Wait: {service.waitTime}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

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
                <View style={styles.staffRating}>
                  <Heart color="#ef4444" size={16} fill="#ef4444" />
                  <Text style={styles.ratingText}>{staff.rating}</Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.bookButton}
                onPress={() => handleBookAppointment(staff.id)}
              >
                <Text style={styles.bookButtonText}>Book Appointment</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Upcoming Appointments</Text>
          {upcomingAppointments.map((appointment) => (
            <View key={appointment.id} style={styles.appointmentCard}>
              <View style={styles.appointmentHeader}>
                <Text style={styles.appointmentTitle}>{appointment.title}</Text>
                <View style={styles.appointmentStatus}>
                  <Text style={styles.appointmentStatusText}>
                    {appointment.status}
                  </Text>
                </View>
              </View>
              <Text style={styles.appointmentDetails}>
                {appointment.doctor} • {appointment.date} at {appointment.time}
              </Text>
              <Text style={styles.appointmentDetails}>{appointment.type}</Text>
            </View>
          ))}
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Health Tips</Text>
          {healthTips.map((tip) => {
            const IconComponent = tip.icon;
            return (
              <View key={tip.id} style={styles.healthTipCard}>
                <View style={styles.tipHeader}>
                  <IconComponent
                    color={tip.color}
                    size={24}
                    style={styles.tipIcon}
                  />
                  <Text style={styles.tipTitle}>{tip.title}</Text>
                </View>
                <Text style={styles.tipDescription}>{tip.description}</Text>
              </View>
            );
          })}
        </View>

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
            </View>

            <View style={styles.contactActions}>
              <TouchableOpacity
                style={styles.contactButton}
                onPress={handleCallCenter}
              >
                <Phone color="white" size={20} />
                <Text style={styles.contactButtonText}>Call Center</Text>
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
                  Get Directions
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
