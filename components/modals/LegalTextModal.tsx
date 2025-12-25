import React from 'react';
import { View, Text, ScrollView, Pressable, Modal } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '@/constants/theme';

interface LegalTextModalProps {
    visible: boolean;
    onClose: () => void;
    onAccept?: () => void;
    type: 'kvkk' | 'terms' | 'marketing';
}

const LEGAL_CONTENT = {
    kvkk: {
        title: 'KVKK Aydınlatma Metni',
        content: `KVKK AYDINLATMA METNİ

Breberber olarak kişisel verilerinizin güvenliği konusunda azami hassasiyet göstermekteyiz.

1. VERİ SORUMLUSU
Breberber uygulaması olarak, 6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında veri sorumlusu sıfatıyla hareket etmekteyiz.

2. KİŞİSEL VERİLERİN İŞLENME AMACI
Kişisel verileriniz;
- Randevu oluşturma ve yönetimi
- Hizmet kalitesinin artırılması
- Kullanıcı deneyiminin iyileştirilmesi
- Yasal yükümlülüklerin yerine getirilmesi
amaçlarıyla işlenmektedir.

3. KİŞİSEL VERİLERİN AKTARILMASI
Kişisel verileriniz, hizmet aldığınız işletmeler ve yasal zorunluluklar çerçevesinde yetkili kurum ve kuruluşlarla paylaşılabilmektedir.

4. KİŞİSEL VERİ TOPLAMA YÖNTEMİ
Kişisel verileriniz, mobil uygulama üzerinden elektronik ortamda toplanmaktadır.

5. HAKLARINIZ
KVKK'nın 11. maddesi uyarınca;
- Kişisel verilerinizin işlenip işlenmediğini öğrenme
- İşlenmişse buna ilişkin bilgi talep etme
- Kişisel verilerinizin silinmesini isteme
haklarına sahipsiniz.

İletişim: destek@breberber.com`
    },
    terms: {
        title: 'Üyelik Sözleşmesi',
        content: `ÜYELİK SÖZLEŞMESİ

1. TARAFLAR
Bu sözleşme, Breberber uygulaması ile kullanıcı arasında akdedilmiştir.

2. HİZMETİN TANIMI
Breberber, berber, kuaför ve güzellik salonlarından online randevu alınmasını sağlayan bir platformdur.

3. ÜYELİK ŞARTLARI
- 18 yaşından büyük olmak
- Doğru ve güncel bilgi vermek
- Hesap güvenliğini sağlamak

4. KULLANICI YÜKÜMLÜLÜKLERİ
- Randevulara zamanında gitmek
- İptal durumunda en az 2 saat önceden bildirim yapmak
- Platform kurallarına uymak

5. RANDEVU KURALLARI
- Randevular işletme tarafından onaylandıktan sonra kesinleşir
- Üst üste 3 gelmeme durumunda hesap askıya alınabilir
- İptal politikaları işletmeye göre değişiklik gösterebilir

6. SORUMLULUK SINIRI
Breberber, işletmelerin sunduğu hizmetlerin kalitesinden sorumlu değildir. Platform yalnızca aracılık hizmeti sunmaktadır.

7. SÖZLEŞMENİN FESHİ
Kullanıcı, dilediği zaman hesabını kapatabilir. Breberber, kural ihlali durumunda hesabı askıya alabilir.

8. UYUŞMAZLIK ÇÖZÜMÜ
Bu sözleşmeden doğan uyuşmazlıklarda İstanbul Mahkemeleri yetkilidir.

Yürürlük Tarihi: Ocak 2025`
    },
    marketing: {
        title: 'Kampanya İzinleri',
        content: `KAMPANYA VE İLETİŞİM İZİNLERİ

Bu izni vererek aşağıdaki iletişimleri almayı kabul edersiniz:

1. RANDEVU BİLDİRİMLERİ
- Randevu hatırlatmaları (24 saat ve 1 saat önce)
- Randevu onay/iptal bildirimleri
- Randevu değişiklik bildirimleri

2. KAMPANYA BİLDİRİMLERİ
- Özel indirimler ve fırsatlar
- Yeni hizmet duyuruları
- Sadakat programı güncellemeleri

3. GENEL BİLDİRİMLER
- Uygulama güncellemeleri
- Önemli duyurular
- Anket ve geri bildirim talepleri

4. İLETİŞİM KANALLARI
- Push bildirimler
- SMS mesajları
- E-posta

5. İZNİN GERİ ÇEKİLMESİ
Bu izni istediğiniz zaman ayarlar menüsünden veya destek@breberber.com adresine e-posta göndererek geri çekebilirsiniz.

Not: Randevu bildirimleri, hizmetin doğası gereği zorunludur ve bu izinden bağımsızdır.`
    }
};

export function LegalTextModal({ visible, onClose, onAccept, type }: LegalTextModalProps) {
    const content = LEGAL_CONTENT[type];

    const handleAccept = () => {
        onAccept?.();
        onClose();
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={onClose}
        >
            <View className="flex-1 bg-[#121212]">
                {/* Header */}
                <View className="flex-row items-center justify-between px-4 py-4 border-b border-white/5">
                    <View className="w-10" />
                    <Text className="text-white text-lg font-bold">{content.title}</Text>
                    <Pressable
                        onPress={onClose}
                        className="w-10 h-10 items-center justify-center rounded-full bg-[#1E1E1E]"
                    >
                        <MaterialIcons name="close" size={20} color="white" />
                    </Pressable>
                </View>

                {/* Content */}
                <ScrollView className="flex-1 px-4 py-4">
                    <Text className="text-gray-300 text-sm leading-relaxed">
                        {content.content}
                    </Text>
                </ScrollView>

                <View className="p-4 border-t border-white/5">
                    <Pressable
                        onPress={handleAccept}
                        className="w-full py-4 rounded-xl bg-primary items-center justify-center"
                    >
                        <Text className="text-black font-bold text-base">Okudum, Anladım</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    );
}
