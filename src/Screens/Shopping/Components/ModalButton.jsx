import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { CustomTouchableOpacity } from "../../../Components/CustomTouchableOpacity";
import { variants } from "./variants";

export function ModalButton({
  onPress,
  title,
  value,
  isLoading,
  // iconName,
  disabled,
  variant = "primary",
  style,
}) {
  const buttonVariant = variants[variant];

  const buttonStyle = disabled ? buttonVariant.disabled : buttonVariant.enabled;

  return (
    <CustomTouchableOpacity
      disabled={isLoading || disabled}
      onPress={onPress}
      style={[styles.container, buttonStyle.button, style]}
    >
      <View style={styles.content}>
        <Text style={[styles.title, { color: buttonStyle.title.color }]}>
          {title}
        </Text>
        <Text style={[styles.value, { color: buttonStyle.value.color }]}>
          {value}
        </Text>
      </View>
    </CustomTouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    height: 60,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  value: {
    paddingLeft: 10,
    fontSize: 20,
    fontWeight: "bold",
  }
});