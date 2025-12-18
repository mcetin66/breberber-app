import { View, Text, Pressable } from 'react-native';
import { LucideIcon, ChevronRight } from 'lucide-react-native';

export interface SettingsRowProps {
    icon: LucideIcon;
    label: string;
    onPress: () => void;
    danger?: boolean;
    accent?: string;
    iconBg?: string; // Custom background color for icon
    rightElement?: React.ReactNode;
    isLast?: boolean; // Whether this is the last item in group
}

export function SettingsRow({ icon: Icon, label, onPress, danger, accent, iconBg, rightElement, isLast }: SettingsRowProps) {
    // Determine colors based on props
    const iconColor = '#FFFFFF'; // White icon on colored background
    const bgColor = iconBg || (danger ? '#EF4444' : accent || '#3B82F6');
    const textColor = danger ? 'text-red-400' : accent ? undefined : 'text-white';
    const textStyle = accent ? { color: accent } : undefined;

    return (
        <Pressable
            onPress={onPress}
            className={`flex-row items-center justify-between p-4 bg-[#1E1E1E] ${!isLast ? 'border-b border-white/5' : ''} active:bg-white/5`}
        >
            <View className="flex-row items-center gap-3">
                <View
                    className="w-9 h-9 rounded-xl items-center justify-center"
                    style={{ backgroundColor: bgColor + '20' }}
                >
                    <Icon size={18} color={bgColor} />
                </View>
                <Text
                    className={`text-sm font-medium ${textColor || ''}`}
                    style={textStyle}
                >
                    {label}
                </Text>
            </View>
            {rightElement || <ChevronRight size={18} color="#4B5563" />}
        </Pressable>
    );
}
