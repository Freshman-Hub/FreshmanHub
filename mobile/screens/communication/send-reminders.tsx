"use client";

import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ArrowLeft,
  Bell,
  Calendar,
  Clock,
  Users,
  MessageSquare,
  Send,
  CheckCircle,
  AlertCircle,
  Mail,
  Smartphone,
} from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { useRouter } from "expo-router";

// Import reusable components
import { Header } from "@/components/ui/Header";
import { Button } from "@/components/ui/Button";
import { TextInput } from "@/components/ui/TextInput";
import { PersonPicker } from "@/components/ui/PersonPicker";
import { FilterChip } from "@/components/ui/FilterChip";
import { Avatar } from "@/components/ui/Avatar";
import { Card } from "@/components/ui/Card";

interface ReminderTemplate {
  id: string;
  title: string;
  description: string;
  subject: string;
  message: string;
  type: "session" | "assignment" | "deadline" | "event" | "general";
  urgency: "low" | "medium" | "high";
}

interface Person {
  id: number;
  name: string;
  avatar?: string;
  role?: string;
  year?: string;
  major?: string;
  email?: string;
  phone?: string;
  specialties?: string[];
  rating?: number;
  coachId?: number;
}

// Mock data
const reminderTemplates: ReminderTemplate[] = [
  {
    id: "session-reminder",
    title: "Session Reminder",
    description: "Remind about upcoming coaching sessions",
    subject: "Upcoming Session Reminder",
    message:
      "Hi {name},\n\nThis is a friendly reminder about your upcoming coaching session:\n\nDate: {date}\nTime: {time}\nLocation: {location}\nCoach: {coach}\n\nPlease confirm your attendance or let us know if you need to reschedule.\n\nBest regards,\nStudent Success Team",
    type: "session",
    urgency: "medium",
  },
  {
    id: "assignment-due",
    title: "Assignment Due",
    description: "Remind about assignment deadlines",
    subject: "Assignment Due Soon",
    message:
      "Hi {name},\n\nThis is a reminder that your assignment '{assignment}' is due on {date}.\n\nIf you need any help or have questions, please reach out to your coach or visit the Student Success Center.\n\nBest regards,\nAcademic Support Team",
    type: "assignment",
    urgency: "high",
  },
  {
    id: "event-reminder",
    title: "Event Reminder",
    description: "Remind about upcoming events",
    subject: "Don't Miss: {event}",
    message:
      "Hi {name},\n\nJust a reminder about the upcoming event:\n\n{event}\nDate: {date}\nTime: {time}\nLocation: {location}\n\nWe look forward to seeing you there!\n\nBest regards,\nEvents Team",
    type: "event",
    urgency: "low",
  },
  {
    id: "check-in",
    title: "Wellness Check-in",
    description: "General wellness and progress check",
    subject: "How are you doing?",
    message:
      "Hi {name},\n\nWe hope you're doing well! This is a friendly check-in to see how you're settling in and if you need any support.\n\nFeel free to reach out if you have any questions or concerns. We're here to help!\n\nBest regards,\nStudent Success Team",
    type: "general",
    urgency: "low",
  },
];

const mockPeople: Person[] = [
  {
    id: 1,
    name: "Sarah Mensah",
    avatar:
      "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400",
    role: "Student",
    year: "Freshman",
    major: "Computer Science",
    email: "sarah.mensah@ashesi.edu.gh",
    phone: "+233 24 123 4567",
    coachId: 5,
  },
  {
    id: 2,
    name: "Kwame Nkrumah",
    avatar:
      "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=400",
    role: "Student",
    year: "Sophomore",
    major: "Business Administration",
    email: "kwame.nkrumah@ashesi.edu.gh",
    phone: "+233 24 234 5678",
    coachId: 6,
  },
  {
    id: 3,
    name: "Akosua Frimpong",
    avatar:
      "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400",
    role: "Student",
    year: "Junior",
    major: "Engineering",
    email: "akosua.frimpong@ashesi.edu.gh",
    phone: "+233 24 345 6789",
    coachId: 7,
  },
  {
    id: 5,
    name: "Michael Osei",
    avatar:
      "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400",
    role: "Peer Coach",
    year: "Senior",
    major: "Computer Science",
    email: "michael.osei@ashesi.edu.gh",
    phone: "+233 24 456 7890",
    specialties: ["Academic Support", "Career Guidance"],
    rating: 4.8,
  },
  {
    id: 6,
    name: "Ama Asante",
    avatar:
      "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400",
    role: "Peer Coach",
    year: "Senior",
    major: "Business Administration",
    email: "ama.asante@ashesi.edu.gh",
    phone: "+233 24 567 8901",
    specialties: ["Personal Development", "Leadership"],
    rating: 4.9,
  },
];

