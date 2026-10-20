import { Tabs } from 'expo-router';
import { colors } from '../../src/theme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.mossDeep,
        tabBarInactiveTintColor: colors.inkSoft,
        tabBarStyle: { backgroundColor: colors.card, borderTopColor: colors.line },
      }}
    >
      <Tabs.Screen name="index" options={{ title: '今日' }} />
      <Tabs.Screen name="garden" options={{ title: '庭' }} />
      <Tabs.Screen name="island" options={{ title: '島' }} />
      <Tabs.Screen name="dex" options={{ title: '図鑑' }} />
    </Tabs>
  );
}
