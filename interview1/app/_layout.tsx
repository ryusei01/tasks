import 'react-native-gesture-handler';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { colors } from '../src/theme';
import { useGame } from '../src/store/useGame';

export default function RootLayout() {
  const ready = useHydrated();
  if (!ready) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.paper, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: colors.ink }}>庭を開いています</Text>
      </View>
    );
  }
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.paper },
          headerTintColor: colors.ink,
          headerShadowVisible: false,
          contentStyle: { backgroundColor: colors.paper },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="task/[id]" options={{ title: 'タスク' }} />
        <Stack.Screen name="cook" options={{ title: '料理', presentation: 'modal' }} />
        <Stack.Screen name="synthesize" options={{ title: '合成', presentation: 'modal' }} />
        <Stack.Screen name="minigame/[id]" options={{ title: 'ミニゲーム', presentation: 'modal' }} />
      </Stack>
    </SafeAreaProvider>
  );
}

function useHydrated() {
  const [ready, setReady] = useState(useGame.persist.hasHydrated());
  useEffect(() => {
    setReady(useGame.persist.hasHydrated());
    return useGame.persist.onFinishHydration(() => setReady(true));
  }, []);
  return ready;
}
