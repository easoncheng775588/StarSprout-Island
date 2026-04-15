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
              ],
              achievementPreview: {
                unlockedCount: 6,
                totalCount: 10,
                nextBadgeName: '本周小冠军'
              }
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
                    { code: 'math-numbers-002', title: '认识 11-20', status: 'available' },
                    { code: 'math-addition-001', title: '10 以内加法', status: 'available' },
                    { code: 'math-addition-002', title: '20 以内加法', status: 'available' },
                    { code: 'math-thinking-001', title: '规律小火车', status: 'available' },
                    { code: 'math-thinking-002', title: '图形规律屋', status: 'available' },
                    { code: 'math-subtraction-001', title: '水果减减看', status: 'available' },
                    { code: 'math-subtraction-002', title: '20 以内减法', status: 'available' },
                    { code: 'math-compare-001', title: '谁更多挑战', status: 'available' },
                    { code: 'math-equation-001', title: '图像列式屋', status: 'available' },
                    { code: 'math-wordproblem-001', title: '故事应用题', status: 'available' }
                  ]
                }
              ]
            })
          } as Response;
        }

        if (url.endsWith('/api/subjects/chinese/map')) {
          return {
            ok: true,
            json: async () => ({
              subject: { code: 'chinese', title: '语文岛' },
              chapters: [
                {
                  code: 'chinese-characters',
                  title: '汉字花园',
                  subtitle: '会读、会认、会观察字形',
                  levels: [
                    { code: 'chinese-characters-001', title: '太阳和月亮', status: 'recommended' },
                    { code: 'chinese-characters-002', title: '生活常见字', status: 'available' },
                    { code: 'chinese-pinyin-001', title: '拼音泡泡', status: 'available' },
                    { code: 'chinese-pinyin-002', title: '拼读小火车', status: 'available' },
                    { code: 'chinese-strokes-001', title: '笔顺小画家', status: 'available' },
                    { code: 'chinese-strokes-002', title: '日字描描乐', status: 'available' }
                  ]
                }
              ]
            })
          } as Response;
        }

        if (url.endsWith('/api/subjects/english/map')) {
          return {
            ok: true,
            json: async () => ({
              subject: { code: 'english', title: '英语岛' },
              chapters: [
                {
                  code: 'english-letters',
                  title: '字母海湾',
                  subtitle: '把字母、拼读和小绘本连起来',
                  levels: [
                    { code: 'english-letters-001', title: '字母 A 到 F', status: 'recommended' },
                    { code: 'english-letters-002', title: '字母 G 到 L', status: 'available' },
                    { code: 'english-letters-003', title: '字母 M 到 R', status: 'available' },
                    { code: 'english-letters-004', title: '字母 S 到 Z', status: 'available' },
                    { code: 'english-phonics-001', title: '字母藏在单词里', status: 'available' },
                    { code: 'english-words-001', title: '日常单词配对', status: 'available' },
                    { code: 'english-words-002', title: '生活单词跟读', status: 'available' },
                    { code: 'english-story-001', title: '海湾小绘本', status: 'available' },
                    { code: 'english-story-002', title: '晨光小绘本', status: 'available' }
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
    expect(screen.getByRole('link', { name: '成就墙' })).toHaveAttribute('href', '/achievements');
    expect(screen.getByText(/已点亮/)).toHaveTextContent('再点亮 1 枚徽章，就能获得“本周小冠军”');
  });

  test('falls back when home overview omits achievement preview', async () => {
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

        throw new Error(`Unhandled fetch: ${url}`);
      })
    );

    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    expect(await screen.findByText('银河探险家')).toBeInTheDocument();
    expect(screen.getByText(/已点亮/)).toHaveTextContent('再点亮 1 枚徽章，就能获得“继续加油章”');
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
    expect(screen.getByText('认识 11-20')).toBeInTheDocument();
    expect(screen.getByText('10 以内加法')).toBeInTheDocument();
    expect(screen.getByText('20 以内加法')).toBeInTheDocument();
    expect(screen.getByText('规律小火车')).toBeInTheDocument();
    expect(screen.getByText('图形规律屋')).toBeInTheDocument();
    expect(screen.getByText('水果减减看')).toBeInTheDocument();
    expect(screen.getByText('20 以内减法')).toBeInTheDocument();
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

  test('renders expanded chinese and english subject maps', async () => {
    const { unmount } = render(
      <MemoryRouter initialEntries={['/subjects/chinese']}>
        <App />
      </MemoryRouter>
    );

    expect(await screen.findByText('汉字花园')).toBeInTheDocument();
    expect(screen.getByText('生活常见字')).toBeInTheDocument();
    expect(screen.getByText('拼读小火车')).toBeInTheDocument();
    expect(screen.getByText('日字描描乐')).toBeInTheDocument();

    unmount();

    render(
      <MemoryRouter initialEntries={['/subjects/english']}>
        <App />
      </MemoryRouter>
    );

    expect(await screen.findByText('字母海湾')).toBeInTheDocument();
    expect(screen.getByText('字母 G 到 L')).toBeInTheDocument();
    expect(screen.getByText('字母 M 到 R')).toBeInTheDocument();
    expect(screen.getByText('字母 S 到 Z')).toBeInTheDocument();
    expect(screen.getByText('字母藏在单词里')).toBeInTheDocument();
    expect(screen.getByText('生活单词跟读')).toBeInTheDocument();
    expect(screen.getByText('晨光小绘本')).toBeInTheDocument();
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
