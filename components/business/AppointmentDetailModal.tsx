import React from 'react';
import { View, Text, Modal, Pressable } from 'react-native';
import { X, Clock, User, Scissors, DollarSign, Calendar as CalendarIcon, Phone, Lock } from 'lucide-react-native';
import { COLORS } from '@/constants/theme';

interface AppointmentDetailModalProps {
    visible: boolean;
    appointment: any;
    onClose: () => void;
    onDelete?: (id: string) => void;
}

export const AppointmentDetailModal = ({ visible, appointment, onClose, onDelete }: AppointmentDetailModalProps) => {
    if (!appointment) return null;

    // Format Time: Remove seconds (09:00:00 -> 09:00)
    const formatTime = (time: string) => time?.slice(0, 5) || '--:--';

    // Format Date: Turkish Format
    const formatDate = (dateStr: string) => {
        if (!dateStr) return '';
        try {
            const date = new Date(dateStr);
            return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', weekday: 'long' });
        } catch {
            return dateStr;
        }
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onDismiss={onClose}
            onRequestClose={onClose}
        >
            <Pressable className="flex-1 bg-black/60 justify-center items-center p-4" onPress={onClose}>
                <Pressable className="bg-[#1E1E1E] w-full max-w-sm rounded-2xl border border-white/10 overflow-hidden" onPress={(e) => e.stopPropagation()}>

                    {/* Header */}
                    <View className="px-5 py-4 border-b border-white/10 flex-row items-center justify-between bg-[#121212]">
                        <View>
                            <Text className="text-white text-lg font-poppins-bold">Randevu Detayı</Text>
                            <Text className="text-gray-400 text-xs font-poppins">{formatDate(appointment.bookingDate || appointment.date)}</Text>
                        </View>
                        <Pressable onPress={onClose} className="w-8 h-8 rounded-full bg-white/5 items-center justify-center">
                            <X size={18} color="white" />
                        </Pressable>
                    </View>

                    {/* Content */}
                    <View className="p-5 gap-4">
                        {appointment.status === 'blocked' ? (
                            <View className="items-center justify-center py-4">
                                <View className="w-16 h-16 rounded-full bg-[#2A2A2A] items-center justify-center mb-4 border border-white/10">
                                    <Clock size={32} color={COLORS.text.secondary} />
                                </View>
                                {/* Display Block Reason */}
                                <Text className="text-white text-xl font-bold text-center">{appointment.customerName || 'Saat Kapalı'}</Text>
                                <Text className="text-gray-400 text-center mt-2 mb-6">
                                    {formatTime(appointment.startTime)} - {formatTime(appointment.endTime)} arası kapatılmıştır.
                                </Text>

                                {onDelete && (
                                    <Pressable
                                        onPress={() => onDelete(appointment.id)}
                                        className="w-full bg-red-500/10 border border-red-500/50 py-4 rounded-xl items-center active:bg-red-500/20 flex-row justify-center gap-2"
                                    >
                                        <X size={20} color="#ef4444" />
                                        <Text className="text-red-500 font-bold text-base">Saati Geri Aç</Text>
                                    </Pressable>
                                )}
                            </View>
                        ) : (
                            <>
                                {/* Status Badge */}
                                <View className="flex-row items-center justify-center mb-2">
                                    <View className={`px-3 py-1 rounded-full ${appointment.status === 'confirmed' ? 'bg-green-500/20' :
                                        appointment.status === 'cancelled' ? 'bg-red-500/20' : 'bg-yellow-500/20'
                                        }`}>
                                        <Text className={`text-xs font-bold uppercase ${appointment.status === 'confirmed' ? 'text-green-500' :
                                            appointment.status === 'cancelled' ? 'text-red-500' : 'text-yellow-500'
                                            }`}>
                                            {appointment.status === 'confirmed' ? 'Onaylandı' :
                                                appointment.status === 'cancelled' ? 'İptal Edildi' : 'Beklemede'}
                                        </Text>
                                    </View>
                                </View>

                                {/* Time Section */}
                                <View className="flex-row items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
                                    <View className="w-10 h-10 rounded-full bg-blue-500/10 items-center justify-center">
                                        <Clock size={20} color="#3b82f6" />
                                    </View>
                                    <View>
                                        <Text className="text-gray-400 text-xs font-poppins">Saat</Text>
                                        <Text className="text-white text-base font-poppins-semibold">
                                            {formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}
                                        </Text>
                                    </View>
                                </View>

                                {/* Customer Section */}
                                <View className="flex-row items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
                                    <View className="w-10 h-10 rounded-full bg-purple-500/10 items-center justify-center">
                                        <User size={20} color="#a855f7" />
                                    </View>
                                    <View className="flex-1">
                                        <Text className="text-gray-400 text-xs font-poppins">Müşteri</Text>
                                        <Text className="text-white text-base font-poppins-semibold">{appointment.customerName || 'Misafir'}</Text>
                                        {appointment.customerPhone && (
                                            <View className="flex-row items-center mt-1">
                                                <Phone size={12} color="#94a3b8" />
                                                <Text className="text-gray-400 text-xs ml-1">{appointment.customerPhone}</Text>
                                            </View>
                                        )}
                                    </View>
                                </View>

                                {/* Service Section */}
                                <View className="flex-row items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
                                    <View className="w-10 h-10 rounded-full bg-orange-500/10 items-center justify-center">
                                        <Scissors size={20} color="#f97316" />
                                    </View>
                                    <View className="flex-1">
                                        <Text className="text-gray-400 text-xs font-poppins">Hizmet & Personel</Text>
                                        <Text className="text-white text-base font-poppins-semibold">{appointment.serviceName}</Text>
                                        <Text className="text-gray-400 text-sm mt-0.5">{appointment.staffName}</Text>
                                    </View>
                                    <View className="items-end">
                                        <Text className="text-primary text-lg font-poppins-bold">₺{appointment.totalPrice}</Text>
                                    </View>
                                </View>
                            </>
                        )}
                    </View>

                    {/* Footer Actions */}
                    <View className="p-5 pt-0">
                        {appointment.status !== 'blocked' && (
                            <Pressable onPress={onClose} className="w-full bg-primary py-3 rounded-xl items-center active:scale-95 transition-transform">
                                <Text className="text-white font-poppins-bold">Tamam</Text>
                            </Pressable>
                        )}
                    </View>

                </Pressable>
            </Pressable>
        </Modal>
    );
};
