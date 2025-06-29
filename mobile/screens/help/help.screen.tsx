import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Linking,
  TextStyle,
  ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  Clock,
  Heart,
  GraduationCap,
  Target,
  Wifi,
  Home,
  UserCheck,
  FileText,
  Building,
  ChevronDown,
  ChevronUp,
  Shield,
  Briefcase,
  BookOpen,
  Utensils,
} from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";

// Campus services contact information
const campusServices = [
  {
    id: 1,
    name: "Support Center",
    description:
      "IT services, hostel management, laptop repair, internet connection, and general campus support",
    department: "Campus Operations",
    phone: "+233 30 610 360",
    email: "support@ashesi.edu.gh",
    location: "Student Center, 2nd Floor",
    hours: "8:00 AM - 6:00 PM (Mon-Fri), 10:00 AM - 4:00 PM (Sat)",
    icon: Wifi,
    color: "#3b82f6",
    services: [
      "IT Support",
      "Laptop Repair",
      "Internet Issues",
      "Hostel Management",
      "Room Maintenance",
      "WiFi Setup",
    ],
  },
  {
    id: 2,
    name: "Lobby Services",
    description:
      "Hostel reception, room assignments, visitor management, and residential support",
    department: "Residential Life",
    phone: "+233 30 610 380",
    email: "lobby@ashesi.edu.gh",
    location: "Residence Hall Lobby",
    hours: "24/7 - Always Available",
    icon: Home,
    color: "#059669",
    services: [
      "Room Assignments",
      "Visitor Registration",
      "Key Management",
      "Residential Issues",
      "Check-in/Check-out",
    ],
  },
  {
    id: 3,
    name: "Health Center",
    description:
      "24/7 medical care, emergency services, counseling, and wellness support",
    department: "Student Health Services",
    phone: "+233 30 610 370",
    email: "health@ashesi.edu.gh",
    location: "Campus Health Building",
    hours: "24/7 - Always Open",
    icon: Heart,
    color: "#ef4444",
    services: [
      "Medical Care",
      "Emergency Services",
      "Mental Health",
      "Pharmacy",
      "Health Screening",
    ],
  },
  {
    id: 4,
    name: "Academic Advising",
    description:
      "Course planning, academic guidance, graduation requirements, and study abroad programs",
    department: "Academic Affairs",
    phone: "+233 30 610 340",
    email: "advising@ashesi.edu.gh",
    location: "Academic Affairs Office",
    hours: "8:00 AM - 5:00 PM (Mon-Fri)",
    icon: GraduationCap,
    color: "#7c3aed",
    services: [
      "Course Selection",
      "Academic Planning",
      "Graduation Requirements",
      "Study Abroad",
      "Academic Support",
    ],
  },
  {
    id: 5,
    name: "Student Coaching",
    description:
      "Personal development, goal setting, study skills, and leadership coaching",
    department: "Student Development",
    phone: "+233 30 610 350",
    email: "coaching@ashesi.edu.gh",
    location: "Student Development Center",
    hours: "9:00 AM - 5:00 PM (Mon-Fri)",
    icon: Target,
    color: "#f59e0b",
    services: [
      "Personal Coaching",
      "Study Skills",
      "Goal Setting",
      "Leadership Development",
      "Time Management",
    ],
  },
  {
    id: 6,
    name: "Admissions Office",
    description:
      "Application support, enrollment services, transfer credits, and prospective student information",
    department: "Admissions",
    phone: "+233 30 610 300",
    email: "admissions@ashesi.edu.gh",
    location: "Administration Building",
    hours: "8:00 AM - 5:00 PM (Mon-Fri)",
    icon: UserCheck,
    color: "#0891b2",
    services: [
      "Application Support",
      "Enrollment",
      "Transfer Credits",
      "Document Verification",
      "Student Records",
    ],
  },
  {
    id: 7,
    name: "Registry",
    description:
      "Student records, transcripts, certificates, graduation, and official documentation",
    department: "Registrar",
    phone: "+233 30 610 320",
    email: "registry@ashesi.edu.gh",
    location: "Registry Office, Admin Building",
    hours: "8:00 AM - 4:30 PM (Mon-Fri)",
    icon: FileText,
    color: "#dc2626",
    services: [
      "Transcripts",
      "Certificates",
      "Student Records",
      "Graduation",
      "Official Documents",
    ],
  },
  {
    id: 8,
    name: "Financial Aid",
    description:
      "Scholarships, financial assistance, payment plans, and student financial support",
    department: "Financial Services",
    phone: "+233 30 610 310",
    email: "financialaid@ashesi.edu.gh",
    location: "Financial Aid Office",
    hours: "8:00 AM - 5:00 PM (Mon-Fri)",
    icon: Briefcase,
    color: "#059669",
    services: [
      "Scholarships",
      "Financial Aid",
      "Payment Plans",
      "Student Accounts",
      "Financial Counseling",
    ],
  },
  {
    id: 9,
    name: "Library Services",
    description:
      "Book catalog, research support, study spaces, computer lab, and printing services",
    department: "Library",
    phone: "+233 30 610 350",
    email: "library@ashesi.edu.gh",
    location: "Central Library",
    hours: "24/7 (Limited weekend hours)",
    icon: BookOpen,
    color: "#7c3aed",
    services: [
      "Book Catalog",
      "Research Support",
      "Study Rooms",
      "Computer Lab",
      "Printing Services",
    ],
  },
  {
    id: 10,
    name: "Dining Services",
    description:
      "Meal plan support, dining options, food services, and campus restaurants",
    department: "Campus Dining",
    phone: "+233 30 610 390",
    email: "dining@ashesi.edu.gh",
    location: "Student Center",
    hours: "6:00 AM - 10:00 PM (Daily)",
    icon: Utensils,
    color: "#f59e0b",
    services: [
      "Meal Plans",
      "Restaurant Support",
      "Food Services",
      "Dietary Accommodations",
      "Catering",
    ],
  },
  {
    id: 11,
    name: "Security Services",
    description:
      "Campus security, emergency response, lost and found, and safety concerns",
    department: "Campus Security",
    phone: "+233 30 610 911",
    email: "security@ashesi.edu.gh",
    location: "Security Office, Main Gate",
    hours: "24/7 - Always Available",
    icon: Shield,
    color: "#ef4444",
    services: [
      "Campus Security",
      "Emergency Response",
      "Lost & Found",
      "Safety Escorts",
      "Incident Reports",
    ],
  },
  {
    id: 12,
    name: "Facilities Management",
    description:
      "Building maintenance, room repairs, utilities, and campus infrastructure",
    department: "Facilities",
    phone: "+233 30 610 400",
    email: "facilities@ashesi.edu.gh",
    location: "Facilities Office",
    hours: "7:00 AM - 6:00 PM (Mon-Fri)",
    icon: Building,
    color: "#64748b",
    services: [
      "Building Maintenance",
      "Room Repairs",
      "Utilities",
      "Infrastructure",
      "Work Orders",
    ],
  },
];

