import type { AudioSpeedMode } from '../components/AudioModeControls';

export type AudioPlaybackSource = 'recorded-asset' | 'browser-tts';

export interface AudioPlaybackRequest {
  text: string;
  lang: string;
  speedMode: AudioSpeedMode;
  recordedAssetUrl?: string;
}

export interface AudioPlaybackPlan {
  text: string;
  lang: string;
  source: AudioPlaybackSource;
  playbackRate: number;
  recordedAssetUrl?: string;
  teacherLabel: string;
  statusLabel: string;
}

export interface AudioPlaybackResult {
  played: boolean;
  voiceLabel: string;
  sourceLabel: string;
}

export function createAudioPlaybackPlan({
  text,
  lang,
  speedMode,
  recordedAssetUrl
}: AudioPlaybackRequest): AudioPlaybackPlan {
  const playbackRate = speedMode === 'slow'
    ? (lang.startsWith('zh') ? 0.72 : 0.85)
    : (lang.startsWith('zh') ? 0.85 : 0.92);

  if (recordedAssetUrl) {
    return {
      text,
      lang,
      source: 'recorded-asset',
      playbackRate,
      recordedAssetUrl,
      teacherLabel: `录音素材 · ${lang}`,
      statusLabel: '使用录音素材领读'
    };
  }

  return {
    text,
    lang,
    source: 'browser-tts',
    playbackRate,
    teacherLabel: `${lang} · 浏览器语音老师`,
    statusLabel: '使用浏览器语音领读'
  };
}

function getPreferredVoice(lang: string) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return undefined;
  }

  const voices = window.speechSynthesis.getVoices?.() ?? [];
  const languageRoot = lang.toLowerCase().split('-')[0];
  const preferredNames = languageRoot === 'zh'
    ? ['Tingting', 'Meijia', 'Eddy', 'Flo', 'Shelley', 'Reed', 'Rocko', 'Sandy']
    : ['Samantha', 'Karen', 'Daniel', 'Alex'];

  const languageMatches = voices.filter((voice) => voice.lang.toLowerCase().startsWith(languageRoot));

  for (const preferredName of preferredNames) {
    const matchedVoice = languageMatches.find((voice) => voice.name.includes(preferredName));
    if (matchedVoice) {
      return matchedVoice;
    }
  }

  return languageMatches[0];
}

export function playLearningAudio(request: AudioPlaybackRequest): AudioPlaybackResult {
  const plan = createAudioPlaybackPlan(request);

  if (plan.source === 'recorded-asset' && plan.recordedAssetUrl && typeof Audio !== 'undefined') {
    const audio = new Audio(plan.recordedAssetUrl);
    audio.playbackRate = plan.playbackRate;
    void audio.play();
    return {
      played: true,
      voiceLabel: plan.teacherLabel,
      sourceLabel: plan.statusLabel
    };
  }

  if (typeof window === 'undefined' || !('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window)) {
    return {
      played: false,
      voiceLabel: '当前设备暂未准备好语音老师',
      sourceLabel: '当前设备暂不支持语音播放'
    };
  }

  window.speechSynthesis.cancel();
  const utterance = new window.SpeechSynthesisUtterance(plan.text);
  utterance.lang = plan.lang;
  utterance.rate = plan.playbackRate;
  utterance.pitch = plan.lang.startsWith('zh') ? 1.05 : 1;

  const preferredVoice = getPreferredVoice(plan.lang);
  if (preferredVoice) {
    utterance.voice = preferredVoice;
  }

  window.speechSynthesis.speak(utterance);
  return {
    played: true,
    voiceLabel: preferredVoice ? `${preferredVoice.lang} · ${preferredVoice.name}` : plan.teacherLabel,
    sourceLabel: plan.statusLabel
  };
}
