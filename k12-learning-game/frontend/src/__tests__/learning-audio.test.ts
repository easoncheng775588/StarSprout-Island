import { describe, expect, test } from 'vitest';
import { createAudioPlaybackPlan } from '../audio/learningAudio';

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
});