// Frequently Asked Questions
const faqData = [
  {
    id: 1,
    question: "How do I connect to the campus WiFi?",
    answer:
      'Connect to "Ashesi-WiFi" network and use your student credentials (student ID and password) to log in. If you have issues, contact the Support Center at +233 30 610 360.',
    category: "IT Support",
  },
  {
    id: 2,
    question: "Who do I contact for room maintenance issues?",
    answer:
      "For hostel room issues like plumbing, electrical, or furniture problems, contact the Support Center at +233 30 610 360. For general residential concerns, contact Lobby Services at +233 30 610 380.",
    category: "Housing",
  },
  {
    id: 3,
    question: "How do I request my official transcript?",
    answer:
      "Contact the Registry Office at +233 30 610 320 or email registry@ashesi.edu.gh. You can also visit their office in the Administration Building during business hours.",
    category: "Academic Records",
  },
  {
    id: 4,
    question: "What should I do in a medical emergency?",
    answer:
      "For medical emergencies, call the Health Center emergency line at +233 30 610 911 or visit the Health Center immediately. The Health Center is open 24/7.",
    category: "Health",
  },
  {
    id: 5,
    question: "How do I apply for financial aid or scholarships?",
    answer:
      "Contact the Financial Aid Office at +233 30 610 310 or email financialaid@ashesi.edu.gh. They can help you with scholarship applications and financial assistance programs.",
    category: "Financial Aid",
  },
  {
    id: 6,
    question: "Who can help me with course selection and academic planning?",
    answer:
      "Contact Academic Advising at +233 30 610 340 or email advising@ashesi.edu.gh. They provide guidance on course selection, graduation requirements, and academic planning.",
    category: "Academic",
  },
  {
    id: 7,
    question: "How do I report a security concern or lost item?",
    answer:
      "Contact Campus Security at +233 30 610 911 for emergencies or security concerns. For lost and found items, visit the Security Office at the Main Gate.",
    category: "Security",
  },
  {
    id: 8,
    question: "Where can I get help with my laptop or technical issues?",
    answer:
      "The Support Center handles all IT issues including laptop repair, software installation, and technical support. Contact them at +233 30 610 360 or visit the Student Center, 2nd Floor.",
    category: "IT Support",
  },
];

