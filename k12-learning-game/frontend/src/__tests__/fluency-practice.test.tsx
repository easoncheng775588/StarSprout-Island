import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { FluencyPracticePage } from '../pages/FluencyPracticePage';
import { SessionProvider } from '../session';

describe('FluencyPracticePage', () => {
  beforeEach(() => {
    window.localStorage.setItem(
      'k12-learning-game-session',
      JSON.stringify({
        parentAccountId: 1,
        parentDisplayName: '星星妈妈',
        childProfileId: 1,
        childNickname: '小星星',
        children: [
          {
            id: 1,
            nickname: '小星星',
            streakDays: 4,
            totalStars: 138,
            title: '晨光冒险家',
            stageLabel: '一年级',
            avatarColor: '#ffcf70'
          }
        ]
      })
    );
  });

  afterEach(() => {
    window.localStorage.clear();
  });

  test('runs a short stage-aware daily math fluency practice', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <SessionProvider>
          <FluencyPracticePage />
        </SessionProvider>
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: '1 分钟数感快练' })).toBeInTheDocument();
    expect(screen.getByText('一年级快练')).toBeInTheDocument();
    expect(screen.getByText('3 + 4 = ?')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '7' }));
    expect(screen.getByText('9 - 2 = ?')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '7' }));
    await user.click(screen.getByRole('button', { name: '12' }));
    await user.click(screen.getByRole('button', { name: '8' }));
    await user.click(screen.getByRole('button', { name: '15' }));

    expect(screen.getByText('今日快练完成')).toBeInTheDocument();
    expect(screen.getByText('完成 5 题，答对 5 题')).toBeInTheDocument();
    expect(screen.getByText('小星星的数感速度正在变稳')).toBeInTheDocument();
  });
});
