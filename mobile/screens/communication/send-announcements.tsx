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
  Megaphone,
  Users,
  Send,
  Clock,
  CheckCircle,
  AlertTriangle,
  Info,
  Star,
  Mail,
  Smartphone,
  Bell,
  Image as ImageIcon,
  Paperclip,
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

interface AnnouncementTemplate {
  id: string;
  title: string;
  description: string;
  subject: string;
  message: string;
  category: "academic" | "event" | "policy" | "emergency" | "general";
  priority: "low" | "medium" | "high" | "urgent";
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
const announcementTemplates: AnnouncementTemplate[] = [
  {
    id: "academic-update",
    title: "Academic Update",
    description: "Important academic announcements and updates",
    subject: "Important Academic Update",
    message:
      "Dear Students,\n\nWe have an important academic update to share with you:\n\n{content}\n\nIf you have any questions, please don't hesitate to reach out to your academic advisor or the Student Success Center.\n\nBest regards,\nAcademic Affairs",
    category: "academic",
    priority: "medium",
  },
  {
    id: "event-announcement",
    title: "Event Announcement",
    description: "Announce upcoming events and activities",
    subject: "Exciting Event Coming Up!",
    message:
      "Hello Everyone,\n\nWe're excited to announce an upcoming event:\n\n{event_name}\nDate: {date}\nTime: {time}\nLocation: {location}\n\n{description}\n\nWe hope to see you there!\n\nBest regards,\nEvents Team",
    category: "event",
    priority: "low",
  },
  {
    id: "policy-update",
    title: "Policy Update",
    description: "Important policy changes and updates",
    subject: "Important Policy Update",
    message:
      "Dear Community,\n\nWe want to inform you about an important policy update:\n\n{policy_details}\n\nThis change will take effect on {effective_date}.\n\nFor questions or clarifications, please contact the administration office.\n\nBest regards,\nAdministration",
    category: "policy",
    priority: "high",
  },
  {
    id: "emergency-alert",
    title: "Emergency Alert",
    description: "Urgent emergency notifications",
    subject: "URGENT: Emergency Alert",
    message:
      "EMERGENCY ALERT\n\n{emergency_details}\n\nImmediate Action Required:\n{action_required}\n\nFor more information, contact emergency services or campus security.\n\nStay safe,\nCampus Security",
    category: "emergency",
    priority: "urgent",
  },
  {
    id: "general-announcement",
    title: "General Announcement",
    description: "General community announcements",
    subject: "Community Announcement",
    message:
      "Dear Community,\n\n{announcement_content}\n\nThank you for your attention to this matter.\n\nBest regards,\nStudent Affairs",
    category: "general",
    priority: "low",
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
    id: 8,
    name: "Dr. Patricia Mensah",
    avatar:
      "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400",
    role: "Head of Coaches",
    email: "patricia.mensah@ashesi.edu.gh",
    phone: "+233 24 789 0123",
  },
];

const categories = [
  "All",
  "Academic",
  "Event",
  "Policy",
  "Emergency",
  "General",
];
const priorities = ["All", "Low", "Medium", "High", "Urgent"];
const deliveryMethods = ["Email", "SMS", "Push Notification"];
const audienceGroups = [
  "All Students",
  "Freshmen",
  "Sophomores",
  "Juniors",
  "Seniors",
  "Coaches",
  "Staff",
];

export default function SendAnnouncementsScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const [selectedTemplate, setSelectedTemplate] =
    useState<AnnouncementTemplate | null>(null);
  const [selectedPeople, setSelectedPeople] = useState<Person[]>([]);
  const [showPersonPicker, setShowPersonPicker] = useState(false);
  const [customSubject, setCustomSubject] = useState("");
  const [customMessage, setCustomMessage] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("All");
  const [selectedPriorityFilter, setSelectedPriorityFilter] = useState("All");
  const [selectedDeliveryMethods, setSelectedDeliveryMethods] = useState<
    string[]
  >(["Email"]);
  const [selectedAudienceGroups, setSelectedAudienceGroups] = useState<
    string[]
  >([]);
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [isScheduled, setIsScheduled] = useState(false);
  const [attachments, setAttachments] = useState<string[]>([]);

