import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import App from '../App';

function mockLevelResponse(levelCode: string) {
  const payloads: Record<string, unknown> = {
    'chinese-characters-001': {
      code: 'chinese-characters-001',
      title: '汉字日月冒险',
      subjectTitle: '语文岛',
      description: '从图像和笔画开始认识两个常见汉字。',
      steps: [
        { id: 'step-1', type: 'tap-choice', prompt: '找到像太阳的字' }
      ],
      reward: { stars: 1, badgeName: '识字小种子' }
    },
    'chinese-pinyin-001': {
      code: 'chinese-pinyin-001',
      title: '拼音泡泡大作战',
      subjectTitle: '语文岛',
      description: '听一听、认一认，把声母和韵母连起来。',
      steps: [
        { id: 'step-1', type: 'listen-choice', prompt: '听一听，选出读音正确的拼音泡泡' }
      ],
      reward: { stars: 1, badgeName: '拼音小耳朵' }
    },
    'english-letters-001': {
      code: 'english-letters-001',
      title: '字母小船出发',
      subjectTitle: '英语岛',
      description: '跟着发音和形状，认识第一组字母朋友。',
      steps: [
        { id: 'step-1', type: 'follow-read', prompt: '跟读 A、B、C、D、E、F' }
      ],
      reward: { stars: 1, badgeName: '字母小船长' }
    },
    'english-words-001': {
      code: 'english-words-001',
      title: '单词海风配对赛',
      subjectTitle: '英语岛',
      description: '把常见生活单词和图像轻松对应起来。',
      steps: [
        { id: 'step-1', type: 'drag-match', prompt: '把 apple、book、cat 和图片连起来' }
      ],
      reward: { stars: 1, badgeName: '单词小海星' }
    }
  };

  return payloads[levelCode];
}

describe('Language level interactions', () => {
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
          'chinese-characters-001',
          'chinese-pinyin-001',
          'english-letters-001',
          'english-words-001'
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

  test('renders interactive chinese character recognition', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={['/levels/chinese-characters-001']}>
        <App />
      </MemoryRouter>
    );

    expect(await screen.findByRole('button', { name: '汉字卡片 日' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '汉字卡片 月' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '汉字卡片 山' })).toBeInTheDocument();

    const completeButton = screen.getByRole('button', { name: '完成本关' });
    expect(completeButton).toBeDisabled();

    await user.click(screen.getByRole('button', { name: '汉字卡片 日' }));

    expect(screen.getByText('答对了，“日”像太阳，4 笔写成')).toBeInTheDocument();
    expect(screen.getByText('笔顺提示：竖、横折、横、横')).toBeInTheDocument();
    expect(completeButton).toBeEnabled();

    await user.click(completeButton);
    expect(await screen.findByText('识字小种子')).toBeInTheDocument();
  });

  test('renders interactive chinese pinyin listening choice', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={['/levels/chinese-pinyin-001']}>
        <App />
      </MemoryRouter>
    );

    expect(await screen.findByRole('button', { name: '播放拼音读音' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '拼音泡泡 ma' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '拼音泡泡 ba' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '播放拼音读音' }));
    expect(screen.getByText('老师正在读：妈')).toBeInTheDocument();
    expect(speakMock).toHaveBeenCalledTimes(1);
    expect(speakMock.mock.calls[0]?.[0]).toMatchObject({
      text: '妈',
      lang: 'zh-CN',
      voice: {
        name: 'Tingting',
        lang: 'zh-CN'
      }
    });

    const completeButton = screen.getByRole('button', { name: '完成本关' });
    expect(completeButton).toBeDisabled();

    await user.click(screen.getByRole('button', { name: '拼音泡泡 ma' }));
    expect(screen.getByText('听对了，这个泡泡读作 ma')).toBeInTheDocument();
    expect(completeButton).toBeEnabled();
  });

  test('renders interactive english follow-read sequence', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={['/levels/english-letters-001']}>
        <App />
      </MemoryRouter>
    );

    expect(await screen.findByRole('button', { name: '字母卡片 A' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '字母卡片 F' })).toBeInTheDocument();

    const completeButton = screen.getByRole('button', { name: '完成本关' });
    expect(completeButton).toBeDisabled();

    await user.click(screen.getByRole('button', { name: '字母卡片 A' }));
    expect(screen.getByText('A /ei/ · apple')).toBeInTheDocument();
    expect(speakMock).toHaveBeenCalledTimes(1);
    expect(speakMock.mock.calls[0]?.[0]).toMatchObject({
      text: 'A',
      lang: 'en-US',
      voice: {
        name: 'Samantha',
        lang: 'en-US'
      }
    });

    for (const letter of ['B', 'C', 'D', 'E', 'F']) {
      await user.click(screen.getByRole('button', { name: `字母卡片 ${letter}` }));
    }

    expect(screen.getByText('已跟读 6 / 6 个字母')).toBeInTheDocument();
    expect(completeButton).toBeEnabled();
  });

  test('renders interactive english word matching', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={['/levels/english-words-001']}>
        <App />
      </MemoryRouter>
    );

    expect(await screen.findByRole('button', { name: '单词卡 apple' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '图片卡 苹果' })).toBeInTheDocument();

    const completeButton = screen.getByRole('button', { name: '完成本关' });
    expect(completeButton).toBeDisabled();

    await user.click(screen.getByRole('button', { name: '单词卡 apple' }));
    expect(screen.getByText('听一听 apple，再点对应图片')).toBeInTheDocument();
    expect(speakMock).toHaveBeenCalledTimes(1);
    expect(speakMock.mock.calls[0]?.[0]).toMatchObject({
      text: 'apple',
      lang: 'en-US',
      voice: {
        name: 'Samantha',
        lang: 'en-US'
      }
    });
    await user.click(screen.getByRole('button', { name: '图片卡 苹果' }));
    expect(screen.getByText('连对了 1 / 3 组，apple 是苹果')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: '单词卡 book' }));
    await user.click(screen.getByRole('button', { name: '图片卡 书本' }));
    await user.click(screen.getByRole('button', { name: '单词卡 cat' }));
    await user.click(screen.getByRole('button', { name: '图片卡 小猫' }));

    expect(screen.getByText('太好了，3 组单词都连对了')).toBeInTheDocument();
    expect(completeButton).toBeEnabled();
  });
});
