import { useTheme } from "@/contexts/ThemeContext";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  Briefcase,
  Building,
  Calendar,
  Clock,
  DollarSign,
  Download,
  ExternalLink,
  Eye,
  FileText,
  Globe,
  Heart,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Search,
  Star,
  Target,
  TrendingUp,
  Users,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TextStyle,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Mock career services data
const careerCenter = {
  name: "Ashesi Career Services Center",
  description:
    "Empowering students with career development resources, job opportunities, and professional guidance for successful career transitions.",
  image:
    "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400",
  location: "Career Center, 2nd Floor",
  phone: "+233 30 610 450",
  email: "careers@ashesi.edu.gh",
  hours: "8:00 AM - 5:00 PM (Mon-Fri)",
  director: {
    name: "Dr. Patricia Osei",
    title: "Director of Career Services",
    avatar:
      "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400",
    experience: "12 years",
  },
};

const careerStats = [
  { label: "Job Placements", value: "94%", icon: TrendingUp, color: "#22c55e" },
  {
    label: "Active Employers",
    value: "150+",
    icon: Building,
    color: "#3b82f6",
  },
  { label: "Career Events", value: "25", icon: Calendar, color: "#f59e0b" },
  { label: "Alumni Network", value: "2.5K", icon: Users, color: "#7c3aed" },
];

const careerServices = [
  {
    id: 1,
    name: "Career Counseling",
    description: "One-on-one career guidance and planning sessions",
    icon: Target,
    color: "#3b82f6",
    available: true,
    duration: "45 min",
  },
  {
    id: 2,
    name: "Resume Review",
    description: "Professional resume and CV review and optimization",
    icon: FileText,
    color: "#059669",
    available: true,
    duration: "30 min",
  },
  {
    id: 3,
    name: "Interview Preparation",
    description: "Mock interviews and interview skills training",
    icon: MessageCircle,
    color: "#7c3aed",
    available: true,
    duration: "60 min",
  },
  {
    id: 4,
    name: "LinkedIn Profile",
    description: "Professional LinkedIn profile optimization",
    icon: Globe,
    color: "#0891b2",
    available: true,
    duration: "30 min",
  },
  {
    id: 5,
    name: "Networking Events",
    description: "Connect with industry professionals and alumni",
    icon: Users,
    color: "#f59e0b",
    available: true,
    duration: "2-3 hours",
  },
  {
    id: 6,
    name: "Job Search Strategy",
    description: "Develop effective job search and application strategies",
    icon: Search,
    color: "#ef4444",
    available: true,
    duration: "45 min",
  },
];

const jobOpportunities = [
  {
    id: 1,
    title: "Software Engineer Intern",
    company: "MTN Ghana",
    location: "Accra, Ghana",
    type: "Internship",
    salary: "GH₵ 2,000/month",
    posted: "2 days ago",
    deadline: "2 weeks",
    logo: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400",
    requirements: ["Computer Science", "Programming", "JavaScript", "React"],
    description:
      "Join our dynamic tech team as a software engineering intern and gain hands-on experience in web development.",
    isBookmarked: false,
    applicants: 45,
  },
  {
    id: 2,
    title: "Business Analyst",
    company: "Ecobank Ghana",
    location: "Accra, Ghana",
    type: "Full-time",
    salary: "GH₵ 8,000 - 12,000",
    posted: "1 week ago",
    deadline: "1 week",
    logo: "https://images.pexels.com/photos/590020/pexels-photo-590020.jpeg?auto=compress&cs=tinysrgb&w=400",
    requirements: ["Business Administration", "Analytics", "Excel", "SQL"],
    description:
      "Analyze business processes and provide data-driven insights to support strategic decision making.",
    isBookmarked: true,
    applicants: 78,
  },
  {
    id: 3,
    title: "Marketing Coordinator",
    company: "Vodafone Ghana",
    location: "Accra, Ghana",
    type: "Full-time",
    salary: "GH₵ 6,000 - 9,000",
    posted: "3 days ago",
    deadline: "10 days",
    logo: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400",
    requirements: [
      "Marketing",
      "Communications",
      "Digital Marketing",
      "Social Media",
    ],
    description:
      "Coordinate marketing campaigns and support brand development initiatives across multiple channels.",
    isBookmarked: false,
    applicants: 32,
  },
];

