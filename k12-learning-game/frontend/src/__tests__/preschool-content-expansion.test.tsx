import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import App from '../App';

function mockLevelResponse(levelCode: string) {
  const payloads: Record<string, unknown> = {
    'math-shapes-001': {
      code: 'math-shapes-001',
      title: '图形分类屋',
      subjectTitle: '数学岛',
      description: '看一看圆形、三角形和正方形，把图形朋友认出来。',
      steps: [
        { id: 'step-1', type: 'tap-choice', prompt: '找到像太阳一样圆圆的图形' }
      ],
      reward: { stars: 2, badgeName: '图形小侦探' }
    },
    'chinese-radicals-001': {
      code: 'chinese-radicals-001',
      title: '偏旁小树',
      subjectTitle: '语文岛',
      description: '观察带木字旁的汉字，发现汉字里的小线索。',
      steps: [
        { id: 'step-1', type: 'tap-choice', prompt: '找到带木字旁的字' }
      ],
      reward: { stars: 2, badgeName: '偏旁观察员' }
    },
    'english-family-001': {
      code: 'english-family-001',
      title: '家庭单词屋',
      subjectTitle: '英语岛',
      description: '把 family、mom、dad 和图标配成一对。',
      steps: [
        { id: 'step-1', type: 'drag-match', prompt: '把 family、mom、dad 和图片连起来' }
      ],
      reward: { stars: 2, badgeName: '家庭单词星' }
    }
  };

  return payloads[levelCode];
}

describe('Preschool content expansion', () => {
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

        for (const levelCode of ['math-shapes-001', 'chinese-radicals-001', 'english-family-001']) {
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

  test('renders a preschool shape classification math level', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={['/levels/math-shapes-001']}>
        <App />
      </MemoryRouter>
    );

    expect(await screen.findByText('图形分类屋')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '汉字卡片 圆形' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '汉字卡片 三角形' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '汉字卡片 圆形' }));

    expect(screen.getByText('答对了，圆形像太阳和皮球，边边是弯弯的')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '完成本关' })).toBeEnabled();
  });

  test('renders a preschool radical observation chinese level', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={['/levels/chinese-radicals-001']}>
        <App />
      </MemoryRouter>
    );

    expect(await screen.findByText('偏旁小树')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '汉字卡片 林' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '汉字卡片 明' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '汉字卡片 林' }));

    expect(screen.getByText('答对了，“林”里有两个木，和树木有关系')).toBeInTheDocument();
    expect(screen.getByText('偏旁提示：木字旁常常和树木、植物有关系')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '完成本关' })).toBeEnabled();
  });

  test('renders a preschool family word matching english level', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={['/levels/english-family-001']}>
        <App />
      </MemoryRouter>
    );

    expect(await screen.findByText('家庭单词屋')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '单词卡 mom' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '图片卡 妈妈' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '单词卡 mom' }));
    await user.click(screen.getByRole('button', { name: '图片卡 妈妈' }));
    await user.click(screen.getByRole('button', { name: '单词卡 dad' }));
    await user.click(screen.getByRole('button', { name: '图片卡 爸爸' }));
    await user.click(screen.getByRole('button', { name: '单词卡 family' }));
    await user.click(screen.getByRole('button', { name: '图片卡 家人' }));

    expect(screen.getByText('太好了，3 组单词都连对了')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '完成本关' })).toBeEnabled();
    expect(speakMock).toHaveBeenCalled();
  });
});