const reminderTypes = ["All", "Session", "Assignment", "Event", "General"];
const urgencyLevels = ["All", "Low", "Medium", "High"];
const deliveryMethods = ["Email", "SMS", "Push Notification"];

export default function SendRemindersScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const [selectedTemplate, setSelectedTemplate] =
    useState<ReminderTemplate | null>(null);
  const [selectedPeople, setSelectedPeople] = useState<Person[]>([]);
  const [showPersonPicker, setShowPersonPicker] = useState(false);
  const [customSubject, setCustomSubject] = useState("");
  const [customMessage, setCustomMessage] = useState("");
  const [selectedTypeFilter, setSelectedTypeFilter] = useState("All");
  const [selectedUrgencyFilter, setSelectedUrgencyFilter] = useState("All");
  const [selectedDeliveryMethods, setSelectedDeliveryMethods] = useState<
    string[]
  >(["Email"]);
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [isScheduled, setIsScheduled] = useState(false);

  const filteredTemplates = reminderTemplates.filter((template) => {
    const matchesType =
      selectedTypeFilter === "All" ||
      template.type === selectedTypeFilter.toLowerCase();
    const matchesUrgency =
      selectedUrgencyFilter === "All" ||
      template.urgency === selectedUrgencyFilter.toLowerCase();
    return matchesType && matchesUrgency;
  });

  const handleTemplateSelect = (template: ReminderTemplate) => {
    setSelectedTemplate(template);
    setCustomSubject(template.subject);
    setCustomMessage(template.message);
  };

  const handleDeliveryMethodToggle = (method: string) => {
    if (selectedDeliveryMethods.includes(method)) {
      setSelectedDeliveryMethods(
        selectedDeliveryMethods.filter((m) => m !== method)
      );
    } else {
      setSelectedDeliveryMethods([...selectedDeliveryMethods, method]);
    }
  };

  const handleSendReminder = () => {
    if (
      !selectedTemplate ||
      selectedPeople.length === 0 ||
      selectedDeliveryMethods.length === 0
    ) {
      Alert.alert(
        "Missing Information",
        "Please select a template, recipients, and delivery method."
      );
      return;
    }

    Alert.alert(
      "Send Reminder",
      `Send "${selectedTemplate.title}" to ${selectedPeople.length} recipient(s) via ${selectedDeliveryMethods.join(
        ", "
      )}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Send",
          onPress: () => {
            // Simulate sending
            Alert.alert("Success", "Reminder sent successfully!");
            router.back();
          },
        },
      ]
    );
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high":
        return "#dc2626";
      case "medium":
        return "#f59e0b";
      case "low":
        return "#059669";
      default:
        return theme.colors.textSecondary;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "session":
        return Calendar;
      case "assignment":
        return CheckCircle;
      case "event":
        return Bell;
      case "general":
        return MessageSquare;
      default:
        return AlertCircle;
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollContent: {
      paddingBottom: theme.spacing.xl,
    },
    section: {
      paddingHorizontal: theme.spacing.md,
      paddingTop: theme.spacing.lg,
    },
    sectionTitle: {
      ...theme.typography.h6,
      color: theme.colors.text,
      fontWeight: "700",
      marginBottom: theme.spacing.md,
    },
    filtersContainer: {
      marginBottom: theme.spacing.lg,
    },
    filterSection: {
      marginBottom: theme.spacing.md,
    },
    filterLabel: {
      ...theme.typography.bodySmall,
      color: theme.colors.text,
      fontWeight: "600",
      marginBottom: theme.spacing.sm,
    },
    filtersScroll: {
      flexDirection: "row",
      gap: theme.spacing.xs,
      paddingBottom: theme.spacing.xs,
    },
    templatesContainer: {
      gap: theme.spacing.md,
      marginBottom: theme.spacing.lg,
    },
    templateCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.lg,
      borderWidth: 2,
      borderColor: "transparent",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 3,
    },
    selectedTemplateCard: {
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.primary + "10",
    },
    templateHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: theme.spacing.sm,
    },
    templateTitle: {
      ...theme.typography.h6,
      color: theme.colors.text,
      fontWeight: "700",
      flex: 1,
    },
    urgencyBadge: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.xxxl,
      marginLeft: theme.spacing.sm,
    },
    urgencyText: {
      ...theme.typography.captionSmall,
      fontWeight: "700",
      textTransform: "uppercase",
    },
    templateDescription: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.sm,
    },
    templateMeta: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.sm,
    },
    templateType: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      fontWeight: "500",
      marginLeft: theme.spacing.sm,
    },
    recipientsSection: {
      marginBottom: theme.spacing.lg,
    },
    recipientsButton: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    recipientsContent: {
      flex: 1,
    },
    recipientsTitle: {
      ...theme.typography.body,
      color: theme.colors.text,
      fontWeight: "600",
      marginBottom: theme.spacing.xs,
    },
    recipientsCount: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
    },
    selectedPeoplePreview: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: theme.spacing.sm,
      gap: theme.spacing.sm,
    },
    avatarStack: {
      flexDirection: "row",
      marginRight: theme.spacing.sm,
    },
    stackedAvatar: {
      marginLeft: -theme.spacing.sm,
      borderWidth: 2,
      borderColor: theme.colors.surface,
    },
    moreCount: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      fontWeight: "600",
    },
    customizationSection: {
      marginBottom: theme.spacing.lg,
    },
    deliverySection: {
      marginBottom: theme.spacing.lg,
    },
    deliveryMethods: {
      flexDirection: "row",
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.md,
    },
    deliveryMethod: {
      flex: 1,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.lg,
      alignItems: "center",
      borderWidth: 2,
      borderColor: "transparent",
    },
    selectedDeliveryMethod: {
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.primary + "10",
    },
    deliveryMethodIcon: {
      marginBottom: theme.spacing.sm,
    },
    deliveryMethodText: {
      ...theme.typography.bodySmall,
      color: theme.colors.text,
      fontWeight: "600",
      textAlign: "center",
    },
    selectedDeliveryMethodText: {
      color: theme.colors.primary,
    },
    scheduleSection: {
      marginBottom: theme.spacing.lg,
    },
    scheduleToggle: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    scheduleToggleText: {
      ...theme.typography.body,
      color: theme.colors.text,
      fontWeight: "600",
      marginLeft: theme.spacing.md,
      flex: 1,
    },
    scheduleInputs: {
      flexDirection: "row",
      gap: theme.spacing.md,
    },
    scheduleInput: {
      flex: 1,
    },
    sendButton: {
      marginHorizontal: theme.spacing.md,
      marginBottom: theme.spacing.lg,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Send Reminders"
        leftIcon={ArrowLeft}
        onLeftPress={() => router.back()}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Template Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Reminder Template</Text>

          {/* Filters */}
          <View style={styles.filtersContainer}>
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Type</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.filtersScroll}>
                  {reminderTypes.map((type) => (
                    <FilterChip
                      key={type}
                      label={type}
                      selected={selectedTypeFilter === type}
                      onPress={() => setSelectedTypeFilter(type)}
                    />
                  ))}
                </View>
              </ScrollView>
            </View>

            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Urgency</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.filtersScroll}>
                  {urgencyLevels.map((urgency) => (
                    <FilterChip
                      key={urgency}
                      label={urgency}
                      selected={selectedUrgencyFilter === urgency}
                      onPress={() => setSelectedUrgencyFilter(urgency)}
                    />
                  ))}
                </View>
              </ScrollView>
            </View>
          </View>

          {/* Templates */}
          <View style={styles.templatesContainer}>
            {filteredTemplates.map((template) => {
              const TypeIcon = getTypeIcon(template.type);
              const isSelected = selectedTemplate?.id === template.id;

              return (
                <TouchableOpacity
                  key={template.id}
                  style={[
                    styles.templateCard,
                    isSelected && styles.selectedTemplateCard,
                  ]}
                  onPress={() => handleTemplateSelect(template)}
                  activeOpacity={0.8}
                >
                  <View style={styles.templateHeader}>
                    <Text style={styles.templateTitle}>{template.title}</Text>
                    <View
                      style={[
                        styles.urgencyBadge,
                        {
                          backgroundColor:
                            getUrgencyColor(template.urgency) + "20",
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.urgencyText,
                          { color: getUrgencyColor(template.urgency) },
                        ]}
                      >
                        {template.urgency}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.templateDescription}>
                    {template.description}
                  </Text>
                  <View style={styles.templateMeta}>
                    <TypeIcon color={theme.colors.textSecondary} size={16} />
                    <Text style={styles.templateType}>{template.type}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Recipients Selection */}
        {selectedTemplate && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Select Recipients</Text>
            <View style={styles.recipientsSection}>
              <TouchableOpacity
                style={styles.recipientsButton}
                onPress={() => setShowPersonPicker(true)}
              >
                <View style={styles.recipientsContent}>
                  <Text style={styles.recipientsTitle}>Recipients</Text>
                  <Text style={styles.recipientsCount}>
                    {selectedPeople.length === 0
                      ? "No recipients selected"
                      : `${selectedPeople.length} recipient${selectedPeople.length === 1 ? "" : "s"} selected`}
                  </Text>
                  {selectedPeople.length > 0 && (
                    <View style={styles.selectedPeoplePreview}>
                      <View style={styles.avatarStack}>
                        {selectedPeople.slice(0, 3).map((person, index) => (
                          <Avatar
                            key={person.id}
                            imageUrl={person.avatar}
                            initials={person.name.charAt(0)}
                            size={32}
                            style={[
                              styles.stackedAvatar,
                              { zIndex: 3 - index },
                            ]}
                          />
                        ))}
                      </View>
                      {selectedPeople.length > 3 && (
                        <Text style={styles.moreCount}>
                          +{selectedPeople.length - 3} more
                        </Text>
                      )}
                    </View>
                  )}
                </View>
                <Users color={theme.colors.textSecondary} size={24} />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Message Customization */}
        {selectedTemplate && selectedPeople.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Customize Message</Text>
            <View style={styles.customizationSection}>
              <TextInput
                label="Subject"
                value={customSubject}
                onChangeText={setCustomSubject}
                placeholder="Enter email subject"
                style={{ marginBottom: theme.spacing.md }}
              />
              <TextInput
                label="Message"
                value={customMessage}
                onChangeText={setCustomMessage}
                placeholder="Enter your message"
                multiline
                numberOfLines={8}
                style={{ height: 120 }}
              />
            </View>
          </View>
        )}

        {/* Delivery Method */}
        {selectedTemplate && selectedPeople.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Delivery Method</Text>
            <View style={styles.deliverySection}>
              <View style={styles.deliveryMethods}>
                {deliveryMethods.map((method) => {
                  const isSelected = selectedDeliveryMethods.includes(method);
                  const IconComponent =
                    method === "Email"
                      ? Mail
                      : method === "SMS"
                        ? Smartphone
                        : Bell;

                  return (
                    <TouchableOpacity
                      key={method}
                      style={[
                        styles.deliveryMethod,
                        isSelected && styles.selectedDeliveryMethod,
                      ]}
                      onPress={() => handleDeliveryMethodToggle(method)}
                    >
                      <View style={styles.deliveryMethodIcon}>
                        <IconComponent
                          color={
                            isSelected
                              ? theme.colors.primary
                              : theme.colors.textSecondary
                          }
                          size={24}
                        />
                      </View>
                      <Text
                        style={[
                          styles.deliveryMethodText,
                          isSelected && styles.selectedDeliveryMethodText,
                        ]}
                      >
                        {method}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </View>
        )}

        {/* Schedule Option */}
        {selectedTemplate &&
          selectedPeople.length > 0 &&
          selectedDeliveryMethods.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Schedule (Optional)</Text>
              <View style={styles.scheduleSection}>
                <TouchableOpacity
                  style={styles.scheduleToggle}
                  onPress={() => setIsScheduled(!isScheduled)}
                >
                  <Clock color={theme.colors.textSecondary} size={24} />
                  <Text style={styles.scheduleToggleText}>
                    Schedule for later
                  </Text>
                  <CheckCircle
                    color={
                      isScheduled ? theme.colors.primary : theme.colors.border
                    }
                    size={24}
                  />
                </TouchableOpacity>

                {isScheduled && (
                  <View style={styles.scheduleInputs}>
                    <TextInput
                      label="Date"
                      value={scheduleDate}
                      onChangeText={setScheduleDate}
                      placeholder="Select date"
                      style={styles.scheduleInput}
                    />
                    <TextInput
                      label="Time"
                      value={scheduleTime}
                      onChangeText={setScheduleTime}
                      placeholder="Select time"
                      style={styles.scheduleInput}
                    />
                  </View>
                )}
              </View>
            </View>
          )}
      </ScrollView>

      {/* Send Button */}
      {selectedTemplate &&
        selectedPeople.length > 0 &&
        selectedDeliveryMethods.length > 0 && (
          <Button
            title={isScheduled ? "Schedule Reminder" : "Send Reminder"}
            onPress={handleSendReminder}
            icon={isScheduled ? Clock : Send}
            mode="contained"
            style={styles.sendButton}
          />
        )}

      {/* Person Picker Modal */}
      <PersonPicker
        visible={showPersonPicker}
        people={mockPeople}
        selectedPeople={selectedPeople}
        onSelect={(people) => {
          setSelectedPeople(people);
          setShowPersonPicker(false);
        }}
        onCancel={() => setShowPersonPicker(false)}
        title="Select Recipients"
        subtitle="Choose who should receive this reminder"
        type="all"
        allowSelectAll={true}
        multiSelect={true}
      />
    </SafeAreaView>
  );
}
