import Svg, { Circle, Ellipse, Path, Rect } from 'react-native-svg';
import type { CompanionAction } from '../../domain/types';

export function CompanionSprite({
  action,
  width = 140,
}: {
  action: CompanionAction;
  width?: number;
}) {
  const resting = action === 'rest';
  const jumping = action === 'jump' || action === 'cling';
  const eyesOpen = action !== 'rest' && action !== 'eat';
  const y = jumping ? 8 : resting ? 28 : 16;

  return (
    <Svg width={width} height={width * 1.15} viewBox="0 0 140 160">
      <Ellipse cx="70" cy="148" rx="36" ry="8" fill="#e4d5ba" />
      <Rect x="48" y={78 + y} width="44" height="46" rx="18" fill="#f3d2b8" />
      <Circle cx="70" cy={52 + y} r="26" fill="#f6d7c0" />
      <Path d="M70 30 l8 16 h-16 z" fill="#6f9a62" transform={`translate(0 ${y})`} />
      <Circle cx="70" cy={28 + y} r="4" fill="#d86b6b" />
      {eyesOpen ? (
        <>
          <Circle cx="60" cy={50 + y} r="3" fill="#243027" />
          <Circle cx="80" cy={50 + y} r={action === 'study' ? 3.4 : 3} fill="#243027" />
        </>
      ) : (
        <>
          <Path d={`M54 ${50 + y} q6 4 12 0`} stroke="#243027" strokeWidth="2" fill="none" />
          <Path d={`M74 ${50 + y} q6 4 12 0`} stroke="#243027" strokeWidth="2" fill="none" />
        </>
      )}
      <Path
        d={action === 'rest' ? `M62 ${64 + y} q8 2 16 0` : `M60 ${62 + y} q10 10 20 0`}
        stroke="#243027"
        strokeWidth="2"
        fill="none"
      />
      <Circle cx="56" cy={60 + y} r="4" fill="#f0b0a8" opacity={0.8} />
      <Circle cx="86" cy={60 + y} r="4" fill="#f0b0a8" opacity={0.8} />
      {action === 'study' ? <Rect x="86" y={96 + y} width="22" height="16" rx="2" fill="#f7f3ea" stroke="#243027" /> : null}
      {action === 'water' ? (
        <>
          <Rect x="18" y={100 + y} width="18" height="12" rx="3" fill="#7ea4c8" />
          <Path d={`M36 ${106 + y} q16 8 8 18`} stroke="#7ea4c8" strokeWidth="3" fill="none" />
        </>
      ) : null}
      {action === 'eat' ? <Ellipse cx="104" cy={108 + y} rx="10" ry="5" fill="#f7f3ea" stroke="#d7a441" /> : null}
      {action === 'cling' ? <Ellipse cx="28" cy={110 + y} rx="10" ry="6" fill="#f3d2b8" /> : null}
    </Svg>
  );
}
