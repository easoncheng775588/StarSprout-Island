import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import App from '../App';

describe('Level completion flow', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
        const url = String(input);

        if (url.endsWith('/api/levels/math-numbers-001') && !init?.method) {
          return {
            ok: true,
            json: async () => ({
              code: 'math-numbers-001',
              title: '数字小探险',
              subjectTitle: '数学岛',
              description: '拖一拖、选一选，把数字和数量变成好朋友。',
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

        if (url.endsWith('/api/levels/math-numbers-001/complete') && init?.method === 'POST') {
          return {
            ok: true,
            json: async () => ({
              levelCode: 'math-numbers-001',
              reward: {
                stars: 3,
                badgeName: '数字小达人'
              },
              message: 'perfect'
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

  test('submits a completed level and shows reward feedback', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={['/levels/math-numbers-001']}>
        <App />
      </MemoryRouter>
    );

    expect(await screen.findByRole('button', { name: '苹果 1' })).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /苹果 \d/ })).toHaveLength(5);
    expect(screen.getAllByAltText('苹果图片')).toHaveLength(5);
    expect(screen.getByLabelText('苹果篮子')).toBeInTheDocument();
    expect(screen.getByAltText('篮子图片')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '数字石牌 5' })).toBeInTheDocument();

    const button = screen.getByRole('button', { name: '完成本关' });
    expect(button).toBeDisabled();

    await user.click(screen.getByRole('button', { name: '苹果 1' }));
    await user.click(screen.getByRole('button', { name: '苹果 2' }));
    await user.click(screen.getByRole('button', { name: '苹果 3' }));
    await user.click(screen.getByRole('button', { name: '苹果 4' }));
    await user.click(screen.getByRole('button', { name: '苹果 5' }));

    expect(screen.getByText('篮子里已经有 5 个苹果啦')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '数字石牌 5' }));
    expect(screen.getByText('找对了，数字 5 已经点亮')).toBeInTheDocument();
    expect(button).toBeEnabled();

    await user.click(button);

    expect(await screen.findByText('获得 3 颗星星')).toBeInTheDocument();
    expect(screen.getByText('数字小达人')).toBeInTheDocument();
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/levels/math-numbers-001/complete',
      expect.objectContaining({ method: 'POST' })
    );
  });
});