const upcomingEvents = [
  {
    id: 1,
    title: "Tech Career Fair 2024",
    date: "March 15, 2024",
    time: "10:00 AM - 4:00 PM",
    location: "Main Auditorium",
    type: "Career Fair",
    attendees: 200,
    companies: 25,
    description:
      "Meet with top tech companies and explore career opportunities in technology.",
  },
  {
    id: 2,
    title: "Resume Writing Workshop",
    date: "March 20, 2024",
    time: "2:00 PM - 4:00 PM",
    location: "Career Center",
    type: "Workshop",
    attendees: 30,
    companies: 0,
    description:
      "Learn how to craft compelling resumes that get noticed by employers.",
  },
  {
    id: 3,
    title: "Alumni Networking Night",
    date: "March 25, 2024",
    time: "6:00 PM - 9:00 PM",
    location: "Student Center",
    type: "Networking",
    attendees: 150,
    companies: 15,
    description:
      "Connect with successful Ashesi alumni across various industries.",
  },
];

const careerResources = [
  {
    id: 1,
    title: "Career Planning Guide",
    type: "PDF Guide",
    downloads: 1234,
    rating: 4.8,
    description:
      "Comprehensive guide to planning your career journey from student to professional.",
  },
  {
    id: 2,
    title: "Interview Questions Database",
    type: "Online Resource",
    downloads: 987,
    rating: 4.9,
    description:
      "Common interview questions and sample answers for various industries.",
  },
  {
    id: 3,
    title: "Salary Negotiation Tips",
    type: "Video Series",
    downloads: 756,
    rating: 4.7,
    description:
      "Learn effective strategies for negotiating your salary and benefits package.",
  },
];

