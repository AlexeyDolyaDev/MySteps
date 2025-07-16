import {
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    View,
    useColorScheme
} from "react-native";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { useSaveSteps } from '@/hooks/useSteps';
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/Button";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors, Spacing } from "@/constants/Colors";
import { Input as TextInput } from "@/components/TextInput";
import ParallaxScrollView from "@/components/ParallaxScrollView";

const formSchema = z.object({
    steps: z
        .string()
        .min(1, { message: "Steps are required" })
        .regex(/^\d+$/, { message: "Steps must be a number" })
        .refine((val) => +val <= 100000, {
            message: "Steps must be at most 100,000"
        })
});

type FormData = z.infer<typeof formSchema>;

export default function HomeScreen() {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? "light"];

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: { steps: "" }
    });

    const { mutate: saveSteps, isPending } = useSaveSteps(() => {
    reset();
    });

    const onSubmit = (data: FormData) => {
        saveSteps(parseInt(data.steps, 10));
    };
    return (
        <ParallaxScrollView
            headerBackgroundColor={{
                light: "transparent",
                dark: "transparent"
            }}
            headerImage={<View />}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                <View style={styles.form}>
                    <ThemedText type="subtitle">Add steps</ThemedText>

                    <TextInput
                        label="Steps"
                        placeholder="Number of steps"
                        control={control}
                        name="steps"
                        error={errors.steps?.message}
                        keyboardType="numeric"
                    />
                    <Button
                        title="Save"
                        onPress={handleSubmit(onSubmit)}
                        loading={isPending}
                    />
                </View>
                <ThemedView
                    style={[
                        styles.recommendationBlock,
                        { backgroundColor: colors.icon }
                    ]}
                >
                    <ThemedText lightColor={colors.background} type="subtitle">
                        🏃 Recommendation
                    </ThemedText>
                    <ThemedText lightColor={colors.background} type="default">
                        Try to walk at least 10,000 steps a day to keep active.
                    </ThemedText>
                </ThemedView>
            </KeyboardAvoidingView>
        </ParallaxScrollView>
    );
}

const styles = StyleSheet.create({
    titleContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8
    },
    stepContainer: {
        gap: 8,
        marginBottom: 8
    },
    reactLogo: {
        height: 178,
        width: 290,
        bottom: 0,
        left: 0,
        position: "absolute"
    },
    form: {
        gap: Spacing.s16
    },
    recommendationBlock: {
        marginVertical: Spacing.s16 * 4,
        padding: Spacing.s16,
        borderRadius: Spacing.s16
    }
});
