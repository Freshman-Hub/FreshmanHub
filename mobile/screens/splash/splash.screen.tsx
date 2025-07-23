"use client";

import { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated, StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../contexts/ThemeContext";
import { useUser } from "../../contexts/UserContext";

export default function SplashScreen() {
  const { theme } = useTheme();
  const { isAuthenticated, loading } = useUser();
  const router = useRouter();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

  // Floating particles animation values
  const particle1 = useRef(new Animated.Value(0)).current;
  const particle2 = useRef(new Animated.Value(0)).current;
  const particle3 = useRef(new Animated.Value(0)).current;
  const particle4 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Main entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        delay: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Continuous animations
    // Logo rotation
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 20000,
        useNativeDriver: true,
      })
    ).start();

    // Logo pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Floating animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Particle animations
    const createParticleAnimation = (
      particle: Animated.Value,
      delay: number
    ) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(particle, {
            toValue: 1,
            duration: 4000,
            useNativeDriver: true,
          }),
          Animated.timing(particle, {
            toValue: 0,
            duration: 4000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    createParticleAnimation(particle1, 0);
    createParticleAnimation(particle2, 1000);
    createParticleAnimation(particle3, 2000);
    createParticleAnimation(particle4, 3000);

    // Navigate after animations and auth check
    const timer = setTimeout(() => {
      if (!loading) {
        if (isAuthenticated) {
          router.replace("/(student-tabs)");
        } else {
          router.replace("/(onboarding)");
        }
      }
    }, 3000); // Increased to 3 seconds for better animation viewing

    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, isAuthenticated]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.primary,
      justifyContent: "center",
      alignItems: "center",
      overflow: "hidden",
    },
    backgroundPattern: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      opacity: 0.1,
    },
    particle: {
      position: "absolute",
      width: 4,
      height: 4,
      borderRadius: 2,
      backgroundColor: "rgba(255, 255, 255, 0.6)",
    },
    content: {
      alignItems: "center",
      justifyContent: "center",
      zIndex: 2,
    },
    logoContainer: {
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: "rgba(255, 255, 255, 0.15)",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: theme.spacing.xl,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.4,
      shadowRadius: 20,
      elevation: 12,
      borderWidth: 3,
      borderColor: "rgba(255, 255, 255, 0.2)",
    },
    logoGlow: {
      position: "absolute",
      width: 140,
      height: 140,
      borderRadius: 70,
      backgroundColor: "rgba(255, 255, 255, 0.1)",
    },
    appTitle: {
      ...theme.typography.h1,
      color: "#ffffff",
      fontWeight: "700",
      marginBottom: theme.spacing.sm,
      textAlign: "center",
      textShadowColor: "rgba(0, 0, 0, 0.3)",
      textShadowOffset: { width: 0, height: 2 },
      textShadowRadius: 4,
    },
    appSubtitle: {
      ...theme.typography.body,
      color: "rgba(255, 255, 255, 0.9)",
      textAlign: "center",
      fontWeight: "500",
      marginBottom: theme.spacing.lg,
      textShadowColor: "rgba(0, 0, 0, 0.2)",
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 2,
    },
    tagline: {
      ...theme.typography.bodySmall,
      color: "rgba(255, 255, 255, 0.8)",
      textAlign: "center",
      fontStyle: "italic",
      textShadowColor: "rgba(0, 0, 0, 0.2)",
      textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
      fontWeight: "500"
    },
    loadingContainer: {
      position: "absolute",
      bottom: 80,
      alignItems: "center",
    },
    loadingDots: {
      flexDirection: "row",
      alignItems: "center",
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: "rgba(255, 255, 255, 0.6)",
      marginHorizontal: 4,
    },
    versionText: {
      ...theme.typography.captionSmall,
      color: "rgba(255, 255, 255, 0.6)",
        marginTop: theme.spacing.sm,
      fontWeight: "500"
    },
  });

  // Enhanced loading dots with staggered animation
  const LoadingDots = () => {
    const dot1 = useRef(new Animated.Value(0.3)).current;
    const dot2 = useRef(new Animated.Value(0.3)).current;
    const dot3 = useRef(new Animated.Value(0.3)).current;

    useEffect(() => {
      const animateDots = () => {
        Animated.stagger(200, [
          Animated.sequence([
            Animated.timing(dot1, {
              toValue: 1,
              duration: 400,
              useNativeDriver: true,
            }),
            Animated.timing(dot1, {
              toValue: 0.3,
              duration: 400,
              useNativeDriver: true,
            }),
          ]),
          Animated.sequence([
            Animated.timing(dot2, {
              toValue: 1,
              duration: 400,
              useNativeDriver: true,
            }),
            Animated.timing(dot2, {
              toValue: 0.3,
              duration: 400,
              useNativeDriver: true,
            }),
          ]),
          Animated.sequence([
            Animated.timing(dot3, {
              toValue: 1,
              duration: 400,
              useNativeDriver: true,
            }),
            Animated.timing(dot3, {
              toValue: 0.3,
              duration: 400,
              useNativeDriver: true,
            }),
          ]),
        ]).start(() => animateDots());
      };
      animateDots();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <View style={styles.loadingDots}>
        <Animated.View
          style={[styles.dot, { opacity: dot1, transform: [{ scale: dot1 }] }]}
        />
        <Animated.View
          style={[styles.dot, { opacity: dot2, transform: [{ scale: dot2 }] }]}
        />
        <Animated.View
          style={[styles.dot, { opacity: dot3, transform: [{ scale: dot3 }] }]}
        />
      </View>
    );
  };

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const float = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10],
  });

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={theme.colors.primary}
      />

      {/* Floating Particles */}
      <View style={styles.backgroundPattern}>
        <Animated.View
          style={[
            styles.particle,
            {
              top: "20%",
              left: "10%",
              opacity: particle1,
              transform: [
                {
                  translateY: particle1.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -100],
                  }),
                },
              ],
            },
          ]}
        />
        <Animated.View
          style={[
            styles.particle,
            {
              top: "40%",
              right: "15%",
              opacity: particle2,
              transform: [
                {
                  translateY: particle2.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -80],
                  }),
                },
              ],
            },
          ]}
        />
        <Animated.View
          style={[
            styles.particle,
            {
              top: "60%",
              left: "20%",
              opacity: particle3,
              transform: [
                {
                  translateY: particle3.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -120],
                  }),
                },
              ],
            },
          ]}
        />
        <Animated.View
          style={[
            styles.particle,
            {
              top: "30%",
              right: "25%",
              opacity: particle4,
              transform: [
                {
                  translateY: particle4.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -90],
                  }),
                },
              ],
            },
          ]}
        />
      </View>

      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }, { translateY: float }],
          },
        ]}
      >
        {/* Logo with glow effect */}
        <Animated.View
          style={[
            styles.logoGlow,
            {
              transform: [{ scale: pulseAnim }],
            },
          ]}
        />
        <Animated.View
          style={[
            styles.logoContainer,
            {
              transform: [{ rotate: spin }, { scale: pulseAnim }],
            },
          ]}
        >
          <Ionicons name="school" size={60} color="#ffffff" />
        </Animated.View>

        <Animated.View
          style={{
            transform: [{ translateY: slideAnim }],
          }}
        >
          <Text style={styles.appTitle}>Freshman Hub</Text>
          <Text style={styles.appSubtitle}>Campus Community Platform</Text>
          <Text style={styles.tagline}>Connecting • Supporting • Growing</Text>
        </Animated.View>
      </Animated.View>

      <View style={styles.loadingContainer}>
        <LoadingDots />
        <Text style={styles.versionText}>Version 1.0.0</Text>
      </View>
    </SafeAreaView>
  );
}