export default function HelpDeskScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [showFAQ, setShowFAQ] = useState(false);
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  };

  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  const handleEmail = (email: string) => {
    Linking.openURL(`mailto:${email}`);
  };

  const toggleFAQ = (faqId: number) => {
    setExpandedFAQ(expandedFAQ === faqId ? null : faqId);
  };

  const filteredServices = campusServices.filter(
    (service) =>
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.services.some((s) =>
        s.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  const filteredFAQs = faqData.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const styles = StyleSheet.create<{
    container: ViewStyle;
    header: ViewStyle;
    backButton: ViewStyle;
    headerTitle: TextStyle;
    toggleContainer: ViewStyle;
    toggleButton: ViewStyle;
    toggleButtonActive: ViewStyle;
    toggleText: TextStyle;
    toggleTextActive: TextStyle;
    scrollContent: ViewStyle;
    searchContainer: ViewStyle;
    searchInput: TextStyle;
    servicesContainer: ViewStyle;
    sectionTitle: TextStyle;
    serviceCard: ViewStyle;
    serviceHeader: ViewStyle;
    serviceIcon: ViewStyle;
    serviceInfo: ViewStyle;
    serviceName: TextStyle;
    serviceDepartment: TextStyle;
    serviceDescription: TextStyle;
    contactInfo: ViewStyle;
    contactRow: ViewStyle;
    contactIcon: ViewStyle;
    contactText: TextStyle;
    servicesOffered: ViewStyle;
    servicesTitle: TextStyle;
    servicesList: ViewStyle;
    serviceTag: ViewStyle;
    serviceTagText: TextStyle;
    contactActions: ViewStyle;
    contactButton: ViewStyle;
    contactButtonSecondary: ViewStyle;
    contactButtonText: TextStyle;
    contactButtonTextSecondary: TextStyle;
    faqContainer: ViewStyle;
    faqCard: ViewStyle;
    faqHeader: ViewStyle;
    faqQuestion: TextStyle;
    faqCategory: ViewStyle;
    faqCategoryText: TextStyle;
    faqAnswer: ViewStyle;
    faqAnswerText: TextStyle;
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
    toggleContainer: {
      flexDirection: "row",
      backgroundColor: theme.colors.surface,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.sm,
      borderBottomWidth: 0.25,
      borderBottomColor: theme.colors.border,
      gap: theme.spacing.sm,
    },
    toggleButton: {
      flex: 1,
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      borderRadius: theme.borderRadius.xxxl,
      backgroundColor: theme.colors.background,
      borderWidth: 1,
      borderColor: theme.colors.border,
      alignItems: "center",
    },
    toggleButtonActive: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    toggleText: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
      fontWeight: "600",
    },
    toggleTextActive: {
      color: "white",
      fontWeight: "700",
    },
    scrollContent: {
      paddingBottom: theme.spacing.md,
    },
    searchContainer: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.md,
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
    } as TextStyle,
    servicesContainer: {
      paddingHorizontal: theme.spacing.md,
    },
    sectionTitle: {
      ...theme.typography.h4,
      color: theme.colors.text,
      fontWeight: "700",
      marginBottom: theme.spacing.md,
    },
    serviceCard: {
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
    serviceHeader: {
      flexDirection: "row",
      alignItems: "flex-start",
      marginBottom: theme.spacing.sm,
    },
    serviceIcon: {
      marginRight: theme.spacing.md,
      marginTop: theme.spacing.xs,
    },
    serviceInfo: {
      flex: 1,
    },
    serviceName: {
      ...theme.typography.h5,
      color: theme.colors.text,
      fontWeight: "700",
      marginBottom: 4,
    },
    serviceDepartment: {
      ...theme.typography.captionSmall,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.sm,
    } as TextStyle,
    serviceDescription: {
      ...theme.typography.body,
      color: theme.colors.text,
      marginBottom: theme.spacing.lg,
    } as TextStyle,
    contactInfo: {
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.md,
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
      ...theme.typography.bodySmall,
      color: theme.colors.text,
      fontWeight: "500",
      flex: 1,
    },
    servicesOffered: {
      marginBottom: theme.spacing.md,
    },
    servicesTitle: {
      ...theme.typography.body,
      color: theme.colors.text,
      fontWeight: "600",
      marginBottom: theme.spacing.sm,
    },
    servicesList: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: theme.spacing.xs,
    },
    serviceTag: {
      backgroundColor: theme.colors.background,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.xxl,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    serviceTagText: {
      ...theme.typography.caption,
      color: theme.colors.text,
      fontWeight: "600",
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
      borderWidth: 1,
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
    faqContainer: {
      paddingHorizontal: theme.spacing.md,
    },
    faqCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
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
      overflow: "hidden",
    },
    faqHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: theme.spacing.md,
    },
    faqQuestion: {
      ...theme.typography.h5,
      color: theme.colors.text,
      fontWeight: "600",
      flex: 1,
      marginRight: theme.spacing.md,
    },
    faqCategory: {
      backgroundColor: theme.colors.primary + "20",
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: 2,
      borderRadius: theme.borderRadius.sm,
      marginBottom: theme.spacing.sm,
      alignSelf: "flex-start",
    },
    faqCategoryText: {
      ...theme.typography.captionSmall,
      color: theme.colors.primary,
      fontWeight: "600",
    },
    faqAnswer: {
      padding: theme.spacing.md,
      paddingTop: theme.spacing.xs,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
    faqAnswerText: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
    } as TextStyle,
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
        <Text style={styles.headerTitle}>Help Desk</Text>
      </View>

      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[styles.toggleButton, !showFAQ && styles.toggleButtonActive]}
          onPress={() => setShowFAQ(false)}
        >
          <Text
            style={[styles.toggleText, !showFAQ && styles.toggleTextActive]}
          >
            Contact Services
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, showFAQ && styles.toggleButtonActive]}
          onPress={() => setShowFAQ(true)}
        >
          <Text style={[styles.toggleText, showFAQ && styles.toggleTextActive]}>
            FAQ
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder={showFAQ ? "Search FAQs..." : "Search services..."}
            placeholderTextColor={theme.colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {!showFAQ ? (
          <View style={styles.servicesContainer}>
            <Text style={styles.sectionTitle}>Campus Services</Text>
            {filteredServices.length > 0 ? (
              filteredServices.map((service) => {
                const IconComponent = service.icon;
                return (
                  <View key={service.id} style={styles.serviceCard}>
                    <View style={styles.serviceHeader}>
                      <IconComponent
                        color={service.color}
                        size={28}
                        style={styles.serviceIcon}
                      />
                      <View style={styles.serviceInfo}>
                        <Text style={styles.serviceName}>{service.name}</Text>
                        <Text style={styles.serviceDepartment}>
                          {service.department}
                        </Text>
                      </View>
                    </View>

                    <Text style={styles.serviceDescription}>
                      {service.description}
                    </Text>

                    <View style={styles.contactInfo}>
                      <View style={styles.contactRow}>
                        <Phone
                          color={theme.colors.textSecondary}
                          size={20}
                          style={styles.contactIcon}
                        />
                        <Text style={styles.contactText}>{service.phone}</Text>
                      </View>
                      <View style={styles.contactRow}>
                        <Mail
                          color={theme.colors.textSecondary}
                          size={20}
                          style={styles.contactIcon}
                        />
                        <Text style={styles.contactText}>{service.email}</Text>
                      </View>
                      <View style={styles.contactRow}>
                        <MapPin
                          color={theme.colors.textSecondary}
                          size={20}
                          style={styles.contactIcon}
                        />
                        <Text style={styles.contactText}>
                          {service.location}
                        </Text>
                      </View>
                      <View style={styles.contactRow}>
                        <Clock
                          color={theme.colors.textSecondary}
                          size={20}
                          style={styles.contactIcon}
                        />
                        <Text style={styles.contactText}>{service.hours}</Text>
                      </View>
                    </View>

                    <View style={styles.servicesOffered}>
                      <Text style={styles.servicesTitle}>Services Offered</Text>
                      <View style={styles.servicesList}>
                        {service.services.map((serviceItem, index) => (
                          <View key={index} style={styles.serviceTag}>
                            <Text style={styles.serviceTagText}>
                              {serviceItem}
                            </Text>
                          </View>
                        ))}
                      </View>
                    </View>

                    <View style={styles.contactActions}>
                      <TouchableOpacity
                        style={styles.contactButton}
                        onPress={() => handleCall(service.phone)}
                      >
                        <Phone color="white" size={20} />
                        <Text style={styles.contactButtonText}>Call</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.contactButton,
                          styles.contactButtonSecondary,
                        ]}
                        onPress={() => handleEmail(service.email)}
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
                );
              })
            ) : (
              <View style={styles.noResultsContainer}>
                <Text style={styles.noResultsText}>
                  No services found for &quot;{searchQuery}&quot;
                </Text>
              </View>
            )}
          </View>
        ) : (
          <View style={styles.faqContainer}>
            <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
            {filteredFAQs.length > 0 ? (
              filteredFAQs.map((faq) => (
                <TouchableOpacity
                  key={faq.id}
                  style={styles.faqCard}
                  onPress={() => toggleFAQ(faq.id)}
                >
                  <View style={styles.faqHeader}>
                    <View style={{ flex: 1 }}>
                      <View style={styles.faqCategory}>
                        <Text style={styles.faqCategoryText}>
                          {faq.category}
                        </Text>
                      </View>
                      <Text style={styles.faqQuestion}>{faq.question}</Text>
                    </View>
                    {expandedFAQ === faq.id ? (
                      <ChevronUp color={theme.colors.textSecondary} size={24} />
                    ) : (
                      <ChevronDown
                        color={theme.colors.textSecondary}
                        size={24}
                      />
                    )}
                  </View>
                  {expandedFAQ === faq.id && (
                    <View style={styles.faqAnswer}>
                      <Text style={styles.faqAnswerText}>{faq.answer}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.noResultsContainer}>
                <Text style={styles.noResultsText}>
                  No FAQs found for &quot;{searchQuery}&quot;
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
