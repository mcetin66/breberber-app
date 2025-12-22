import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { formatTimeRange } from '@/hooks/useCalendarLogic';

interface CalendarColumnProps {
    columnId: string;
    columnTitle?: string; // e.g. Staff Name
    date: Date;
    appointments: any[];
    blockedTimes: any[];
    slots: string[];
    currentTime: Date;
    isToday?: boolean;
    forceShowLine?: boolean;
    onSlotPress: (date: Date, time: string) => void;
    onAppointmentPress: (appointment: any) => void;
}

export const CalendarColumn: React.FC<CalendarColumnProps> = ({
    columnId,
    columnTitle,
    date,
    appointments,
    blockedTimes,
    slots,
    currentTime,
    isToday = false,
    forceShowLine = false,
    onSlotPress,
    onAppointmentPress
}) => {
    // Calc Current Time Top
    const startHour = parseInt(slots[0]?.split(':')[0] || '9');
    const nowTop = ((currentTime.getHours() - startHour) * 84) + ((currentTime.getMinutes() / 60) * 84);
    const showTimeline = (isToday || forceShowLine) && nowTop >= 0 && nowTop <= (slots.length * 84);

    const getPositionStyle = (timeStr: string, durationMin: number) => {
        const [h, m] = timeStr.split(':').map(Number);
        const top = ((h - startHour) * 84) + ((m / 60) * 84);
        const height = (durationMin / 60) * 84;
        return { top, height };
    };

    return (
        <View className="relative h-full">
            {/* Grid Lines & Touch Area */}
            {slots.map((time, i) => (
                <View key={`slot-${i}`} className="absolute w-full" style={{ top: i * 84, height: 84 }}>
                    <View className="w-full h-[1px] bg-white/10" />

                    {/* Sub-lines */}
                    <View className="absolute top-[21px] w-full h-[1px] bg-white/5 opacity-10" />
                    <View className="absolute top-[42px] w-full h-[1px] bg-white/5 opacity-20" />
                    <View className="absolute top-[63px] w-full h-[1px] bg-white/5 opacity-10" />

                    <Pressable
                        onPress={() => onSlotPress(date, time)}
                        className="absolute inset-0 z-10 active:bg-white/5"
                    />
                </View>
            ))}

            {/* Current Time Indicator */}
            {showTimeline && (
                <View className="absolute w-full z-40 pointer-events-none" style={{ top: nowTop }}>
                    <View className="w-full h-[2px] bg-green-500 shadow-sm shadow-green-500" />
                    {isToday && <View className="absolute -left-1 -top-[3px] w-2 h-2 rounded-full bg-green-500 shadow-sm shadow-green-500" />}
                </View>
            )}

            {/* Appointments */}
            {appointments.map((apt, idx) => {
                const style = getPositionStyle(apt.startTime, apt.duration);
                const isPending = apt.status === 'pending';

                // Privacy Logic for Pending: Show Initials Only
                const displayName = isPending
                    ? '🔒 ' + (apt.customerName || '').split(' ').map((n: string) => n[0]).join('.') + '.'
                    : apt.customerName;

                return (
                    <View key={`apt-${idx}`} className="absolute w-full px-1 z-30" style={style}>
                        <Pressable
                            onPress={() => onAppointmentPress(apt)}
                            className={`w-full h-full rounded-md border-l-4 p-1 overflow-hidden shadow-sm active:opacity-80
                  ${isPending ? 'bg-zinc-700/80 border-zinc-500' : 'bg-[#d4af35] border-white'}
                `}
                        >
                            {isPending && (
                                <View className="absolute inset-0 bg-zinc-800/50 stripe-pattern opacity-30" />
                            )}

                            <Text className={`text-[9px] font-black opacity-80 mb-0.5 ${isPending ? 'text-zinc-300' : 'text-black'}`}>
                                {formatTimeRange(apt.startTime, apt.duration)}
                            </Text>
                            <Text className={`text-[10px] font-bold truncate leading-snug ${isPending ? 'text-zinc-200' : 'text-black'}`}>
                                {displayName}
                            </Text>
                            {apt.serviceName && (
                                <Text className={`text-[8px] font-medium opacity-70 truncate leading-tight ${isPending ? 'text-zinc-400' : 'text-black'}`}>
                                    {apt.serviceName}
                                </Text>
                            )}
                        </Pressable>
                    </View>
                );
            })}

            {/* Blocks (Merged) */}
            {blockedTimes.map((block, idx) => {
                const style = getPositionStyle(block.startTime, block.duration);
                // Check logic: type 'break' or note 'Mola' is Break (Blue)
                const isBreak = block.type === 'break' || block.note === 'Mola';
                const activeColor = isBreak ? '#3B82F6' : '#EF4444'; // Blue : Red

                return (
                    <View key={`block-${idx}`} className="absolute w-full px-1 z-20" style={style}>
                        <Pressable
                            onPress={() => onAppointmentPress(block)}
                            className="w-full h-full rounded-md border-l-4 p-1 overflow-hidden active:opacity-80"
                            style={{
                                backgroundColor: `${activeColor}20`,
                                borderColor: activeColor
                            }}
                        >
                            <View
                                className="w-full h-full absolute opacity-10 stripe-pattern"
                                style={{ backgroundColor: activeColor }}
                            />
                            <Text
                                className="text-[9px] font-black opacity-80 mb-0.5"
                                style={{ color: activeColor }}
                            >
                                {formatTimeRange(block.startTime, block.duration)}
                            </Text>
                            <Text
                                className="text-[10px] font-bold text-center"
                                style={{ color: activeColor }}
                            >
                                {isBreak ? 'Mola' : 'Dolu'}
                                {block.note && block.note !== 'Mola' && block.note !== 'Dolu' ? ` (${block.note})` : ''}
                            </Text>
                        </Pressable>
                    </View>
                );
            })}
        </View>
    );
};
