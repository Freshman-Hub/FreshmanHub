import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import React, { Component, ReactNode } from "react";
import {
  Animated,
  Dimensions,
  Platform,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface Props {
  children: ReactNode;
  fallback?: (
    error: Error,
    resetError: () => void,
    errorId: string
  ) => ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo, errorId: string) => void;
  enableReporting?: boolean;
  enableAutoRestart?: boolean;
  autoRestartDelay?: number;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  errorId: string | null;
  errorCount: number;
  showDetails: boolean;
}

const { width, height } = Dimensions.get("window");

class AdvancedErrorBoundary extends Component<Props, State> {
  private animatedValue = new Animated.Value(0);
  private pulseValue = new Animated.Value(1);
  private autoRestartTimer: number | null = null;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
      errorCount: 0,
      showDetails: false,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    const errorId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    return {
      hasError: true,
      error,
      errorId,
    };
  }

  async componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const {
      onError,
      enableReporting,
      enableAutoRestart,
      autoRestartDelay = 5000,
    } = this.props;
    const errorId = this.state.errorId!;

    // Update state with error info
    this.setState((prevState) => ({
      errorInfo,
      errorCount: prevState.errorCount + 1,
    }));

    // Log error
    console.error("AdvancedErrorBoundary caught an error:", error, errorInfo);

    // Store error locally for debugging
    if (enableReporting) {
      await this.storeErrorLocally(error, errorInfo, errorId);
    }

    // Call custom error handler
    onError?.(error, errorInfo, errorId);

    // Start animations
    this.startEntranceAnimations();

    // Haptic feedback
    if (Platform.OS === "ios") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }

    // Auto restart if enabled and error count is low
    if (enableAutoRestart && this.state.errorCount < 3) {
      this.autoRestartTimer = setTimeout(() => {
        this.resetError();
      }, autoRestartDelay);
    }
  }

  componentWillUnmount() {
    if (this.autoRestartTimer) {
      clearTimeout(this.autoRestartTimer);
    }
  }

  private startEntranceAnimations = () => {
    Animated.parallel([
      Animated.spring(this.animatedValue, {
        toValue: 1,
        useNativeDriver: true,
        tension: 50,
        friction: 8,
      }),
      Animated.loop(
        Animated.sequence([
          Animated.timing(this.pulseValue, {
            toValue: 1.1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(this.pulseValue, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ),
    ]).start();
  };

  private storeErrorLocally = async (
    error: Error,
    errorInfo: React.ErrorInfo,
    errorId: string
  ) => {
    try {
      const errorData = {
        id: errorId,
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
        userAgent: Platform.OS,
        version: Platform.Version,
      };

      const existingErrors = await AsyncStorage.getItem("error_reports");
      const errors = existingErrors ? JSON.parse(existingErrors) : [];
      errors.push(errorData);

      // Keep only last 10 errors
      if (errors.length > 10) {
        errors.splice(0, errors.length - 10);
      }

      await AsyncStorage.setItem("error_reports", JSON.stringify(errors));
    } catch (storageError) {
      console.error("Failed to store error locally:", storageError);
    }
  };

  private shareErrorReport = async () => {
    try {
      const { error, errorInfo, errorId } = this.state;
      if (!error || !errorInfo) return;

      const errorReport = `
Error Report (ID: ${errorId})
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📱 Platform: ${Platform.OS} ${Platform.Version}
⏰ Time: ${new Date().toLocaleString()}
🔢 Error Count: ${this.state.errorCount}

🚨 Error Message:
${error.message}

📍 Stack Trace:
${error.stack || "No stack trace available"}

🧩 Component Stack:
${errorInfo.componentStack || "No component stack available"}
      `.trim();

      await Share.share({
        message: errorReport,
        title: "Error Report - FreshmanHub",
      });
    } catch (shareError) {
      console.error("Failed to share error report:", shareError);
    }
  };

  private resetError = () => {
    if (this.autoRestartTimer) {
      clearTimeout(this.autoRestartTimer);
      this.autoRestartTimer = null;
    }

    Animated.timing(this.animatedValue, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
        errorId: null,
        showDetails: false,
      });
    });

    if (Platform.OS === "ios") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  private toggleDetails = () => {
    this.setState((prevState) => ({ showDetails: !prevState.showDetails }));
    if (Platform.OS === "ios") {
      Haptics.selectionAsync();
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback(
          this.state.error!,
          this.resetError,
          this.state.errorId!
        );
      }

      return (
        <AdvancedErrorFallback
          error={this.state.error!}
          errorInfo={this.state.errorInfo!}
          errorId={this.state.errorId!}
          errorCount={this.state.errorCount}
          showDetails={this.state.showDetails}
          resetError={this.resetError}
          toggleDetails={this.toggleDetails}
          shareErrorReport={this.shareErrorReport}
          animatedValue={this.animatedValue}
          pulseValue={this.pulseValue}
        />
      );
    }

    return this.props.children;
  }
}

interface AdvancedErrorFallbackProps {
  error: Error;
  errorInfo: React.ErrorInfo;
  errorId: string;
  errorCount: number;
  showDetails: boolean;
  resetError: () => void;
  toggleDetails: () => void;
  shareErrorReport: () => void;
  animatedValue: Animated.Value;
  pulseValue: Animated.Value;
}

const AdvancedErrorFallback: React.FC<AdvancedErrorFallbackProps> = ({
  error,
  errorInfo,
  errorId,
  errorCount,
  showDetails,
  resetError,
  toggleDetails,
  shareErrorReport,
  animatedValue,
  pulseValue,
}) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const isDark = colorScheme === "dark";

  return (
    <View style={styles.container}>
      {/* Animated Background */}
      <LinearGradient
        colors={
          isDark
            ? ["#0F0F23", "#1A1A2E", "#16213E", "#0F0F23"]
            : ["#667eea", "#764ba2", "#f093fb", "#667eea"]
        }
        style={StyleSheet.absoluteFillObject}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <BlurView intensity={20} style={StyleSheet.absoluteFillObject} />

      {/* Floating Particles */}
      <FloatingParticles />

      {/* Main Content */}
      <Animated.View
        style={[
          styles.contentContainer,
          {
            opacity: animatedValue,
            transform: [
              {
                scale: animatedValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.8, 1],
                }),
              },
              {
                translateY: animatedValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [50, 0],
                }),
              },
            ],
          },
        ]}
      >
        {/* Error Icon with Pulse */}
        <Animated.View
          style={[styles.iconContainer, { transform: [{ scale: pulseValue }] }]}
        >
          <View
            style={[
              styles.iconGlow,
              { backgroundColor: isDark ? "#FF6B6B" : "#FF4757" },
            ]}
          />
          <Ionicons
            name="warning"
            size={80}
            color={isDark ? "#FF6B6B" : "#FF4757"}
          />
        </Animated.View>

        {/* Error Info */}
        <View style={styles.errorHeader}>
          <Text style={[styles.title, { color: colors.text }]}>
            Unexpected Error
          </Text>
          <View style={styles.errorMeta}>
            <Text style={[styles.errorId, { color: colors.text }]}>
              ID: {errorId.slice(-8).toUpperCase()}
            </Text>
            {errorCount > 1 && (
              <Text style={[styles.errorCount, { color: "#FF6B6B" }]}>
                Attempt #{errorCount}
              </Text>
            )}
          </View>
        </View>

        <Text style={[styles.description, { color: colors.text }]}>
          We&apos;ve encountered an unexpected issue. Our team has been notified
          automatically.
        </Text>

        {/* Error Details Toggle */}
        <TouchableOpacity
          style={[styles.detailsToggle, { borderColor: colors.tint + "30" }]}
          onPress={toggleDetails}
        >
          <Ionicons
            name={showDetails ? "chevron-up" : "chevron-down"}
            size={20}
            color={colors.tint}
          />
          <Text style={[styles.detailsText, { color: colors.tint }]}>
            {showDetails ? "Hide" : "Show"} Technical Details
          </Text>
        </TouchableOpacity>

        {/* Collapsible Error Details */}
        {showDetails && (
          <Animated.View style={styles.errorDetails}>
            <Text style={[styles.errorMessage, { color: "#FF6B6B" }]}>
              {error.message}
            </Text>
            <Text style={[styles.errorStack, { color: colors.text }]}>
              {error.stack?.split("\n").slice(0, 5).join("\n")}
            </Text>
          </Animated.View>
        )}

        {/* Action Buttons */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={[
              styles.button,
              styles.primaryButton,
              { backgroundColor: colors.tint },
            ]}
            onPress={resetError}
          >
            <Ionicons name="refresh" size={20} color="white" />
            <Text style={styles.buttonText}>Try Again</Text>
          </TouchableOpacity>

          <View style={styles.secondaryButtons}>
            <TouchableOpacity
              style={[
                styles.button,
                styles.secondaryButton,
                { borderColor: colors.tint + "50" },
              ]}
              onPress={shareErrorReport}
            >
              <Ionicons name="share" size={18} color={colors.tint} />
              <Text
                style={[styles.secondaryButtonText, { color: colors.tint }]}
              >
                Share Report
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.button,
                styles.secondaryButton,
                { borderColor: colors.tint + "50" },
              ]}
              onPress={() => {
                // Navigate to home or safe screen
                console.log("Navigate to safe screen");
              }}
            >
              <Ionicons name="home" size={18} color={colors.tint} />
              <Text
                style={[styles.secondaryButtonText, { color: colors.tint }]}
              >
                Home
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </View>
  );
};

