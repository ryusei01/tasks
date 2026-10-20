import type { Signals } from './types';

export function shareMessage(signals: Signals, speech: string): string {
  const rate =
    signals.todayRate == null ? '今日の期限つきタスクはない' : `達成率 ${Math.round(signals.todayRate * 100)}%`;
  return `はなこと\n${rate}\n連続 ${signals.streak}日\n${speech}`;
}
