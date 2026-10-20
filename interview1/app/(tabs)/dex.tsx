import { useMemo, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RECIPES } from '../../src/domain/cooking';
import { allSeasons } from '../../src/domain/season';
import { SECRETS } from '../../src/domain/secrets';
import { allSlimes, ELEMENT_LABEL, SLIME_ELEMENTS, slimeId, slimeName } from '../../src/domain/slime';
import type { SlimeElement } from '../../src/domain/types';
import { screen } from '../../src/components/screen';
import { SlimeSprite } from '../../src/components/svg/SlimeSprite';
import { Button, Chip } from '../../src/components/ui';
import { useRecordDiscoveries } from '../../src/store/useDiscoveries';
import { useGame } from '../../src/store/useGame';

const PAGE = 12;
type Section = 'flower' | 'dish' | 'slime' | 'visitor' | 'secret';

export default function DexScreen() {
  const discoveries = useGame((state) => state.discoveries);
  const nursery = useGame((state) => state.nursery);
  const cooked = useGame((state) => state.cooked);
  const known = useMemo(() => new Set(discoveries), [discoveries]);
  const catalog = useMemo(() => allSlimes(), []);
  const [section, setSection] = useState<Section>('flower');
  const [element, setElement] = useState<SlimeElement | 'all'>('all');
  const [page, setPage] = useState(0);
  useRecordDiscoveries(false);

  const slimes = catalog.filter((genes) => element === 'all' || genes.element === element);
  const pageCount = Math.max(1, Math.ceil(slimes.length / PAGE));
  const safePage = Math.min(page, pageCount - 1);
  const slice = slimes.slice(safePage * PAGE, safePage * PAGE + PAGE);
  const foundSlimes = catalog.filter((genes) => known.has(slimeId(genes))).length;

  return (
    <SafeAreaView style={screen.page} edges={['top']}>
    <ScrollView contentContainerStyle={screen.scroll}>
      <View style={screen.column}>
        <Text style={screen.title}>図鑑</Text>
        <Text style={screen.sub}>
          発見 {discoveries.length}　スライム {foundSlimes} / {catalog.length}
        </Text>
        <View style={screen.row}>
          {(
            [
              ['flower', '花'],
              ['dish', '料理'],
              ['slime', 'スライム'],
              ['visitor', '訪問者'],
              ['secret', '隠し'],
            ] as const
          ).map(([id, label]) => (
            <Chip key={id} label={label} selected={section === id} onPress={() => setSection(id)} />
          ))}
        </View>

        {section === 'flower' ? (
          <View style={{ gap: 10 }}>
            {SECRETS.filter((secret) => secret.section === 'flower').map((secret) => (
              <Entry key={secret.id} open={known.has(secret.id)} name={secret.name} hint={secret.hint} />
            ))}
            {allSeasons().map((season) => (
              <Entry key={season.plantId} open={known.has(season.plantId)} name={season.plantName} hint={`${season.name}の庭に咲く。季節が来ればまた会える。`} />
            ))}
            {nursery.map((gene) => (
              <Entry key={gene.id} open name={gene.name} hint={`${gene.petals}枚の花弁。親株は残したまま生まれた。`} />
            ))}
            {discoveries
              .filter((id) => id.startsWith('flower:form:'))
              .map((id) => (
                <Entry key={id} open name="見た花の姿" hint={id.replace('flower:form:', '').replace(':', ' / ')} />
              ))}
          </View>
        ) : null}

        {section === 'dish' ? (
          <View style={{ gap: 10 }}>
            {RECIPES.map((recipe) => (
              <Entry
                key={recipe.id}
                open={cooked.includes(recipe.id)}
                name={recipe.name}
                hint={Object.entries(recipe.needs)
                  .map(([key, count]) => `${ingredientName(key)}×${count}`)
                  .join('、')}
              />
            ))}
          </View>
        ) : null}

        {section === 'slime' ? (
          <View style={{ gap: 10 }}>
            <View style={screen.row}>
              <Chip label="すべて" selected={element === 'all'} onPress={() => { setElement('all'); setPage(0); }} />
              {SLIME_ELEMENTS.map((item) => (
                <Chip
                  key={item}
                  label={ELEMENT_LABEL[item]}
                  selected={element === item}
                  onPress={() => {
                    setElement(item);
                    setPage(0);
                  }}
                />
              ))}
            </View>
            <View style={screen.row}>
              {slice.map((genes) => {
                const id = slimeId(genes);
                const open = known.has(id);
                return (
                  <View key={id} style={{ width: 120, alignItems: 'center' }}>
                    <SlimeSprite genes={genes} silhouette={!open} width={100} />
                    <Text style={screen.muted}>{open ? slimeName(genes) : '？？？'}</Text>
                  </View>
                );
              })}
            </View>
            <View style={screen.row}>
              <Button label="前" tone="ghost" onPress={() => setPage((value) => Math.max(0, safePage - 1))} />
              <Text style={screen.body}>
                {safePage + 1} / {pageCount}
              </Text>
              <Button label="次" tone="ghost" onPress={() => setPage((value) => Math.min(pageCount - 1, safePage + 1))} />
            </View>
          </View>
        ) : null}

        {section === 'visitor' ? (
          <View style={{ gap: 10 }}>
            {allSeasons().map((season) => (
              <Entry
                key={season.visitorId}
                open={known.has(season.visitorId)}
                name={season.visitorName}
                hint={`${season.name}に庭を開くと会える。いなくても、次の季節に戻る。`}
              />
            ))}
          </View>
        ) : null}

        {section === 'secret' ? (
          <View style={{ gap: 10 }}>
            {SECRETS.map((secret) => (
              <Entry key={secret.id} open={known.has(secret.id)} name={secret.name} hint={secret.hint} />
            ))}
          </View>
        ) : null}
      </View>
    </ScrollView>
    </SafeAreaView>
  );
}

function ingredientName(key: string): string {
  if (key === 'tomato') return 'トマト';
  if (key === 'strawberry') return 'イチゴ';
  if (key === 'mushroom') return 'キノコ';
  return key;
}

function Entry({ open, name, hint }: { open: boolean; name: string; hint: string }) {
  return (
    <View style={screen.task}>
      <Text style={screen.body}>{open ? name : '？？？'}</Text>
      <Text style={screen.muted}>{open ? hint : hint}</Text>
    </View>
  );
}
