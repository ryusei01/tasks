import Svg, { Circle, Ellipse, Path, Rect } from 'react-native-svg';
import { ELEMENT_COLOR } from '../../domain/slime';
import type { SlimeGenes } from '../../domain/types';

export function SlimeSprite({
  genes,
  width = 120,
  silhouette = false,
  bounce = 0,
}: {
  genes: SlimeGenes;
  width?: number;
  silhouette?: boolean;
  bounce?: number;
}) {
  const color = silhouette ? '#c8c2b6' : ELEMENT_COLOR[genes.element];
  const body = bodyShape(genes.body);
  const lift = Math.min(18, bounce);

  return (
    <Svg width={width} height={width} viewBox="0 0 120 120">
      {genes.aura !== 'none' && !silhouette ? (
        <Circle cx="60" cy={70 - lift} r="46" fill={auraColor(genes.aura)} opacity={0.35} />
      ) : null}
      <Ellipse cx="60" cy="104" rx="28" ry="6" fill="#e4d5ba" />
      <Path d={body} fill={color} transform={`translate(0 ${-lift})`} />
      {!silhouette && genes.pattern === 'spots' ? (
        <>
          <Circle cx="48" cy={68 - lift} r="4" fill="#fffaf3" opacity={0.7} />
          <Circle cx="70" cy={78 - lift} r="5" fill="#fffaf3" opacity={0.7} />
        </>
      ) : null}
      {!silhouette && genes.pattern === 'stripes' ? (
        <Path d={`M40 ${64 - lift} H80 M38 ${76 - lift} H82`} stroke="#fffaf3" strokeWidth="3" opacity={0.7} />
      ) : null}
      {!silhouette && genes.pattern === 'stars' ? (
        <Path d={`M60 ${58 - lift} l2 5 5 1 -4 3 1 5 -4 -3 -4 3 1 -5 -4 -3 5 -1 z`} fill="#fffaf3" />
      ) : null}
      {!silhouette ? <Eyes kind={genes.eyes} lift={lift} /> : null}
    </Svg>
  );
}

function bodyShape(body: SlimeGenes['body']): string {
  switch (body) {
    case 'tall':
      return 'M60 28 C86 28 96 58 90 86 C84 108 36 108 30 86 C24 58 34 28 60 28';
    case 'wide':
      return 'M60 48 C98 40 112 70 104 90 C96 110 24 110 16 90 C8 70 22 40 60 48';
    case 'blob':
      return 'M60 40 C90 34 108 62 100 86 C92 112 28 114 20 88 C12 64 30 34 60 40';
    case 'spiky':
      return 'M60 24 L72 46 L96 40 L84 62 L108 74 L82 80 L90 104 L60 90 L30 104 L38 80 L12 74 L36 62 L24 40 L48 46 Z';
    default:
      return 'M60 36 C90 36 104 60 100 82 C96 108 24 108 20 82 C16 60 30 36 60 36';
  }
}

function auraColor(aura: SlimeGenes['aura']): string {
  if (aura === 'flame') return '#f2a15a';
  if (aura === 'frost') return '#d7f3ff';
  return '#fff3b0';
}

function Eyes({ kind, lift }: { kind: SlimeGenes['eyes']; lift: number }) {
  if (kind === 'sleepy') {
    return (
      <>
        <Path d={`M46 ${70 - lift} q8 5 14 0`} stroke="#243027" strokeWidth="2.4" fill="none" />
        <Path d={`M68 ${70 - lift} q8 5 14 0`} stroke="#243027" strokeWidth="2.4" fill="none" />
      </>
    );
  }
  if (kind === 'star') {
    return (
      <>
        <Circle cx="50" cy={68 - lift} r="4" fill="#243027" />
        <Circle cx="74" cy={68 - lift} r="4" fill="#243027" />
        <Circle cx="51" cy={67 - lift} r="1.2" fill="#fffaf3" />
      </>
    );
  }
  const r = kind === 'big' ? 5 : 2.6;
  return (
    <>
      <Circle cx="50" cy={68 - lift} r={r} fill="#243027" />
      <Circle cx="74" cy={68 - lift} r={r} fill="#243027" />
    </>
  );
}

export function SeasonMark({ hue, kind, width = 72 }: { hue: string; kind: 'plant' | 'visitor'; width?: number }) {
  if (kind === 'plant') {
    return (
      <Svg width={width} height={width} viewBox="0 0 72 72">
        <Rect x="34" y="36" width="4" height="24" fill="#3f6b4a" />
        <Circle cx="36" cy="30" r="12" fill={hue} />
        <Circle cx="24" cy="38" r="8" fill={hue} />
        <Circle cx="48" cy="38" r="8" fill={hue} />
      </Svg>
    );
  }
  return (
    <Svg width={width} height={width} viewBox="0 0 72 72">
      <Ellipse cx="36" cy="40" rx="16" ry="12" fill={hue} />
      <Circle cx="48" cy="34" r="8" fill={hue} />
      <Circle cx="51" cy="33" r="1.4" fill="#243027" />
      <Ellipse cx="22" cy="48" rx="8" ry="5" fill={hue} />
    </Svg>
  );
}
