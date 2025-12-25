# SKILL 24: Keyboard Handling & Input Focus (ZORUNLU UI TEKNİK STANDART)

Her TextInput içeren ekran, modal, form veya bottom sheet'te klavye input'u örtmesin. Projemizde yüklü paket "react-native-keyboard-aware-scroll-view" olduğu için bu standart zorunlu.

### Doğru Import ve Kullanım (Mevcut Paket)
```tsx
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

<KeyboardAwareScrollView
  contentContainerStyle={{ flexGrow: 1 }}
  keyboardShouldPersistTaps="handled"
  extraScrollHeight={80} // alt boşluk için (extraHeight kullanılır, bottomOffset değil)
  enableOnAndroid={true}
  enableAutomaticScroll={true}
  showsVerticalScrollIndicator={false}
>
  {/* Tüm içerik + TextInput'lar */}
</KeyboardAwareScrollView>
```
