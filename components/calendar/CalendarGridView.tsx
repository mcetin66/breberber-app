import React from 'react';
import { View } from 'react-native';
import { CalendarColumn } from './CalendarColumn';

interface CalendarGridViewProps {
    staffList: any[];
    selectedDate: Date;
    appointments: any[];
    blockedTimes: any[];
    timeSlots: string[];
    currentTime: Date;
    isStaffAvailable: (staff: any, slotTime: string) => boolean;
    onSlotPress: (staffId: string, staffName: string, date: Date, time: string) => void;
    onAppointmentPress: (appointment: any) => void;
}

export const CalendarGridView: React.FC<CalendarGridViewProps> = ({
    staffList,
    selectedDate,
    appointments,
    blockedTimes,
    timeSlots,
    currentTime,
    isStaffAvailable,
    onSlotPress,
    onAppointmentPress
}) => {
    return (
        <>
            {staffList.map(staff => (
                <View key={staff.id} className="w-40 border-r border-white/5 bg-[#121212]">
                    <CalendarColumn
                        columnId={staff.id}
                        columnTitle={staff.name}
                        date={selectedDate}
                        appointments={appointments.filter(a => a.staffId === staff.id && a.date.toDateString() === selectedDate.toDateString())}
                        blockedTimes={blockedTimes.filter(b => b.staffId === staff.id && b.date.toDateString() === selectedDate.toDateString())}
                        slots={timeSlots}
                        currentTime={currentTime}
                        isToday={selectedDate.toDateString() === currentTime.toDateString()}
                        onSlotPress={(date, time) => onSlotPress(staff.id, staff.name, date, time)}
                        onAppointmentPress={onAppointmentPress}
                    />
                </View>
            ))}
        </>
    );
};
