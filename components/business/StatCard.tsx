import { View, Text } from 'react-native';
import { StatCardProps } from './StatCard.types';

export const StatCard = ({ label, value, icon: Icon, colorClass, highlight, highlightClass }: StatCardProps) => (
    <View className="w-[140px] h-[120px] rounded-xl bg-surface-light dark:bg-surface-dark p-4 border border-gray-100 dark:border-[#293038] mr-3 shadow-sm justify-between">
        <View className="flex-row items-start justify-between">
            <View className={`p-1.5 rounded-lg ${colorClass}`}>
                <Icon size={20} color={colorClass.includes('blue') ? '#137fec' : colorClass.includes('yellow') ? '#EAB308' : '#A855F7'} />
            </View>
            {highlight && (
                <View className={`px-1.5 py-0.5 rounded-full ${highlightClass}`}>
                    <Text className="text-[10px] font-bold text-green-500">{highlight}</Text>
                </View>
            )}
        </View>
        <View>
            <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-0.5">{value}</Text>
            <Text className="text-xs text-gray-500 dark:text-[#9dabb9] font-medium">{label}</Text>
        </View>
    </View>
);
