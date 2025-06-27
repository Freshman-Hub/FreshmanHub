import {
  MaterialIcons,
  FontAwesome,
  Ionicons,
  Feather,
} from "@expo/vector-icons";
import { OpaqueColorValue, type StyleProp, type TextStyle } from "react-native";

type IconSet = "MaterialIcons" | "FontAwesome" | "Ionicons" | "Feather";

type IconConfig = {
  set: IconSet;
  name: string;
};

/**
 * Icon mappings with their respective icon sets
 * You can use any icon from @expo/vector-icons
 */
const ICON_MAPPING: Record<string, IconConfig> = {
  // Navigation
  home: { set: "MaterialIcons", name: "home" },
  "home-filled": { set: "MaterialIcons", name: "home" },
  map: { set: "MaterialIcons", name: "map" },
  location: { set: "MaterialIcons", name: "location-on" },
  explore: { set: "MaterialIcons", name: "explore" },
  search: { set: "MaterialIcons", name: "search" },

  // Communication
  chat: { set: "MaterialIcons", name: "chat" },
  message: { set: "MaterialIcons", name: "message" },
  send: { set: "MaterialIcons", name: "send" },
  phone: { set: "MaterialIcons", name: "phone" },
  email: { set: "MaterialIcons", name: "email" },

  // Academic
  book: { set: "MaterialIcons", name: "book" },
  school: { set: "MaterialIcons", name: "school" },
  assignment: { set: "MaterialIcons", name: "assignment" },
  calendar: { set: "MaterialIcons", name: "calendar-today" },
  grade: { set: "MaterialIcons", name: "grade" },

  // User & Profile
  person: { set: "MaterialIcons", name: "people" },
  profile: { set: "MaterialIcons", name: "account-circle" },
  settings: { set: "MaterialIcons", name: "settings" },
  edit: { set: "MaterialIcons", name: "edit" },

  // Actions
  add: { set: "MaterialIcons", name: "add" },
  delete: { set: "MaterialIcons", name: "delete" },
  more: { set: "MaterialIcons", name: "more-vert" },
  close: { set: "MaterialIcons", name: "close" },
  check: { set: "MaterialIcons", name: "check" },
  "arrow-right": { set: "MaterialIcons", name: "arrow-forward" },
  "arrow-left": { set: "MaterialIcons", name: "arrow-back" },

  // Notifications & Alerts
  notification: { set: "MaterialIcons", name: "notifications" },
  bell: { set: "Ionicons", name: "notifications" },
  warning: { set: "MaterialIcons", name: "warning" },
  info: { set: "MaterialIcons", name: "info" },
  error: { set: "MaterialIcons", name: "error" },

  // Social & Community
  group: { set: "MaterialIcons", name: "group" },
  people: { set: "MaterialIcons", name: "people" },
  favorite: { set: "MaterialIcons", name: "favorite" },
  share: { set: "MaterialIcons", name: "share" },

  // Campus & Facilities
  building: { set: "MaterialIcons", name: "business" },
  library: { set: "MaterialIcons", name: "local-library" },
  dining: { set: "MaterialIcons", name: "restaurant" },
  parking: { set: "MaterialIcons", name: "local-parking" },
  gym: { set: "MaterialIcons", name: "fitness-center" },

  // Help & Support
  help: { set: "MaterialIcons", name: "help" },
  support: { set: "MaterialIcons", name: "support" },
  feedback: { set: "MaterialIcons", name: "feedback" },

  // Privacy & Security
  lock: { set: "MaterialIcons", name: "lock" },
  unlock: { set: "MaterialIcons", name: "lock-open" },
  visibility: { set: "MaterialIcons", name: "visibility" },
  "visibility-off": { set: "MaterialIcons", name: "visibility-off" },
};

export type IconName = keyof typeof ICON_MAPPING;

/**
 * Universal icon component using Expo Vector Icons
 * Supports MaterialIcons, FontAwesome, Ionicons, and Feather
 */
export function IconSymbol({
  name,
  size = 24,
  color = "#000",
  style,
}: {
  name: IconName;
  size?: number;
  color?: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
}) {
  const iconConfig = ICON_MAPPING[name];

  if (!iconConfig) {
    console.warn(`Icon "${name}" not found in ICON_MAPPING`);
    return (
      <MaterialIcons name="help" size={size} color={color} style={style} />
    );
  }

  const iconProps = {
    name: iconConfig.name as any,
    size,
    color,
    style,
  };

  switch (iconConfig.set) {
    case "FontAwesome":
      return <FontAwesome {...iconProps} />;
    case "Ionicons":
      return <Ionicons {...iconProps} />;
    case "Feather":
      return <Feather {...iconProps} />;
    case "MaterialIcons":
    default:
      return <MaterialIcons {...iconProps} />;
  }
}

// Export individual icon sets for direct use if needed
export { MaterialIcons, FontAwesome, Ionicons, Feather };
