import React, { useRef, useState } from 'react';
import { View, Text, ScrollView, Dimensions, Pressable, NativeSyntheticEvent, NativeScrollEvent, Image } from 'react-native';
import { ZoomIn, ZoomOut } from 'lucide-react-native';
import { COLORS } from '@/constants/theme';
import { Staff, Appointment } from '@/types';

interface SchedulerProps {
    staffList: Staff[];
    appointments: Appointment[];
    onAppointmentPress: (appointment: Appointment) => void;
    onSlotPress: (staffId: string, time: string) => void;
}

const START_HOUR = 9;
const END_HOUR = 22;
const BASE_HOUR_HEIGHT = 80; // Changed from 100 to 80 as per instruction
const COLUMN_WIDTH = 120; // Wider columns for capsules
const TIME_COL_WIDTH = 60;
const HEADER_HEIGHT = 90;

export const SchedulerGrid = ({ staffList, appointments, onAppointmentPress, onSlotPress }: SchedulerProps) => {
    // Zoom State
    const [zoom, setZoom] = useState(1.0);
    const hourHeight = BASE_HOUR_HEIGHT * zoom;

    // Generate Time Labels (10 min intervals for grid lines, but labels per hour)
    const hours = Array.from({ length: END_HOUR - START_HOUR + 1 }, (_, i) => START_HOUR + i);

    // Scroll Sync Refs
    const headerScrollRef = useRef<ScrollView>(null);
    const bodyScrollRef = useRef<ScrollView>(null);
    const [isSyncing, setIsSyncing] = useState(false);

    // Sync Logic
    const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>, targetRef: React.RefObject<ScrollView | null>) => {
        if (isSyncing) return;
        setIsSyncing(true);
        const x = e.nativeEvent.contentOffset.x;
        targetRef.current?.scrollTo({ x, animated: false });
        setTimeout(() => setIsSyncing(false), 50);
    };

    const handleZoom = (delta: number) => {
        setZoom(prev => Math.min(Math.max(prev + delta, 0.5), 2.0));
    };

    // Helper: Calculate position
    const getTopOffset = (timeStr: string) => {
        // timeStr format HH:mm or HH:mm:ss
        if (!timeStr) return 0;
        const [h, m] = timeStr.split(':').map(Number);
        if (h < START_HOUR) return 0;
        const totalMinutes = (h - START_HOUR) * 60 + m;
        return (totalMinutes / 60) * hourHeight;
    };

    const getHeight = (duration: number = 30) => {
        return (duration / 60) * hourHeight;
    };

    // Current time state for the indicator
    const [currentTime, setCurrentTime] = useState(new Date());

    React.useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000); // Update every minute
        return () => clearInterval(timer);
    }, []);

    // Calculate top offset for current time
    const getCurrentTimeTop = () => {
        const now = currentTime;
        const h = now.getHours();
        const m = now.getMinutes();
        if (h < START_HOUR || h > END_HOUR) return null; // Hide if outside of schedule hours

        const totalMinutes = (h - START_HOUR) * 60 + m;
        return (totalMinutes / 60) * hourHeight;
    };

    const currentTimeTop = getCurrentTimeTop();

    return (
        <View className="flex-1 bg-[#121212]">

            {/* Controls Row (Zoom) */}
            <View className="absolute right-4 bottom-36 z-50 flex-row gap-2">
                <Pressable onPress={() => handleZoom(-0.2)} className="bg-[#1E1E1E] p-3 rounded-full border border-white/10 shadow-lg">
                    <ZoomOut size={20} color="white" />
                </Pressable>
                <Pressable onPress={() => handleZoom(0.2)} className="bg-[#1E1E1E] p-3 rounded-full border border-white/10 shadow-lg">
                    <ZoomIn size={20} color="white" />
                </Pressable>
            </View>

            {/* Header Row (Staff Columns) */}
            <View style={{ height: HEADER_HEIGHT }} className="flex-row border-b border-white/10 bg-[#1E1E1E] z-10">
                {/* Empty Corner */}
                <View style={{ width: TIME_COL_WIDTH }} className="border-r border-white/10 items-center justify-center">
                    <Text className="text-gray-400 text-[10px] font-bold">SAAT</Text>
                </View>

                {/* Scrollable Staff Headers */}
                <ScrollView
                    horizontal
                    ref={headerScrollRef}
                    scrollEventThrottle={16}
                    onScroll={(e) => handleScroll(e, bodyScrollRef)}
                    showsHorizontalScrollIndicator={false}
                >
                    {staffList.map((staff, idx) => (
                        <View
                            key={staff.id}
                            style={{ width: COLUMN_WIDTH }}
                            className={`items-center justify-center border-r border-white/10 px-2 ${idx % 2 === 0 ? 'bg-[#1E1E1E]' : 'bg-[#1E1E1E]/50'}`}
                        >
                            {/* Staff Avatar or Initials */}
                            <View className="w-14 h-14 rounded-full bg-[#2A2A2A] items-center justify-center mb-2 overflow-hidden border-2 border-white/10 shadow-sm">
                                {staff.avatar || (staff as any).avatar_url ? (
                                    <Image
                                        source={{ uri: staff.avatar || (staff as any).avatar_url }}
                                        className="w-full h-full"
                                        resizeMode="cover"
                                    />
                                ) : (
                                    <Text className="text-white font-bold text-lg" style={{ color: COLORS.primary.DEFAULT }}>
                                        {staff.name.charAt(0).toUpperCase()}
                                    </Text>
                                )}
                            </View>
                            <Text numberOfLines={1} className="text-white font-bold text-xs">{staff.name}</Text>
                        </View>
                    ))}
                    {/* Spacer for right padding */}
                    <View style={{ width: 20 }} />
                </ScrollView>
            </View>

            {/* Main Grid (Vertical Scroll) */}
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                <View className="flex-row relative">

                    {/* Time Column (Fixed Left) */}
                    <View style={{ width: TIME_COL_WIDTH }} className="bg-[#121212] border-r border-white/10 relative">
                        {hours.map(h => (
                            <View key={h} style={{ height: hourHeight }} className="border-b border-white/5 relative">
                                {/* Hour Label */}
                                <Text className="text-gray-500 text-xs font-mono absolute top-1 left-2">{h.toString().padStart(2, '0')}:00</Text>

                                {/* Minute Markers */}
                                {[10, 20, 30, 40, 50].map(m => (
                                    <Text
                                        key={m}
                                        style={{ top: (m / 60) * hourHeight - 6 }}
                                        className="text-gray-700 text-[9px] font-mono absolute right-1"
                                    >
                                        {m}
                                    </Text>
                                ))}
                            </View>
                        ))}

                        {/* Current Time Marker (Left Sidebar) */}
                        {currentTimeTop !== null && (
                            <View
                                style={{
                                    position: 'absolute',
                                    top: currentTimeTop - 4,
                                    right: -1, // On the border edge 
                                    zIndex: 60
                                }}
                            >
                                <View className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(212,175,53,0.8)]" />
                            </View>
                        )}
                    </View>

                    {/* Grid Body (Horizontal Scroll) */}
                    <ScrollView
                        horizontal
                        ref={bodyScrollRef}
                        scrollEventThrottle={16}
                        onScroll={(e) => handleScroll(e, headerScrollRef)}
                        showsHorizontalScrollIndicator={false}
                    >
                        <View className="bg-[#121212] relative">
                            {/* Background Grid Lines && Interaction Layer */}
                            <View className="absolute inset-0 flex-row">
                                {staffList.map((staff, idx) => (
                                    <Pressable
                                        key={staff.id}
                                        onPress={(e) => {
                                            const y = e.nativeEvent.locationY;
                                            // Calculate time
                                            const totalMinutes = (y / hourHeight) * 60;
                                            const hour = Math.floor(totalMinutes / 60) + START_HOUR;
                                            const minute = Math.floor(totalMinutes % 60);
                                            // Round to nearest 15 mins for easier selection
                                            const roundedMinute = Math.floor(minute / 15) * 15;

                                            const timeStr = `${hour.toString().padStart(2, '0')}:${roundedMinute.toString().padStart(2, '0')}`;
                                            onSlotPress(staff.id, timeStr);
                                        }}
                                        style={{ width: COLUMN_WIDTH }}
                                        className={`border-r border-white/5 h-full active:bg-white/5`}
                                    />
                                ))}
                            </View>

                            {/* Horizontal Time Lines */}
                            <View className="absolute inset-0" pointerEvents="none">
                                {hours.map(h => (
                                    <View key={h} style={{ height: hourHeight }} className="border-b border-white/5 w-[2000px]" />
                                ))}
                            </View>

                            {/* 10-min Guidelines (Subtle) */}
                            <View className="absolute inset-0 overflow-hidden" pointerEvents="none">
                                {hours.map(h => (
                                    <View key={`sub-${h}`} style={{ height: hourHeight }}>
                                        {[10, 20, 30, 40, 50].map(m => (
                                            <View
                                                key={m}
                                                style={{
                                                    position: 'absolute',
                                                    top: (m / 60) * hourHeight,
                                                    width: 2000,
                                                    height: 1,
                                                    backgroundColor: 'rgba(255,255,255,0.02)'
                                                }}
                                            />
                                        ))}
                                    </View>
                                ))}
                            </View>

                            {/* Interaction Layer (On Top of Grid Lines) */}
                            <View className="absolute inset-0 flex-row" style={{ zIndex: 10 }}>
                                {staffList.map((staff, idx) => (
                                    <Pressable
                                        key={staff.id}
                                        onPress={(e) => {
                                            const y = e.nativeEvent.locationY;
                                            // Calculate time
                                            const totalMinutes = (y / hourHeight) * 60;
                                            const hour = Math.floor(totalMinutes / 60) + START_HOUR;
                                            const minute = Math.floor(totalMinutes % 60);
                                            // Round to nearest 15 mins for easier selection
                                            const roundedMinute = Math.floor(minute / 15) * 15;

                                            const timeStr = `${hour.toString().padStart(2, '0')}:${roundedMinute.toString().padStart(2, '0')}`;
                                            onSlotPress(staff.id, timeStr);
                                        }}
                                        style={{ width: COLUMN_WIDTH }}
                                        className={`border-r border-white/5 h-full active:bg-white/5`}
                                    />
                                ))}
                            </View>

                            {/* CURRENT TIME LINE (Updated to Primary Gold) */}
                            {currentTimeTop !== null && (
                                <View
                                    style={{
                                        position: 'absolute',
                                        top: currentTimeTop,
                                        width: 2000,
                                        height: 2,
                                        backgroundColor: COLORS.primary.DEFAULT,
                                        zIndex: 50,
                                        shadowColor: COLORS.primary.DEFAULT,
                                        shadowOffset: { width: 0, height: 0 },
                                        shadowOpacity: 0.8,
                                        shadowRadius: 4,
                                        elevation: 5
                                    }}
                                />
                            )}

                            {/* Appointment Capsules */}
                            {staffList.map((staff, colIdx) => {
                                const staffApts = appointments.filter(a => a.staffId === staff.id);

                                // Get real working hours or default to standard business hours
                                const startStr = staff.workingHours?.start || '09:00';
                                const endStr = staff.workingHours?.end || '19:00';

                                const [sH, sM] = startStr.split(':').map(Number);
                                const [eH, eM] = endStr.split(':').map(Number);

                                // Calculate decimal hours (e.g., 09:30 -> 9.5)
                                const shiftStart = (!isNaN(sH) ? sH + (sM || 0) / 60 : START_HOUR);
                                const shiftEnd = (!isNaN(eH) ? eH + (eM || 0) / 60 : END_HOUR);

                                // Calculate heights relative to grid start
                                // If shift starts before grid start, clamp to 0
                                const startOffset = Math.max(0, shiftStart - START_HOUR);
                                const endOffset = Math.max(0, shiftEnd - START_HOUR);

                                const morningHeight = startOffset * hourHeight;
                                const eveningTop = endOffset * hourHeight;

                                // Lunch Break Calculation
                                let lunchTop = 0;
                                let lunchHeight = 0;
                                const lunchStartStr = staff.workingHours?.lunchStart;
                                const lunchEndStr = staff.workingHours?.lunchEnd;

                                if (lunchStartStr && lunchEndStr) {
                                    const [lsh, lsm] = lunchStartStr.split(':').map(Number);
                                    const [leh, lem] = lunchEndStr.split(':').map(Number);
                                    const lsVal = (!isNaN(lsh) ? lsh + (lsm || 0) / 60 : 0);
                                    const leVal = (!isNaN(leh) ? leh + (lem || 0) / 60 : 0);

                                    if (lsVal >= START_HOUR && leVal > lsVal) {
                                        lunchTop = (lsVal - START_HOUR) * hourHeight;
                                        lunchHeight = (leVal - lsVal) * hourHeight;
                                    }
                                }

                                return (
                                    <View key={staff.id} style={{ position: 'absolute', left: colIdx * COLUMN_WIDTH, width: COLUMN_WIDTH, height: '100%' }}>

                                        {/* Shift Background (Active Area) */}
                                        <View
                                            style={{
                                                position: 'absolute',
                                                top: morningHeight,
                                                height: Math.max(0, eveningTop - morningHeight),
                                                left: 0,
                                                right: 0,
                                                backgroundColor: 'rgba(255,255,255,0.02)'
                                            }}
                                        />

                                        {/* Non-Working Hours (Morning) */}
                                        {morningHeight > 0 && (
                                            <View
                                                style={{
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: 0,
                                                    right: 0,
                                                    height: morningHeight,
                                                    backgroundColor: 'rgba(18, 18, 18, 0.9)', // Darker overlay
                                                    zIndex: 5,
                                                    borderBottomWidth: 1,
                                                    borderBottomColor: 'rgba(255,255,255,0.05)',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                <View className="opacity-20" style={{ transform: [{ rotate: '-45deg' }] }}>
                                                    <Text className="text-xs font-bold text-gray-600">KAPALI</Text>
                                                </View>
                                            </View>
                                        )}

                                        {/* Non-Working Hours (Evening) */}
                                        <View
                                            style={{
                                                position: 'absolute',
                                                top: eveningTop,
                                                left: 0,
                                                right: 0,
                                                bottom: 0,
                                                backgroundColor: 'rgba(18, 18, 18, 0.9)',
                                                zIndex: 5,
                                                borderTopWidth: 1,
                                                borderTopColor: 'rgba(255,255,255,0.05)',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <View className="opacity-20" style={{ transform: [{ rotate: '-45deg' }] }}>
                                                <Text className="text-xs font-bold text-gray-600">KAPALI</Text>
                                            </View>
                                        </View>

                                        {/* Lunch Break Overlay */}
                                        {lunchHeight > 0 && (
                                            <View
                                                style={{
                                                    position: 'absolute',
                                                    top: lunchTop,
                                                    height: lunchHeight,
                                                    left: 0,
                                                    right: 0,
                                                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                                                    zIndex: 15, // Above standard grid but below appts
                                                    borderTopWidth: 1,
                                                    borderBottomWidth: 1,
                                                    borderColor: 'rgba(255,255,255,0.05)',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                <View className="flex-row items-center opacity-40 bg-black/40 px-2 py-0.5 rounded">
                                                    <Text className="text-[9px] font-bold text-gray-400">ÖĞLE ARASI</Text>
                                                </View>
                                            </View>
                                        )}

                                        {staffApts.map(apt => {
                                            const top = getTopOffset(apt.startTime || '09:00');
                                            const height = getHeight(apt.totalDuration || 60);
                                            const isBlocked = apt.status === 'blocked';

                                            return (
                                                <Pressable
                                                    key={apt.id}
                                                    onPress={() => onAppointmentPress(apt)}
                                                    style={{
                                                        position: 'absolute',
                                                        top,
                                                        height,
                                                        left: 4,
                                                        right: 4,
                                                        backgroundColor: isBlocked ? '#2A2A2A' : COLORS.primary.DEFAULT + 'E6',
                                                        borderRadius: 6,
                                                        borderLeftWidth: 3,
                                                        borderLeftColor: isBlocked ? '#64748B' : '#fff',
                                                        shadowColor: "#000",
                                                        shadowOffset: {
                                                            width: 0,
                                                            height: 1,
                                                        },
                                                        shadowOpacity: 0.22,
                                                        shadowRadius: 2.22,
                                                        elevation: 3,
                                                        zIndex: 20 // Above overlays
                                                    }}
                                                >
                                                    <View className="flex-1 p-1.5 overflow-hidden">
                                                        {isBlocked ? (
                                                            <View className="flex-1 items-center justify-center opacity-70">
                                                                <Text className="text-gray-300 font-bold text-[10px] tracking-widest uppercase mb-1">{apt.customerName || 'KAPALI'}</Text>
                                                                <View className="bg-black/20 px-1.5 py-0.5 rounded">
                                                                    <Text className="text-gray-200 text-[9px] font-bold">
                                                                        {apt.startTime?.slice(0, 5)} - {apt.endTime?.slice(0, 5)}
                                                                    </Text>
                                                                </View>
                                                            </View>
                                                        ) : (
                                                            <>
                                                                {/* Time Range (Top Priority) */}
                                                                <View className="mb-0.5 flex-row items-center">
                                                                    <View className="bg-black/20 px-1.5 py-0.5 rounded">
                                                                        <Text className="text-white/95 text-[9px] font-bold">
                                                                            {apt.startTime?.slice(0, 5)} - {apt.endTime?.slice(0, 5)}
                                                                        </Text>
                                                                    </View>
                                                                </View>

                                                                <Text numberOfLines={1} className="text-white text-[11px] font-bold mb-0.5 leading-tight">
                                                                    {apt.customerName || 'Müşteri'}
                                                                </Text>

                                                                {height > 45 && (
                                                                    <Text numberOfLines={1} className="text-white/80 text-[10px]">
                                                                        {apt.serviceName}
                                                                    </Text>
                                                                )}
                                                            </>
                                                        )}
                                                    </View>
                                                </Pressable>
                                            );
                                        })}
                                    </View>
                                );
                            })}

                            {/* Spacer for horizontal scroll width */}
                            <View style={{ width: staffList.length * COLUMN_WIDTH + 20 }} />
                        </View>
                    </ScrollView>
                </View>
                {/* Bottom Spacer */}
                <View style={{ height: 150 }} />
            </ScrollView>
        </View>
    );
};
