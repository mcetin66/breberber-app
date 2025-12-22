import React from 'react';
import { View } from 'react-native';
import { CalendarColumn } from './CalendarColumn';

interface CalendarListViewProps {
    weekDays: any[];
    activeStaffId: string | null;
    staffName: string;
    appointments: any[];
    blockedTimes: any[];
    timeSlots: string[];
    currentTime: Date;
    onSlotPress: (staffId: string, staffName: string, date: Date, time: string) => void;
    onAppointmentPress: (appointment: any) => void;
}

export const CalendarListView: React.FC<CalendarListViewProps> = ({
    weekDays,
    activeStaffId,
    staffName,
    appointments,
    blockedTimes,
    timeSlots,
    currentTime,
    onSlotPress,
    onAppointmentPress
}) => {
    return (
        <>
            {weekDays.map(day => (
                <View key={day.date} className="w-40 border-r border-white/5 bg-[#121212]">
                    <CalendarColumn
                        columnId={day.date}
                        date={day.fullDate}
                        appointments={appointments.filter(a => a.staffId === activeStaffId && a.date.toDateString() === day.fullDate.toDateString())}
                        blockedTimes={blockedTimes.filter(b => b.staffId === activeStaffId && b.date.toDateString() === day.fullDate.toDateString())}
                        slots={timeSlots}
                        currentTime={currentTime}
                        isToday={day.fullDate.toDateString() === currentTime.toDateString()}
                        forceShowLine={weekDays.some(d => d.isToday)}
                        onSlotPress={(date, time) => onSlotPress(activeStaffId || '', staffName, date, time)}
                        onAppointmentPress={onAppointmentPress}
                    />
                </View>
            ))}
        </>
    );
};
