import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import App from '../App';

function mockLevelResponse(levelCode: string) {
  const payloads: Record<string, unknown> = {
    'math-subtraction-001': {
      code: 'math-subtraction-001',
      title: '水果减减看',
      subjectTitle: '数学岛',
      description: '点一点拿走水果，再想想还剩多少。',
      steps: [
        { id: 'step-1', type: 'take-away', prompt: '从 8 个草莓里拿走 3 个' },
        { id: 'step-2', type: 'tap-choice', prompt: '还剩几个草莓？' }
      ],
      reward: { stars: 2, badgeName: '减法小能手' }
    },
    'math-compare-001': {
      code: 'math-compare-001',
      title: '谁更多挑战',
      subjectTitle: '数学岛',
      description: '看一看两边的数量，选出更多的一组。',
      steps: [
        { id: 'step-1', type: 'comparison-choice', prompt: '哪一边的小鱼更多？' }
      ],
      reward: { stars: 2, badgeName: '数感小雷达' }
    },
    'math-equation-001': {
      code: 'math-equation-001',
      title: '图像列式屋',
      subjectTitle: '数学岛',
      description: '看着图片把加法算式列出来。',
      steps: [
        { id: 'step-1', type: 'equation-choice', prompt: '看图片，选出正确的算式' }
      ],
      reward: { stars: 2, badgeName: '列式小侦探' }
    },
    'math-wordproblem-001': {
      code: 'math-wordproblem-001',
      title: '故事应用题',
      subjectTitle: '数学岛',
      description: '听故事、看图画，再算出最后的答案。',
      steps: [
        { id: 'step-1', type: 'story-choice', prompt: '小兔子有 4 根胡萝卜，又收到 2 根，一共有几根？' }
      ],
      reward: { stars: 2, badgeName: '应用题小勇士' }
    }
  };

  return payloads[levelCode];
}

describe('Expanded math levels', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
        const url = String(input);

        for (const levelCode of ['math-subtraction-001', 'math-compare-001', 'math-equation-001', 'math-wordproblem-001']) {
          if (url.endsWith(`/api/levels/${levelCode}`) && !init?.method) {
            return {
              ok: true,
              json: async () => mockLevelResponse(levelCode)
            } as Response;
          }

          if (url.endsWith(`/api/levels/${levelCode}/complete`) && init?.method === 'POST') {
            const reward = (mockLevelResponse(levelCode) as { reward: { stars: number; badgeName: string } }).reward;

            return {
              ok: true,
              json: async () => ({
                levelCode,
                reward,
                message: 'perfect'
              })
            } as Response;
          }
        }

        throw new Error(`Unhandled fetch: ${url}`);
      })
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  test('renders interactive subtraction flow with taking away objects and choosing result', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={['/levels/math-subtraction-001']}>
        <App />
      </MemoryRouter>
    );

    expect(await screen.findByRole('button', { name: '草莓 1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '草莓 8' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '草莓 1' }));
    await user.click(screen.getByRole('button', { name: '草莓 2' }));
    await user.click(screen.getByRole('button', { name: '草莓 3' }));

    expect(screen.getByText('已经拿走 3 / 3 个草莓')).toBeInTheDocument();

    const completeButton = screen.getByRole('button', { name: '完成本关' });
    expect(completeButton).toBeDisabled();

    await user.click(screen.getByRole('button', { name: '数字石牌 5' }));

    expect(screen.getByText('答对了，8 - 3 = 5')).toBeInTheDocument();
    expect(completeButton).toBeEnabled();
  });

  test('renders interactive quantity comparison level', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={['/levels/math-compare-001']}>
        <App />
      </MemoryRouter>
    );

    expect(await screen.findByText('左边小鱼')).toBeInTheDocument();
    expect(screen.getByText('右边小鱼')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '比较卡片 左边更多' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '比较卡片 左边更多' }));

    expect(screen.getByText('答对了，左边有 6 条小鱼，更多一些')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '完成本关' })).toBeEnabled();
  });

  test('renders interactive image equation level', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={['/levels/math-equation-001']}>
        <App />
      </MemoryRouter>
    );

    expect(await screen.findByText('左边有 2 只小鸭')).toBeInTheDocument();
    expect(screen.getByText('右边又来了 3 只')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '算式卡片 2 + 3 = 5' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '算式卡片 2 + 3 = 5' }));

    expect(screen.getByText('答对了，2 只加 3 只一共是 5 只')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '完成本关' })).toBeEnabled();
  });

  test('renders interactive math word problem level', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={['/levels/math-wordproblem-001']}>
        <App />
      </MemoryRouter>
    );

    expect(await screen.findByText('小兔子')).toBeInTheDocument();
    expect(screen.getByText('原来有 4 根胡萝卜')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '答案卡片 6' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '答案卡片 6' }));

    expect(screen.getByText('答对了，4 + 2 = 6')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '完成本关' })).toBeEnabled();
  });
});
