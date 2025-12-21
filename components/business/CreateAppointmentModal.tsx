import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { View, Text, Modal, Pressable, TextInput, ScrollView, Alert, TouchableOpacity, NativeSyntheticEvent, NativeScrollEvent, Keyboard } from 'react-native';
import { X, User, Coffee, Ban, Check } from 'lucide-react-native';
import { useBusinessStore } from '@/stores/businessStore';
import { COLORS } from '@/constants/theme';

interface CreateAppointmentModalProps {
    visible: boolean;
    initialData: {
        id?: string;
        staffId: string;
        staffName: string;
        date: Date;
        time: string;
        endTime?: string;
        businessId: string;
        customerName?: string;
        serviceIds?: string[];
        serviceId?: string;
        duration?: number;
        status?: string;
        notes?: string;
    } | null;
    onClose: () => void;
    onSave: (data: any) => void;
}

const ITEM_HEIGHT = 50;

// Generate 10-minute intervals
const TIME_SLOTS: string[] = [];
for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 10) {
        TIME_SLOTS.push(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
    }
}

// ---- ROBUST WHEEL PICKER ----
interface WheelPickerProps {
    value: string;
    onSelect: (val: string) => void;
    activeColor: string;
}

const WheelPicker = React.memo(({ value, onSelect, activeColor }: WheelPickerProps) => {
    const scrollViewRef = useRef<ScrollView>(null);
    const isUserScrolling = useRef(false);

    // Sync Scroll with Value (Programmatic Update)
    useEffect(() => {
        if (!isUserScrolling.current) {
            const index = TIME_SLOTS.indexOf(value);
            if (index !== -1) {
                // Use animated:true for nice feedback when "End Time" updates automatically
                // But if it causes shaking, we can fallback to false. 
                // Since we guard with isUserScrolling, it should be safe.
                scrollViewRef.current?.scrollTo({
                    y: index * ITEM_HEIGHT,
                    animated: true
                });
            }
        }
    }, [value]);

    const onScrollBeginDrag = () => {
        isUserScrolling.current = true;
    };

    const onMomentumScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        const offsetY = e.nativeEvent.contentOffset.y;
        const index = Math.round(offsetY / ITEM_HEIGHT);
        const safeIndex = Math.max(0, Math.min(index, TIME_SLOTS.length - 1));
        const selectedTime = TIME_SLOTS[safeIndex];

        if (selectedTime && selectedTime !== value) {
            onSelect(selectedTime);
        }
        // Release guard after a short delay to allow state to settle
        setTimeout(() => {
            isUserScrolling.current = false;
        }, 100);
    };

    return (
        <View className="h-[150px] w-full relative bg-[#18181b]">
            {/* Center Highlight */}
            <View
                className="absolute top-[50px] left-0 right-0 h-[50px] bg-white/5 rounded-lg border-y border-white/10 z-0"
                style={{ borderColor: `${activeColor}40`, backgroundColor: `${activeColor}05` }}
                pointerEvents="none"
            />

            <ScrollView
                ref={scrollViewRef}
                showsVerticalScrollIndicator={false}
                snapToInterval={ITEM_HEIGHT}
                decelerationRate="fast"
                onScrollBeginDrag={onScrollBeginDrag}
                onMomentumScrollEnd={onMomentumScrollEnd}
                nestedScrollEnabled={true}
                contentContainerStyle={{ paddingVertical: 50 }}
            >
                {TIME_SLOTS.map((item) => {
                    const isSelected = item === value;
                    return (
                        <View key={item} className="h-[50px] items-center justify-center w-full z-10">
                            <Text
                                className={`font-mono text-xl font-bold ${isSelected ? 'scale-110 opacity-100' : 'text-zinc-500 scale-90 opacity-40'}`}
                                style={isSelected ? {
                                    color: activeColor,
                                } : {}}
                            >
                                {item}
                            </Text>
                        </View>
                    );
                })}
            </ScrollView>

            {/* Simple Opacity Overlays */}
            <View className="absolute top-0 left-0 right-0 h-[40px] bg-[#18181b] opacity-80 z-20 pointer-events-none" />
            <View className="absolute bottom-0 left-0 right-0 h-[40px] bg-[#18181b] opacity-80 z-20 pointer-events-none" />
        </View>
    );
});
// ------------------------------------------------

