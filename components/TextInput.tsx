import React from "react";
import { Control, Controller } from "react-hook-form";
import {
    StyleSheet,
    Text,
    TextInput,
    TextInputProps,
    View
} from "react-native";

interface InputProps extends Omit<TextInputProps, "onChange" | "value"> {
    label?: string;
    error?: string;
    control: Control<any>;
    name: string;
    keyboardType?: TextInputProps["keyboardType"];
}

export const Input: React.FC<InputProps> = ({
    label,
    error,
    control,
    name,
    style,
    keyboardType,
    ...textInputProps
}) => {
    return (
        <Controller
            control={control}
            name={name}
            render={({ field: { onChange, onBlur, value } }) => (
                <View style={styles.container}>
                    {label && <Text style={styles.label}>{label}</Text>}
                    <TextInput
                        style={[
                            styles.input,
                            style,
                            error && styles.errorBorder
                        ]}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        value={value}
                        keyboardType={keyboardType}
                        {...textInputProps}
                    />
                    {error && <Text style={styles.errorText}>{error}</Text>}
                </View>
            )}
        />
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 8
    },
    label: {
        marginBottom: 4,
        fontSize: 14,
        color: "#333"
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 10,
        fontSize: 16,
        color: "#000"
    },
    errorBorder: {
        borderColor: "red"
    },
    errorText: {
        marginTop: 4,
        color: "red",
        fontSize: 12
    }
});
