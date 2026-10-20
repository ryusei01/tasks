import type { Difficulty, Situation, Task } from './types';
import type { Signals } from './types';
import { isEarly, isLastMinute, isNight } from './time';

const BOOK: Record<Difficulty, Record<Situation, readonly string[]>> = {
  super_soft: {
    complete: ['できたね。それだけで、花がひとつ息をしたよ。', 'えらいよ。葉が、そっと開いた。'],
    early: ['早めにできたね。花がやさしく光ったよ。', '余裕があったね。つぼみが安心している。'],
    night: ['夜に終えたね。花が月光を浴びているよ。', '静かな時間にできたね。葉が月の色になった。'],
    last_minute: ['間に合ったね。ちょっと汗をかいているよ。', 'ぎりぎりでも、終わったことがうれしい。'],
    streak: ['続いてるね。甘えてきてもいいくらいだよ。', '毎日すこしずつ。花が増えていくよ。'],
    rest: ['休んでいいよ。枯れはしない。葉は丸まって、また明日。', '今日はおしまいにしよう。枯れはしない。株は元気なままだよ。'],
    long_focus: ['長く座っていたね。一緒に勉強するよ。', '集中、えらかった。ページを一緒にめくるね。'],
    partial: ['触れてくれただけで、葉が少し動いたよ。', '始めたね。それだけで庭は起きている。'],
    idle: ['今日はまだ静かだよ。一つでも触れると、葉が動く。', '待っているよ。急がなくていい。'],
  },
  soft: {
    complete: ['できたね。水、いっしょにやろ。', 'うん、終わった。花がこちらを向いた。'],
    early: ['早めだね。花が光りはじめた。', '時間に余裕がある。つぼみが開きたがっている。'],
    night: ['夜の完了だね。月光の花になるよ。', '夜に終えた。葉がしっとりしている。'],
    last_minute: ['間に合った。汗はかいたけど、花は笑ってる。', '直前だったね。それでも実は残る。'],
    streak: ['連続だね。信頼して、そばにいるよ。', '続いてる。花の数が増えた。'],
    rest: ['休もう。枯れはしない。明日また水をやろ。', '今日は休息。枯れはしない。葉は丸まるだけだよ。'],
    long_focus: ['長く集中したね。一緒に勉強する。', 'その時間、そばにいたよ。'],
    partial: ['着手したね。花が目を覚ました。', '途中でもいい。庭は応えている。'],
    idle: ['まだ静かだね。一個でいいから、触れてみよ。', 'タスクを置くと、庭が動き出すよ。'],
  },
  normal: {
    complete: ['達成。花がひとつ応えた。', '終わった。今日の分は、ここまで。'],
    early: ['早めの達成。花が光っている。', '期限の前に終了。つぼみが開いた。'],
    night: ['夜の達成。花が月光を浴びている。', '夜間に完了。葉の色が月寄りになった。'],
    last_minute: ['期限直前の達成。汗をかいている。', 'ギリギリで完了。花は起きている。'],
    streak: ['連続達成。花が増えた。', '続いている。相棒が距離を詰めた。'],
    rest: ['休息にした。枯れはしない。葉は丸まって眠る。', '今日は休む。枯れはしない。株は生きている。'],
    long_focus: ['集中が長い。一緒に勉強する。', '長い着手。ページが進んだ。'],
    partial: ['着手。葉が少し開いた。', '開始。完了の前でも、庭は動く。'],
    idle: ['今日の庭は、まだタスクを待っている。', '期限つきタスクがない日は、株が静かに立つ。'],
  },
  hard: {
    complete: ['遅い。でも終わった。次は時間内だ。', '終わっただけでは足りない。次はもっと前で終えろ。'],
    early: ['早い。その調子を崩すな。まだ足りない。', '前倒しは認めた。次も時間内より前だ。'],
    night: ['夜まで持ったな。遅い。明日は明るいうちに片をつけろ。', '夜間完了。月光は出たが、満足するな。'],
    last_minute: ['ギリギリだ。次は時間内の手前で収めろ。', '直前は遅い。汗をかけ。次は繰り返すな。'],
    streak: ['続いている。気を抜くな。まだ足りない。', '連続は事実だ。そこで満足するな。'],
    rest: ['休むのか。勝手にしろ。ただし、枯れはしない。', '今日はここまでだ。枯れはしない。花は眠る。死にはしない。'],
    long_focus: ['長い集中は認めた。中身が薄ければ足りない。', '座っていた時間は見た。次は成果で示せ。'],
    partial: ['着手だけか。まだ足りない。完了まで持っていけ。', '始めた事実だけだ。途中で逃げるな。'],
    idle: ['まだ何もしていない。足りない。株は待っている。', '空白のままだ。一つ置け。枯れはしないが、進んでもいない。'],
  },
  super_hard: {
    complete: ['その程度で満足するな。花は光っていない。まだ足りない。', '完了は通過点だ。次は余裕を作れ。'],
    early: ['早い。それでいい。だが満足するな。', '前倒しを当然にしろ。一度で調子に乗るな。'],
    night: ['夜に終えた。遅い。次は明るいうちに片をつけろ。', '月光に頼るな。遅い完了だ。明日は前に出せ。'],
    last_minute: ['ギリギリだ。時間内に収めろ。次はもっと前だ。', '直前完了は遅い。その汗を習慣にするな。'],
    streak: ['続いている。まだ足りない。気を抜くな。', '連続は最低線だ。そこで満足するな。'],
    rest: ['休むなら休め。枯れはしない。明日、取り返す。', '休止を認める。株は生きている。言い訳は明日するな。'],
    long_focus: ['集中は認めた。その程度で満足するな。', '長いだけで足りない。密度を上げろ。'],
    partial: ['着手だけか。まだ足りない。だが株は生きている。', '開始は通過点にも届いていない。完了まで持っていけ。'],
    idle: ['まだ何もしていない。足りない。株は待っている。', '空白を許さない。一つ置け。枯れはしない。'],
  },
};

export function linesFor(difficulty: Difficulty, situation: Situation): readonly string[] {
  return BOOK[difficulty][situation];
}

export function pickLine(difficulty: Difficulty, situation: Situation, salt: number): string {
  const lines = linesFor(difficulty, situation);
  const index = Math.abs(salt) % lines.length;
  return lines[index];
}

export function situationFor(
  action: 'complete' | 'rest' | 'start',
  task: Task,
  signals: Signals,
): Situation {
  if (action === 'rest') return 'rest';
  if (action === 'start') return signals.longFocusToday ? 'long_focus' : 'partial';
  if (task.completedAt && isEarly(task.completedAt, task.dueAt)) return 'early';
  if (task.completedAt && isNight(task.completedAt)) return 'night';
  if (task.completedAt && isLastMinute(task.completedAt, task.dueAt)) return 'last_minute';
  if (signals.longFocusToday) return 'long_focus';
  if (signals.streak >= 3) return 'streak';
  return 'complete';
}

export function idleSpeech(signals: Signals, difficulty: Difficulty, salt: number): string {
  if (signals.restedYesterday && !signals.engagedToday) {
    return pickLine(difficulty, 'rest', salt);
  }
  return pickLine(difficulty, 'idle', salt);
}

export const SOFT_BANNED = ['満足するな', '取り返す', '言い訳', '気を抜くな', '片をつけろ', '収めろ', '通過点'];

export function assuresSurvival(text: string): boolean {
  return text.includes('枯れはしない') || text.includes('死にはしない') || text.includes('株は生きている');
}