export const CreateAppointmentModal = ({ visible, initialData, onClose, onSave }: CreateAppointmentModalProps) => {
    const [mode, setMode] = useState<'appointment' | 'full' | 'break'>('appointment');
    const [customerName, setCustomerName] = useState('');

    // Multiple Services State
    const [selectedServices, setSelectedServices] = useState<any[]>([]);

    const [startTime, setStartTime] = useState('09:00');
    const [endTime, setEndTime] = useState('09:10');

    // Store
    const { getServices } = useBusinessStore();
    const services = useMemo(() => initialData?.businessId ? getServices(initialData.businessId) : [], [initialData?.businessId]);

    // Initialize State
    useEffect(() => {
        if (visible && initialData) {
            // Edit Mode Hydration
            const isBlockWithNote = initialData.status === 'blocked' && initialData.notes && initialData.notes !== 'Mola' && initialData.notes !== 'Dolu';

            // Detect Mode
            if (initialData.status === 'blocked') {
                if (initialData.notes === 'Mola') setMode('break');
                else setMode('full');
            } else {
                setMode('appointment');
            }

            setCustomerName(initialData.customerName || '');

            // Hydrate Services if provided
            if (initialData.serviceIds && initialData.serviceIds.length > 0) {
                // Find full service objects
                const foundServices = services.filter(s => initialData.serviceIds?.includes(s.id));
                setSelectedServices(foundServices);
            } else if (initialData.serviceId) {
                // Fallback for single serviceId
                const found = services.find(s => s.id === initialData.serviceId);
                if (found) setSelectedServices([found]);
                else setSelectedServices([]);
            } else {
                setSelectedServices([]);
            }

            const start = initialData.time || '09:00';
            setStartTime(start);

            // Hydrate End Time or Calculate
            if (initialData.endTime) {
                setEndTime(String(initialData.endTime).slice(0, 5));
            } else {
                calculateAndSetEndTime(start, initialData.serviceIds ? services.filter(s => initialData.serviceIds?.includes(s.id)) : []);
            }
        }
    }, [visible, initialData, services]);

    const handleServiceToggle = (service: any) => {
        if (mode !== 'appointment') return;

        let newServices;
        const exists = selectedServices.find(s => s.id === service.id);

        if (exists) {
            newServices = selectedServices.filter(s => s.id !== service.id);
        } else {
            newServices = [...selectedServices, service];
        }

        setSelectedServices(newServices);
        calculateAndSetEndTime(startTime, newServices);
    };

    // Helper to Calculate End Time
    const calculateAndSetEndTime = (start: string, currentServices: any[]) => {
        // Calculate total duration
        const totalDuration = currentServices.reduce((acc, curr) => acc + (curr.duration_minutes || 10), 0);

        // If no services, default to 10 mins
        const durationToUse = totalDuration > 0 ? totalDuration : 10;

        const [h, m] = start.split(':').map(Number);
        const d = new Date();
        d.setHours(h, m + durationToUse, 0, 0);

        const endH = d.getHours().toString().padStart(2, '0');
        const endM = d.getMinutes().toString().padStart(2, '0');
        setEndTime(`${endH}:${endM}`);
    };

    const handleStartTimeChange = (newStart: string) => {
        setStartTime(newStart);
        // Auto update end time when start time changes
        calculateAndSetEndTime(newStart, selectedServices);
    };

    const handleSave = () => {
        const finalName = mode === 'appointment' ? customerName : (mode === 'full' ? 'Dolu' : 'Mola');

        if (mode === 'appointment' && !finalName.trim()) {
            Alert.alert('Eksik Bilgi', 'Lütfen müşteri adı girin.');
            return;
        }

        const [startH, startM] = startTime.split(':').map(Number);
        const [endH, endM] = endTime.split(':').map(Number);

        const startMin = startH * 60 + startM;
        const endMin = endH * 60 + endM;
        const duration = endMin - startMin;

        if (duration <= 0) {
            Alert.alert('Hata', 'Bitiş saati başlangıçtan sonra olmalı');
            return;
        }

        // Combine service names and prices
        const combinedServiceName = selectedServices.map(s => s.name).join(', ');
        const totalPrice = selectedServices.reduce((acc, s) => acc + (s.price || 0), 0);

        onSave({
            staffId: initialData?.staffId,
            date: initialData?.date,
            startTime,
            endTime,
            duration,
            type: mode === 'appointment' ? 'appointment' : (mode === 'break' ? 'break' : 'blocked'),
            customerName: mode === 'appointment' ? customerName : undefined,
            // Pass the primary service ID if one, or null. Logic might need array later but keeping consistent for now.
            serviceId: selectedServices.length > 0 ? selectedServices[0].id : undefined,
            serviceIds: selectedServices.map(s => s.id), // Extra data just in case
            serviceName: mode === 'appointment' ? combinedServiceName : undefined,
            price: mode === 'appointment' ? totalPrice : undefined,
            status: mode === 'appointment' ? 'confirmed' : 'blocked',
            note: mode === 'full' ? 'Dolu' : (mode === 'break' ? 'Mola' : undefined),
            id: initialData?.id // Pass ID back for updates
        });
        onClose();
    };

    const modes = [
        { id: 'appointment', label: 'Randevu', icon: User, color: '#d4af35' }, // Gold
        { id: 'full', label: 'Dolu', icon: Ban, color: '#EF4444' }, // Red
        { id: 'break', label: 'Mola', icon: Coffee, color: '#3B82F6' }, // Blue
    ];

    const activeModeObj = modes.find(m => m.id === mode);
    const activeColor = activeModeObj?.color || COLORS.primary.DEFAULT;

    if (!visible || !initialData) return null;

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <View className="flex-1 justify-end">
                {/* Backdrop - Sibling 1 (Dismiss Keyboard) */}
                <Pressable
                    className="absolute top-0 bottom-0 left-0 right-0 bg-black/80"
                    onPress={() => {
                        Keyboard.dismiss();
                        onClose();
                    }}
                />

                {/* Content - Sibling 2 (Independent) */}
                <View className="bg-[#18181b] w-full rounded-t-3xl border-t border-white/10 h-[75%] overflow-hidden">

                    {/* Header */}
                    <View className="flex-row items-center justify-between p-6 border-b border-white/10 bg-[#18181b] z-50">
                        <Text className="text-white text-xl font-bold">Yeni Ekle</Text>
                        <Pressable onPress={onClose} className="w-8 h-8 rounded-full bg-white/5 items-center justify-center">
                            <X size={20} color="white" />
                        </Pressable>
                    </View>

                    {/* FIXED SECTION */}
                    <View className="px-6 pt-6 pb-2 bg-[#18181b] z-40">
                        {/* 1. Mode Tabs */}
                        <View className="flex-row bg-[#27272a] p-1 rounded-xl mb-6">
                            {modes.map((m) => {
                                const isActive = mode === m.id;
                                const Icon = m.icon;
                                return (
                                    <TouchableOpacity
                                        key={m.id}
                                        onPress={() => setMode(m.id as any)}
                                        className={`flex-1 flex-row items-center justify-center py-3 rounded-lg ${isActive ? 'bg-[#3f3f46]' : ''}`}
                                        style={isActive ? { backgroundColor: `${m.color}20` } : {}}
                                    >
                                        <Icon size={16} color={isActive ? m.color : '#a1a1aa'} />
                                        <Text
                                            className={`ml-2 text-xs font-bold ${isActive ? '' : 'text-zinc-400'}`}
                                            style={isActive ? { color: m.color } : {}}
                                        >
                                            {m.label}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>

                        {/* 2. Time Picker */}
                        <View className="mb-4">
                            <View className="flex-row items-center justify-between mb-2 px-4">
                                <Text className="text-zinc-400 text-xs font-bold uppercase tracking-wider">BAŞLANGIÇ</Text>
                                <Text className="text-zinc-400 text-xs font-bold uppercase tracking-wider">BİTİŞ</Text>
                            </View>

                            <View className="flex-row gap-4 items-center justify-center bg-[#121212]/50 rounded-2xl p-2 border border-white/5 relative">
                                <View className="flex-1">
                                    <WheelPicker
                                        value={startTime}
                                        onSelect={handleStartTimeChange}
                                        activeColor={activeColor}
                                    />
                                </View>

                                <View className="h-[40px] w-[1px] bg-white/10" />

                                <View className="flex-1">
                                    <WheelPicker
                                        value={endTime}
                                        onSelect={setEndTime}
                                        activeColor={activeColor}
                                    />
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* SCROLLABLE SECTION */}
                    <View className="flex-1">
                        <ScrollView
                            className="flex-1 px-6"
                            contentContainerStyle={{ paddingBottom: 40, paddingTop: 10 }}
                            showsVerticalScrollIndicator={false}
                        >
                            {mode === 'appointment' ? (
                                <View className="gap-6">
                                    <View>
                                        <Text className="text-zinc-400 text-xs font-bold mb-3 uppercase tracking-wider">Müşteri</Text>
                                        <View className="bg-[#27272a] rounded-xl border border-white/5 px-4 py-3">
                                            <TextInput
                                                placeholder="Müşteri Adı ve Soyadı"
                                                placeholderTextColor="#525252"
                                                className="text-white text-base font-medium h-6"
                                                value={customerName}
                                                onChangeText={setCustomerName}
                                            />
                                        </View>
                                    </View>

                                    <View>
                                        <Text className="text-zinc-400 text-xs font-bold mb-3 uppercase tracking-wider">Hizmet Seçimi</Text>
                                        {/* Show selected duration sum */}
                                        {selectedServices.length > 0 && (
                                            <Text className="text-[#d4af35] text-xs font-bold mb-2">
                                                Seçili: {selectedServices.map(s => s.name).join(', ')} ({selectedServices.reduce((a, b) => a + (b.duration_minutes || 10), 0)} dk)
                                            </Text>
                                        )}

                                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
                                            {services.map((service, idx) => {
                                                const isSelected = selectedServices.some(s => s.id === service.id);
                                                return (
                                                    <TouchableOpacity
                                                        key={idx}
                                                        onPress={() => handleServiceToggle(service)}
                                                        className={`px-4 py-3 rounded-xl border ${isSelected ? 'bg-[#d4af35]/20 border-[#d4af35]' : 'bg-[#27272a] border-white/5'}`}
                                                    >
                                                        <Text className={`font-bold ${isSelected ? 'text-[#d4af35]' : 'text-zinc-300'}`}>{service.name}</Text>
                                                        <Text className={`text-xs mt-1 ${isSelected ? 'text-[#d4af35]/80' : 'text-zinc-500'}`}>{service.duration_minutes || 10} dk • ₺{service.price}</Text>
                                                    </TouchableOpacity>
                                                );
                                            })}
                                        </ScrollView>
                                    </View>
                                </View>
                            ) : (
                                <View className="items-center justify-center py-6 bg-[#27272a] rounded-2xl border border-dashed border-zinc-700">
                                    <Text className="text-zinc-400 text-sm">
                                        {mode === 'full' ? 'Seçili aralık randevuya kapatılacak.' : 'Personel molası olarak işlenecek.'}
                                    </Text>
                                </View>
                            )}
                        </ScrollView>
                    </View>

                    {/* Footer */}
                    <View className="p-6 border-t border-white/10 bg-[#18181b]">
                        <TouchableOpacity
                            onPress={handleSave}
                            className="w-full py-4 rounded-xl items-center justify-center flex-row gap-2 active:opacity-90 shadow-lg"
                            style={{ backgroundColor: activeColor, shadowColor: activeColor, shadowOpacity: 0.3, shadowRadius: 12 }}
                        >
                            <Check size={20} color="white" />
                            <Text className="text-white font-bold text-lg tracking-wider">
                                KAYDET
                            </Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </View>
        </Modal>
    );
}
