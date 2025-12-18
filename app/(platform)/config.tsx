import { View, Text, ScrollView, Pressable, TextInput, Switch, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, Keyboard, InputAccessoryView, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Settings, ChevronLeft, Percent, Users, Calendar, Crown, Wallet, Save, RefreshCw } from 'lucide-react-native';
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

interface ConfigItem {
    key: string;
    value: string;
    description?: string;
    category?: string;
}

// Components defined outside to prevent re-renders losing focus
const ConfigSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View className="mb-6">
        <Text className="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-3 ml-1">{title}</Text>
        <View className="bg-[#1E1E1E] rounded-xl overflow-hidden border border-white/5">
            {children}
        </View>
    </View>
);

const ConfigRow = ({
    icon: Icon,
    label,
    value,
    onChangeText,
    suffix,
    isLast
}: {
    icon: any;
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    suffix?: string;
    isLast?: boolean;
}) => (
    <View className={`flex-row items-center p-4 ${!isLast ? 'border-b border-white/5' : ''}`}>
        <View className="w-9 h-9 rounded-lg bg-[#d4af35]/10 items-center justify-center mr-3">
            <Icon size={16} color="#d4af35" />
        </View>
        <Text className="text-white flex-1 text-sm">{label}</Text>
        <View className="flex-row items-center gap-1">
            <TextInput
                value={value}
                onChangeText={onChangeText}
                keyboardType="numeric"
                returnKeyType="done"
                onSubmitEditing={Keyboard.dismiss}
                inputAccessoryViewID={Platform.OS === 'ios' ? 'numericInputAccessory' : undefined}
                className="text-[#d4af35] text-right font-bold text-base bg-[#2a2a2a] px-3 py-1.5 rounded-lg min-w-[60px]"
                placeholderTextColor="#6B7280"
            />
            {suffix && <Text className="text-gray-500 text-sm ml-1">{suffix}</Text>}
        </View>
    </View>
);

const ToggleRow = ({
    icon: Icon,
    label,
    value,
    onValueChange,
    isLast
}: {
    icon: any;
    label: string;
    value: boolean;
    onValueChange: (value: boolean) => void;
    isLast?: boolean;
}) => (
    <View className={`flex-row items-center p-4 ${!isLast ? 'border-b border-white/5' : ''}`}>
        <View className="w-9 h-9 rounded-lg bg-[#d4af35]/10 items-center justify-center mr-3">
            <Icon size={16} color="#d4af35" />
        </View>
        <Text className="text-white flex-1 text-sm">{label}</Text>
        <Switch
            value={value}
            onValueChange={onValueChange}
            trackColor={{ false: '#374151', true: '#d4af35' }}
            thumbColor={'white'}
        />
    </View>
);

