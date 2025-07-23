"use client";

import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
//   StatusBar,
  TouchableOpacity,
  type ImageSourcePropType,
  ScrollView,
  // Image, // Commented out for now
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../contexts/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";


const { width } = Dimensions.get("window");

interface OnboardingSlide {
  id: number;
  icon: string;
  title: string;
  subtitle: string;
  description: string;
  color: string;
  backgroundImage: ImageSourcePropType; // Keeping for future use
}

const onboardingData: OnboardingSlide[] = [
  {
    id: 1,
    icon: "people-circle",
    title: "Welcome to Your Community",
    subtitle: "Connect with peers, coaches, and mentors",
    description:
      "Join a vibrant community of students, peer coaches, academic advisors, and support staff all working together to make your university experience amazing.",
    color: "#3b82f6",
    backgroundImage: require("../../assets/images/login-background.jpg"), // Keeping for future use
  },
  {
    id: 2,
    icon: "school",
    title: "Personalized Support",
    subtitle: "Get the help you need, when you need it",
    description:
      "Whether you're a freshman finding your way or a continuing student seeking growth, our platform connects you with the right people and resources.",
    color: "#10b981",
    backgroundImage: require("../../assets/images/login-background.jpg"), // Keeping for future use
  },
  {
    id: 3,
    icon: "calendar",
    title: "Stay Connected",
    subtitle: "Never miss important events and opportunities",
    description:
      "Discover campus events, workshops, study groups, and social activities. Stay informed about everything happening in your university community.",
    color: "#f59e0b",
    backgroundImage: require("../../assets/images/login-background.jpg"), // Keeping for future use
  },
  {
    id: 4,
    icon: "chatbubbles",
    title: "Real-time Communication",
    subtitle: "Chat, share, and collaborate seamlessly",
    description:
      "Connect instantly with your peer coaches, buddies, and fellow students. Share experiences, ask questions, and build lasting friendships.",
    color: "#8b5cf6",
    backgroundImage: require("../../assets/images/login-background.jpg"), // Keeping for future use
  },
  {
    id: 5,
    icon: "trophy",
    title: "Achieve Your Goals",
    subtitle: "Track your progress and celebrate success",
    description:
      "Set academic and personal goals, track your progress, and celebrate achievements with your support network. Your success is our mission.",
    color: "#ef4444",
    backgroundImage: require("../../assets/images/login-background.jpg"), // Keeping for future use
  },
];

