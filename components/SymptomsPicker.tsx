import { View, Text, Pressable, StyleSheet } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

type Symptom = {
    key: string;
    iconName: string;
    label: string;
};

const SYMPTOMS: Symptom[] = [
    { key: 'cramps',     iconName: 'emoticon-cry-outline',   label: 'Cramps'   },
    { key: 'headache',   iconName: 'head-side-virus',        label: 'Headache' },
    { key: 'fatigue',    iconName: 'sleep',                  label: 'Fatigue'  },
    { key: 'bloating',   iconName: 'circle-slice-3',         label: 'Bloat'    },
    { key: 'acne',       iconName: 'face-woman-profile',     label: 'Acne'     },
];

type Props = {
    symptoms: Record<string, boolean>;
    toggleSymptom: (key: string) => void;
};

export function SymptomsPicker({ symptoms, toggleSymptom }: Props) {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>Symptoms</Text>
            <View style={styles.row}>
                {SYMPTOMS.map(({ key, iconName }) => {
                    const active = !!symptoms[key];
                    return (
                        <Pressable
                            key={key}
                            onPress={() => toggleSymptom(key)}
                            style={[
                                styles.button,
                                active && styles.buttonActive,
                            ]}
                        >
                            <MaterialCommunityIcons
                                name={iconName}
                                size={28}
                                color={active ? '#f2a9a5' : '#888'}
                            />
                        </Pressable>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 16,
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
        color: '#faf9f6',
        textAlign: 'center',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    button: {
        marginHorizontal: 8,
        padding: 6,
        borderRadius: 8,
    },
    buttonActive: {
        backgroundColor: 'rgba(242,169,165,0.3)',
    },
});
