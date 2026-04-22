export type AudioSpeedMode = 'normal' | 'slow';

interface AudioModeControlsProps {
  audioSpeedMode: AudioSpeedMode;
  audioTeacherLabel: string;
  onModeChange: (mode: AudioSpeedMode) => void;
}

export function AudioModeControls({
  audioSpeedMode,
  audioTeacherLabel,
  onModeChange
}: AudioModeControlsProps) {
  return (
    <>
      <div className="audio-mode-row">
        <button
          className={`audio-mode-chip ${audioSpeedMode === 'normal' ? 'audio-mode-chip-active' : ''}`}
          onClick={() => onModeChange('normal')}
          type="button"
        >
          标准速度
        </button>
        <button
          className={`audio-mode-chip ${audioSpeedMode === 'slow' ? 'audio-mode-chip-active' : ''}`}
          onClick={() => onModeChange('slow')}
          type="button"
        >
          慢速跟读
        </button>
      </div>
      <p className="audio-helper-text">当前老师音色：{audioTeacherLabel}</p>
    </>
  );
}
