import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import App from '../App';

describe('Olympiad training module', () => {
  beforeEach(() => {
    window.localStorage.setItem(
      'k12-learning-game-session',
      JSON.stringify({
        parentAccountId: 1,
        parentDisplayName: '星星妈妈',
        childProfileId: 1,
        childNickname: '小星星',
        children: [
          { id: 1, nickname: '小星星', streakDays: 7, totalStars: 126, title: '晨光冒险家', stageLabel: '幼小衔接' }
        ]
      })
    );

    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        throw new Error('Olympiad route should render from local training map');
      })
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    window.localStorage.clear();
  });

  test('shows a first through sixth grade olympiad training path', async () => {
    render(
      <MemoryRouter initialEntries={['/olympiad']}>
        <App />
      </MemoryRouter>
    );

    expect(await screen.findByRole('heading', { name: '奥数训练营' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '一年级' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '六年级' })).toBeInTheDocument();
    expect(screen.getByText('找规律')).toBeInTheDocument();
    expect(screen.getByText('鸡兔同笼')).toBeInTheDocument();
    expect(screen.getByText('工程问题')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /挑战 鸡兔同笼/ })).toHaveAttribute(
      'href',
      '/levels/olympiad-g4-chicken-rabbit-001'
    );
  });

  test('supports grade filtering and recommends a focused training level', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={['/olympiad']}>
        <App />
      </MemoryRouter>
    );

    expect(await screen.findByText('今日推荐训练')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /开始推荐关卡/ })).toHaveAttribute(
      'href',
      '/levels/olympiad-g1-pattern-001'
    );
    expect(screen.getByText('能力雷达')).toBeInTheDocument();
    expect(screen.getAllByText('模型应用').length).toBeGreaterThan(0);
    expect(screen.getByText('解题四步法')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '四年级路线' }));

    expect(screen.getByRole('heading', { name: '四年级' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: '一年级' })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: /挑战 鸡兔同笼/ })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /开始推荐关卡/ })).toHaveAttribute(
      'href',
      '/levels/olympiad-g4-chicken-rabbit-001'
    );
  });
});
