// Rol bazlı yasal metinler
// Her rol için ayrı KVKK, Sözleşme ve Kampanya metinleri

export type LegalTextType = 'kvkk' | 'terms' | 'marketing' | 'commercial';

export interface LegalText {
    title: string;
    content: string;
    required: boolean;
}

export type RoleLegalTexts = {
    [key in LegalTextType]?: LegalText;
};

// ============ MÜŞTERİ ============
const CUSTOMER_LEGAL: RoleLegalTexts = {
    kvkk: {
        title: 'KVKK Aydınlatma Metni',
        required: true,
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
        title: 'Kullanım Koşulları',
        required: true,
        content: `KULLANIM KOŞULLARI

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

Yürürlük Tarihi: Ocak 2025`
    },
    marketing: {
        title: 'Kampanya İzinleri',
        required: false,
        content: `KAMPANYA VE İLETİŞİM İZİNLERİ

Bu izni vererek aşağıdaki iletişimleri almayı kabul edersiniz:

1. RANDEVU BİLDİRİMLERİ
- Randevu hatırlatmaları
- Randevu onay/iptal bildirimleri

2. KAMPANYA BİLDİRİMLERİ
- Özel indirimler ve fırsatlar
- Yeni hizmet duyuruları

3. İLETİŞİM KANALLARI
- Push bildirimler
- SMS mesajları
- E-posta

Bu izni istediğiniz zaman ayarlar menüsünden geri çekebilirsiniz.`
    }
};

// ============ İŞLETME SAHİBİ ============
const BUSINESS_LEGAL: RoleLegalTexts = {
    kvkk: {
        title: 'KVKK Aydınlatma Metni',
        required: true,
        content: `TİCARİ KVKK AYDINLATMA METNİ

Breberber olarak işletme sahiplerinin kişisel verilerinin korunması konusunda azami hassasiyet göstermekteyiz.

1. VERİ SORUMLUSU
Breberber platformu olarak 6698 sayılı KVKK kapsamında veri sorumlusu sıfatıyla hareket etmekteyiz.

2. İŞLENEN VERİLER
- Kimlik bilgileri (ad, soyad, TC kimlik no)
- İletişim bilgileri (telefon, e-posta, adres)
- İşletme bilgileri (işletme adı, vergi no, banka bilgileri)
- Finansal veriler (ciro, randevu istatistikleri)

3. VERİ İŞLEME AMAÇLARI
- Platform hizmetlerinin sunulması
- Ödeme ve mutabakat işlemleri
- Yasal yükümlülüklerin yerine getirilmesi
- Hizmet kalitesinin artırılması

4. HAKLARINIZ
KVKK'nın 11. maddesi kapsamındaki tüm haklarınız saklıdır.

İletişim: isletme@breberber.com`
    },
    commercial: {
        title: 'Ticari Sözleşme',
        required: true,
        content: `TİCARİ HİZMET SÖZLEŞMESİ

1. TARAFLAR
Bu sözleşme Breberber platformu ile işletme sahibi arasında akdedilmiştir.

2. HİZMET KAPSAMI
- Online randevu yönetim sistemi
- Müşteri yönetimi araçları
- İstatistik ve raporlama
- Mobil uygulama erişimi

3. ÜCRETLER VE ÖDEME
- Platform kullanım ücreti aylık/yıllık abonelik şeklindedir
- Fiyatlar güncel tarife üzerinden belirlenir
- Ödemeler her ayın ilk haftası içinde yapılmalıdır

4. İŞLETME YÜKÜMLÜLÜKLERİ
- Güncel ve doğru bilgi sağlamak
- Müşteri randevularını yönetmek
- Platform kurallarına uymak
- Yasal gereklilikleri karşılamak

5. FESİH
- Her iki taraf 30 gün önceden bildirimle sözleşmeyi feshedebilir
- Kural ihlali durumunda Breberber hesabı askıya alabilir

6. GİZLİLİK
Müşteri verileri işletme tarafından 3. şahıslarla paylaşılamaz.

7. SORUMLULUK
İşletme, sunduğu hizmetlerin kalitesinden tamamen sorumludur.

Yürürlük Tarihi: Ocak 2025`
    },
    marketing: {
        title: 'Ticari İletişim İzni',
        required: false,
        content: `TİCARİ İLETİŞİM İZNİ

Bu izni vererek aşağıdaki iletişimleri almayı kabul edersiniz:

1. PLATFORM GÜNCELLEMELERİ
- Yeni özellik duyuruları
- Sistem bakım bildirimleri

2. TİCARİ TEKLİFLER
- Özel kampanyalar
- Abonelik fırsatları

3. EĞİTİM VE DESTEK
- Kullanım ipuçları
- Eğitim içerikleri

Bu izni istediğiniz zaman ayarlar menüsünden geri çekebilirsiniz.`
    }
};

// ============ EXPORT ============
export const LEGAL_TEXTS = {
    customer: CUSTOMER_LEGAL,
    business: BUSINESS_LEGAL,
} as const;

export const getLegalText = (role: 'customer' | 'business', type: LegalTextType): LegalText | undefined => {
    return LEGAL_TEXTS[role][type];
};

export const getRequiredLegalTypes = (role: 'customer' | 'business'): LegalTextType[] => {
    const texts = LEGAL_TEXTS[role];
    return (Object.keys(texts) as LegalTextType[]).filter(key => texts[key]?.required);
};
