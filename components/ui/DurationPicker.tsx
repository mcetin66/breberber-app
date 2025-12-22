import React from 'react';
import { View, Text, Pressable, ScrollView, Modal } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '@/constants/theme';

interface DurationPickerProps {
    value: number;
    onChange: (value: number) => void;
    error?: string;
    label?: string;
}

// Generate durations in 10-minute intervals up to 4 hours (240 mins)
const DURATIONS = Array.from({ length: 24 }, (_, i) => (i + 1) * 10);

export const DurationPicker: React.FC<DurationPickerProps> = ({ value, onChange, error, label = "Süre (Dakika)" }) => {
    const [modalVisible, setModalVisible] = React.useState(false);

    const formatDuration = (mins: number) => {
        const hours = Math.floor(mins / 60);
        const minutes = mins % 60;
        if (hours > 0 && minutes > 0) return `${hours} sa ${minutes} dk`;
        if (hours > 0) return `${hours} saat`;
        return `${minutes} dakika`;
    };

    return (
        <View className="mb-4">
            {label && <Text className="text-zinc-400 text-sm mb-1 font-medium">{label}</Text>}

            <Pressable
                onPress={() => setModalVisible(true)}
                className={`flex-row items-center justify-between bg-[#1E1E1E] p-4 rounded-xl border ${error ? 'border-red-500' : 'border-white/10'} active:border-[#d4af35]`}
            >
                <Text className="text-white text-base">
                    {value ? formatDuration(value) : "Süre Seçiniz"}
                </Text>
                <MaterialIcons name="access-time" size={20} color="#666" />
            </Pressable>

            {error && <Text className="text-red-500 text-xs mt-1">{error}</Text>}

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View className="flex-1 justify-end bg-black/80">
                    <View className="bg-[#1E1E1E] rounded-t-3xl border-t border-white/10 h-[50%]">
                        <View className="p-4 border-b border-white/10 flex-row justify-between items-center">
                            <Text className="text-white font-bold text-lg">Süre Seçimi</Text>
                            <Pressable onPress={() => setModalVisible(false)} className="p-2 bg-white/5 rounded-full">
                                <MaterialIcons name="close" size={20} color="white" />
                            </Pressable>
                        </View>

                        <ScrollView contentContainerStyle={{ padding: 16 }} showsVerticalScrollIndicator={false}>
                            <View className="flex-row flex-wrap gap-3 justify-center">
                                {DURATIONS.map((duration) => (
                                    <Pressable
                                        key={duration}
                                        onPress={() => {
                                            onChange(duration);
                                            setModalVisible(false);
                                        }}
                                        className={`w-[30%] py-4 rounded-xl items-center border ${value === duration ? 'bg-[#d4af35] border-[#d4af35]' : 'bg-[#121212] border-white/5'}`}
                                    >
                                        <Text className={`font-bold ${value === duration ? 'text-black' : 'text-white'}`}>
                                            {formatDuration(duration)}
                                        </Text>
                                    </Pressable>
                                ))}
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </View>
    );
};
