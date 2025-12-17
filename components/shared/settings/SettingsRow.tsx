import { View, Text, Pressable } from 'react-native';
import { LucideIcon, ChevronRight } from 'lucide-react-native';

interface SettingsRowProps {
    icon: LucideIcon;
    label: string;
    onPress: () => void;
    danger?: boolean;
    rightElement?: React.ReactNode;
}

export function SettingsRow({ icon: Icon, label, onPress, danger, rightElement }: SettingsRowProps) {
    return (
        <Pressable
            onPress={onPress}
            className="flex-row items-center justify-between p-4 bg-[#1E293B] mb-[1px] first:rounded-t-2xl last:rounded-b-2xl border-b border-white/5 active:bg-white/5"
        >
            <View className="flex-row items-center gap-4">
                <View className={`w-10 h-10 rounded-full ${danger ? 'bg-red-500/10' : 'bg-blue-500/10'} items-center justify-center`}>
                    <Icon size={20} color={danger ? '#EF4444' : '#3B82F6'} />
                </View>
                <Text className={`text-sm font-medium ${danger ? 'text-red-400' : 'text-slate-200'}`}>
                    {label}
                </Text>
            </View>
            {rightElement || <ChevronRight size={20} color="#64748B" />}
        </Pressable>
    );
}
