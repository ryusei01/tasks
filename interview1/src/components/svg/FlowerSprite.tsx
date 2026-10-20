import Svg, { Circle, Ellipse, G, Rect, Text as SvgText } from 'react-native-svg';
import type { PlantView } from '../../domain/types';

export function FlowerSprite({ plant, width = 200 }: { plant: PlantView; width?: number }) {
  const height = width * 1.15;
  const open = plant.stage === 'bloom' || plant.stage === 'bud' || plant.stage === 'leaves';
  const petalReach = plant.stage === 'bloom' ? 26 : plant.stage === 'bud' ? 14 : plant.stage === 'leaves' ? 8 : 0;
  const colors = plant.multi ? [plant.hue, plant.hueB, '#f7f3ea', '#9bb7ff'] : [plant.hue, plant.hueB];
  const extras = Math.min(4, plant.flowerCount - 1);

  return (
    <Svg width={width} height={height} viewBox="0 0 200 230">
      {plant.moonlit ? <Circle cx="166" cy="34" r="16" fill="#f7f4e4" /> : <Circle cx="166" cy="32" r="12" fill="#f2d48a" />}
      {plant.moonlit ? <Circle cx="174" cy="30" r="14" fill="#d7e4f5" /> : null}
      {plant.glow ? <Circle cx="100" cy="96" r="48" fill="#fff1c2" opacity={0.85} /> : null}
      <Ellipse cx="100" cy="208" rx="74" ry="14" fill="#d9c8a6" />
      <Rect x="96" y="118" width="8" height="78" rx="4" fill="#3d6848" />
      <Ellipse
        cx={plant.curled ? 84 : 68}
        cy={plant.curled ? 156 : 168}
        rx={plant.curled ? 14 : 24}
        ry="11"
        fill={plant.curled ? '#4f6d45' : '#7ea56a'}
        transform={plant.curled ? 'rotate(-70 84 156)' : 'rotate(-18 68 168)'}
      />
      <Ellipse
        cx={plant.curled ? 116 : 132}
        cy={plant.curled ? 156 : 168}
        rx={plant.curled ? 14 : 24}
        ry="11"
        fill={plant.curled ? '#4f6d45' : '#6f9a62'}
        transform={plant.curled ? 'rotate(70 116 156)' : 'rotate(18 132 168)'}
      />
      {open ? (
        <G>
          {Array.from({ length: plant.petals }, (_, index) => {
            const angle = (Math.PI * 2 * index) / plant.petals - Math.PI / 2;
            const cx = 100 + Math.cos(angle) * petalReach;
            const cy = 96 + Math.sin(angle) * petalReach;
            return (
              <Ellipse
                key={index}
                cx={cx}
                cy={cy}
                rx={plant.stage === 'bloom' ? 12 : 7}
                ry={plant.stage === 'bloom' ? 18 : 10}
                fill={colors[index % colors.length]}
                transform={`rotate(${(angle * 180) / Math.PI + 90} ${cx} ${cy})`}
              />
            );
          })}
        </G>
      ) : (
        <Ellipse cx="100" cy="104" rx="14" ry="18" fill={plant.hue} />
      )}
      <Circle cx="100" cy="96" r={plant.stage === 'bloom' ? 8 : 5} fill="#f7f1dc" />
      {plant.fruit ? <Circle cx="132" cy="132" r="9" fill="#e07a4a" /> : null}
      {plant.sleepy ? (
        <SvgText x="132" y="78" fill="#5c6b5e" fontSize="14">
          z z
        </SvgText>
      ) : null}
      {Array.from({ length: extras }, (_, index) => {
        const x = 36 + index * 42;
        return (
          <G key={index}>
            <Rect x={x + 6} y="168" width="4" height="28" rx="2" fill="#3d6848" />
            <Circle cx={x + 8} cy="160" r="8" fill={colors[index % colors.length]} />
          </G>
        );
      })}
    </Svg>
  );
}
