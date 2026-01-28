import { ThemeProvider } from "@/components/theme-provider";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Tabs as WebTabs } from "expo-router/tabs";
import {
  Icon,
  Label,
  NativeTabs,
  VectorIcon,
} from "expo-router/unstable-native-tabs";
import { Platform, useWindowDimensions } from "react-native";

export default function Layout() {
  const { width } = useWindowDimensions();

  const isMd = width >= 768;
  const isLg = width >= 1024;

  return (
    <ThemeProvider>
      {process.env.EXPO_OS === "web" ? (
        <WebTabs
          screenOptions={{
            headerShown: false,
            ...(isMd
              ? {
                  tabBarPosition: "left",
                  tabBarVariant: "material",
                  tabBarLabelPosition: isLg ? undefined : "below-icon",
                }
              : {
                  tabBarPosition: "bottom",
                }),
          }}
        >
          <WebTabs.Screen
            name="(index)"
            options={{
              title: "Medications",
              tabBarIcon: (props) => <MaterialIcons {...props} name="medication" />,
            }}
          />
          <WebTabs.Screen
            name="(info)"
            options={{
              title: "Info",
              tabBarIcon: (props) => <MaterialIcons {...props} name="info" />,
            }}
          />
        </WebTabs>
      ) : (
        <NativeTabs>
          <NativeTabs.Trigger name="(index)">
            <Label>Medications</Label>
            <Icon
              {...Platform.select({
                ios: { sf: { default: "pills", selected: "pills.fill" } },
                default: {
                  src: <VectorIcon family={MaterialIcons} name="medication" />,
                },
              })}
            />
          </NativeTabs.Trigger>
          <NativeTabs.Trigger name="(info)">
            <Label>Info</Label>
            <Icon
              {...Platform.select({
                ios: { sf: "cursorarrow.rays" },
                default: {
                  src: <VectorIcon family={MaterialIcons} name="info" />,
                },
              })}
            />
          </NativeTabs.Trigger>
        </NativeTabs>
      )}
    </ThemeProvider>
  );
}
