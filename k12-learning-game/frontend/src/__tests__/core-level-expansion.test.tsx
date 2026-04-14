import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import App from '../App';

function mockLevelResponse(levelCode: string) {
  const payloads: Record<string, unknown> = {
    'math-thinking-001': {
      code: 'math-thinking-001',
      title: '规律小火车',
      subjectTitle: '数学岛',
      description: '找一找颜色和图形的规律，让小火车继续往前开。',
      steps: [
        { id: 'step-1', type: 'pattern-choice', prompt: '看看规律，选出下一节车厢' }
      ],
      reward: { stars: 2, badgeName: '规律观察家' }
    },
    'chinese-strokes-001': {
      code: 'chinese-strokes-001',
      title: '笔顺小画家',
      subjectTitle: '语文岛',
      description: '按顺序点一点，把汉字的笔画排整齐。',
      steps: [
        { id: 'step-1', type: 'stroke-order', prompt: '按笔顺点出“口”的三笔' }
      ],
      reward: { stars: 2, badgeName: '笔顺小画家' }
    },
    'english-story-001': {
      code: 'english-story-001',
      title: '海湾小绘本',
      subjectTitle: '英语岛',
      description: '跟着图片读一读简单句子，把小故事完整读下来。',
      steps: [
        { id: 'step-1', type: 'sentence-read', prompt: '按顺序读完这三句小绘本' }
      ],
      reward: { stars: 2, badgeName: '绘本小海鸥' }
    }
  };

  return payloads[levelCode];
}

describe('Expanded core levels', () => {
  const speakMock = vi.fn();

  beforeEach(() => {
    class MockSpeechSynthesisUtterance {
      text: string;
      lang = '';
      rate = 1;
      pitch = 1;

      constructor(text: string) {
        this.text = text;
      }
    }

    vi.stubGlobal('SpeechSynthesisUtterance', MockSpeechSynthesisUtterance);
    vi.stubGlobal('speechSynthesis', {
      cancel: vi.fn(),
      getVoices: vi.fn(() => [
        { name: 'Samantha', lang: 'en-US' },
        { name: 'Tingting', lang: 'zh-CN' }
      ]),
      speak: speakMock
    });
    speakMock.mockClear();

    vi.stubGlobal(
      'fetch',
      vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
        const url = String(input);

        for (const levelCode of [
          'math-thinking-001',
          'chinese-strokes-001',
          'english-story-001'
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

  test('renders interactive math pattern reasoning level', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={['/levels/math-thinking-001']}>
        <App />
      </MemoryRouter>
    );

    expect(await screen.findByRole('button', { name: '规律卡片 蓝色车厢' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '规律卡片 绿色车厢' })).toBeInTheDocument();

    const completeButton = screen.getByRole('button', { name: '完成本关' });
    expect(completeButton).toBeDisabled();

    await user.click(screen.getByRole('button', { name: '规律卡片 蓝色车厢' }));

    expect(screen.getByText('答对了，红蓝红蓝的规律要继续排下去')).toBeInTheDocument();
    expect(completeButton).toBeEnabled();
  });

  test('renders interactive chinese stroke order level', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={['/levels/chinese-strokes-001']}>
        <App />
      </MemoryRouter>
    );

    expect(await screen.findByRole('button', { name: '笔画卡片 竖' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '笔画卡片 横折' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '笔画卡片 横' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '笔画卡片 竖' }));
    expect(screen.getByText('笔顺进度 1 / 3')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: '笔画卡片 横折' }));
    await user.click(screen.getByRole('button', { name: '笔画卡片 横' }));

    expect(screen.getByText('真棒，“口”字写完整了')).toBeInTheDocument();
    expect(screen.getByText('笔顺口诀：先外后里，最后封口')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '完成本关' })).toBeEnabled();
  });

  test('renders interactive english story follow-read level', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={['/levels/english-story-001']}>
        <App />
      </MemoryRouter>
    );

    expect(await screen.findByRole('button', { name: '句子卡片 I see a cat.' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '句子卡片 The cat can run.' })).toBeInTheDocument();

    const completeButton = screen.getByRole('button', { name: '完成本关' });
    expect(completeButton).toBeDisabled();

    await user.click(screen.getByRole('button', { name: '句子卡片 I see a cat.' }));
    expect(screen.getByText('已跟读 1 / 3 句')).toBeInTheDocument();
    expect(speakMock).toHaveBeenCalledTimes(1);
    expect(speakMock.mock.calls[0]?.[0]).toMatchObject({
      text: 'I see a cat.',
      lang: 'en-US'
    });

    await user.click(screen.getByRole('button', { name: '句子卡片 The cat can run.' }));
    await user.click(screen.getByRole('button', { name: '句子卡片 I can wave hi.' }));

    expect(screen.getByText('小绘本读完啦，给自己一个掌声')).toBeInTheDocument();
    expect(completeButton).toBeEnabled();
  });
});
