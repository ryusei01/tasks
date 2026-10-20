import { useState, type RefObject } from 'react';
import { Share } from 'react-native';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import { shareMessage } from '../domain/shareText';
import type { Signals } from '../domain/types';
import type { ShareCardRef } from './ShareCard';

export function useShareCard(ref: RefObject<ShareCardRef | null>, signals: Signals, speech: string) {
  const [note, setNote] = useState('');

  async function share() {
    setNote('');
    try {
      const uri = await captureRef(ref.current as never, { format: 'png', quality: 1, result: 'tmpfile' });
      const fileUri = uri.startsWith('file://') || uri.startsWith('data:') ? uri : `file://${uri}`;
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, { mimeType: 'image/png', dialogTitle: 'はなことを共有' });
        setNote('共有シートを開いた。XやInstagramを選べる。');
        return;
      }
    } catch {
      // 画像化できない環境では文章共有に落とす。
    }
    try {
      await Share.share({ message: shareMessage(signals, speech) });
      setNote('画像の代わりに、文章を共有シートへ渡した。');
    } catch {
      setNote('この環境では共有シートを開けなかった。');
    }
  }

  return { share, note };
}
