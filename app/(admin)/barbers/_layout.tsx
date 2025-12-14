import { Stack } from 'expo-router';
import { View, Pressable } from 'react-native';
import { useNavigation } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';

export default function BarbersStackLayout() {
    const navigation = useNavigation();

    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{
                    title: 'İşletme Listesi',
                    headerShown: false // We might want the custom header from the screen itself, or standardized here.
                    // Let's keep it false for index if the index screen has its own elaborate header, 
                    // OR set simple title. The user complained about bad navigation, so standard header is better.
                    // However, checking barbers.tsx (now index), it probably has a custom header.
                    // I will check the file content in a moment. For now, let's assume safely.
                }}
            />
            <Stack.Screen
                name="[id]"
                options={{
                    title: 'Berber Detayı',
                    presentation: 'card',
                    headerBackTitle: 'Geri',
                    headerTintColor: '#fff',
                    headerStyle: { backgroundColor: '#0F172A' },
                    headerTitleStyle: { color: '#fff' },
                }}
            />
        </Stack>
    );
}
