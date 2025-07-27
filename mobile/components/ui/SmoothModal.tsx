import React, { useEffect, useRef } from "react";
import {
  Modal as RNModal,
  Animated,
  Dimensions,
  PanResponder,
  SafeAreaView,
  StyleSheet,
  View,
} from "react-native";

interface SmoothModalProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  animationDuration?: number;
}

export function SmoothModal({
  visible,
  onClose,
  children,
  animationDuration = 300,
}: SmoothModalProps) {
  const screenHeight = Dimensions.get("window").height;
  const translateY = useRef(new Animated.Value(screenHeight)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Animate in
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: animationDuration,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: animationDuration,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Animate out
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: screenHeight,
          duration: animationDuration,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: animationDuration,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, translateY, opacity, screenHeight, animationDuration]);

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) => {
      return gestureState.dy > 20;
    },
    onPanResponderMove: (_, gestureState) => {
      if (gestureState.dy > 0) {
        translateY.setValue(gestureState.dy);
      }
    },
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dy > 100 || gestureState.vy > 0.5) {
        // Close modal if dragged down enough
        Animated.timing(translateY, {
          toValue: screenHeight,
          duration: 200,
          useNativeDriver: true,
        }).start(() => onClose());
      } else {
        // Snap back to original position
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }).start();
      }
    },
  });

  const styles = StyleSheet.create({
    modalContainer: {
      flex: 1,
      backgroundColor: "transparent",
    },
    animatedContainer: {
      flex: 1,
      backgroundColor: "white",
    },
  });

  return (
    <RNModal
      visible={visible}
      transparent={true}
      onRequestClose={onClose}
      statusBarTranslucent={true}
      hardwareAccelerated={true}
    >
      <View style={styles.modalContainer}>
        <Animated.View
          style={[
            styles.animatedContainer,
            {
              transform: [{ translateY }],
              opacity,
            },
          ]}
          {...panResponder.panHandlers}
        >
          <SafeAreaView style={{ flex: 1 }}>{children}</SafeAreaView>
        </Animated.View>
      </View>
    </RNModal>
  );
}