export default function CareerServicesScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedJobType, setSelectedJobType] = useState("All");
  const [jobs, setJobs] = useState(jobOpportunities);

  const jobTypes = ["All", "Full-time", "Internship", "Part-time", "Contract"];

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  };

  const handleServicePress = (serviceId: number) => {
    console.log("Booking career service:", serviceId);
  };

  const handleJobPress = (jobId: number) => {
    console.log("Viewing job details:", jobId);
  };

  const handleBookmarkJob = (jobId: number) => {
    setJobs((prev) =>
      prev.map((job) =>
        job.id === jobId ? { ...job, isBookmarked: !job.isBookmarked } : job
      )
    );
  };

  const handleEventPress = (eventId: number) => {
    console.log("Viewing event details:", eventId);
  };

  const handleResourcePress = (resourceId: number) => {
    console.log("Downloading resource:", resourceId);
  };

  const handleCallCenter = () => {
    console.log("Calling career center:", careerCenter.phone);
  };

  const handleEmailCenter = () => {
    console.log("Emailing career center:", careerCenter.email);
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesType =
      selectedJobType === "All" || job.type === selectedJobType;
    const matchesSearch =
      searchQuery === "" ||
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.requirements.some((req) =>
        req.toLowerCase().includes(searchQuery.toLowerCase())
      );

    return matchesType && matchesSearch;
  });

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
      ...theme.typography.h4,
      color: theme.colors.text,
      fontWeight: "700",
      flex: 1,
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
    serviceDuration: {
      backgroundColor: theme.colors.accent + "20",
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: 2,
      borderRadius: theme.borderRadius.sm,
    },
    serviceDurationText: {
      ...theme.typography.captionSmall,
      color: theme.colors.accent,
      fontWeight: "600",
    },
    searchContainer: {
      marginBottom: theme.spacing.md,
    },
    searchInput: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xxxl,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.sm,
      borderWidth: 1,
      borderColor: theme.colors.border,
      ...theme.typography.body,
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
      fontWeight: "500",
    },
    filtersContainer: {
      flexDirection: "row",
      gap: theme.spacing.sm,
    },
    filterChip: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.xxxl,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    filterChipActive: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    filterChipText: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      fontWeight: "600",
    },
    filterChipTextActive: {
      color: "white",
      fontWeight: "700",
    },
    jobCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.lg,
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
    jobHeader: {
      flexDirection: "row",
      alignItems: "flex-start",
      marginBottom: theme.spacing.md,
    },
    jobLogo: {
      width: 50,
      height: 50,
      borderRadius: theme.borderRadius.lg,
      marginRight: theme.spacing.md,
    },
    jobInfo: {
      flex: 1,
    },
    jobTitle: {
      ...theme.typography.h6,
      color: theme.colors.text,
      fontWeight: "700",
      marginBottom: 4,
    },
    jobCompany: {
      ...theme.typography.caption,
      color: theme.colors.textSecondary,
      marginBottom: 4,
      fontWeight: "600",
    },
    jobLocation: {
      ...theme.typography.captionSmall,
      color: theme.colors.textSecondary,
    } as TextStyle,
    bookmarkButton: {
      padding: theme.spacing.sm,
    },
    jobMeta: {
      flexDirection: "row",
      flexWrap: "wrap",
      alignItems: "center",
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.md,
    },
    metaItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.xs,
    },
    metaText: {
      ...theme.typography.captionSmall,
      color: theme.colors.textSecondary,
      fontWeight: "500",
    },
    jobDescription: {
      ...theme.typography.body,
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
      fontWeight: "500",
    },
    requirementsContainer: {
      marginBottom: theme.spacing.md,
    },
    requirementsList: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: theme.spacing.xs,
    },
    requirementTag: {
      backgroundColor: theme.colors.background,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    requirementText: {
      ...theme.typography.caption,
      color: theme.colors.text,
      fontWeight: "600",
    },
    jobActions: {
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
    eventCard: {
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
    eventHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: theme.spacing.sm,
    },
    eventTitle: {
      ...theme.typography.body,
      color: theme.colors.text,
      fontWeight: "700",
      flex: 1,
    },
    eventType: {
      backgroundColor: theme.colors.primary + "20",
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: 2,
      borderRadius: theme.borderRadius.sm,
    },
    eventTypeText: {
      ...theme.typography.captionSmall,
      color: theme.colors.primary,
      fontWeight: "600",
    },
    eventDetails: {
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.md,
    },
    eventDetailRow: {
      flexDirection: "row",
      alignItems: "center",
    },
    eventDetailText: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      marginLeft: theme.spacing.sm,
      fontWeight: "500",
    },
    eventDescription: {
      ...theme.typography.bodySmall,
      color: theme.colors.text,
      lineHeight: 18,
    } as TextStyle,
    resourceCard: {
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
    resourceHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: theme.spacing.sm,
    },
    resourceTitle: {
      ...theme.typography.body,
      color: theme.colors.text,
      fontWeight: "700",
      flex: 1,
    },
    resourceType: {
      backgroundColor: theme.colors.accent + "20",
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: 2,
      borderRadius: theme.borderRadius.sm,
    },
    resourceTypeText: {
      ...theme.typography.captionSmall,
      color: theme.colors.accent,
      fontWeight: "600",
    },
    resourceDescription: {
      ...theme.typography.bodySmall,
      color: theme.colors.text,
      lineHeight: 18,
      marginBottom: theme.spacing.md,
      fontWeight: "500",
    },
    resourceMeta: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    resourceStats: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.md,
    },
    resourceStat: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.xs,
    },
    resourceStatText: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
    } as TextStyle,
    downloadButton: {
      backgroundColor: theme.colors.primary,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.lg,
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.xs,
    },
    downloadButtonText: {
      ...theme.typography.bodySmall,
      color: "white",
      fontWeight: "600",
    },
    directorCard: {
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
    directorHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: theme.spacing.md,
    },
    directorAvatar: {
      width: 80,
      height: 80,
      borderRadius: 40,
      marginRight: theme.spacing.lg,
      borderWidth: 3,
      borderColor: theme.colors.primary + "40",
    },
    directorInfo: {
      flex: 1,
    },
    directorName: {
      ...theme.typography.h5,
      color: theme.colors.text,
      fontWeight: "700",
      marginBottom: 4,
    },
    directorTitle: {
      ...theme.typography.caption,
      color: theme.colors.textSecondary,
      marginBottom: 4,
      fontWeight: "600",
    },
    directorExperience: {
      ...theme.typography.captionSmall,
      color: theme.colors.textSecondary,
    } as TextStyle,
    contactInfo: {
      gap: theme.spacing.md,
      marginBottom: theme.spacing.lg,
    },
    contactRow: {
      flexDirection: "row",
      alignItems: "center",
    },
    contactIcon: {
      marginRight: theme.spacing.md,
      width: 20,
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
      paddingVertical: theme.spacing.sm,
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
        <Text style={styles.headerTitle}>Career Services</Text>
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
            source={{ uri: careerCenter.image }}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <View style={styles.heroOverlay}>
            <Text style={styles.heroTitle}>{careerCenter.name}</Text>
            <Text style={styles.heroDescription}>
              {careerCenter.description}
            </Text>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statsRow}>
            {careerStats.map((stat, index) => {
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
          <Text style={styles.sectionTitle}>Career Services</Text>
          <View style={styles.servicesGrid}>
            {careerServices.map((service) => {
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
                  <View style={styles.serviceDuration}>
                    <Text style={styles.serviceDurationText}>
                      {service.duration}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Job Opportunities</Text>

          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search jobs, companies, or skills..."
              placeholderTextColor={theme.colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filtersContainer}
            >
              {jobTypes.map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.filterChip,
                    selectedJobType === type && styles.filterChipActive,
                  ]}
                  onPress={() => setSelectedJobType(type)}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      selectedJobType === type && styles.filterChipTextActive,
                    ]}
                  >
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <TouchableOpacity
                key={job.id}
                style={styles.jobCard}
                onPress={() => handleJobPress(job.id)}
              >
                <View style={styles.jobHeader}>
                  <Image source={{ uri: job.logo }} style={styles.jobLogo} />
                  <View style={styles.jobInfo}>
                    <Text style={styles.jobTitle}>{job.title}</Text>
                    <Text style={styles.jobCompany}>{job.company}</Text>
                    <Text style={styles.jobLocation}>{job.location}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.bookmarkButton}
                    onPress={() => handleBookmarkJob(job.id)}
                  >
                    <Heart
                      color={
                        job.isBookmarked
                          ? "#ef4444"
                          : theme.colors.textSecondary
                      }
                      size={24}
                      fill={job.isBookmarked ? "#ef4444" : "none"}
                    />
                  </TouchableOpacity>
                </View>

                <View style={styles.jobMeta}>
                  <View style={styles.metaItem}>
                    <Briefcase color={theme.colors.textSecondary} size={16} />
                    <Text style={styles.metaText}>{job.type}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <DollarSign color={theme.colors.textSecondary} size={16} />
                    <Text style={styles.metaText}>{job.salary}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Clock color={theme.colors.textSecondary} size={16} />
                    <Text style={styles.metaText}>Posted {job.posted}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Users color={theme.colors.textSecondary} size={16} />
                    <Text style={styles.metaText}>
                      {job.applicants} applicants
                    </Text>
                  </View>
                </View>

                <Text style={styles.jobDescription}>{job.description}</Text>

                <View style={styles.requirementsContainer}>
                  <View style={styles.requirementsList}>
                    {job.requirements.map((requirement, index) => (
                      <View key={index} style={styles.requirementTag}>
                        <Text style={styles.requirementText}>
                          {requirement}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>

                <View style={styles.jobActions}>
                  <TouchableOpacity style={styles.actionButton}>
                    <ExternalLink color="white" size={18} />
                    <Text style={styles.actionButtonText}>Apply Now</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.actionButtonSecondary]}
                  >
                    <Eye color={theme.colors.text} size={18} />
                    <Text
                      style={[
                        styles.actionButtonText,
                        styles.actionButtonTextSecondary,
                      ]}
                    >
                      View Details
                    </Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.noResultsContainer}>
              <Text style={styles.noResultsText}>
                No jobs found matching your criteria
              </Text>
            </View>
          )}
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Upcoming Events</Text>
          {upcomingEvents.map((event) => (
            <TouchableOpacity
              key={event.id}
              style={styles.eventCard}
              onPress={() => handleEventPress(event.id)}
            >
              <View style={styles.eventHeader}>
                <Text style={styles.eventTitle}>{event.title}</Text>
                <View style={styles.eventType}>
                  <Text style={styles.eventTypeText}>{event.type}</Text>
                </View>
              </View>

              <View style={styles.eventDetails}>
                <View style={styles.eventDetailRow}>
                  <Calendar color={theme.colors.textSecondary} size={16} />
                  <Text style={styles.eventDetailText}>
                    {event.date} • {event.time}
                  </Text>
                </View>
                <View style={styles.eventDetailRow}>
                  <MapPin color={theme.colors.textSecondary} size={16} />
                  <Text style={styles.eventDetailText}>{event.location}</Text>
                </View>
                <View style={styles.eventDetailRow}>
                  <Users color={theme.colors.textSecondary} size={16} />
                  <Text style={styles.eventDetailText}>
                    {event.attendees} attendees
                    {event.companies > 0 && ` • ${event.companies} companies`}
                  </Text>
                </View>
              </View>

              <Text style={styles.eventDescription}>{event.description}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Career Resources</Text>
          {careerResources.map((resource) => (
            <View key={resource.id} style={styles.resourceCard}>
              <View style={styles.resourceHeader}>
                <Text style={styles.resourceTitle}>{resource.title}</Text>
                <View style={styles.resourceType}>
                  <Text style={styles.resourceTypeText}>{resource.type}</Text>
                </View>
              </View>

              <Text style={styles.resourceDescription}>
                {resource.description}
              </Text>

              <View style={styles.resourceMeta}>
                <View style={styles.resourceStats}>
                  <View style={styles.resourceStat}>
                    <Download color={theme.colors.textSecondary} size={16} />
                    <Text style={styles.resourceStatText}>
                      {resource.downloads}
                    </Text>
                  </View>
                  <View style={styles.resourceStat}>
                    <Star color="#f59e0b" size={16} fill="#f59e0b" />
                    <Text style={styles.resourceStatText}>
                      {resource.rating}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.downloadButton}
                  onPress={() => handleResourcePress(resource.id)}
                >
                  <Download color="white" size={16} />
                  <Text style={styles.downloadButtonText}>Download</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Meet the Director</Text>
          <View style={styles.directorCard}>
            <View style={styles.directorHeader}>
              <Image
                source={{ uri: careerCenter.director.avatar }}
                style={styles.directorAvatar}
              />
              <View style={styles.directorInfo}>
                <Text style={styles.directorName}>
                  {careerCenter.director.name}
                </Text>
                <Text style={styles.directorTitle}>
                  {careerCenter.director.title}
                </Text>
                <Text style={styles.directorExperience}>
                  {careerCenter.director.experience} experience
                </Text>
              </View>
            </View>

            <View style={styles.contactInfo}>
              <View style={styles.contactRow}>
                <Clock
                  color={theme.colors.textSecondary}
                  size={20}
                  style={styles.contactIcon}
                />
                <Text style={styles.contactText}>{careerCenter.hours}</Text>
              </View>
              <View style={styles.contactRow}>
                <MapPin
                  color={theme.colors.textSecondary}
                  size={20}
                  style={styles.contactIcon}
                />
                <Text style={styles.contactText}>{careerCenter.location}</Text>
              </View>
              <View style={styles.contactRow}>
                <Phone
                  color={theme.colors.textSecondary}
                  size={20}
                  style={styles.contactIcon}
                />
                <Text style={styles.contactText}>{careerCenter.phone}</Text>
              </View>
              <View style={styles.contactRow}>
                <Mail
                  color={theme.colors.textSecondary}
                  size={20}
                  style={styles.contactIcon}
                />
                <Text style={styles.contactText}>{careerCenter.email}</Text>
              </View>
            </View>

            <View style={styles.contactActions}>
              <TouchableOpacity
                style={styles.contactButton}
                onPress={handleCallCenter}
              >
                <Phone color="white" size={20} />
                <Text style={styles.contactButtonText}>Call</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.contactButton, styles.contactButtonSecondary]}
                onPress={handleEmailCenter}
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
    </SafeAreaView>
  );
}
