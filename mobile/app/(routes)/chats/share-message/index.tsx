"use client";
import { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ArrowLeft, Send, Users, Check } from "lucide-react-native";
import { Avatar } from "@/components/chats/Avatar";

// Mock contacts data
const mockContacts = [
  {
    id: "status",
    name: "My status",
    subtitle: "My contacts",
    avatar: null,
    type: "status",
  },
  {
    id: "1",
    name: "Mi Leilou",
    subtitle: "Hey there! I am using WhatsApp.",
    avatar:
      "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400",
    type: "frequent",
  },
  {
    id: "2",
    name: "Naré Barké Noaga Mariama",
    subtitle: "",
    avatar:
      "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400",
    type: "recent",
  },
  {
    id: "3",
    name: "Jacqueline Lompo",
    subtitle: "",
    avatar:
      "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400",
    type: "recent",
  },
  {
    id: "4",
    name: "Naima Tahirou Mayaki ADU",
    subtitle: "",
    avatar: null,
    type: "recent",
  },
  {
    id: "5",
    name: "H",
    subtitle: "Disponible",
    avatar: null,
    type: "recent",
  },
  {
    id: "6",
    name: "Priscilla Unknown",
    subtitle: "",
    avatar: null,
    type: "recent",
  },
  {
    id: "7",
    name: "Vivance",
    subtitle: "Psalm 84:10",
    avatar: null,
    type: "recent",
  },
  {
    id: "8",
    name: "Grâce Sawadogo BF",
    subtitle: "Grâcieeeeee😂",
    avatar: null,
    type: "recent",
  },
];

