import { Stack } from "expo-router";
import * as AC from "@bacons/apple-colors";
import { NativeStackNavigationOptions } from "@react-navigation/native-stack";

let isLiquidGlassAvailable: () => boolean = () => false;
if (process.env.EXPO_OS === "ios") {
  try {
    const glassEffect = require("expo-glass-effect");
    isLiquidGlassAvailable = glassEffect.isLiquidGlassAvailable;
  } catch {}
}

const AppleStackPreset: NativeStackNavigationOptions =
  process.env.EXPO_OS !== "ios"
    ? {}
    : isLiquidGlassAvailable()
    ? {
        headerTransparent: true,
        headerShadowVisible: false,
        headerLargeTitleShadowVisible: false,
        headerLargeStyle: {
          backgroundColor: "transparent",
        },
        headerTitleStyle: {
          color: AC.label as any,
        },
        headerBlurEffect: "none",
        headerBackButtonDisplayMode: "minimal",
      }
    : {
        headerTransparent: true,
        headerShadowVisible: true,
        headerLargeTitleShadowVisible: false,
        headerLargeStyle: {
          backgroundColor: "transparent",
        },
        headerBlurEffect: "systemChromeMaterial",
        headerBackButtonDisplayMode: "default",
      };

export default function Layout() {
  return (
    <Stack screenOptions={AppleStackPreset}>
      <Stack.Screen
        name="index"
        options={{
          title: "Medications",
          headerLargeTitle: true,
        }}
      />
      <Stack.Screen
        name="add-medication"
        options={{
          presentation: "modal",
          title: "Add Medication",
        }}
      />
    </Stack>
  );
}

