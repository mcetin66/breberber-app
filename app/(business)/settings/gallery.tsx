import { View, Text, Pressable, ScrollView, Switch, Image, TextInput } from 'react-native';
import { StandardScreen } from '@/components/ui/StandardScreen';
import { COLORS } from '@/constants/theme';
import { Settings, ChevronDown, Edit2, ImagePlus, Check, ArrowRight, ShieldAlert } from 'lucide-react-native';
import { useState } from 'react';

const TABS = ['Yükleme', 'Onay Bekleyen', 'Yayınlanan'];
const TAGS = ['Saç Kesimi', 'Sakal', 'Cilt Bakımı', 'Boya'];

export default function BusinessGalleryScreen() {
    const [activeTab, setActiveTab] = useState('Yükleme');
    const [selectedTags, setSelectedTags] = useState<string[]>(['Saç Kesimi', 'Sakal']);
    const [hasConsent, setHasConsent] = useState(false);

    const toggleTag = (tag: string) => {
        if (selectedTags.includes(tag)) {
            setSelectedTags(selectedTags.filter(t => t !== tag));
        } else {
            setSelectedTags([...selectedTags, tag]);
        }
    };

    return (
        <StandardScreen
            title="Galeri Yönetimi"
            rightElement={
                <Pressable className="w-10 h-10 items-center justify-center">
                    <Settings size={24} color="#b6b1a0" />
                </Pressable>
            }
            footer={
                <Pressable className="w-full h-14 rounded-xl bg-[#d4af35] flex-row items-center justify-center gap-2 shadow-lg shadow-[#d4af35]/40 active:scale-[0.98]">
                    <Text className="text-black font-bold text-lg">Galeriye Yayınla</Text>
                    <ArrowRight size={24} color="black" />
                </Pressable>
            }
        >
            {/* Tabs */}
            <View className="flex-row border-b border-white/10 mb-6">
                {TABS.map(tab => (
                    <Pressable
                        key={tab}
                        onPress={() => setActiveTab(tab)}
                        className={`flex-1 items-center justify-center pb-3 pt-2 border-b-2 ${activeTab === tab ? 'border-[#d4af35]' : 'border-transparent'}`}
                    >
                        <Text className={`text-sm font-bold ${activeTab === tab ? 'text-[#d4af35]' : 'text-gray-500'}`}>{tab}</Text>
                    </Pressable>
                ))}
            </View>

            <View className="mb-4">
                <Text className="text-2xl font-bold text-white mb-1">Yeni Dönüşüm</Text>
                <Text className="text-gray-400 text-sm">Öncesi ve sonrası fotoğraflarını seçerek başlayın.</Text>
            </View>

            {/* Customer Selector */}
            <View className="mb-6 gap-2">
                <Text className="text-[#b6b1a0] text-sm font-medium pl-1">Müşteri Seçimi</Text>
                <View className="relative">
                    <View className="w-full h-14 bg-[#1E1E1E] border border-white/10 rounded-xl px-4 flex-row items-center justify-between">
                        <Text className="text-white text-base">Ahmet Yılmaz - 14:30</Text>
                        <ChevronDown size={20} color={COLORS.primary.DEFAULT} />
                    </View>
                </View>
            </View>

            {/* Image Grid */}
            <View className="flex-row gap-4 mb-6">
                {/* Before Image */}
                <View className="flex-1 aspect-[3/4] bg-[#1E1E1E] rounded-xl border border-white/10 overflow-hidden relative group">
                    <Image
                        source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }}
                        className="w-full h-full opacity-60"
                    />
                    <View className="absolute top-3 left-3 bg-black/60 px-2 py-1 rounded border border-white/10">
                        <Text className="text-white text-xs font-bold uppercase">ÖNCESİ</Text>
                    </View>
                    <View className="absolute inset-0 items-center justify-center">
                        <View className="bg-white/20 p-3 rounded-full backdrop-blur-md">
                            <Edit2 size={24} color="white" />
                        </View>
                    </View>
                </View>

                {/* After Image (Empty) */}
                <View className="flex-1 aspect-[3/4] bg-[#1E1E1E] rounded-xl border-2 border-dashed border-white/10 items-center justify-center gap-2">
                    <View className="absolute top-3 left-3 bg-[#d4af35]/20 px-2 py-1 rounded border border-[#d4af35]/20">
                        <Text className="text-[#d4af35] text-xs font-bold uppercase">SONRASI</Text>
                    </View>
                    <View className="w-12 h-12 rounded-full bg-white/5 items-center justify-center">
                        <ImagePlus size={28} color="gray" />
                    </View>
                    <Text className="text-gray-500 text-xs font-medium">Fotoğraf Yükle</Text>
                </View>
            </View>

            {/* Tags */}
            <View className="mb-6 gap-3">
                <Text className="text-[#b6b1a0] text-sm font-medium pl-1">Yapılan İşlemler</Text>
                <View className="flex-row flex-wrap gap-2">
                    {TAGS.map(tag => {
                        const isSelected = selectedTags.includes(tag);
                        return (
                            <Pressable
                                key={tag}
                                onPress={() => toggleTag(tag)}
                                className={`px-4 py-2 rounded-lg border ${isSelected
                                        ? 'bg-[#d4af35] border-[#d4af35]'
                                        : 'bg-[#1E1E1E] border-white/10'
                                    }`}
                            >
                                <Text className={`text-sm font-medium ${isSelected ? 'text-black' : 'text-gray-400'}`}>
                                    {tag}
                                </Text>
                            </Pressable>
                        )
                    })}
                </View>
            </View>

            {/* Consent */}
            <View className="mb-8 rounded-xl bg-[#1E1E1E] p-4 border border-white/5 flex-row items-start gap-4">
                <View className="mt-1 rounded-full bg-[#d4af35]/10 p-2">
                    <ShieldAlert size={20} color={COLORS.primary.DEFAULT} />
                </View>
                <View className="flex-1">
                    <Text className="text-white text-sm font-bold mb-1">Müşteri İzni</Text>
                    <Text className="text-xs text-gray-400 leading-relaxed mb-3">
                        Fotoğrafların sosyal medyada ve uygulama galerisinde paylaşılması için müşteriden sözlü/yazılı izin alındığını onaylıyorum.
                    </Text>
                    <View className="flex-row items-center gap-3">
                        <Switch
                            value={hasConsent}
                            onValueChange={setHasConsent}
                            trackColor={{ false: '#374151', true: COLORS.primary.DEFAULT }}
                            thumbColor={hasConsent ? '#121212' : '#f4f3f4'}
                        />
                        <Text className="text-sm font-medium text-white">İzin Alındı</Text>
                    </View>
                </View>
            </View>

        </StandardScreen>
    );
}
