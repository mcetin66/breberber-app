import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
    return (
        <SafeAreaView className="flex-1 bg-background-light dark:bg-background-dark justify-center items-center">
            <Text className="text-gray-900 dark:text-white">Ayarlar Sayfası (Yapım Aşamasında)</Text>
        </SafeAreaView>
    );
}
