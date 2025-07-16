import {
    JSXElementConstructor,
    ReactElement,
    ReactNode,
    ReactPortal,
    SetStateAction,
    useCallback,
    useEffect,
    useMemo,
    useState
} from "react";

import {
    ActivityIndicator,
    Dimensions,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    useColorScheme,
    View
} from "react-native";

import dayjs from "dayjs";
import { BarChart } from "react-native-gifted-charts";
import { useFocusEffect } from "@react-navigation/native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

import { useSteps } from '@/hooks/useSteps';
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors, Spacing } from "@/constants/Colors";

export default function StatsScreen() {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? "light"];

    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    const { data: stepsData, isLoading, refetch } = useSteps();

    useEffect(() => {}, [stepsData]);

    useFocusEffect(
        useCallback(() => {
            refetch();
        }, [refetch])
    );

    const stats = useMemo(() => {
        if (!stepsData || stepsData.length === 0) return null;
        const values = stepsData.map((i) => i.steps_count);
        const total = values.reduce((a, b) => a + b, 0);
        const avg = Math.round(total / values.length);
        const min = Math.min(...values);
        const max = Math.max(...values);
        return { total, avg, min, max };
    }, [stepsData]);

    const chartData = useMemo(() => {
        const today = dayjs().format("YYYY-MM-DD");

        if (!!stepsData && Array.isArray(stepsData)) {
            return stepsData.map((item, index) => {
                const date = dayjs(item.created_at).format("YYYY-MM-DD");
                const isToday = date === today;
                const isMin = item.steps_count === stats?.min;
                const isMax = item.steps_count === stats?.max;

                let color = colors.tint;
                if (isToday) color = colors.tint;
                else if (isMax) color = colors.tabIconDefault;
                else if (isMin) color = colors.tabIconDefault;

                return {
                    value: item.steps_count,
                    label: `D${index + 1}`,
                    frontColor: color,
                    date,
                    index
                };
            });
        }

        return [];
    }, [stepsData]);

    const screenWidth = Dimensions.get("window").width;

    if (isLoading) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator color={colors.tabIconSelected} size={23} />
            </View>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
            <Animated.View
                style={[styles.container]}
                entering={FadeIn.duration(500)}
                exiting={FadeOut.duration(500)}
            >
                <ThemedText type="title">Steps</ThemedText>

                <ThemedView
                    style={[
                        styles.statItem,
                        { backgroundColor: colors.tabIconSelected }
                    ]}
                >
                    <ThemedText type="title" lightColor={colors.background}>
                        Average
                    </ThemedText>
                    <ThemedText type="title" lightColor={colors.background}>
                        {stats?.avg || 0}
                    </ThemedText>
                    <ThemedText lightColor={colors.background}>
                        steps
                    </ThemedText>
                </ThemedView>
                <ThemedView style={styles.statContainer}>
                    <ThemedView
                        style={[
                            styles.statItem,
                            { backgroundColor: colors.tabIconSelected }
                        ]}
                    >
                        <ThemedText
                            type="subtitle"
                            lightColor={colors.background}
                        >
                            Min
                        </ThemedText>
                        <ThemedText
                            type="subtitle"
                            lightColor={colors.background}
                        >
                            {stats?.min || 0}
                        </ThemedText>
                        <ThemedText lightColor={colors.background}>
                            steps
                        </ThemedText>
                    </ThemedView>
                    <ThemedView
                        style={[
                            styles.statItem,
                            { backgroundColor: colors.tabIconSelected }
                        ]}
                    >
                        <ThemedText
                            type="subtitle"
                            lightColor={colors.background}
                        >
                            Max
                        </ThemedText>
                        <ThemedText
                            type="subtitle"
                            lightColor={colors.background}
                        >
                            {stats?.max || 0}
                        </ThemedText>
                        <ThemedText lightColor={colors.background}>
                            steps
                        </ThemedText>
                    </ThemedView>
                </ThemedView>

                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <BarChart
                        data={chartData}
                        spacing={Spacing.s16}
                        yAxisThickness={0}
                        xAxisThickness={0}
                        noOfSections={4}
                        isAnimated
                        animationDuration={800}
                        height={220}
                        endSpacing={screenWidth / 8}
                        maxValue={(stats?.max ?? 0) * 1.5}
                        yAxisTextStyle={{ color: colors.icon }}
                        xAxisLabelTextStyle={{ color: colors.tabIconDefault }}
                        onPress={(item: {
                            index: SetStateAction<number | null>;
                        }) => setSelectedIndex(item.index)}
                        renderTooltip={(item: {
                            index: number | null;
                            value:
                                | string
                                | number
                                | bigint
                                | boolean
                                | ReactElement<
                                      unknown,
                                      string | JSXElementConstructor<any>
                                  >
                                | Iterable<ReactNode>
                                | ReactPortal
                                | Promise<
                                      | string
                                      | number
                                      | bigint
                                      | boolean
                                      | ReactPortal
                                      | ReactElement<
                                            unknown,
                                            string | JSXElementConstructor<any>
                                        >
                                      | Iterable<ReactNode>
                                      | null
                                      | undefined
                                  >
                                | null
                                | undefined;
                            date:
                                | string
                                | number
                                | Date
                                | dayjs.Dayjs
                                | null
                                | undefined;
                        }) =>
                            selectedIndex === item.index ? (
                                <ThemedView style={styles.tooltip}>
                                    <ThemedText
                                        type="subtitle"
                                        style={{ fontWeight: "bold" }}
                                    >
                                        {item.value}
                                    </ThemedText>
                                    <ThemedText>steps</ThemedText>
                                </ThemedView>
                            ) : null
                        }
                    />
                </ScrollView>
            </Animated.View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    loader: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center"
    },
    container: {
        flex: 1,
        padding: Spacing.s16,
        gap: Spacing.s16
    },

    statItem: {
        flex: 1,
        maxHeight: 150,
        padding: Spacing.s16,
        borderRadius: Spacing.s16,
        marginBottom: Spacing.s16,
        flexDirection: "column",
        justifyContent: "center"
    },
    statContainer: {
        flexDirection: "row",
        gap: Spacing.s16
    },
    tooltip: {
        padding: Spacing.s16,
        borderRadius: Spacing.s16,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
    }
});
