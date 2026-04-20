import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import App from '../App';

function mockLevelResponse(levelCode: string) {
  const payloads: Record<string, unknown> = {
    'math-grade4-decimal-001': {
      code: 'math-grade4-decimal-001',
      title: '小数点灯塔',
      subjectTitle: '数学岛',
      description: '从十分之几开始认识小数，理解 0.7 表示的数量。',
      steps: [
        { id: 'step-1', type: 'tap-choice', prompt: '10 格里涂了 7 格，写成小数是多少？' }
      ],
      reward: { stars: 3, badgeName: '小数启航星' }
    },
    'chinese-grade4-poem-001': {
      code: 'chinese-grade4-poem-001',
      title: '古诗积累亭',
      subjectTitle: '语文岛',
      description: '按顺序朗读古诗句，感受画面和节奏。',
      steps: [
        { id: 'step-1', type: 'sentence-read', prompt: '按顺序读完这三句古诗积累' }
      ],
      reward: { stars: 2, badgeName: '古诗积累星' }
    },
    'english-grade4-tense-001': {
      code: 'english-grade4-tense-001',
      title: '时态小罗盘',
      subjectTitle: '英语岛',
      description: '认识 yesterday 和过去式，感受动作发生的时间。',
      steps: [
        { id: 'step-1', type: 'tap-choice', prompt: '找到表示昨天踢足球的句子' }
      ],
      reward: { stars: 2, badgeName: '时态启航星' }
    }
  };

  return payloads[levelCode];
}

describe('Grade 4 level interactions', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
        const url = String(input);

        for (const levelCode of [
          'math-grade4-decimal-001',
          'chinese-grade4-poem-001',
          'english-grade4-tense-001'
        ]) {
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

  test('renders interactive grade 4 decimal level', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={['/levels/math-grade4-decimal-001']}>
        <App />
      </MemoryRouter>
    );

    expect(await screen.findByText('小数点灯塔')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '数字石牌 0.7' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '数字石牌 0.7' }));

    expect(screen.getByText('答对了，10 格里有 7 格就是 0.7')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '完成本关' })).toBeEnabled();
  });

  test('renders interactive grade 4 classical poem reading level', async () => {
    const user = userEvent.setup();

    class MockSpeechSynthesisUtterance {
      text: string;
      lang = '';

      constructor(text: string) {
        this.text = text;
      }
    }

    vi.stubGlobal('SpeechSynthesisUtterance', MockSpeechSynthesisUtterance);
    vi.stubGlobal('speechSynthesis', {
      cancel: vi.fn(),
      getVoices: vi.fn(() => [{ name: 'Tingting', lang: 'zh-CN' }]),
      speak: vi.fn()
    });

    render(
      <MemoryRouter initialEntries={['/levels/chinese-grade4-poem-001']}>
        <App />
      </MemoryRouter>
    );

    expect(await screen.findByRole('button', { name: '句子卡片 远上寒山石径斜。' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '句子卡片 远上寒山石径斜。' }));
    await user.click(screen.getByRole('button', { name: '句子卡片 白云生处有人家。' }));
    await user.click(screen.getByRole('button', { name: '句子卡片 停车坐爱枫林晚。' }));

    expect(screen.getByText('古诗积累完成，画面已经读出来了')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '完成本关' })).toBeEnabled();
  });

  test('renders interactive grade 4 english tense level', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={['/levels/english-grade4-tense-001']}>
        <App />
      </MemoryRouter>
    );

    expect(await screen.findByRole('button', { name: '汉字卡片 I played football yesterday.' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '汉字卡片 I played football yesterday.' }));

    expect(screen.getByText('答对了，yesterday 提醒我们动作发生在过去')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '完成本关' })).toBeEnabled();
  });
});
