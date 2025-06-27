import {View, StyleSheet} from 'react-native';
import {TouchableRipple} from 'react-native-paper';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {VeilText} from "@/components/VeilText";
import {veilColors, veilSpacing} from "@/styles/VeilStyles";

type Symptom = {
    key: string;
    iconName: string;
    label: string;
};

const SYMPTOMS: Symptom[] = [
    {key: 'cramps', iconName: 'pill', label: 'Cramps'},
    {key: 'headache', iconName: 'brain', label: 'Headache'},
    {key: 'fatigue', iconName: 'bed-empty', label: 'Fatigue'},
    {key: 'bloating', iconName: 'stomach', label: 'Bloating'},
    {key: 'acne', iconName: 'emoticon-sick-outline', label: 'Acne'},
];

type Props = {
    symptoms: Record<string, boolean>;
    toggleSymptom: (key: string) => void;
};

export function SymptomsPicker({ symptoms, toggleSymptom }: Props) {
    return (
        <View style={styles.container}>
            <View style={styles.row}>
                {SYMPTOMS.map(({key, iconName, label}) => {
                    const active = !!symptoms[key];
                    return (
                        <TouchableRipple
                            key={key}
                            onPress={() => toggleSymptom(key)}
                            style={[
                                styles.button,
                                active && styles.buttonActive,
                            ]}
                        >
                            <View>
                                <MaterialCommunityIcons
                                    name={iconName}
                                    size={28}
                                    color={active ? veilColors.accent : veilColors.accentSoft}
                                />
                                <VeilText variant="labelSmall">{label}</VeilText>
                            </View>

                        </TouchableRipple>
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
    row: {
        flexDirection: 'row',
        flexWrap: 'wrap',             // ← allow multi-row
        justifyContent: 'space-around',
        marginBottom: veilSpacing.md,
    },
    item: {
        width: 60,                    // ← fixed width so 4–5 fit per row
        alignItems: 'center',
        marginVertical: veilSpacing.xs,
    },
    label: {
        fontSize: 12,                 // ← shrink text a hair
        textAlign: 'center',
    },
    button: {
        marginHorizontal: 8,
        padding: 6,
        borderRadius: 8,
    },
    buttonActive: {
        backgroundColor: 'rgba(242,169,165,0.3)',
    },
    symptomLabel: {
        color: veilColors.text,
    }
});
