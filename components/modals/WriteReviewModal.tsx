import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { reviewService } from '@/services/reviews';
import { useAuthStore } from '@/stores/authStore';

interface WriteReviewModalProps {
    visible: boolean;
    onClose: () => void;
    booking: any;
    onSuccess: () => void;
}

export default function WriteReviewModal({ visible, onClose, booking, onSuccess }: WriteReviewModalProps) {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);
    const { user } = useAuthStore();

    const handleSubmit = async () => {
        if (rating === 0) {
            Alert.alert('Hata', 'Lütfen puan verin.');
            return;
        }

        setLoading(true);
        try {
            await reviewService.create({
                booking_id: booking.id,
                business_id: booking.business_id || booking.barberId,
                staff_id: booking.staff_id || booking.staffId,
                customer_id: user?.id,
                rating,
                comment,
                // rating etc. handled by mapper if field names match domain or DB
            });

            Alert.alert('Teşekkürler', 'Yorumunuz başarıyla gönderildi.');
            onSuccess();
            onClose();
        } catch (error: any) {
            console.error(error);
            Alert.alert('Hata', 'Yorum gönderilirken bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View className="flex-1 justify-end bg-black/50">
                <View className="bg-[#1E1E1E] rounded-t-3xl p-6 h-[70%]">
                    {/* Header */}
                    <View className="flex-row justify-between items-center mb-6">
                        <Text className="text-white text-xl font-bold">Değerlendir</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={24} color="#9CA3AF" />
                        </TouchableOpacity>
                    </View>

                    {/* Business Info */}
                    <View className="mb-6">
                        <Text className="text-gray-400 mb-1">İşletme</Text>
                        <Text className="text-white text-lg font-semibold">{booking?.businessName || 'Kuaför'}</Text>
                    </View>

                    {/* Star Rating */}
                    <View className="flex-row justify-center mb-8 space-x-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <TouchableOpacity key={star} onPress={() => setRating(star)}>
                                <Ionicons
                                    name={star <= rating ? 'star' : 'star-outline'}
                                    size={40}
                                    color="#D4AF37"
                                />
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Comment Input */}
                    <Text className="text-gray-400 mb-2">Yorumunuz (İsteğe bağlı)</Text>
                    <TextInput
                        className="bg-[#121212] text-white p-4 rounded-xl h-32 mb-6"
                        placeholder="Deneyiminizi anlatın..."
                        placeholderTextColor="#6B7280"
                        multiline
                        textAlignVertical="top"
                        value={comment}
                        onChangeText={setComment}
                    />

                    {/* Submit Button */}
                    <TouchableOpacity
                        className={`bg-[#D4AF37] p-4 rounded-xl items-center ${loading ? 'opacity-50' : ''}`}
                        onPress={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#000" />
                        ) : (
                            <Text className="text-black font-bold text-lg">Gönder</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}
