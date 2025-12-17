import { Stack } from 'expo-router';

export default function BusinessSettingsLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
                animation: 'slide_from_right',
            }}
        >
            <Stack.Screen name="profile" />
            <Stack.Screen name="hours" />
            <Stack.Screen name="gallery" />
        </Stack>
    );
}
