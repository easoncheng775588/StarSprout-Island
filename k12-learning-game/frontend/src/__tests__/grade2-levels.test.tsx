import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import App from '../App';

function mockLevelResponse(levelCode: string) {
  const payloads: Record<string, unknown> = {
    'math-grade2-multiply-001': {
      code: 'math-grade2-multiply-001',
      title: '乘法跳跳屋',
      subjectTitle: '数学岛',
      description: '把一组一组的小物件数清楚，学会把乘法看成重复加法。',
      steps: [
        { id: 'step-1', type: 'tap-choice', prompt: '3 组小星星，每组 4 颗，一共有几颗？' }
      ],
      reward: { stars: 3, badgeName: '乘法起步星' }
    },
    'chinese-grade2-phrase-001': {
      code: 'chinese-grade2-phrase-001',
      title: '词语搭配桥',
      subjectTitle: '语文岛',
      description: '把合适的词语搭配在一起，让表达更完整。',
      steps: [
        { id: 'step-1', type: 'tap-choice', prompt: '找到能和“认真”搭配的词语' }
      ],
      reward: { stars: 2, badgeName: '搭配小能手' }
    },
    'english-grade2-phonics-001': {
      code: 'english-grade2-phonics-001',
      title: '自然拼读进阶站',
      subjectTitle: '英语岛',
      description: '听清楚字母组合的声音，再找到对应单词。',
      steps: [
        { id: 'step-1', type: 'listen-choice', prompt: '听一听 /sh/ 的声音，找到正确单词' }
      ],
      reward: { stars: 2, badgeName: '拼读进阶星' }
    }
  };

  return payloads[levelCode];
}

describe('Grade 2 level interactions', () => {
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
          'math-grade2-multiply-001',
          'chinese-grade2-phrase-001',
          'english-grade2-phonics-001'
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

  test('renders interactive grade 2 multiplication level', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={['/levels/math-grade2-multiply-001']}>
        <App />
      </MemoryRouter>
    );

    expect(await screen.findByText('乘法跳跳屋')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '数字石牌 12' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '数字石牌 12' }));

    expect(screen.getByText('答对了，3 组 4 颗就是 12 颗')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '完成本关' })).toBeEnabled();
  });

  test('renders interactive grade 2 chinese phrase matching level', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={['/levels/chinese-grade2-phrase-001']}>
        <App />
      </MemoryRouter>
    );

    expect(await screen.findByRole('button', { name: '汉字卡片 听讲' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '汉字卡片 飞快' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '汉字卡片 听讲' }));

    expect(screen.getByText('答对了，“认真听讲”是课堂里的好习惯')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '完成本关' })).toBeEnabled();
  });

  test('renders interactive grade 2 english phonics level', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={['/levels/english-grade2-phonics-001']}>
        <App />
      </MemoryRouter>
    );

    expect(await screen.findByRole('button', { name: '播放拼音读音' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '播放拼音读音' }));
    expect(screen.getByText('老师正在读：shh')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '拼音泡泡 sheep' }));

    expect(screen.getByText('答对了，sheep 开头就是 /sh/ 的声音')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '完成本关' })).toBeEnabled();
    expect(speakMock).toHaveBeenCalledTimes(1);
  });
});
