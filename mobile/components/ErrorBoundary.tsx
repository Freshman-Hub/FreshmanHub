import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import React, { Component, ReactNode } from "react";
import {
  Animated,
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface Props {
  children: ReactNode;
  fallback?: (error: Error, resetError: () => void) => ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: string | null;
}

const { width, height } = Dimensions.get("window");

class ErrorBoundary extends Component<Props, State> {
  private animatedValue = new Animated.Value(0);
  private pulseValue = new Animated.Value(1);

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: error.stack || "No stack trace available",
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);

    // Start entrance animation
    Animated.spring(this.animatedValue, {
      toValue: 1,
      useNativeDriver: true,
      tension: 50,
      friction: 8,
    }).start();

    // Start pulse animation
    this.startPulseAnimation();

    // Haptic feedback
    if (Platform.OS === "ios") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  }

  startPulseAnimation = () => {
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
    ).start();
  };

  resetError = () => {
    // Exit animation
    Animated.timing(this.animatedValue, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
      });
    });

    // Haptic feedback
    if (Platform.OS === "ios") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error!, this.resetError);
      }

      return (
        <ErrorFallback error={this.state.error!} resetError={this.resetError} />
      );
    }

    return this.props.children;
  }
}

interface ErrorFallbackProps {
  error: Error;
  resetError: () => void;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, resetError }) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const animatedValue = new Animated.Value(0);
  const scaleValue = new Animated.Value(0.8);

  React.useEffect(() => {
    Animated.parallel([
      Animated.spring(animatedValue, {
        toValue: 1,
        useNativeDriver: true,
        tension: 50,
        friction: 8,
      }),
      Animated.spring(scaleValue, {
        toValue: 1,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }),
    ]).start();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isDark = colorScheme === "dark";

  return (
    <View style={styles.container}>
      {/* Background Gradient */}
      <LinearGradient
        colors={
          isDark
            ? ["#0F0F23", "#1A1A2E", "#16213E"]
            : ["#667eea", "#764ba2", "#f093fb"]
        }
        style={StyleSheet.absoluteFillObject}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* Blur Overlay */}
      <BlurView intensity={20} style={StyleSheet.absoluteFillObject} />

      {/* Content Container */}
      <Animated.View
        style={[
          styles.contentContainer,
          {
            opacity: animatedValue,
            transform: [
              { scale: scaleValue },
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
        {/* Error Icon with Glow Effect */}
        <View style={styles.iconContainer}>
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
        </View>

        {/* Title */}
        <Text style={[styles.title, { color: colors.text }]}>
          Oops! Something went wrong
        </Text>

        {/* Description */}
        <Text style={[styles.description, { color: colors.text }]}>
          We encountered an unexpected error. Don&apos;t worry, our team has been
          notified and we&apos;re working on a fix.
        </Text>

        {/* Error Details (Collapsible) */}
        <TouchableOpacity
          style={[styles.detailsButton, { borderColor: colors.tint + "30" }]}
          onPress={() => {
            // Toggle error details (you can implement state for this)
            console.log("Error details:", error.message);
          }}
        >
          <Ionicons
            name="information-circle-outline"
            size={20}
            color={colors.tint}
          />
          <Text style={[styles.detailsText, { color: colors.tint }]}>
            View Details
          </Text>
        </TouchableOpacity>

        {/* Action Buttons */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={[
              styles.button,
              styles.primaryButton,
              { backgroundColor: colors.tint },
            ]}
            onPress={resetError}
            activeOpacity={0.8}
          >
            <Ionicons name="refresh" size={20} color="white" />
            <Text style={styles.buttonText}>Try Again</Text>
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
            activeOpacity={0.8}
          >
            <Ionicons name="home" size={20} color={colors.tint} />
            <Text style={[styles.secondaryButtonText, { color: colors.tint }]}>
              Go Home
            </Text>
          </TouchableOpacity>
        </View>

        {/* Floating Particles Animation */}
        <FloatingParticles />
      </Animated.View>
    </View>
  );
};

const FloatingParticles: React.FC = () => {
  const particles = Array.from({ length: 6 }, (_, i) => i);

  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
      {particles.map((particle) => (
        <FloatingParticle key={particle} delay={particle * 500} />
      ))}
    </View>
  );
};

const FloatingParticle: React.FC<{ delay: number }> = ({ delay }) => {
  const animatedValue = new Animated.Value(0);
  const opacityValue = new Animated.Value(0);

  React.useEffect(() => {
    const startAnimation = () => {
      Animated.loop(
        Animated.parallel([
          Animated.timing(animatedValue, {
            toValue: 1,
            duration: 4000 + Math.random() * 2000,
            useNativeDriver: true,
            delay,
          }),
          Animated.sequence([
            Animated.timing(opacityValue, {
              toValue: 0.6,
              duration: 1000,
              useNativeDriver: true,
              delay,
            }),
            Animated.timing(opacityValue, {
              toValue: 0,
              duration: 3000,
              useNativeDriver: true,
            }),
          ]),
        ])
      ).start();
    };

    startAnimation();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [delay]);

  return (
    <Animated.View
      style={[
        styles.particle,
        {
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
              scale: animatedValue.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [0, 1, 0],
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
    width: width * 0.9,
    maxWidth: 400,
    padding: 32,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 24,
    alignItems: "center",
    backdropFilter: "blur(10px)",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 20,
    },
    shadowOpacity: 0.25,
    shadowRadius: 25,
    elevation: 25,
  },
  iconContainer: {
    position: "relative",
    marginBottom: 24,
  },
  iconGlow: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    opacity: 0.2,
    top: -20,
    left: -20,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 16,
    fontFamily: "Inter-Bold",
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 24,
    opacity: 0.8,
    fontFamily: "Inter-Regular",
  },
  detailsButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 24,
  },
  detailsText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "500",
  },
  buttonsContainer: {
    width: "100%",
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
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  secondaryButton: {
    borderWidth: 2,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Inter-SemiBold",
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Inter-SemiBold",
  },
  particle: {
    position: "absolute",
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  },
});

export default ErrorBoundary;
