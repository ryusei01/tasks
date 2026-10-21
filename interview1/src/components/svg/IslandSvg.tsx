import Svg, { Circle, Ellipse, Path, Rect } from 'react-native-svg';
import type { WorldView } from '../../domain/types';

export function IslandSvg({ world, width = 360 }: { world: WorldView; width?: number }) {
  const height = width * 0.62;
  return (
    <Svg width={width} height={height} viewBox="0 0 360 224">
      <Rect width="360" height="224" rx="24" fill="#d7ebe3" />
      <Circle cx="300" cy="42" r="16" fill="#f6e7b2" />
      <Circle cx="295" cy="40" r="1.5" fill="#243027" />
      <Circle cx="306" cy="40" r="1.5" fill="#243027" />
      <Path d="M294 46 q6 5 12 0" stroke="#243027" strokeWidth="1.2" fill="none" />
      <Ellipse cx="180" cy="168" rx="150" ry="42" fill="#8fbf78" />
      <Ellipse cx="180" cy="160" rx="132" ry="34" fill="#c6ad72" />
      {world.river > 0 ? (
        <Path
          d="M40 150 C90 140 120 180 170 156 C220 132 250 170 320 148"
          stroke="#7eb8c9"
          strokeWidth={2 + world.river * 2}
          fill="none"
        />
      ) : (
        <Path d="M70 156 H250" stroke="#b7a27a" strokeWidth="2" fill="none" />
      )}
      {Array.from({ length: world.forest }, (_, index) => {
        const x = 48 + index * 28;
        return (
          <Path key={index} d={`M${x} 150 L${x + 14} 96 L${x + 28} 150 Z`} fill={index % 2 ? '#2f6a3d' : '#3f7d4a'} />
        );
      })}
      {world.library > 0 ? (
        <Rect x="150" y={128 - world.library * 8} width="46" height={36 + world.library * 8} rx="3" fill="#f4efe4" stroke="#243027" />
      ) : null}
      {world.library > 2 ? <Rect x="160" y="108" width="26" height="8" fill="#7ea4c8" /> : null}
      {Array.from({ length: world.buildings }, (_, index) => (
        <Rect key={index} x={214 + index * 18} y={132 - index * 4} width="16" height={28 + index * 4} fill="#e7d7b8" stroke="#243027" />
      ))}
      {world.atelier > 0 ? (
        <>
          <Rect x="78" y="126" width="34" height="30" rx="4" fill="#f7f1e4" stroke="#243027" />
          <Circle cx="95" cy="140" r={4 + world.atelier} fill={world.atelier >= 3 ? '#f6e7a2' : '#cdb892'} />
        </>
      ) : null}
      {world.cleanliness < 2
        ? [120, 200, 250].map((x) => <Circle key={x} cx={x} cy="176" r="3" fill="#8a6a45" />)
        : null}
      {world.cleanliness >= 4
        ? [130, 190, 240].map((x) => <Circle key={x} cx={x} cy="176" r="3" fill="#e07a7a" />)
        : null}
    </Svg>
  );
}
