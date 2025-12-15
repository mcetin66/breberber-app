import { Stack } from 'expo-router';

export default function StaffStackLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" options={{ title: 'Ekip' }} />
            <Stack.Screen
                name="detail"
                options={{
                    title: 'Personel Detayı',
                    headerShown: true,
                    headerBackTitle: 'Geri',
                    headerTintColor: '#fff',
                    headerStyle: { backgroundColor: '#1E293B' }, // Dark slate
                    headerTitleStyle: { color: '#fff', fontFamily: 'Manrope_700Bold' },
                }}
            />
        </Stack>
    );
}
