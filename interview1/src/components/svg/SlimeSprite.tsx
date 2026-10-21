import Svg, { Circle, Ellipse, Path, Rect } from 'react-native-svg';
import { ELEMENT_COLOR } from '../../domain/slime';
import type { SlimeBody, SlimeGenes } from '../../domain/types';

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
  const face = faceAnchor(genes.body);

  return (
    <Svg width={width} height={width} viewBox="0 0 120 120">
      {genes.aura !== 'none' && !silhouette ? (
        <Circle cx="60" cy={70 - lift} r="46" fill={auraColor(genes.aura)} opacity={0.35} />
      ) : null}
      <Ellipse cx="60" cy="104" rx={genes.body === 'wide' ? 40 : 28} ry="6" fill="#e4d5ba" />
      <Path d={body} fill={color} transform={`translate(0 ${-lift})`} />
      {genes.body === 'blob' && !silhouette ? (
        <Ellipse cx="78" cy={96 - lift} rx="6" ry="9" fill={color} />
      ) : null}
      {!silhouette && genes.pattern === 'spots' ? (
        <>
          <Circle cx="46" cy={face - 4 - lift} r="4" fill="#fffaf3" opacity={0.7} />
          <Circle cx="74" cy={face + 10 - lift} r="5" fill="#fffaf3" opacity={0.7} />
          <Circle cx="58" cy={face + 16 - lift} r="3" fill="#fffaf3" opacity={0.55} />
        </>
      ) : null}
      {!silhouette && genes.pattern === 'stripes' ? (
        <Path
          d={`M38 ${face - 6 - lift} H82 M36 ${face + 6 - lift} H84`}
          stroke="#fffaf3"
          strokeWidth="3"
          opacity={0.7}
        />
      ) : null}
      {!silhouette && genes.pattern === 'stars' ? (
        <Path d={star(60, face - 14 - lift, 6)} fill="#fffaf3" />
      ) : null}
      {!silhouette ? <Eyes kind={genes.eyes} y={face - lift} /> : null}
      {!silhouette ? <Mouth body={genes.body} y={face + 12 - lift} /> : null}
      {!silhouette ? (
        <>
          <Circle cx="40" cy={face + 4 - lift} r="4" fill="#f0b0a8" opacity={0.55} />
          <Circle cx="80" cy={face + 4 - lift} r="4" fill="#f0b0a8" opacity={0.55} />
        </>
      ) : null}
    </Svg>
  );
}

function faceAnchor(body: SlimeBody): number {
  if (body === 'tall') return 48;
  if (body === 'wide') return 80;
  if (body === 'blob') return 74;
  if (body === 'spiky') return 70;
  return 66;
}

function bodyShape(body: SlimeBody): string {
  switch (body) {
    case 'tall':
      return 'M60 12 C74 12 78 40 76 78 C74 112 46 112 44 78 C42 40 46 12 60 12';
    case 'wide':
      return 'M60 64 C102 52 118 78 108 96 C98 116 22 116 12 96 C2 78 18 52 60 64';
    case 'blob':
      return 'M60 38 C96 28 114 60 104 84 C96 108 78 120 60 124 C40 120 22 108 16 84 C6 58 28 30 60 38';
    case 'spiky':
      return 'M60 16 L74 42 L104 30 L90 58 L116 72 L86 80 L96 112 L60 92 L24 112 L34 80 L4 72 L30 58 L16 30 L46 42 Z';
    default:
      return 'M60 36 C90 36 104 60 100 82 C96 108 24 108 20 82 C16 60 30 36 60 36';
  }
}

function auraColor(aura: SlimeGenes['aura']): string {
  if (aura === 'flame') return '#f2a15a';
  if (aura === 'frost') return '#d7f3ff';
  return '#fff3b0';
}

