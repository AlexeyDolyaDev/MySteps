import { Colors } from "@/constants/Colors";
import { SymbolView } from "expo-symbols";
import {
    Image,
    StyleProp,
    StyleSheet,
    useColorScheme,
    View,
    ViewStyle
} from "react-native";

export function Avatar({
    uri,
    size = 80,
    style
}: {
    uri?: string;
    size?: number;
    style?: StyleProp<ViewStyle>;
}) {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? "light"];

    return (
        <View
            style={[
                styles.container,
                { width: size, height: size, borderRadius: size / 2 },
                style
            ]}
        >
            {uri ? (
                <Image
                    source={{ uri }}
                    style={{
                        width: size,
                        height: size,
                        borderRadius: size / 2
                    }}
                    resizeMode="cover"
                />
            ) : (
                <SymbolView
                    name="person.crop.circle"
                    size={size}
                    weight="regular"
                    style={{ width: size, height: size }}
                    tintColor={colors.tint}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        overflow: "hidden",
        backgroundColor: "#eee",
        alignItems: "center",
        justifyContent: "center"
    }
});
