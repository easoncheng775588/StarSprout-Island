import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import App from '../App';

function mockLevelResponse(levelCode: string) {
  const payloads: Record<string, unknown> = {
    'math-grade3-division-001': {
      code: 'math-grade3-division-001',
      title: '平均分小队',
      subjectTitle: '数学岛',
      description: '把物品平均分给几组，认识除法的意思。',
      steps: [
        { id: 'step-1', type: 'story-choice', prompt: '12 个贝壳平均分给 3 个小朋友，每人几个？' }
      ],
      reward: { stars: 3, badgeName: '平均分小队长' }
    },
    'chinese-grade3-paragraph-001': {
      code: 'chinese-grade3-paragraph-001',
      title: '段落理解屋',
      subjectTitle: '语文岛',
      description: '按顺序读完一小段话，抓住主要画面。',
      steps: [
        { id: 'step-1', type: 'sentence-read', prompt: '按顺序读完这三句段落短文' }
      ],
      reward: { stars: 2, badgeName: '段落理解星' }
    },
    'english-grade3-transform-001': {
      code: 'english-grade3-transform-001',
      title: '句型变变屋',
      subjectTitle: '英语岛',
      description: '把熟悉句型换一种方式说出来。',
      steps: [
        { id: 'step-1', type: 'tap-choice', prompt: '找到 I like apples. 的否定句' }
      ],
      reward: { stars: 2, badgeName: '句型变换星' }
    }
  };

  return payloads[levelCode];
}

describe('Grade 3 level interactions', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
        const url = String(input);

        for (const levelCode of [
          'math-grade3-division-001',
          'chinese-grade3-paragraph-001',
          'english-grade3-transform-001'
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

  test('renders interactive grade 3 division level', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={['/levels/math-grade3-division-001']}>
        <App />
      </MemoryRouter>
    );

    expect(await screen.findByText('平均分小队')).toBeInTheDocument();
    expect(screen.getByText('12 个贝壳平均分给 3 个小朋友，每人几个？')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '答案卡片 4' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '答案卡片 4' }));

    expect(screen.getByText('答对了，12 平均分成 3 份，每份是 4')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '完成本关' })).toBeEnabled();
  });

  test('renders interactive grade 3 paragraph reading level', async () => {
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
      <MemoryRouter initialEntries={['/levels/chinese-grade3-paragraph-001']}>
        <App />
      </MemoryRouter>
    );

    expect(await screen.findByRole('button', { name: '句子卡片 春天来了，小草从泥土里探出头。' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '句子卡片 春天来了，小草从泥土里探出头。' }));
    await user.click(screen.getByRole('button', { name: '句子卡片 河边的柳树长出了嫩绿的叶子。' }));
    await user.click(screen.getByRole('button', { name: '句子卡片 小朋友们在风里放起了风筝。' }));

    expect(screen.getByText('段落读完啦，春天的画面已经连起来了')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '完成本关' })).toBeEnabled();
  });

  test('renders interactive grade 3 english sentence transform level', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={['/levels/english-grade3-transform-001']}>
        <App />
      </MemoryRouter>
    );

    expect(await screen.findByRole('button', { name: '汉字卡片 I do not like apples.' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '汉字卡片 I do not like apples.' }));

    expect(screen.getByText('答对了，do not 可以把 like 变成“不喜欢”')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '完成本关' })).toBeEnabled();
  });
});
