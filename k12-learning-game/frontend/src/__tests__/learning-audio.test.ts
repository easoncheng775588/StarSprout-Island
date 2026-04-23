import { afterEach, describe, expect, test, vi } from 'vitest';
import { createAudioPlaybackPlan, playLearningAudio } from '../audio/learningAudio';

describe('learning audio playback planning', () => {
  test('prefers recorded assets and keeps speed mode metadata', () => {
    const plan = createAudioPlaybackPlan({
      text: 'apple',
      lang: 'en-US',
      speedMode: 'slow',
      recordedAssetUrl: '/audio/apple.mp3'
    });

    expect(plan.source).toBe('recorded-asset');
    expect(plan.playbackRate).toBe(0.85);
    expect(plan.teacherLabel).toBe('录音素材 · en-US');
    expect(plan.statusLabel).toBe('使用录音素材领读');
  });

  test('falls back to browser speech when no recorded asset is configured', () => {
    const plan = createAudioPlaybackPlan({
      text: '你好',
      lang: 'zh-CN',
      speedMode: 'normal'
    });

    expect(plan.source).toBe('browser-tts');
    expect(plan.playbackRate).toBe(0.85);
    expect(plan.teacherLabel).toBe('zh-CN · 浏览器语音老师');
    expect(plan.statusLabel).toBe('使用浏览器语音领读');
  });

  test('falls back to browser speech when recorded asset playback fails', async () => {
    const cancel = vi.fn();
    const speak = vi.fn();

    class MockUtterance {
      lang = '';
      rate = 1;
      pitch = 1;
      voice?: SpeechSynthesisVoice;
      constructor(public text: string) {}
    }

    class MockAudio {
      playbackRate = 1;
      constructor(public src: string) {}
      play() {
        return Promise.reject(new Error('missing asset'));
      }
    }

    Object.defineProperty(window, 'speechSynthesis', {
      configurable: true,
      value: {
        cancel,
        speak,
        getVoices: () => []
      }
    });
    Object.defineProperty(window, 'SpeechSynthesisUtterance', {
      configurable: true,
      value: MockUtterance
    });
    vi.stubGlobal('Audio', MockAudio);

    const result = await playLearningAudio({
      text: 'apple',
      lang: 'en-US',
      speedMode: 'normal',
      recordedAssetUrl: '/audio/apple.mp3'
    });

    expect(result.played).toBe(true);
    expect(result.sourceLabel).toBe('录音素材暂时不可用，已切换浏览器语音');
    expect(cancel).toHaveBeenCalled();
    expect(speak).toHaveBeenCalledTimes(1);
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
});
