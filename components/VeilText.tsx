import React from 'react';
import {StyleSheet} from 'react-native';
import { TextInput, TextInputProps, Text, TextProps } from 'react-native-paper';
import {veilColors} from "@/styles/VeilStyles";

export function VeilText (props: TextProps<any>){
    const flattened = StyleSheet.flatten(props.style);
    const fontFamily = flattened?.fontFamily ?? 'MonaspaceRadonWide';
    return (
        <Text style={[{fontFamily: fontFamily}, props.style]}>
            {props.children}
        </Text>
    );
}

export function VeilTextInput (props: TextInputProps){
    return (
        <TextInput
            {...props} style={[styles.defaultStyle, props.style]}
            textColor={veilColors.text}
            contentStyle={styles.defaultStyle}
        />
    );
}

const styles = StyleSheet.create({
    defaultStyle: {
        fontFamily: 'MonaspaceRadonWide',
    },
});