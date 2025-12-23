import React, { useState } from 'react';
import { View, Text, Modal, Pressable, TextInput, Alert, ActivityIndicator } from 'react-native';
import { Star, X, Send } from 'lucide-react-native';
import { reviewService } from '@/services/reviews';
import { COLORS } from '@/constants/theme';

interface WriteReviewModalProps {
    visible: boolean;
    onClose: () => void;
    bookingId: string;
    businessId: string;
    staffId?: string;
    customerId: string;
    businessName: string;
    onSuccess?: () => void;
}

export function WriteReviewModal({
    visible,
    onClose,
    bookingId,
    businessId,
    staffId,
    customerId,
    businessName,
    onSuccess
}: WriteReviewModalProps) {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (rating === 0) {
            Alert.alert('Uyarı', 'Lütfen bir puan verin.');
            return;
        }

        setLoading(true);
        try {
            await reviewService.create({
                booking_id: bookingId,
                business_id: businessId,
                staff_id: staffId || null,
                customer_id: customerId,
                rating,
                comment: comment.trim() || null,
            });

            Alert.alert('Başarılı', 'Yorumunuz gönderildi. Teşekkürler!', [
                {
                    text: 'Tamam', onPress: () => {
                        setRating(0);
                        setComment('');
                        onClose();
                        onSuccess?.();
                    }
                }
            ]);
        } catch (error) {
            console.error('Review error:', error);
            Alert.alert('Hata', 'Yorum gönderilirken bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    const renderStars = () => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <Pressable key={i} onPress={() => setRating(i)} className="p-1">
                    <Star
                        size={36}
                        color={i <= rating ? COLORS.primary.DEFAULT : '#4B5563'}
                        fill={i <= rating ? COLORS.primary.DEFAULT : 'transparent'}
                    />
                </Pressable>
            );
        }
        return stars;
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent
            onRequestClose={onClose}
        >
            <View className="flex-1 bg-black/70 justify-end">
                <View className="bg-[#1E1E1E] rounded-t-3xl px-5 pt-6 pb-10">
                    {/* Header */}
                    <View className="flex-row items-center justify-between mb-6">
                        <View>
                            <Text className="text-white text-xl font-bold">Değerlendirme</Text>
                            <Text className="text-gray-500 text-sm mt-1">{businessName}</Text>
                        </View>
                        <Pressable
                            onPress={onClose}
                            className="w-10 h-10 rounded-full bg-[#2A2A2A] items-center justify-center"
                        >
                            <X size={20} color="#9CA3AF" />
                        </Pressable>
                    </View>

                    {/* Stars */}
                    <View className="items-center mb-6">
                        <Text className="text-gray-400 text-sm mb-3">Deneyiminizi nasıl değerlendirirsiniz?</Text>
                        <View className="flex-row gap-1">
                            {renderStars()}
                        </View>
                        {rating > 0 && (
                            <Text className="text-primary text-sm font-medium mt-2">
                                {rating === 1 && 'Kötü'}
                                {rating === 2 && 'Orta'}
                                {rating === 3 && 'İyi'}
                                {rating === 4 && 'Çok İyi'}
                                {rating === 5 && 'Mükemmel'}
                            </Text>
                        )}
                    </View>

                    {/* Comment */}
                    <View className="mb-6">
                        <Text className="text-gray-400 text-sm mb-2">Yorumunuz (İsteğe bağlı)</Text>
                        <TextInput
                            className="bg-[#2A2A2A] rounded-xl p-4 text-white text-base min-h-[100px] border border-white/5"
                            placeholder="Deneyiminizi paylaşın..."
                            placeholderTextColor="#6B7280"
                            multiline
                            textAlignVertical="top"
                            value={comment}
                            onChangeText={setComment}
                            maxLength={500}
                        />
                        <Text className="text-gray-600 text-xs text-right mt-1">{comment.length}/500</Text>
                    </View>

                    {/* Submit Button */}
                    <Pressable
                        onPress={handleSubmit}
                        disabled={loading || rating === 0}
                        className={`w-full h-14 rounded-xl flex-row items-center justify-center gap-2 ${rating > 0 ? 'bg-primary' : 'bg-gray-700'
                            }`}
                    >
                        {loading ? (
                            <ActivityIndicator color="#121212" />
                        ) : (
                            <>
                                <Send size={20} color="#121212" />
                                <Text className="text-[#121212] font-bold text-base">Gönder</Text>
                            </>
                        )}
                    </Pressable>
                </View>
            </View>
        </Modal>
    );
}