export default function OnboardingScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const floatingAnim1 = useRef(new Animated.Value(0)).current;
  const floatingAnim2 = useRef(new Animated.Value(0)).current;
  const floatingAnim3 = useRef(new Animated.Value(0)).current;
  const morphAnim = useRef(new Animated.Value(0)).current;
  const parallaxAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    const createFloatingAnimation = (
      animValue: Animated.Value,
      delay: number
    ) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(animValue, {
            toValue: 1,
            duration: 3000 + delay,
            useNativeDriver: true,
          }),
          Animated.timing(animValue, {
            toValue: 0,
            duration: 3000 + delay,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    // Morphing animation for dynamic shapes
    Animated.loop(
      Animated.sequence([
        Animated.timing(morphAnim, {
          toValue: 1,
          duration: 8000,
          useNativeDriver: true,
        }),
        Animated.timing(morphAnim, {
          toValue: 0,
          duration: 8000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Parallax effect
    Animated.loop(
      Animated.sequence([
        Animated.timing(parallaxAnim, {
          toValue: 1,
          duration: 12000,
          useNativeDriver: true,
        }),
        Animated.timing(parallaxAnim, {
          toValue: 0,
          duration: 12000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    createFloatingAnimation(floatingAnim1, 0);
    createFloatingAnimation(floatingAnim2, 1000);
    createFloatingAnimation(floatingAnim3, 2000);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      scrollViewRef.current?.scrollTo({
        x: nextIndex * width,
        animated: true,
      });
    } else {
      handleGetStarted();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      scrollViewRef.current?.scrollTo({
        x: prevIndex * width,
        animated: true,
      });
    }
  };

  const handleGetStarted = async () => {
    try {
      await AsyncStorage.setItem("hasSeenOnboarding", "true");
      router.replace("/(auth)/login");
    } catch (error) {
      console.error("Error saving onboarding status:", error);
      router.replace("/(auth)/login");
    }
  };

  const handleSkip = () => {
    router.replace("/(auth)/login");
  };

  const onScroll = (event: any) => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(slideIndex);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      zIndex: 10,
      backgroundColor: theme.colors.background + "F0",
      backdropFilter: "blur(10px)",
    },
    skipButton: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.lg,
      backgroundColor: theme.colors.surface + "80",
    },
    skipText: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
      fontWeight: "600",
    },
    progressContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    progressDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: theme.colors.border,
      marginHorizontal: 4,
    },
    progressDotActive: {
      backgroundColor: theme.colors.primary,
      width: 24,
    },
    scrollContainer: {
      flex: 1,
    },
    slideContainer: {
      width,
      flex: 1,
      position: "relative",
      overflow: "hidden",
    },
    // 🎨 CREATIVE BACKGROUND DESIGNS (Currently commented out - ready for future use)
    /*
    backgroundArtwork: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 0,
    },
    // Organic blob shape - top right
    organicShape1: {
      position: "absolute",
      width: width * 0.8,
      height: height * 0.6,
      top: -height * 0.1,
      right: -width * 0.2,
      borderRadius: width * 0.4,
      overflow: "hidden",
      opacity: 0.8,
    },
    // Curved bottom left shape
    organicShape2: {
      position: "absolute",
      width: width * 0.7,
      height: height * 0.5,
      bottom: -height * 0.15,
      left: -width * 0.15,
      borderTopRightRadius: width * 0.6,
      borderTopLeftRadius: width * 0.2,
      borderBottomRightRadius: width * 0.3,
      overflow: "hidden",
      opacity: 0.6,
    },
    // Floating circular element
    floatingCircle: {
      position: "absolute",
      width: width * 0.4,
      height: width * 0.4,
      borderRadius: width * 0.2,
      top: height * 0.3,
      left: width * 0.1,
      overflow: "hidden",
      opacity: 0.4,
    },
    // Diagonal slice
    diagonalSlice: {
      position: "absolute",
      width: width * 1.2,
      height: height * 0.4,
      top: height * 0.1,
      left: -width * 0.1,
      overflow: "hidden",
      opacity: 0.3,
      transform: [{ rotate: "15deg" }],
    },
    // Wave-like shape
    waveShape: {
      position: "absolute",
      width: width * 1.5,
      height: height * 0.3,
      bottom: height * 0.2,
      right: -width * 0.3,
      borderTopLeftRadius: width * 0.8,
      borderBottomLeftRadius: width * 0.4,
      overflow: "hidden",
      opacity: 0.5,
    },
    backgroundImage: {
      width: "100%",
      height: "100%",
    },
    gradientOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      opacity: 0.7,
    },
    */
    slideContent: {
      flex: 1,
      paddingHorizontal: theme.spacing.sm,
      justifyContent: "center",
      alignItems: "center",
      zIndex: 3,
      position: "relative",
    },
    enhancedIconContainer: {
      width: 140,
      height: 140,
      borderRadius: 70,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: theme.spacing.xl,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.25,
      shadowRadius: 20,
      elevation: 12,
      borderWidth: 4,
      borderColor: "rgba(255, 255, 255, 0.3)",
      backgroundColor: "rgba(255, 255, 255, 0.95)",
    },
    floatingElements: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 2,
    },
    floatingDot: {
      position: "absolute",
      borderRadius: 8,
      opacity: 0.6,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 4,
    },
    footer: {
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.xl,
      backgroundColor: theme.colors.background + "F5",
      backdropFilter: "blur(15px)",
      zIndex: 10,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border + "30",
    },
    navigationContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: theme.spacing.lg,
    },
    navButton: {
      width: 64,
      height: 64,
      borderRadius: 32,
      justifyContent: "center",
      alignItems: "center",
      shadowColor: theme.colors.primary,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 8,
    },
    navButtonPrimary: {
      backgroundColor: theme.colors.primary,
    },
    navButtonSecondary: {
      backgroundColor: theme.colors.surface,
      borderWidth: 2,
      borderColor: theme.colors.border,
    },
    navButtonDisabled: {
      backgroundColor: theme.colors.border,
      shadowOpacity: 0,
      elevation: 0,
    },
    getStartedButton: {
      height: 64,
      backgroundColor: theme.colors.primary,
      borderRadius: theme.borderRadius.xxl,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: theme.spacing.md,
      shadowColor: theme.colors.primary,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.4,
      shadowRadius: 16,
      elevation: 10,
    },
    getStartedText: {
      ...theme.typography.button,
      color: "#ffffff",
      fontSize: 18,
      fontWeight: "700",
    },
    slideIndicator: {
      alignItems: "center",
      marginBottom: theme.spacing.xl,
    },
    slideNumber: {
      ...theme.typography.captionSmall,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.sm,
      fontWeight: "600",
    },
    progressBar: {
      width: 240,
      height: 6,
      backgroundColor: theme.colors.border,
      borderRadius: 3,
      overflow: "hidden",
    },
    progressFill: {
      height: "100%",
      backgroundColor: theme.colors.primary,
      borderRadius: 3,
    },
    slideTitle: {
      ...theme.typography.h1,
      color: theme.colors.text,
      textAlign: "center",
      marginBottom: theme.spacing.md,
      fontWeight: "800",
      fontSize: 32,
      lineHeight: 38,
      textShadowColor: "rgba(255, 255, 255, 0.8)",
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 2,
    },
    slideSubtitle: {
      ...theme.typography.h4,
      color: theme.colors.textSecondary,
      textAlign: "center",
      marginBottom: theme.spacing.lg,
      fontWeight: "600",
      fontSize: 20,
      lineHeight: 26,
    },
    slideDescription: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
      textAlign: "center",
      lineHeight: 28,
      paddingHorizontal: theme.spacing.md,
      fontSize: 17,
      fontWeight: "400",
    },
  });

  const renderSlide = (slide: OnboardingSlide, index: number) => {
    // Dynamic positioning based on slide index (keeping for future use)
    // const shapeVariations = [
    //   { rotation: "0deg", scale: 1 },
    //   { rotation: "45deg", scale: 1.1 },
    //   { rotation: "-30deg", scale: 0.9 },
    //   { rotation: "60deg", scale: 1.2 },
    //   { rotation: "-45deg", scale: 1.05 },
    // ];

    // const currentVariation = shapeVariations[index % shapeVariations.length];

    return (
      <View key={slide.id} style={styles.slideContainer}>
        {/* 🎨 CREATIVE BACKGROUND ARTWORK - COMMENTED OUT FOR NOW */}
        {/*
        <View style={styles.backgroundArtwork}>
          <Animated.View
            style={[
              styles.organicShape1,
              {
                transform: [
                  { rotate: currentVariation.rotation },
                  { scale: currentVariation.scale },
                  {
                    translateX: morphAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 30],
                    }),
                  },
                  {
                    translateY: morphAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -20],
                    }),
                  },
                ],
              },
            ]}
          >
            <Image source={slide.backgroundImage} style={styles.backgroundImage} resizeMode="cover" />
            <Animated.View
              style={[
                styles.gradientOverlay,
                {
                  backgroundColor: slide.color,
                  opacity: morphAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.2, 0.4],
                  }),
                },
              ]}
            />
          </Animated.View>

          <Animated.View
            style={[
              styles.organicShape2,
              {
                transform: [
                  { rotate: `-${currentVariation.rotation}` },
                  {
                    translateX: parallaxAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -25],
                    }),
                  },
                ],
              },
            ]}
          >
            <Image source={slide.backgroundImage} style={styles.backgroundImage} resizeMode="cover" />
            <View style={[styles.gradientOverlay, { backgroundColor: slide.color, opacity: 0.3 }]} />
          </Animated.View>

          <Animated.View
            style={[
              styles.floatingCircle,
              {
                transform: [
                  {
                    translateY: floatingAnim1.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -40],
                    }),
                  },
                  {
                    scale: morphAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 1.3],
                    }),
                  },
                ],
              },
            ]}
          >
            <Image source={slide.backgroundImage} style={styles.backgroundImage} resizeMode="cover" />
            <View style={[styles.gradientOverlay, { backgroundColor: slide.color, opacity: 0.5 }]} />
          </Animated.View>

          <Animated.View
            style={[
              styles.diagonalSlice,
              {
                transform: [
                  { rotate: `${15 + index * 10}deg` },
                  {
                    translateX: parallaxAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 50],
                    }),
                  },
                ],
              },
            ]}
          >
            <Image source={slide.backgroundImage} style={styles.backgroundImage} resizeMode="cover" />
            <View style={[styles.gradientOverlay, { backgroundColor: slide.color, opacity: 0.25 }]} />
          </Animated.View>

          <Animated.View
            style={[
              styles.waveShape,
              {
                transform: [
                  {
                    translateY: floatingAnim2.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 35],
                    }),
                  },
                ],
              },
            ]}
          >
            <Image source={slide.backgroundImage} style={styles.backgroundImage} resizeMode="cover" />
            <View style={[styles.gradientOverlay, { backgroundColor: slide.color, opacity: 0.4 }]} />
          </Animated.View>
        </View>
        */}

        {/* Enhanced Floating Elements */}
        <View style={styles.floatingElements}>
          <Animated.View
            style={[
              styles.floatingDot,
              {
                width: 16,
                height: 16,
                backgroundColor: slide.color,
                top: "25%",
                left: "20%",
                transform: [
                  {
                    translateY: floatingAnim1.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -30],
                    }),
                  },
                  {
                    rotate: morphAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ["0deg", "360deg"],
                    }),
                  },
                ],
              },
            ]}
          />
          <Animated.View
            style={[
              styles.floatingDot,
              {
                width: 12,
                height: 12,
                backgroundColor: slide.color,
                top: "65%",
                right: "25%",
                transform: [
                  {
                    translateY: floatingAnim2.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 25],
                    }),
                  },
                  {
                    scale: morphAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 1.5],
                    }),
                  },
                ],
              },
            ]}
          />
          <Animated.View
            style={[
              styles.floatingDot,
              {
                width: 20,
                height: 8,
                backgroundColor: slide.color,
                top: "45%",
                left: "75%",
                borderRadius: 10,
                transform: [
                  {
                    translateY: floatingAnim3.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -15],
                    }),
                  },
                  {
                    rotate: parallaxAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ["0deg", "180deg"],
                    }),
                  },
                ],
              },
            ]}
          />
        </View>

        {/* Content */}
        <View style={styles.slideContent}>
          <Animated.View
            style={[
              styles.enhancedIconContainer,
              {
                backgroundColor: slide.color + "20",
                borderColor: slide.color + "40",
                transform: [
                  {
                    scale: morphAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 1.05],
                    }),
                  },
                ],
              },
            ]}
          >
            <Ionicons name={slide.icon as any} size={70} color={slide.color} />
          </Animated.View>

          <Text style={styles.slideTitle}>{slide.title}</Text>
          <Text style={styles.slideSubtitle}>{slide.subtitle}</Text>
          <Text style={styles.slideDescription}>{slide.description}</Text>
        </View>
      </View>
    );
  };

  const isLastSlide = currentIndex === onboardingData.length - 1;

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* <StatusBar
        barStyle={
          theme.colors.background === "#ffffff"
            ? "light-content"
            : "light-content"
        }
      /> */}

      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>

          <View style={styles.progressContainer}>
            {onboardingData.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.progressDot,
                  index === currentIndex && styles.progressDotActive,
                ]}
              />
            ))}
          </View>
        </View>

        {/* Slides */}
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={onScroll}
          scrollEventThrottle={16}
          style={styles.scrollContainer}
        >
          {onboardingData.map((slide, index) => renderSlide(slide, index))}
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          {/* Progress Indicator */}
          <View style={styles.slideIndicator}>
            <Text style={styles.slideNumber}>
              {currentIndex + 1} of {onboardingData.length}
            </Text>
            <View style={styles.progressBar}>
              <Animated.View
                style={[
                  styles.progressFill,
                  {
                    width: `${((currentIndex + 1) / onboardingData.length) * 100}%`,
                  },
                ]}
              />
            </View>
          </View>

          {/* Navigation */}
          {isLastSlide ? (
            <TouchableOpacity
              style={styles.getStartedButton}
              onPress={handleGetStarted}
              activeOpacity={0.8}
            >
              <Text style={styles.getStartedText}>Get Started</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.navigationContainer}>
              <TouchableOpacity
                style={[
                  styles.navButton,
                  currentIndex === 0
                    ? styles.navButtonDisabled
                    : styles.navButtonSecondary,
                ]}
                onPress={handlePrevious}
                disabled={currentIndex === 0}
                activeOpacity={0.8}
              >
                <Ionicons
                  name="chevron-back"
                  size={28}
                  color={
                    currentIndex === 0
                      ? theme.colors.textSecondary
                      : theme.colors.text
                  }
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.navButton, styles.navButtonPrimary]}
                onPress={handleNext}
                activeOpacity={0.8}
              >
                <Ionicons name="chevron-forward" size={28} color="#ffffff" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}
