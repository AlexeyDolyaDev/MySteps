import { QueryProvider } from "@/providers/QueryProvider";
import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function TabLayout() {
    const colorScheme = useColorScheme();

    return (
        <QueryProvider>
            <Tabs
                screenOptions={{
                    tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
                    headerShown: false,
                    tabBarButton: HapticTab,
                    tabBarLabelStyle: {
                        fontSize: 14
                    },
                    tabBarBackground: TabBarBackground,
                    tabBarStyle: Platform.select({
                        ios: {
                            position: "absolute"
                        },
                        default: {}
                    })
                }}
            >
                <Tabs.Screen
                    name="index"
                    options={{
                        title: "Add Steps",
                        tabBarIcon: ({ color }) => (
                            <IconSymbol
                                size={28}
                                name="figure.walk"
                                color={color}
                            />
                        )
                    }}
                />
                <Tabs.Screen
                    name="stat"
                    options={{
                        title: "Stats",
                        tabBarIcon: ({ color }) => (
                            <IconSymbol
                                size={28}
                                name="chart.bar.fill"
                                color={color}
                            />
                        )
                    }}
                />
            </Tabs>
        </QueryProvider>
    );
}