export default function ShareMessageScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [sharedMessage, setSharedMessage] = useState<any>(null);

  useEffect(() => {
    if (params.messageData) {
      try {
        const messageData = JSON.parse(params.messageData as string);
        setSharedMessage(messageData);
      } catch (error) {
        console.error("Error parsing message data:", error);
      }
    }
  }, [params.messageData]);

  const frequentContacts = mockContacts.filter(
    (contact) => contact.type === "frequent" || contact.type === "status"
  );
  const recentContacts = mockContacts.filter(
    (contact) => contact.type === "recent"
  );

  const handleContactToggle = (contactId: string) => {
    setSelectedContacts((prev) =>
      prev.includes(contactId)
        ? prev.filter((id) => id !== contactId)
        : [...prev, contactId]
    );
  };

  const handleShare = () => {
    if (selectedContacts.length > 0) {
      // TODO: Share message to selected contacts
      console.log(
        "Sharing message to:",
        selectedContacts,
        "with message:",
        message
      );
      router.back();
    }
  };

  const getSelectedContactsData = () => {
    return mockContacts.filter((contact) =>
      selectedContacts.includes(contact.id)
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.md,
      backgroundColor: theme.colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    backButton: {
      marginRight: theme.spacing.md,
    },
    headerTitle: {
      ...theme.typography.h4,
      color: theme.colors.text,
      fontWeight: "600",
      flex: 1,
    },
    headerActions: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.md,
    },
    sectionHeader: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      backgroundColor: theme.colors.surface,
    },
    sectionTitle: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      fontWeight: "600",
    },
    contactItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.md,
      backgroundColor:
        selectedContacts.length > 0
          ? theme.colors.background
          : theme.colors.background,
    },
    selectedContactItem: {
      backgroundColor: theme.colors.primary + "15",
    },
    contactContent: {
      flex: 1,
      marginLeft: theme.spacing.md,
    },
    contactName: {
      ...theme.typography.body,
      color: theme.colors.text,
      fontWeight: "500",
    },
    contactSubtitle: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      marginTop: 2,
    },
    checkmark: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: theme.colors.primary,
      justifyContent: "center",
      alignItems: "center",
      marginLeft: theme.spacing.md,
    },
    messageInputContainer: {
      backgroundColor: theme.colors.surface,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.md,
    },
    selectedContactsPreview: {
      marginBottom: theme.spacing.sm,
    },
    selectedContactName: {
      ...theme.typography.bodySmall,
      color: theme.colors.primary,
      fontWeight: "500",
    },
    inputRow: {
      flexDirection: "row",
      alignItems: "center",
    },
    messageInput: {
      flex: 1,
      ...theme.typography.body,
      color: theme.colors.text,
      backgroundColor: theme.colors.background,
      borderRadius: theme.borderRadius.xl,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      marginRight: theme.spacing.sm,
      maxHeight: 100,
    },
    sendButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: theme.colors.primary,
      justifyContent: "center",
      alignItems: "center",
    },
    statusIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.primary,
      justifyContent: "center",
      alignItems: "center",
    },
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {selectedContacts.length} selected
        </Text>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={() => console.log("Add contacts")}>
            <Users size={24} color={theme.colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Status Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}></Text>
        </View>
        {frequentContacts.map((contact) => (
          <TouchableOpacity
            key={contact.id}
            style={[
              styles.contactItem,
              selectedContacts.includes(contact.id) &&
                styles.selectedContactItem,
            ]}
            onPress={() => handleContactToggle(contact.id)}
          >
            {contact.type === "status" ? (
              <View style={styles.statusIcon}>
                <Users size={20} color="white" />
              </View>
            ) : (
              <Avatar
                source={contact.avatar}
                name={contact.name}
                size={40}
                type="direct"
              />
            )}
            <View style={styles.contactContent}>
              <Text style={styles.contactName}>{contact.name}</Text>
              {contact.subtitle && (
                <Text style={styles.contactSubtitle}>{contact.subtitle}</Text>
              )}
            </View>
            {selectedContacts.includes(contact.id) && (
              <View style={styles.checkmark}>
                <Check size={16} color="white" />
              </View>
            )}
          </TouchableOpacity>
        ))}

        {/* Frequently Contacted */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Frequently contacted</Text>
        </View>
        {frequentContacts
          .filter((contact) => contact.type === "frequent")
          .map((contact) => (
            <TouchableOpacity
              key={contact.id}
              style={[
                styles.contactItem,
                selectedContacts.includes(contact.id) &&
                  styles.selectedContactItem,
              ]}
              onPress={() => handleContactToggle(contact.id)}
            >
              <Avatar
                source={contact.avatar}
                name={contact.name}
                size={40}
                type="direct"
              />
              <View style={styles.contactContent}>
                <Text style={styles.contactName}>{contact.name}</Text>
                {contact.subtitle && (
                  <Text style={styles.contactSubtitle}>{contact.subtitle}</Text>
                )}
              </View>
              {selectedContacts.includes(contact.id) && (
                <View style={styles.checkmark}>
                  <Check size={16} color="white" />
                </View>
              )}
            </TouchableOpacity>
          ))}

        {/* Recent Chats */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent chats</Text>
        </View>
        {recentContacts.map((contact) => (
          <TouchableOpacity
            key={contact.id}
            style={[
              styles.contactItem,
              selectedContacts.includes(contact.id) &&
                styles.selectedContactItem,
            ]}
            onPress={() => handleContactToggle(contact.id)}
          >
            <Avatar
              source={contact.avatar}
              name={contact.name}
              size={40}
              type="direct"
            />
            <View style={styles.contactContent}>
              <Text style={styles.contactName}>{contact.name}</Text>
              {contact.subtitle && (
                <Text style={styles.contactSubtitle}>{contact.subtitle}</Text>
              )}
            </View>
            {selectedContacts.includes(contact.id) && (
              <View style={styles.checkmark}>
                <Check size={16} color="white" />
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Message Input */}
      {selectedContacts.length > 0 && (
        <View style={styles.messageInputContainer}>
          <View style={styles.selectedContactsPreview}>
            <Text style={styles.selectedContactName}>
              {getSelectedContactsData()
                .map((c) => c.name)
                .join(", ")}
            </Text>
          </View>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.messageInput}
              placeholder="Add a message..."
              placeholderTextColor={theme.colors.textSecondary}
              value={message}
              onChangeText={setMessage}
              multiline
            />
            <TouchableOpacity style={styles.sendButton} onPress={handleShare}>
              <Send size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}
