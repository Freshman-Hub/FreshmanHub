"use client";

import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { FAB, Portal } from "react-native-paper";
import { Calendar, Clock, Gift, Users, Plus, X } from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";

interface FloatingAction {
  type: string;
  label: string;
  icon?: React.ComponentType<any>;
  color?: string;
}

interface FloatingActionButtonProps {
  actions: FloatingAction[];
  onActionPress: (actionType: string) => void;
}

export function FloatingActionButton({
  actions,
  onActionPress,
}: FloatingActionButtonProps) {
  const { theme } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);

  const getIconForAction = (actionType: string) => {
    switch (actionType) {
      case "event":
        return Calendar;
      case "session":
        return Users;
      case "task":
        return Clock;
      case "reminder":
        return Gift;
      default:
        return Calendar;
    }
  };

  const getColorForAction = (actionType: string) => {
    switch (actionType) {
      case "event":
        return theme.colors.primary;
      case "session":
        return "#f093fb"; // Purple for sessions
      case "task":
        return theme.colors.textSecondary;
      case "reminder":
        return theme.colors.warning;
      default:
        return theme.colors.primary;
    }
  };

  const handleActionPress = (actionType: string) => {
    setIsExpanded(false);
    onActionPress(actionType);
  };

  // Convert Lucide icons to render props for Paper
  const createIconRenderProp =
    (IconComponent: React.ComponentType<any>, color: string) => {
    const IconWrapper = ({ size }: { size: number }) => (
      <View style={{ alignItems: "center", justifyContent: "center" }}>
        <IconComponent size={size} color={color} />
      </View>
    );
    IconWrapper.displayName = 'IconWrapper';
    return IconWrapper;
  };

  const fabActions = actions.map((action) => {
    const IconComponent = action.icon || getIconForAction(action.type);
    const iconColor = action.color || getColorForAction(action.type);

    return {
      icon: createIconRenderProp(IconComponent, iconColor),
      label: action.label,
      onPress: () => handleActionPress(action.type),
      style: {
        backgroundColor: theme.colors.surface,
      },
    };
  });

  const styles = StyleSheet.create({
    fab: {
      backgroundColor: theme.colors.primary,
    },
    fabGroup: {
      paddingBottom: 16,
      paddingRight: 16,
    },
  });

  return (
    <Portal>
      <FAB.Group
        open={isExpanded}
        visible={true}
        icon={createIconRenderProp(isExpanded ? X : Plus, "white")}
        actions={fabActions}
        onStateChange={({ open }) => setIsExpanded(open)}
        onPress={() => {
          if (isExpanded) {
            // Do nothing, let the group handle closing
          }
        }}
        style={styles.fabGroup}
        fabStyle={styles.fab}
        theme={{
          colors: {
            primary: theme.colors.primary,
            surface: theme.colors.surface,
            onSurface: theme.colors.text,
          },
        }}
      />
    </Portal>
  );
}
