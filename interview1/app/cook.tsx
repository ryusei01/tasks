import { ScrollView, Text, View } from 'react-native';
import { canCook, RECIPES } from '../src/domain/cooking';
import { PRODUCE_LABEL } from '../src/domain/labels';
import type { ProduceKind } from '../src/domain/types';
import { screen } from '../src/components/screen';
import { Button, Speech } from '../src/components/ui';
import { useGame } from '../src/store/useGame';

const INGREDIENTS: ProduceKind[] = ['tomato', 'strawberry', 'mushroom'];

export default function CookScreen() {
  const inventory = useGame((state) => state.inventory);
  const cookDish = useGame((state) => state.cookDish);
  const feed = useGame((state) => state.feed);
  const lastSpeech = useGame((state) => state.lastSpeech);

  return (
    <ScrollView style={screen.page} contentContainerStyle={screen.scroll}>
      <View style={screen.column}>
        <Text style={screen.title}>料理</Text>
        <Text style={screen.sub}>収穫した実で作る。食べさせると、今日の表情が変わる。株は庭に残る。</Text>
        {lastSpeech ? <Speech text={lastSpeech.text} /> : null}
        <Text style={screen.body}>
          {INGREDIENTS.map((kind) => `${PRODUCE_LABEL[kind]} ${inventory[kind] ?? 0}`).join('　')}
        </Text>
        {RECIPES.map((recipe) => {
          const owned = inventory[recipe.id] ?? 0;
          const ready = canCook(inventory, recipe);
          return (
            <View key={recipe.id} style={screen.task}>
              <Text style={screen.body}>
                {recipe.name}　手元 {owned}
              </Text>
              <Text style={screen.muted}>
                {Object.entries(recipe.needs)
                  .map(([key, count]) => `${labelOf(key)} ${count}`)
                  .join('、')}
              </Text>
              <View style={screen.row}>
                <Button label={ready ? '作る' : '材料待ち'} tone={ready ? 'solid' : 'ghost'} onPress={() => cookDish(recipe.id, Date.now())} />
                <Button label="食べさせる" tone="ghost" onPress={() => feed(recipe.id, Date.now())} />
              </View>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

function labelOf(key: string): string {
  if (key === 'tomato' || key === 'strawberry' || key === 'mushroom') return PRODUCE_LABEL[key];
  return key;
}
