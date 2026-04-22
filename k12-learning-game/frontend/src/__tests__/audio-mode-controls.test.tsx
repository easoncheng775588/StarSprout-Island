import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { AudioModeControls } from '../components/AudioModeControls';

describe('AudioModeControls', () => {
  test('renders teacher voice and lets children switch speed', async () => {
    const user = userEvent.setup();
    const onModeChange = vi.fn();

    render(
      <AudioModeControls
        audioSpeedMode="normal"
        audioTeacherLabel="Samantha"
        onModeChange={onModeChange}
      />
    );

    expect(screen.getByText('当前老师音色：Samantha')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '标准速度' })).toHaveClass('audio-mode-chip-active');

    await user.click(screen.getByRole('button', { name: '慢速跟读' }));

    expect(onModeChange).toHaveBeenCalledWith('slow');
  });
});
