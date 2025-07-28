"use client";

import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import { X, Users, GraduationCap } from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { useUser } from "@/contexts/UserContext";
import { Modal } from "@/components/ui/Modal";
import { Avatar } from "@/components/ui/Avatar";
import { UserService } from "@/services/user.service";

interface Person {
  id: string;
  name: string;
  email?: string;
  type: "person" | "group";
  avatar?: string;
  role?: string;
  yearGroup?: string;
  userIds?: string[]; // For groups - contains list of user IDs
}

interface PeoplePickerProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (people: Person[]) => void;
  selectedPeople: Person[];
}

export function PeoplePicker({
  visible,
  onClose,
  onSelect,
  selectedPeople,
}: PeoplePickerProps) {
  const { theme } = useTheme();
  const { user } = useUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentSelection, setCurrentSelection] =
    useState<Person[]>(selectedPeople);
  const [loading, setLoading] = useState(true);
  const [, setAllUsers] = useState<any[]>([]);
  const [availablePeople, setAvailablePeople] = useState<Person[]>([]);

  // Load users from backend
  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      const { users, error } = await UserService.getAllUsers();

      if (error) {
        console.error("Error fetching users:", error);
        Alert.alert("Error", "Failed to load users. Please try again.");
        return;
      }

      setAllUsers(users);

      // Create people list (exclude current user)
      const people: Person[] = users
        .filter((u) => u.id !== user?.id && u.isActive) // Exclude current user and inactive users
        .map((u) => ({
          id: u.id,
          name:
            `${u.firstName || ""} ${u.lastName || ""}`.trim() ||
            u.email?.split("@")[0] ||
            "Unknown User",
          email: u.email,
          type: "person" as const,
          avatar: u.profileImage,
          role: u.role,
          yearGroup: u.yearGroup,
        }));

      // Create dynamic groups
      const groups = createDynamicGroups(users);

      setAvailablePeople([...people, ...groups]);
    } catch (error) {
      console.error("Error loading users:", error);
      Alert.alert("Error", "Failed to load users. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // Create dynamic groups based on users
  const createDynamicGroups = (users: any[]): Person[] => {
    const groups: Person[] = [];

    // Class of 2027 - all users with yearGroup = "2027"
    const class2027Users = users.filter(
      (u) => u.yearGroup === "2027" && u.isActive
    );
    if (class2027Users.length > 0) {
      groups.push({
        id: "class_2027",
        name: `Class of 2027 (${class2027Users.length} members)`,
        type: "group",
        userIds: class2027Users.map((u) => u.id),
      });
    }

    // Class of 2026 - all users with yearGroup = "2026"
    const class2026Users = users.filter(
      (u) => u.yearGroup === "2026" && u.isActive
    );
    if (class2026Users.length > 0) {
      groups.push({
        id: "class_2026",
        name: `Class of 2026 (${class2026Users.length} members)`,
        type: "group",
        userIds: class2026Users.map((u) => u.id),
      });
    }

    // Class of 2025 - all users with yearGroup = "2025"
    const class2025Users = users.filter(
      (u) => u.yearGroup === "2025" && u.isActive
    );
    if (class2025Users.length > 0) {
      groups.push({
        id: "class_2025",
        name: `Class of 2025 (${class2025Users.length} members)`,
        type: "group",
        userIds: class2025Users.map((u) => u.id),
      });
    }

    // Freshmen group - all users with role = "freshman"
    const freshmenUsers = users.filter(
      (u) => u.role === "freshman" && u.isActive
    );
    if (freshmenUsers.length > 0) {
      groups.push({
        id: "freshmen",
        name: `Freshmen (${freshmenUsers.length} students)`,
        type: "group",
        userIds: freshmenUsers.map((u) => u.id),
      });
    }

    // Peer Coaches group - all users with role = "peer_coach"
    const peerCoachUsers = users.filter(
      (u) => u.role === "peer_coach" && u.isActive
    );
    if (peerCoachUsers.length > 0) {
      groups.push({
        id: "peer_coaches",
        name: `Peer Coaches (${peerCoachUsers.length} coaches)`,
        type: "group",
        userIds: peerCoachUsers.map((u) => u.id),
      });
    }

    // Student Leaders group - all users with role = "student_leader"
    const studentLeaderUsers = users.filter(
      (u) => u.role === "student_leader" && u.isActive
    );
    if (studentLeaderUsers.length > 0) {
      groups.push({
        id: "student_leaders",
        name: `Student Leaders (${studentLeaderUsers.length} leaders)`,
        type: "group",
        userIds: studentLeaderUsers.map((u) => u.id),
      });
    }

    // Academic Advisors group - all users with role = "academic_advisor"
    const advisorUsers = users.filter(
      (u) => u.role === "academic_advisor" && u.isActive
    );
    if (advisorUsers.length > 0) {
      groups.push({
        id: "advisors",
        name: `Academic Advisors (${advisorUsers.length} advisors)`,
        type: "group",
        userIds: advisorUsers.map((u) => u.id),
      });
    }

    // All Students group - freshmen + continuous + student_leader
    const allStudentUsers = users.filter(
      (u) =>
        (u.role === "freshman" ||
          u.role === "continuous" ||
          u.role === "student_leader") &&
        u.isActive
    );
    if (allStudentUsers.length > 0) {
      groups.push({
        id: "all_students",
        name: `All Students (${allStudentUsers.length} students)`,
        type: "group",
        userIds: allStudentUsers.map((u) => u.id),
      });
    }

    return groups;
  };

  // Load users when modal opens
  useEffect(() => {
    if (visible) {
      loadUsers();
      setCurrentSelection(selectedPeople);
    }
  }, [visible, selectedPeople, loadUsers]);

  const filteredPeople = availablePeople.filter((person) => {
    if (searchQuery === "") return true;
    const query = searchQuery.toLowerCase();
    return (
      person.name.toLowerCase().includes(query) ||
      (person.email && person.email.toLowerCase().includes(query)) ||
      (person.role && person.role.toLowerCase().includes(query))
    );
  });

  const handleTogglePerson = (person: Person) => {
    const isSelected = currentSelection.some((p) => p.id === person.id);
    if (isSelected) {
      setCurrentSelection(currentSelection.filter((p) => p.id !== person.id));
    } else {
      setCurrentSelection([...currentSelection, person]);
    }
  };

  const handleSave = () => {
    onSelect(currentSelection);
    onClose();
  };

  const handleClose = () => {
    setCurrentSelection(selectedPeople); // Reset to original selection
    onClose();
  };

  const styles = StyleSheet.create({
    modalContent: {
      backgroundColor: "white",
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      height: "85%", // Extended modal height
      width: "100%",
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: "#f0f0f0",
    },
    title: {
      fontSize: 18,
      fontWeight: "600",
      color: "#333",
    },
    closeButton: {
      padding: 8,
    },
    doneButton: {
      color: theme.colors.primary,
      fontWeight: "600",
      fontSize: 16,
    },
    searchContainer: {
      paddingHorizontal: 20,
      paddingVertical: 16,
    },
    searchInput: {
      backgroundColor: "#f8f9fa",
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
      fontSize: 16,
      borderWidth: 1,
      borderColor: "#e9ecef",
    },
    content: {
      flex: 1,
      paddingHorizontal: 20,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: "#666",
      marginTop: 20,
      marginBottom: 12,
      flexDirection: "row",
      alignItems: "center",
    },
    sectionIcon: {
      marginRight: 8,
    },
    personItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: "#f0f0f0",
    },
    personInfo: {
      flex: 1,
      marginLeft: 12,
    },
    personName: {
      fontSize: 16,
      fontWeight: "500",
      color: "#333",
    },
    personEmail: {
      fontSize: 14,
      color: "#666",
      marginTop: 2,
    },
    personRole: {
      fontSize: 12,
      color: theme.colors.primary,
      marginTop: 2,
      fontWeight: "500",
    },
    removeButton: {
      padding: 8,
    },
    selectedIndicator: {
      backgroundColor: theme.colors.primary + "10",
    },
    groupItem: {
      backgroundColor: theme.colors.surface,
      borderRadius: 8,
      marginBottom: 8,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: 40,
    },
    loadingText: {
      marginTop: 12,
      color: theme.colors.textSecondary,
      fontSize: 16,
    },
    emptyState: {
      alignItems: "center",
      paddingVertical: 40,
    },
    emptyText: {
      color: theme.colors.textSecondary,
      fontSize: 16,
      textAlign: "center",
    },
  });

  // Helper function to get role display name
  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case "freshman":
        return "Freshman";
      case "continuous":
        return "Continuing Student";
      case "student_leader":
        return "Student Leader";
      case "peer_coach":
        return "Peer Coach";
      case "head_of_coaches":
        return "Head of Coaches";
      case "academic_advisor":
        return "Academic Advisor";
      default:
        return role;
    }
  };

  const assignees = currentSelection.filter((p) => p.type === "person");
  const groups = currentSelection.filter((p) => p.type === "group");

  return (
    <Modal
      visible={visible}
      onClose={handleClose}
      position="bottom"
      showCloseIcon={false}
    >
      <View style={styles.modalContent}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <X color="#666" size={24} />
          </TouchableOpacity>
          <Text style={styles.title}>Add People</Text>
          <TouchableOpacity style={styles.closeButton} onPress={handleSave}>
            <Text style={styles.doneButton}>Done</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search people or groups..."
            placeholderTextColor="#999"
          />
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading users...</Text>
          </View>
        ) : (
          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
          >
            {/* Selected Assignees */}
            {assignees.length > 0 && (
              <>
                <View style={styles.sectionTitle}>
                  <Users color="#666" size={16} style={styles.sectionIcon} />
                  <Text
                    style={{ fontSize: 16, fontWeight: "600", color: "#666" }}
                  >
                    Selected People ({assignees.length})
                  </Text>
                </View>
                {assignees.map((person) => (
                  <TouchableOpacity
                    key={person.id}
                    style={[styles.personItem, styles.selectedIndicator]}
                    onPress={() => handleTogglePerson(person)}
                  >
                    <Avatar
                      imageUrl={person.avatar}
                      initials={person.name.charAt(0)}
                      size={36}
                    />
                    <View style={styles.personInfo}>
                      <Text style={styles.personName}>{person.name}</Text>
                      {person.email && (
                        <Text style={styles.personEmail}>{person.email}</Text>
                      )}
                      {person.role && (
                        <Text style={styles.personRole}>
                          {getRoleDisplayName(person.role)}
                        </Text>
                      )}
                    </View>
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => handleTogglePerson(person)}
                    >
                      <X color={theme.colors.primary} size={20} />
                    </TouchableOpacity>
                  </TouchableOpacity>
                ))}
              </>
            )}

            {/* Selected Groups */}
            {groups.length > 0 && (
              <>
                <View style={styles.sectionTitle}>
                  <GraduationCap
                    color="#666"
                    size={16}
                    style={styles.sectionIcon}
                  />
                  <Text
                    style={{ fontSize: 16, fontWeight: "600", color: "#666" }}
                  >
                    Selected Groups ({groups.length})
                  </Text>
                </View>
                {groups.map((group) => (
                  <TouchableOpacity
                    key={group.id}
                    style={[
                      styles.personItem,
                      styles.selectedIndicator,
                      styles.groupItem,
                    ]}
                    onPress={() => handleTogglePerson(group)}
                  >
                    <Avatar
                      initials={group.name.substring(0, 2)}
                      size={36}
                      backgroundColor={theme.colors.accent}
                    />
                    <View style={styles.personInfo}>
                      <Text style={styles.personName}>{group.name}</Text>
                      <Text style={styles.personRole}>Group</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => handleTogglePerson(group)}
                    >
                      <X color={theme.colors.primary} size={20} />
                    </TouchableOpacity>
                  </TouchableOpacity>
                ))}
              </>
            )}

            {/* Available Groups */}
            <View style={styles.sectionTitle}>
              <GraduationCap
                color="#666"
                size={16}
                style={styles.sectionIcon}
              />
              <Text style={{ fontSize: 16, fontWeight: "600", color: "#666" }}>
                Groups
              </Text>
            </View>
            {filteredPeople
              .filter(
                (p) =>
                  p.type === "group" &&
                  !currentSelection.some((s) => s.id === p.id)
              )
              .map((group) => (
                <TouchableOpacity
                  key={group.id}
                  style={[styles.personItem, styles.groupItem]}
                  onPress={() => handleTogglePerson(group)}
                >
                  <Avatar
                    initials={group.name.substring(0, 2)}
                    size={36}
                    backgroundColor={theme.colors.accent + "30"}
                  />
                  <View style={styles.personInfo}>
                    <Text style={styles.personName}>{group.name}</Text>
                    <Text style={styles.personRole}>Group</Text>
                  </View>
                </TouchableOpacity>
              ))}

            {/* Available People */}
            <View style={styles.sectionTitle}>
              <Users color="#666" size={16} style={styles.sectionIcon} />
              <Text style={{ fontSize: 16, fontWeight: "600", color: "#666" }}>
                People
              </Text>
            </View>
            {filteredPeople
              .filter(
                (p) =>
                  p.type === "person" &&
                  !currentSelection.some((s) => s.id === p.id)
              )
              .map((person) => (
                <TouchableOpacity
                  key={person.id}
                  style={styles.personItem}
                  onPress={() => handleTogglePerson(person)}
                >
                  <Avatar
                    imageUrl={person.avatar}
                    initials={person.name.charAt(0)}
                    size={36}
                  />
                  <View style={styles.personInfo}>
                    <Text style={styles.personName}>{person.name}</Text>
                    {person.email && (
                      <Text style={styles.personEmail}>{person.email}</Text>
                    )}
                    {person.role && (
                      <Text style={styles.personRole}>
                        {getRoleDisplayName(person.role)}
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>
              ))}

            {filteredPeople.length === 0 && !loading && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>
                  No people or groups found matching &quot;{searchQuery}&quot;
                </Text>
              </View>
            )}
          </ScrollView>
        )}
      </View>
    </Modal>
  );
}
