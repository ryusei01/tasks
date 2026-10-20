import Svg, { Circle, Ellipse, Path, Rect } from 'react-native-svg';
import type { ProduceView } from '../../domain/types';

export function ProduceSprite({ view, width = 92 }: { view: ProduceView; width?: number }) {
  const scale = 0.75 + view.size * 0.18;
  const tilt = view.mood === 'dance' ? -12 : view.mood === 'sulk' ? 8 : 0;
  const faceY = view.kind === 'mushroom' ? 58 : 48;

  return (
    <Svg width={width} height={width * 1.15} viewBox="0 0 100 120">
      <Ellipse cx="50" cy="108" rx="28" ry="7" fill="#e4d5ba" />
      <ProduceBody kind={view.kind} scale={scale} tilt={tilt} />
      {view.mood === 'sulk' ? (
        <>
          <Path d="M38 42 l10 4" stroke="#243027" strokeWidth="2" />
          <Path d="M62 42 l-10 4" stroke="#243027" strokeWidth="2" />
        </>
      ) : (
        <>
          <Circle cx="42" cy={faceY} r="2.2" fill="#243027" />
          <Circle cx="58" cy={faceY} r="2.2" fill="#243027" />
        </>
      )}
      <Path
        d={view.mood === 'sulk' || view.mood === 'rest' ? 'M42 64 q8 2 16 0' : 'M42 62 q8 8 16 0'}
        stroke="#243027"
        strokeWidth="2"
        fill="none"
      />
      {view.mood === 'sweat' ? <Ellipse cx="70" cy="36" rx="4" ry="6" fill="#9fd4ea" /> : null}
      {view.mood === 'rest' ? (
        <Path d="M66 30 h10 M66 36 h8" stroke="#5c6b5e" strokeWidth="2" />
      ) : null}
    </Svg>
  );
}

function ProduceBody({ kind, scale, tilt }: { kind: ProduceView['kind']; scale: number; tilt: number }) {
  const transform = `rotate(${tilt} 50 70) translate(${(1 - scale) * 50} ${(1 - scale) * 40}) scale(${scale})`;
  if (kind === 'tomato') {
    return (
      <>
        <Ellipse cx="50" cy="64" rx="28" ry="26" fill="#d84c3f" transform={transform} />
        <Path d="M50 38 q8 8 0 10 q-8 -2 0 -10" fill="#3f6b4a" transform={transform} />
      </>
    );
  }
  if (kind === 'strawberry') {
    return (
      <>
        <Path d="M50 34 C78 48 76 90 50 96 C24 90 22 48 50 34" fill="#e25b6a" transform={transform} />
        <Path d="M36 40 h28 l-6 10 h-16 z" fill="#3f6b4a" transform={transform} />
        <Circle cx="44" cy="62" r="1.6" fill="#f7e27a" transform={transform} />
        <Circle cx="54" cy="70" r="1.6" fill="#f7e27a" transform={transform} />
        <Circle cx="48" cy="78" r="1.6" fill="#f7e27a" transform={transform} />
      </>
    );
  }
  return (
    <>
      <Ellipse cx="50" cy="58" rx="30" ry="18" fill="#c96b4a" transform={transform} />
      <Rect x="44" y="64" width="12" height="26" rx="6" fill="#f3e2c8" transform={transform} />
    </>
  );
}
