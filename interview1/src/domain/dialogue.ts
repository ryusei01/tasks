import type { Difficulty, Situation, Task } from './types';
import type { Signals } from './types';
import { isEarly, isLastMinute, isNight } from './time';

const BOOK: Record<Difficulty, Record<Situation, readonly string[]>> = {
  super_soft: {
    complete: ['できたね。花が自分で拍手して、自分で照れてる。', 'えらい。葉が「すごいすごい」って小さく言って、隣の葉に自慢した。'],
    early: ['早すぎて花が寝ぼけたまま拍手してる。でも本気で喜んでる。', '余裕の完了。つぼみが「えっ、もう？」って布団から顔を出した。'],
    night: ['夜に終えたね。花がパジャマのまま拍手して、あくびが混ざった。', '静かな完了。葉が月を見て「ふぁ……えらい」ってなった。'],
    last_minute: ['間に合ったね。花が汗をぬぐって、それでも拍手。音は小さい。', 'ぎりぎり。株が「ヒヤッとした」って正直に言って、そのあと笑った。'],
    streak: ['続いてるね。甘えてきてもいい。膝、空いてる。花がすでに座ろうとしてる。', '毎日すこしずつ。花が増えて、賑やかで、ちょっとうるさい。'],
    rest: ['休んでいいよ。枯れはしない。葉は自分で布団になって丸まってる。', '今日はおしまい。枯れはしない。株はいびきの練習を始めた。'],
    long_focus: ['長く座ってたね。一緒に勉強する。ページは私がめくる。赤ペンは小さい。', '集中えらかった。相棒が豆電球みたいな目で、本を覗き込んでる。'],
    partial: ['触れただけで葉がびくっとした。起きてる起きてる。髪はまだ寝ぐせ。', '始めたね。庭が「おっ」って半分だけ起きて、もう半分は寝てる。'],
    idle: ['今日はまだ静か。一つ触れると、葉がびっくりして跳ねる。', '待ってるよ。急がなくていい。株は暇そうに、鼻歌のふり。'],
  },
  soft: {
    complete: ['できたね。花が水をねだる前に、先にガッツポーズした。', 'うん、終わった。花がこっちを向いて、ちょっと得意な顔。'],
    early: ['早めだね。つぼみが「予定より早い」とカレンダーを叩いてる。', '余裕がある。花が光りながら、早く見せたがってる。'],
    night: ['夜の完了だね。花が月に向かって、小さなガッツポーズ。', '夜に終えた。葉がしっとりして、「今日はこれで寝る」って宣言した。'],
    last_minute: ['間に合った。汗はかいた。花は笑いながら、ハンカチを出してきた。', '直前だったね。実が「もう少しで落ちるとこだった」と震えてる。'],
    streak: ['連続だね。相棒が距離を詰めて、もう膝の上の予約を入れてる。', '続いてる。花の数が増えて、庭がちょっと自慢げ。'],
    rest: ['休もう。枯れはしない。葉はもう丸まって、おやすみを先に言った。', '今日は休息。枯れはしない。株は元気なまま、布団の角度を調整中。'],
    long_focus: ['長く集中したね。相棒が司書の顔で、ページの端を押さえてる。', 'その時間、そばにいた。途中で居眠りしそうになって、自分で起こした。'],
    partial: ['着手したね。花が目を覚まして、寝ぐせを急いで直してる。', '途中でもいい。庭は応えてる。葉が「続きは？」って覗いてる。'],
    idle: ['まだ静かだね。一個でいい。葉が待ってるあいだ、小石を蹴ってる。', 'タスクを置くと庭が動き出す。今は、動く前のストレッチ。'],
  },
  normal: {
    complete: ['達成。花がひとつ拍手して、すぐに普通の顔に戻った。', '終わった。今日の分はここまで。花が「業務完了」って花弁を閉じかけた。'],
    early: ['早めの達成。花が光って、「予定どおりの前」とメモした。', '期限の前に終了。つぼみが開いて、ちょっと得意。'],
    night: ['夜の達成。花が月光を浴びて、あくびしながら受け取る。', '夜間に完了。葉が月寄りの色になって、「遅番、了解」と言った。'],
    last_minute: ['期限直前。花が汗をかいて、拍手は一回だけ。', 'ギリギリで完了。花は起きてる。心臓の代わりに葉がドキドキしてる。'],
    streak: ['連続達成。花が増えて、庭の人口密度が上がった。', '続いている。相棒が距離を詰めて、もう腕に手をかけてる。'],
    rest: ['休息にした。枯れはしない。葉は丸まって、いびきのふり。', '今日は休む。枯れはしない。株は生きている。むしろ気楽そうな顔。'],
    long_focus: ['集中が長い。一緒に勉強する。相棒のメガネが少しずれてる。', '長い着手。ページが進んで、花が赤ペンを持ってきた。小さすぎて読めない。'],
    partial: ['着手。葉が少し開いて、「続きある？」と聞いてきた。', '開始。完了の前でも庭は動く。今は準備運動の顔。'],
    idle: ['今日の庭は、まだタスクを待って、小石でまるを描いてる。', '期限つきタスクがない日は、株が静かに立って、暇を隠してない。'],
  },
  hard: {
    complete: ['遅い。でも終わった。花の拍手は一回で、すぐに腕を組んだ。', '終わっただけでは足りない。花が「で、次は？」と花弁をトントンしてる。'],
    early: ['早い。その顔を崩すな。花は認めたが、まだ王冠は貸さない。', '前倒しは認めた。つぼみが「これが普通」という顔で開いた。'],
    night: ['夜まで持ったな。遅い。花は月光を浴びながら、不機嫌に光ってる。', '夜間完了。月光は出た。花は「遅番、減点」と花弁に書いた。'],
    last_minute: ['ギリギリだ。花が汗を見て、拍手を拒否した。', '直前は遅い。葉が「ヒヤヒヤしただろう」と自分で自分に言ってる。'],
    streak: ['続いている。花は増えた。そこでニヤけるな。とげはまだ仮。', '連続は事実だ。相棒が距離を詰めて、「調子に乗るな」と膝を叩いた。'],
    rest: ['休むのか。勝手にしろ。ただし、枯れはしない。花は腕を組んで寝る。', '今日はここまでだ。枯れはしない。死にはしない。花は不機嫌なまま布団。'],
    long_focus: ['長い集中は認めた。中身が薄ければ、花は赤ペンを置く。', '座っていた時間は見た。花が「で、ページは進んだのか」と覗き込んだ。'],
    partial: ['着手だけか。まだ足りない。花が片眉を上げて待ってる。', '始めた事実だけだ。葉が途中で丸まりかけて、自分で止めた。'],
    idle: ['まだ何もしていない。足りない。株は待ってる。暇そうな顔はしてない。', '空白のままだ。一つ置け。枯れはしないが、花は腕を組んだまま。'],
  },
  super_hard: {
    complete: ['その程度で満足するな。花は拍手を拒否して、花弁を腕組みにしてる。', '完了は通過点だ。花が「次は余裕でやれ」と花弁の裏に書いた。'],
    early: ['早い。それでいい。だが満足するな。王冠はまだ床に置いたまま。', '前倒しを当然にしろ。つぼみが一度ニヤけて、自分で消した。'],
    night: ['夜に終えた。遅い。花は月を見て、「証人にはしない」と言った。', '月光に頼るな。遅い完了だ。葉が月の色になったまま、不機嫌。'],
    last_minute: ['ギリギリだ。時間内に収めろ。花が汗を見て、ハンカチを貸さなかった。', '直前完了は遅い。その汗を実が真似して、ぶるぶる震えてる。'],
    streak: ['続いている。まだ足りない。花は増えたが、拍手は保留。', '連続は最低線だ。そこで満足するな。とげは、まだ審査中。'],
    rest: ['休むなら休め。枯れはしない。花は寝ながら、明日の分まで腕を組んでる。', '休止を認める。株は生きている。言い訳は、花が聞いてない。'],
    long_focus: ['集中は認めた。その程度で満足するな。赤ペンがまだ赤い。', '長いだけで足りない。花がページの薄さを、花弁で測ってる。'],
    partial: ['着手だけか。まだ足りない。だが株は生きている。花は片眉だけ上げた。', '開始は通過点にも届いていない。葉が「続き」と地面に書いた。'],
    idle: ['まだ何もしていない。足りない。株は待ってる。沈黙がちょっとうるさい。', '空白を許さない。一つ置け。枯れはしない。花は腕を組んで、時計を見てる。'],
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
