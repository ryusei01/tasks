import type { Signals } from './types';

export interface Secret {
  id: string;
  name: string;
  hint: string;
  section: 'flower' | 'slime' | 'companion' | 'world';
}

export const SECRETS: readonly Secret[] = [
  {
    id: 'flower:moon_lotus',
    name: '月下の青蓮',
    hint: '夜に7回終えると、花が月の色になる。寝不足の勲章。',
    section: 'flower',
  },
  {
    id: 'flower:gold',
    name: '早暁の金花',
    hint: '期限より早く7回終えると金の花。朝型の自慢。',
    section: 'flower',
  },
  {
    id: 'flower:spectrum',
    name: '五日の花',
    hint: '一日で五つの区分を全部終えると、花がごちゃまぜ。欲張り。',
    section: 'flower',
  },
  {
    id: 'flower:last_bloom',
    name: '汗の蕾',
    hint: '期限の直前に5回終えると、蕾が汗を覚える。ヒヤヒヤの味。',
    section: 'flower',
  },
  {
    id: 'flower:dawn_moon',
    name: '月と朝',
    hint: '朝の余裕と夜の静けさが両方そろう。生活が忙しい花。',
    section: 'flower',
  },
  {
    id: 'slime:rainbow_core',
    name: '虹の核',
    hint: '偏らせない日が七日。スライムが何屋か分からなくなる。',
    section: 'slime',
  },
  {
    id: 'companion:librarian',
    name: '司書の仕草',
    hint: '勉強に長く座った日が重なると、相棒が本を持ち始める。メガネはずれてる。',
    section: 'companion',
  },
  {
    id: 'world:spotless',
    name: '磨かれた石畳',
    hint: '家事を重ねると道が石になる。掃除が勝ち誇る。',
    section: 'world',
  },
];

export function secretUnlocked(secret: Secret, signals: Signals): boolean {
  switch (secret.id) {
    case 'flower:moon_lotus':
      return signals.nightCount >= 7;
    case 'flower:gold':
      return signals.earlyCount >= 7;
    case 'flower:spectrum':
      return signals.fullSpectrumDays >= 1;
    case 'flower:last_bloom':
      return signals.lastMinuteCount >= 5;
    case 'flower:dawn_moon':
      return signals.nightDays >= 3 && signals.earlyDays >= 3;
    case 'slime:rainbow_core':
      return signals.balancedDays >= 7;
    case 'companion:librarian':
      return signals.studyFocusDays >= 5;
    case 'world:spotless':
      return signals.categoryPoints.housework >= 10;
    default:
      return false;
  }
}

export function unlockedSecrets(signals: Signals): Secret[] {
  return SECRETS.filter((secret) => secretUnlocked(secret, signals));
}
