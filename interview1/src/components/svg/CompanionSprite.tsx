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
  const jumping = action === 'jump';
  const eyesOpen = action !== 'rest' && action !== 'eat';
  const y = jumping ? 0 : action === 'cling' ? 8 : resting ? 36 : 16;

  return (
    <Svg width={width} height={width * 1.15} viewBox="0 0 140 160">
      <Ellipse cx="70" cy="148" rx={resting ? 48 : 36} ry="8" fill="#e4d5ba" />
      {jumping ? (
        <>
          <Path d="M40 118 l-16 10 M100 118 l16 10" stroke="#c9a227" strokeWidth="2" />
          <Rect x="50" y={120 + y} width="12" height="18" rx="5" fill="#f3d2b8" transform="rotate(-24 56 128)" />
          <Rect x="78" y={120 + y} width="12" height="18" rx="5" fill="#f3d2b8" transform="rotate(24 84 128)" />
        </>
      ) : null}
      <Rect
        x={resting ? 34 : 48}
        y={78 + y}
        width={resting ? 72 : 44}
        height={resting ? 26 : 46}
        rx="18"
        fill="#f3d2b8"
      />
      <Ellipse cx="70" cy={52 + y} rx={resting ? 32 : 26} ry={resting ? 18 : 26} fill="#f6d7c0" />
      {resting ? null : <Path d="M70 30 l8 16 h-16 z" fill="#6f9a62" transform={`translate(0 ${y})`} />}
      {resting ? null : <Circle cx="70" cy={28 + y} r="4" fill="#d86b6b" />}
      <Arms action={action} y={y} />
      {action === 'study' ? (
        <>
          <Circle cx="60" cy={50 + y} r="8" stroke="#243027" strokeWidth="1.6" fill="none" />
          <Circle cx="80" cy={50 + y} r="8" stroke="#243027" strokeWidth="1.6" fill="none" />
          <Path d={`M68 ${50 + y} H72`} stroke="#243027" strokeWidth="1.6" />
        </>
      ) : null}
      {eyesOpen ? (
        <>
          <Circle cx="60" cy={50 + y} r={action === 'study' ? 2.4 : 3} fill="#243027" />
          <Circle cx="80" cy={50 + y} r={action === 'study' ? 2.4 : action === 'jump' ? 3.6 : 3} fill="#243027" />
        </>
      ) : (
        <>
          <Path d={`M54 ${50 + y} q6 4 12 0`} stroke="#243027" strokeWidth="2" fill="none" />
          <Path d={`M74 ${50 + y} q6 4 12 0`} stroke="#243027" strokeWidth="2" fill="none" />
        </>
      )}
      {action === 'eat' ? (
        <Ellipse cx="70" cy={64 + y} rx="7" ry="5" fill="#243027" />
      ) : (
        <Path
          d={
            action === 'rest'
              ? `M62 ${62 + y} q8 1 16 0`
              : action === 'jump' || action === 'cling'
                ? `M58 ${60 + y} q12 12 24 0`
                : `M60 ${62 + y} q10 8 20 0`
          }
          stroke="#243027"
          strokeWidth="2"
          fill="none"
        />
      )}
      {action === 'water' ? <Ellipse cx="70" cy={70 + y} rx="3" ry="5" fill="#e07a7a" /> : null}
      <Circle cx="54" cy={60 + y} r={action === 'eat' ? 6 : 4} fill="#f0b0a8" opacity={0.8} />
      <Circle cx="86" cy={60 + y} r={action === 'eat' ? 6 : 4} fill="#f0b0a8" opacity={0.8} />
      {action === 'study' ? (
        <>
          <Rect x="92" y={96 + y} width="24" height="16" rx="2" fill="#f7f3ea" stroke="#243027" />
          <Path d={`M104 ${100 + y} v8`} stroke="#d7a441" strokeWidth="1" />
          <Ellipse cx="96" cy={46 + y} rx="3" ry="4" fill="#9fd4ea" />
        </>
      ) : null}
      {action === 'water' ? (
        <>
          <Rect x="16" y={100 + y} width="18" height="12" rx="3" fill="#7ea4c8" />
          <Path d={`M34 ${106 + y} q16 8 8 18`} stroke="#7ea4c8" strokeWidth="3" fill="none" />
          <Circle cx="46" cy={128 + y} r="2" fill="#7ea4c8" />
        </>
      ) : null}
      {action === 'eat' ? (
        <>
          <Ellipse cx="104" cy={108 + y} rx="10" ry="5" fill="#f7f3ea" stroke="#d7a441" />
          <Circle cx="96" cy={118 + y} r="2" fill="#d7a441" />
          <Circle cx="108" cy={124 + y} r="1.6" fill="#e07a4a" />
        </>
      ) : null}
      {action === 'cling' ? (
        <Path d={`M18 ${70 + y} c0 -8 14 -8 14 0 c0 6 -7 12 -7 12 c0 0 -7 -6 -7 -12`} fill="#e07a7a" />
      ) : null}
      {action === 'rest' ? (
        <Path d={`M96 ${36 + y} h8 M96 ${42 + y} h6`} stroke="#5c6b5e" strokeWidth="2" />
      ) : null}
    </Svg>
  );
}

function Arms({ action, y }: { action: CompanionAction; y: number }) {
  if (action === 'jump') {
    return (
      <>
        <Path d={`M48 ${88 + y} L26 ${58 + y}`} stroke="#f3d2b8" strokeWidth="8" strokeLinecap="round" />
        <Path d={`M92 ${88 + y} L114 ${58 + y}`} stroke="#f3d2b8" strokeWidth="8" strokeLinecap="round" />
      </>
    );
  }
  if (action === 'cling') {
    return (
      <>
        <Path d={`M48 ${96 + y} L16 ${86 + y}`} stroke="#f3d2b8" strokeWidth="8" strokeLinecap="round" />
        <Path d={`M48 ${108 + y} L18 ${108 + y}`} stroke="#f3d2b8" strokeWidth="8" strokeLinecap="round" />
      </>
    );
  }
  if (action === 'rest') return null;
  if (action === 'study') {
    return <Path d={`M48 ${100 + y} L28 ${112 + y}`} stroke="#f3d2b8" strokeWidth="8" strokeLinecap="round" />;
  }
  if (action === 'water') {
    return <Path d={`M48 ${96 + y} L30 ${108 + y}`} stroke="#f3d2b8" strokeWidth="8" strokeLinecap="round" />;
  }
  if (action === 'eat') {
    return (
      <>
        <Path d={`M48 ${96 + y} L96 ${108 + y}`} stroke="#f3d2b8" strokeWidth="8" strokeLinecap="round" />
        <Path d={`M92 ${96 + y} L108 ${104 + y}`} stroke="#f3d2b8" strokeWidth="8" strokeLinecap="round" />
      </>
    );
  }
  return <Path d={`M48 ${90 + y} Q36 ${70 + y} 58 ${42 + y}`} stroke="#f3d2b8" strokeWidth="8" strokeLinecap="round" fill="none" />;
}
