import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import App from '../App';

describe('App shell', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async (input: RequestInfo | URL) => {
        const url = String(input);

        if (url.endsWith('/api/home/overview')) {
          return {
            ok: true,
            json: async () => ({
              child: {
                id: 1,
                nickname: '小火箭',
                streakDays: 9,
                totalStars: 188,
                title: '银河探险家'
              },
              subjects: [
                { code: 'math', title: '数学岛', subtitle: '数字火花开始跳舞', accentColor: '#ff8a5b' },
                { code: 'chinese', title: '语文岛', subtitle: '拼音种子正在发芽', accentColor: '#f2c14e' },
                { code: 'english', title: '英语岛', subtitle: '单词海风轻轻吹', accentColor: '#39b7a5' }
              ]
            })
          } as Response;
        }

        if (url.endsWith('/api/subjects/math/map')) {
          return {
            ok: true,
            json: async () => ({
              subject: { code: 'math', title: '数学岛' },
              chapters: [
                {
                  code: 'math-numbers',
                  title: '数字启蒙站',
                  subtitle: '新的数字旅程',
                  levels: [
                    { code: 'math-numbers-001', title: '认识 0-10', status: 'recommended' },
                    { code: 'math-addition-001', title: '10 以内加法', status: 'available' },
                    { code: 'math-thinking-001', title: '规律小火车', status: 'available' },
                    { code: 'math-subtraction-001', title: '水果减减看', status: 'available' },
                    { code: 'math-compare-001', title: '谁更多挑战', status: 'available' },
                    { code: 'math-equation-001', title: '图像列式屋', status: 'available' },
                    { code: 'math-wordproblem-001', title: '故事应用题', status: 'available' }
                  ]
                }
              ]
            })
          } as Response;
        }

        if (url.endsWith('/api/levels/math-numbers-001')) {
          return {
            ok: true,
            json: async () => ({
              code: 'math-numbers-001',
              title: '数字小探险',
              subjectTitle: '数学岛',
              description: '真的从接口里取到了这一关。',
              steps: [
                { id: 'step-1', type: 'drag-match', prompt: '把 5 个苹果拖进篮子' },
                { id: 'step-2', type: 'tap-choice', prompt: '找到写着 5 的数字石牌' }
              ],
              reward: {
                stars: 3,
                badgeName: '数字小达人'
              }
            })
          } as Response;
        }

        throw new Error(`Unhandled fetch: ${url}`);
      })
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  test('renders the home world with subject islands and task card', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    expect(await screen.findByText('银河探险家')).toBeInTheDocument();
    expect(screen.getByText('数学岛')).toBeInTheDocument();
    expect(screen.getByText('语文岛')).toBeInTheDocument();
    expect(screen.getByText('英语岛')).toBeInTheDocument();
    expect(screen.getByText('今日任务')).toBeInTheDocument();
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/home/overview',
      expect.objectContaining({
        headers: expect.objectContaining({ 'Content-Type': 'application/json' })
      })
    );
  });

  test('shows home shortcuts for parent dashboard and leaderboard', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    expect(await screen.findByText('银河探险家')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '家长中心' })).toHaveAttribute('href', '/parent');
    expect(screen.getByRole('link', { name: '排行榜' })).toHaveAttribute('href', '/leaderboard');
  });

  test('renders subject map nodes from route data', async () => {
    render(
      <MemoryRouter initialEntries={['/subjects/math']}>
        <App />
      </MemoryRouter>
    );

    expect(await screen.findByText('数字启蒙站')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '返回首页' })).toHaveAttribute('href', '/');
    expect(screen.getByText('认识 0-10')).toBeInTheDocument();
    expect(screen.getByText('10 以内加法')).toBeInTheDocument();
    expect(screen.getByText('规律小火车')).toBeInTheDocument();
    expect(screen.getByText('水果减减看')).toBeInTheDocument();
    expect(screen.getByText('谁更多挑战')).toBeInTheDocument();
    expect(screen.getByText('图像列式屋')).toBeInTheDocument();
    expect(screen.getByText('故事应用题')).toBeInTheDocument();
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/subjects/math/map',
      expect.objectContaining({
        headers: expect.objectContaining({ 'Content-Type': 'application/json' })
      })
    );
  });

  test('renders level player summary and step prompts', async () => {
    render(
      <MemoryRouter initialEntries={['/levels/math-numbers-001']}>
        <App />
      </MemoryRouter>
    );

    expect(await screen.findByText('数字小探险')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '返回数学岛' })).toHaveAttribute('href', '/subjects/math');
    expect(screen.getByText('把 5 个苹果拖进篮子')).toBeInTheDocument();
    expect(screen.getByText('第 1 / 2 步')).toBeInTheDocument();
    expect(screen.getByText('真的从接口里取到了这一关。')).toBeInTheDocument();
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/levels/math-numbers-001',
      expect.objectContaining({
        headers: expect.objectContaining({ 'Content-Type': 'application/json' })
      })
    );
  });
});