function star(cx: number, cy: number, r: number): string {
  return `M${cx} ${cy - r} l${r * 0.35} ${r * 0.85} ${r} ${r * 0.15} -${r * 0.7} ${r * 0.5} ${r * 0.2} ${r} -${r * 0.7} -${r * 0.5} -${r * 0.7} ${r * 0.5} ${r * 0.2} -${r} -${r * 0.7} -${r * 0.5} ${r} -${r * 0.15} z`;
}

function Eyes({ kind, y }: { kind: SlimeGenes['eyes']; y: number }) {
  if (kind === 'sleepy') {
    return (
      <>
        <Path d={`M46 ${y} q8 6 14 0`} stroke="#243027" strokeWidth="2.4" fill="none" />
        <Path d={`M68 ${y} q8 6 14 0`} stroke="#243027" strokeWidth="2.4" fill="none" />
        <Ellipse cx="86" cy={y + 10} rx="3" ry="5" fill="#9fd4ea" />
      </>
    );
  }
  if (kind === 'star') {
    return (
      <>
        <Path d={star(50, y, 6)} fill="#243027" />
        <Path d={star(76, y, 6)} fill="#243027" />
      </>
    );
  }
  const r = kind === 'big' ? 7 : 2.6;
  return (
    <>
      <Circle cx="48" cy={y} r={r} fill="#243027" />
      <Circle cx="76" cy={y} r={r} fill="#243027" />
      {kind === 'big' ? (
        <>
          <Circle cx="50" cy={y - 2} r="2" fill="#fffaf3" />
          <Circle cx="78" cy={y - 2} r="2" fill="#fffaf3" />
        </>
      ) : null}
    </>
  );
}

function Mouth({ body, y }: { body: SlimeBody; y: number }) {
  if (body === 'spiky') {
    return (
      <>
        <Path d={`M46 ${y - 2} q14 14 28 0`} stroke="#243027" strokeWidth="2.2" fill="none" />
        <Path d={`M58 ${y + 2} l3 5 h-6 z`} fill="#fffaf3" />
      </>
    );
  }
  if (body === 'blob') {
    return <Path d={`M44 ${y} q10 12 24 -3`} stroke="#243027" strokeWidth="2.2" fill="none" />;
  }
  if (body === 'wide') {
    return <Path d={`M40 ${y} q20 14 40 0`} stroke="#243027" strokeWidth="2.4" fill="none" />;
  }
  if (body === 'tall') {
    return <Path d={`M54 ${y} q6 5 12 0`} stroke="#243027" strokeWidth="2" fill="none" />;
  }
  return <Path d={`M50 ${y} q10 8 20 0`} stroke="#243027" strokeWidth="2" fill="none" />;
}

export function SeasonMark({ hue, kind, width = 72 }: { hue: string; kind: 'plant' | 'visitor'; width?: number }) {
  if (kind === 'plant') {
    return (
      <Svg width={width} height={width} viewBox="0 0 72 72">
        <Rect x="34" y="36" width="4" height="24" fill="#3f6b4a" />
        <Circle cx="36" cy="30" r="12" fill={hue} />
        <Circle cx="24" cy="38" r="8" fill={hue} />
        <Circle cx="48" cy="38" r="8" fill={hue} />
        <Circle cx="33" cy="30" r="1.2" fill="#243027" />
        <Circle cx="39" cy="30" r="1.2" fill="#243027" />
        <Path d="M33 34 q3 3 6 0" stroke="#243027" strokeWidth="1" fill="none" />
      </Svg>
    );
  }
  return (
    <Svg width={width} height={width} viewBox="0 0 72 72">
      <Ellipse cx="36" cy="40" rx="16" ry="12" fill={hue} />
      <Circle cx="48" cy="34" r="8" fill={hue} />
      <Circle cx="51" cy="33" r="1.4" fill="#243027" />
      <Path d="M48 36 q3 3 6 0" stroke="#243027" strokeWidth="1" fill="none" />
      <Ellipse cx="22" cy="48" rx="8" ry="5" fill={hue} />
      <Path d="M18 28 q4 -8 2 0" stroke={hue} strokeWidth="2" fill="none" />
    </Svg>
  );
}
