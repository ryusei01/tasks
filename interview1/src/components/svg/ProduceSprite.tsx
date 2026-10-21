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
      <ProduceFace view={view} faceY={faceY} />
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

function ProduceFace({ view, faceY }: { view: ProduceView; faceY: number }) {
  if (view.mood === 'sulk') {
    return (
      <>
        <Path d="M36 40 l12 5" stroke="#243027" strokeWidth="2" />
        <Path d="M64 40 l-12 5" stroke="#243027" strokeWidth="2" />
        <Path d="M40 66 q10 -2 20 0" stroke="#243027" strokeWidth="2" fill="none" />
      </>
    );
  }
  if (view.mood === 'rest') {
    return (
      <>
        <Path d={`M38 ${faceY} q6 4 10 0`} stroke="#243027" strokeWidth="2" fill="none" />
        <Path d={`M52 ${faceY} q6 4 10 0`} stroke="#243027" strokeWidth="2" fill="none" />
        <Path d="M42 66 q8 1 16 0" stroke="#243027" strokeWidth="2" fill="none" />
        <Path d="M66 28 h12 M66 34 h8" stroke="#5c6b5e" strokeWidth="2" />
      </>
    );
  }
  if (view.mood === 'sweat') {
    return (
      <>
        <Circle cx="42" cy={faceY} r="2.4" fill="#243027" />
        <Circle cx="58" cy={faceY} r="2.4" fill="#243027" />
        <Path d="M40 64 q10 2 22 -4" stroke="#243027" strokeWidth="2" fill="none" />
        <Ellipse cx="74" cy="32" rx="5" ry="8" fill="#9fd4ea" />
        <Ellipse cx="78" cy="48" rx="3" ry="5" fill="#9fd4ea" />
      </>
    );
  }
  if (view.mood === 'dance') {
    return (
      <>
        <Path d={`M36 ${faceY} q6 -6 10 0`} stroke="#243027" strokeWidth="2" fill="none" />
        <Path d={`M54 ${faceY} q6 -6 10 0`} stroke="#243027" strokeWidth="2" fill="none" />
        <Path d="M38 62 q12 12 24 0" stroke="#243027" strokeWidth="2" fill="none" />
        <Circle cx="34" cy={faceY + 8} r="3" fill="#f0b0a8" />
        <Circle cx="66" cy={faceY + 8} r="3" fill="#f0b0a8" />
        <Path d="M24 58 l-8 -10 M76 58 l8 -10" stroke="#e25b6a" strokeWidth="2" />
      </>
    );
  }
  return (
    <>
      <Circle cx="42" cy={faceY} r="2.2" fill="#243027" />
      <Circle cx="58" cy={faceY} r="2.2" fill="#243027" />
      <Path
        d={view.mood === 'happy' ? 'M40 62 q10 10 20 0' : 'M44 64 q6 3 12 0'}
        stroke="#243027"
        strokeWidth="2"
        fill="none"
      />
    </>
  );
}