export default function PlatformConfigScreen() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Config state
    const [config, setConfig] = useState<Record<string, string>>({
        commission_rate: '10',
        silver_price: '499',
        gold_price: '999',
        platinum_price: '1999',
        silver_staff_limit: '5',
        gold_staff_limit: '15',
        platinum_staff_limit: '999',
        silver_appointment_limit: '100',
        gold_appointment_limit: '999',
        platinum_appointment_limit: '999',
        trial_days: '14',
        max_images_per_business: '20',
        auto_approve_businesses: 'false',
    });

    const updateConfig = (key: string, value: string) => {
        setConfig(prev => ({ ...prev, [key]: value }));
    };

    // Fetch config from database
    const fetchConfig = useCallback(async () => {
        setLoading(true);
        try {
            const { data, error } = await (supabase
                .from('platform_config') as any)
                .select('key, value');

            if (error) {
                console.error('Config fetch error:', error);
                return;
            }

            if (data) {
                const configMap: any = {};
                data.forEach((item: ConfigItem) => {
                    configMap[item.key] = item.value;
                });
                setConfig(prev => ({ ...prev, ...configMap }));
            }
        } catch (err) {
            console.error('Config fetch error:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchConfig();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            // Update each config value
            const updates = Object.entries(config).map(async ([key, value]) => {
                const { error } = await (supabase
                    .from('platform_config') as any)
                    .update({ value: String(value) })
                    .eq('key', key);

                if (error) {
                    console.error(`Error updating ${key}:`, error);
                }
            });

            await Promise.all(updates);
            Alert.alert('Başarılı', 'Platform yapılandırması kaydedildi.');
        } catch (err) {
            console.error('Save error:', err);
            Alert.alert('Hata', 'Kaydetme sırasında bir hata oluştu.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <SafeAreaView className="flex-1 bg-[#121212] items-center justify-center" edges={['top']}>
                <ActivityIndicator size="large" color="#d4af35" />
                <Text className="text-gray-500 mt-4">Yapılandırma yükleniyor...</Text>
            </SafeAreaView>
        );
    }

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={80}>
            <SafeAreaView className="flex-1 bg-[#121212]" edges={['top']}>
                {/* Header */}
                <View className="px-4 py-3 flex-row items-center gap-3 border-b border-white/5">
                    <Pressable
                        onPress={() => router.back()}
                        className="w-10 h-10 rounded-full bg-[#1E1E1E] items-center justify-center border border-white/10"
                    >
                        <ChevronLeft size={20} color="#fff" />
                    </Pressable>
                    <View className="flex-row items-center gap-3 flex-1">
                        <View className="w-10 h-10 rounded-full bg-[#d4af35] items-center justify-center">
                            <Settings size={20} color="#121212" />
                        </View>
                        <View>
                            <Text className="text-white text-lg font-bold">Platform Yapılandırması</Text>
                            <Text className="text-gray-500 text-xs">Komisyon, limitler ve fiyatlar</Text>
                        </View>
                    </View>
                </View>

                <ScrollView className="flex-1 px-4 pt-4 pb-20" keyboardShouldPersistTaps="handled">
                    {/* Komisyon */}
                    <ConfigSection title="KOMİSYON">
                        <ConfigRow
                            icon={Percent}
                            label="Platform Komisyonu"
                            value={config.commission_rate}
                            onChangeText={(v) => updateConfig('commission_rate', v)}
                            suffix="%"
                            isLast
                        />
                    </ConfigSection>

                    {/* Plan Fiyatları */}
                    <ConfigSection title="PLAN FİYATLARI (₺/AY)">
                        <ConfigRow
                            icon={Crown}
                            label="Silver"
                            value={config.silver_price}
                            onChangeText={(v) => updateConfig('silver_price', v)}
                            suffix="₺"
                        />
                        <ConfigRow
                            icon={Crown}
                            label="Gold"
                            value={config.gold_price}
                            onChangeText={(v) => updateConfig('gold_price', v)}
                            suffix="₺"
                        />
                        <ConfigRow
                            icon={Crown}
                            label="Platinum"
                            value={config.platinum_price}
                            onChangeText={(v) => updateConfig('platinum_price', v)}
                            suffix="₺"
                            isLast
                        />
                    </ConfigSection>

                    {/* Personel Limitleri */}
                    <ConfigSection title="PERSONEL LİMİTLERİ">
                        <ConfigRow
                            icon={Users}
                            label="Silver"
                            value={config.silver_staff_limit}
                            onChangeText={(v) => updateConfig('silver_staff_limit', v)}
                            suffix="kişi"
                        />
                        <ConfigRow
                            icon={Users}
                            label="Gold"
                            value={config.gold_staff_limit}
                            onChangeText={(v) => updateConfig('gold_staff_limit', v)}
                            suffix="kişi"
                        />
                        <ConfigRow
                            icon={Users}
                            label="Platinum"
                            value={config.platinum_staff_limit}
                            onChangeText={(v) => updateConfig('platinum_staff_limit', v)}
                            suffix="kişi"
                            isLast
                        />
                    </ConfigSection>

                    {/* Genel Ayarlar */}
                    <ConfigSection title="GENEL AYARLAR">
                        <ConfigRow
                            icon={Calendar}
                            label="Deneme Süresi"
                            value={config.trial_days}
                            onChangeText={(v) => updateConfig('trial_days', v)}
                            suffix="gün"
                        />
                        <ConfigRow
                            icon={Wallet}
                            label="Max Galeri Resmi"
                            value={config.max_images_per_business}
                            onChangeText={(v) => updateConfig('max_images_per_business', v)}
                            suffix="adet"
                        />
                        <ToggleRow
                            icon={RefreshCw}
                            label="Otomatik İşletme Onayı"
                            value={config.auto_approve_businesses === 'true'}
                            onValueChange={(v) => updateConfig('auto_approve_businesses', v ? 'true' : 'false')}
                            isLast
                        />
                    </ConfigSection>
                </ScrollView>

                {/* iOS Numeric Keyboard Accessory View */}
                {Platform.OS === 'ios' && (
                    <InputAccessoryView nativeID="numericInputAccessory">
                        <View className="bg-[#D1D3D9] flex-row justify-end px-4 py-2 border-t border-gray-300">
                            <Button
                                onPress={() => Keyboard.dismiss()}
                                title="Tamam"
                                color="#007AFF"
                            />
                        </View>
                    </InputAccessoryView>
                )}

                {/* Fixed Save Button */}
                <View className="p-4 bg-[#121212] border-t border-white/10">
                    <Pressable
                        onPress={handleSave}
                        disabled={saving}
                        className={`bg-[#d4af35] rounded-xl py-4 flex-row items-center justify-center gap-2 ${saving ? 'opacity-50' : ''}`}
                    >
                        {saving ? (
                            <ActivityIndicator size="small" color="#121212" />
                        ) : (
                            <Save size={18} color="#121212" />
                        )}
                        <Text className="text-[#121212] font-bold text-base">{saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}</Text>
                    </Pressable>
                </View>
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
}
