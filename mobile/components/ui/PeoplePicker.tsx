"use client";

import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
} from "react-native";
import { X } from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { Modal } from "@/components/ui/Modal";
import { Avatar } from "@/components/ui/Avatar";

interface Person {
  id: string;
  name: string;
  email?: string;
  type: "person" | "group";
  avatar?: string;
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
  const [searchQuery, setSearchQuery] = useState("");
  const [currentSelection, setCurrentSelection] =
    useState<Person[]>(selectedPeople);

  const availablePeople: Person[] = [
    { id: "me", name: "Me", type: "person" },
    { id: "ayishatu", name: "Ayishatu Mohammed", type: "person" },
    { id: "inares", name: "Inares Kenne Tsangue", type: "person" },
    { id: "daniel", name: "Daniel Assem", type: "person" },
    { id: "bismark", name: "Bismark Ackah", type: "person" },
    {
      id: "saidou",
      name: "saidouamadousouweba@gmail.com",
      email: "saidouamadousouweba@gmail.com",
      type: "person",
    },
    { id: "vivance", name: "Vivance Niyoyavuze", type: "person" },
    { id: "students", name: "Students", type: "group" },
    { id: "faculty", name: "Faculty", type: "group" },
    { id: "class2027", name: "Class of 2027", type: "group" },
    { id: "class2026", name: "Class of 2026", type: "group" },
  ];

  const filteredPeople = availablePeople.filter(
    (person) =>
      person.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (person.email &&
        person.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

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

  const styles = StyleSheet.create({
    modalContent: {
      backgroundColor: "white",
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      height: "80%",
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
    removeButton: {
      padding: 8,
    },
    selectedIndicator: {
      backgroundColor: "#e3f2fd",
    },
  });

  const assignees = currentSelection.filter((p) => p.type === "person");
  const groups = currentSelection.filter((p) => p.type === "group");

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      position="bottom"
      showCloseIcon={false}
    >
      <View style={styles.modalContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Add People</Text>
          <TouchableOpacity style={styles.closeButton} onPress={handleSave}>
            <Text style={{ color: "#1976d2", fontWeight: "600" }}>Done</Text>
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

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {assignees.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Assignees</Text>
              {assignees.map((person) => (
                <TouchableOpacity
                  key={person.id}
                  style={[styles.personItem, styles.selectedIndicator]}
                  onPress={() => handleTogglePerson(person)}
                >
                  <Avatar name={person.name} size={32} />
                  <View style={styles.personInfo}>
                    <Text style={styles.personName}>{person.name}</Text>
                    {person.email && (
                      <Text style={styles.personEmail}>{person.email}</Text>
                    )}
                  </View>
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => handleTogglePerson(person)}
                  >
                    <X color="#666" size={20} />
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </>
          )}

          {groups.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Groups</Text>
              {groups.map((group) => (
                <TouchableOpacity
                  key={group.id}
                  style={[styles.personItem, styles.selectedIndicator]}
                  onPress={() => handleTogglePerson(group)}
                >
                  <Avatar name={group.name} size={32} />
                  <View style={styles.personInfo}>
                    <Text style={styles.personName}>{group.name}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => handleTogglePerson(group)}
                  >
                    <X color="#666" size={20} />
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </>
          )}

          <Text style={styles.sectionTitle}>People</Text>
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
                <Avatar name={person.name} size={32} />
                <View style={styles.personInfo}>
                  <Text style={styles.personName}>{person.name}</Text>
                  {person.email && (
                    <Text style={styles.personEmail}>{person.email}</Text>
                  )}
                </View>
              </TouchableOpacity>
            ))}

          <Text style={styles.sectionTitle}>Groups</Text>
          {filteredPeople
            .filter(
              (p) =>
                p.type === "group" &&
                !currentSelection.some((s) => s.id === p.id)
            )
            .map((group) => (
              <TouchableOpacity
                key={group.id}
                style={styles.personItem}
                onPress={() => handleTogglePerson(group)}
              >
                <Avatar name={group.name} size={32} />
                <View style={styles.personInfo}>
                  <Text style={styles.personName}>{group.name}</Text>
                </View>
              </TouchableOpacity>
            ))}
        </ScrollView>
      </View>
    </Modal>
  );
}