  const filteredTemplates = announcementTemplates.filter((template) => {
    const matchesCategory =
      selectedCategoryFilter === "All" ||
      template.category === selectedCategoryFilter.toLowerCase();
    const matchesPriority =
      selectedPriorityFilter === "All" ||
      template.priority === selectedPriorityFilter.toLowerCase();
    return matchesCategory && matchesPriority;
  });

  const handleTemplateSelect = (template: AnnouncementTemplate) => {
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

  const handleAudienceGroupToggle = (group: string) => {
    if (selectedAudienceGroups.includes(group)) {
      setSelectedAudienceGroups(
        selectedAudienceGroups.filter((g) => g !== group)
      );
    } else {
      setSelectedAudienceGroups([...selectedAudienceGroups, group]);
    }
  };

  const handleSendAnnouncement = () => {
    if (
      !selectedTemplate ||
      (selectedPeople.length === 0 && selectedAudienceGroups.length === 0) ||
      selectedDeliveryMethods.length === 0
    ) {
      Alert.alert(
        "Missing Information",
        "Please select a template, recipients (individual or groups), and delivery method."
      );
      return;
    }

    const totalRecipients =
      selectedPeople.length + selectedAudienceGroups.length * 50; // Estimate
    Alert.alert(
      "Send Announcement",
      `Send "${selectedTemplate.title}" to approximately ${totalRecipients} recipient(s) via ${selectedDeliveryMethods.join(
        ", "
      )}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Send",
          onPress: () => {
            Alert.alert("Success", "Announcement sent successfully!");
            router.back();
          },
        },
      ]
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "#dc2626";
      case "high":
        return "#f59e0b";
      case "medium":
        return "#3b82f6";
      case "low":
        return "#059669";
      default:
        return theme.colors.textSecondary;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "academic":
        return Info;
      case "event":
        return Star;
      case "policy":
        return CheckCircle;
      case "emergency":
        return AlertTriangle;
      case "general":
        return Megaphone;
      default:
        return Info;
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
    priorityBadge: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.xxxl,
      marginLeft: theme.spacing.sm,
    },
    priorityText: {
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
    templateCategory: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      fontWeight: "500",
      marginLeft: theme.spacing.sm,
    },
    audienceSection: {
      marginBottom: theme.spacing.lg,
    },
    audienceOptions: {
      gap: theme.spacing.md,
    },
    audienceOption: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    audienceOptionTitle: {
      ...theme.typography.body,
      color: theme.colors.text,
      fontWeight: "600",
      marginBottom: theme.spacing.sm,
    },
    audienceGroups: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.md,
    },
    audienceGroup: {
      backgroundColor: theme.colors.background,
      borderRadius: theme.borderRadius.xxxl,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderWidth: 2,
      borderColor: "transparent",
    },
    selectedAudienceGroup: {
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.primary + "10",
    },
    audienceGroupText: {
      ...theme.typography.bodySmall,
      color: theme.colors.text,
      fontWeight: "600",
    },
    selectedAudienceGroupText: {
      color: theme.colors.primary,
    },
    individualRecipientsButton: {
      backgroundColor: theme.colors.background,
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
    attachmentsSection: {
      marginBottom: theme.spacing.lg,
    },
    attachmentButton: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: theme.spacing.md,
    },
    attachmentButtonText: {
      ...theme.typography.body,
      color: theme.colors.text,
      fontWeight: "600",
      marginLeft: theme.spacing.sm,
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
        title="Send Announcements"
        leftIcon={ArrowLeft}
        onLeftPress={() => router.back()}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Template Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Announcement Template</Text>

          {/* Filters */}
          <View style={styles.filtersContainer}>
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Category</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.filtersScroll}>
                  {categories.map((category) => (
                    <FilterChip
                      key={category}
                      label={category}
                      selected={selectedCategoryFilter === category}
                      onPress={() => setSelectedCategoryFilter(category)}
                    />
                  ))}
                </View>
              </ScrollView>
            </View>

            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Priority</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.filtersScroll}>
                  {priorities.map((priority) => (
                    <FilterChip
                      key={priority}
                      label={priority}
                      selected={selectedPriorityFilter === priority}
                      onPress={() => setSelectedPriorityFilter(priority)}
                    />
                  ))}
                </View>
              </ScrollView>
            </View>
          </View>

          {/* Templates */}
          <View style={styles.templatesContainer}>
            {filteredTemplates.map((template) => {
              const CategoryIcon = getCategoryIcon(template.category);
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
                        styles.priorityBadge,
                        {
                          backgroundColor:
                            getPriorityColor(template.priority) + "20",
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.priorityText,
                          { color: getPriorityColor(template.priority) },
                        ]}
                      >
                        {template.priority}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.templateDescription}>
                    {template.description}
                  </Text>
                  <View style={styles.templateMeta}>
                    <CategoryIcon
                      color={theme.colors.textSecondary}
                      size={16}
                    />
                    <Text style={styles.templateCategory}>
                      {template.category}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Audience Selection */}
        {selectedTemplate && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Select Audience</Text>
            <View style={styles.audienceSection}>
              <View style={styles.audienceOptions}>
                {/* Group Selection */}
                <View style={styles.audienceOption}>
                  <Text style={styles.audienceOptionTitle}>
                    Audience Groups
                  </Text>
                  <View style={styles.audienceGroups}>
                    {audienceGroups.map((group) => {
                      const isSelected = selectedAudienceGroups.includes(group);
                      return (
                        <TouchableOpacity
                          key={group}
                          style={[
                            styles.audienceGroup,
                            isSelected && styles.selectedAudienceGroup,
                          ]}
                          onPress={() => handleAudienceGroupToggle(group)}
                        >
                          <Text
                            style={[
                              styles.audienceGroupText,
                              isSelected && styles.selectedAudienceGroupText,
                            ]}
                          >
                            {group}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>

                {/* Individual Recipients */}
                <View style={styles.audienceOption}>
                  <Text style={styles.audienceOptionTitle}>
                    Individual Recipients
                  </Text>
                  <TouchableOpacity
                    style={styles.individualRecipientsButton}
                    onPress={() => setShowPersonPicker(true)}
                  >
                    <View style={styles.recipientsContent}>
                      <Text style={styles.recipientsTitle}>
                        Select Individuals
                      </Text>
                      <Text style={styles.recipientsCount}>
                        {selectedPeople.length === 0
                          ? "No individuals selected"
                          : `${selectedPeople.length} individual${selectedPeople.length === 1 ? "" : "s"} selected`}
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
            </View>
          </View>
        )}

        {/* Message Customization */}
        {selectedTemplate &&
          (selectedPeople.length > 0 || selectedAudienceGroups.length > 0) && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Customize Message</Text>
              <View style={styles.customizationSection}>
                <TextInput
                  label="Subject"
                  value={customSubject}
                  onChangeText={setCustomSubject}
                  placeholder="Enter announcement subject"
                  style={{ marginBottom: theme.spacing.md }}
                />
                <TextInput
                  label="Message"
                  value={customMessage}
                  onChangeText={setCustomMessage}
                  placeholder="Enter your announcement message"
                  multiline
                  numberOfLines={10}
                  style={{ height: 150 }}
                />
              </View>
            </View>
          )}

        {/* Attachments */}
        {selectedTemplate &&
          (selectedPeople.length > 0 || selectedAudienceGroups.length > 0) && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Attachments (Optional)</Text>
              <View style={styles.attachmentsSection}>
                <TouchableOpacity
                  style={styles.attachmentButton}
                  onPress={() => {}}
                >
                  <Paperclip color={theme.colors.textSecondary} size={20} />
                  <Text style={styles.attachmentButtonText}>
                    Add Attachment
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

        {/* Delivery Method */}
        {selectedTemplate &&
          (selectedPeople.length > 0 || selectedAudienceGroups.length > 0) && (
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
          (selectedPeople.length > 0 || selectedAudienceGroups.length > 0) &&
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
        (selectedPeople.length > 0 || selectedAudienceGroups.length > 0) &&
        selectedDeliveryMethods.length > 0 && (
          <Button
            title={isScheduled ? "Schedule Announcement" : "Send Announcement"}
            onPress={handleSendAnnouncement}
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
        subtitle="Choose individuals to receive this announcement"
        type="all"
        allowSelectAll={true}
        multiSelect={true}
      />
    </SafeAreaView>
  );
}