// Enhanced Floating Particles Component
const FloatingParticles: React.FC = () => {
  const particles = Array.from({ length: 8 }, (_, i) => i);

  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
      {particles.map((particle) => (
        <FloatingParticle
          key={particle}
          delay={particle * 700}
          size={Math.random() * 6 + 4}
          duration={4000 + Math.random() * 3000}
        />
      ))}
    </View>
  );
};

const FloatingParticle: React.FC<{
  delay: number;
  size: number;
  duration: number;
}> = ({ delay, size, duration }) => {
  const animatedValue = new Animated.Value(0);
  const opacityValue = new Animated.Value(0);
  const rotationValue = new Animated.Value(0);

  React.useEffect(() => {
    const startAnimation = () => {
      Animated.loop(
        Animated.parallel([
          Animated.timing(animatedValue, {
            toValue: 1,
            duration,
            useNativeDriver: true,
            delay,
          }),
          Animated.sequence([
            Animated.timing(opacityValue, {
              toValue: 0.8,
              duration: duration * 0.2,
              useNativeDriver: true,
              delay,
            }),
            Animated.timing(opacityValue, {
              toValue: 0,
              duration: duration * 0.8,
              useNativeDriver: true,
            }),
          ]),
          Animated.timing(rotationValue, {
            toValue: 1,
            duration,
            useNativeDriver: true,
            delay,
          }),
        ])
      ).start();
    };

    startAnimation();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [delay, duration]);

  return (
    <Animated.View
      style={[
        styles.particle,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          opacity: opacityValue,
          transform: [
            {
              translateX: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [Math.random() * width, Math.random() * width],
              }),
            },
            {
              translateY: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [height, -100],
              }),
            },
            {
              rotate: rotationValue.interpolate({
                inputRange: [0, 1],
                outputRange: ["0deg", "360deg"],
              }),
            },
            {
              scale: animatedValue.interpolate({
                inputRange: [0, 0.3, 0.7, 1],
                outputRange: [0, 1, 1, 0],
              }),
            },
          ],
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    width: width * 0.92,
    maxWidth: 420,
    padding: 32,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    borderRadius: 28,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 25 },
    shadowOpacity: 0.3,
    shadowRadius: 30,
    elevation: 30,
  },
  iconContainer: {
    position: "relative",
    marginBottom: 24,
  },
  iconGlow: {
    position: "absolute",
    width: 140,
    height: 140,
    borderRadius: 70,
    opacity: 0.15,
    top: -30,
    left: -30,
  },
  errorHeader: {
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 8,
    fontFamily: "Inter-Bold",
  },
  errorMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  errorId: {
    fontSize: 12,
    opacity: 0.6,
    fontFamily: "SpaceMono",
  },
  errorCount: {
    fontSize: 12,
    fontWeight: "600",
    backgroundColor: "rgba(255, 107, 107, 0.2)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 24,
    opacity: 0.85,
    fontFamily: "Inter-Regular",
  },
  detailsToggle: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 16,
  },
  detailsText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "500",
  },
  errorDetails: {
    width: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  errorMessage: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    fontFamily: "SpaceMono",
  },
  errorStack: {
    fontSize: 11,
    lineHeight: 16,
    opacity: 0.8,
    fontFamily: "SpaceMono",
  },
  buttonsContainer: {
    width: "100%",
    gap: 16,
  },
  secondaryButtons: {
    flexDirection: "row",
    gap: 12,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    gap: 8,
  },
  primaryButton: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  secondaryButton: {
    flex: 1,
    borderWidth: 2,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "Inter-Bold",
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "Inter-SemiBold",
  },
  particle: {
    position: "absolute",
    backgroundColor: "rgba(255, 255, 255, 0.4)",
  },
});

export default AdvancedErrorBoundary;
