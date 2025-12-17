import { View, Text, Pressable } from 'react-native';
import { LucideIcon, ChevronRight } from 'lucide-react-native';

export interface SettingsRowProps {
    icon: LucideIcon;
    label: string;
    onPress: () => void;
    danger?: boolean;
    accent?: string; // Custom accent color for special items
    rightElement?: React.ReactNode;
}

export function SettingsRow({ icon: Icon, label, onPress, danger, accent, rightElement }: SettingsRowProps) {
    // Determine colors based on props
    const iconColor = danger ? '#EF4444' : accent || '#3B82F6';
    const bgColor = danger ? 'bg-red-500/10' : accent ? undefined : 'bg-blue-500/10';
    const bgStyle = accent ? { backgroundColor: accent + '15' } : undefined;
    const textColor = danger ? 'text-red-400' : accent ? undefined : 'text-slate-200';
    const textStyle = accent ? { color: accent } : undefined;

    return (
        <Pressable
            onPress={onPress}
            className="flex-row items-center justify-between p-4 bg-[#1E293B] mb-[1px] first:rounded-t-2xl last:rounded-b-2xl border-b border-white/5 active:bg-white/5"
        >
            <View className="flex-row items-center gap-4">
                <View
                    className={`w-10 h-10 rounded-full ${bgColor || ''} items-center justify-center`}
                    style={bgStyle}
                >
                    <Icon size={20} color={iconColor} />
                </View>
                <Text
                    className={`text-sm font-medium ${textColor || ''}`}
                    style={textStyle}
                >
                    {label}
                </Text>
            </View>
            {rightElement || <ChevronRight size={20} color="#64748B" />}
        </Pressable>
    );
}
