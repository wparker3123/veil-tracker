import React from 'react';
import {Text, StyleSheet, TextStyle, StyleProp, TextProps, TextInputProps, TextInput} from 'react-native';

export function VeilText (props: TextProps){
    return (
        <Text style={[styles.defaultStyle, props.style]}>
            {props.children}
        </Text>
    );
}

export function VeilTextInput (props: TextInputProps){
    return (
        <TextInput {...props} style={[styles.defaultStyle, props.style]}/>
    );
}

const styles = StyleSheet.create({
    defaultStyle: {
        fontFamily: 'MonaspaceRadonWide',
    },
});