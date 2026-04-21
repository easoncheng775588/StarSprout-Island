import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import App from '../App';
import { subjectMaps } from '../data/mockData';

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
    'math-grade4-hundredths-001': {
      code: 'math-grade4-hundredths-001',
      title: '小数百格图',
      subjectTitle: '数学岛',
      description: '用 100 格模型认识百分之几和两位小数。',
      steps: [
        {
          id: 'step-1',
          type: 'tap-choice',
          prompt: '100 格里涂了 32 格，写成小数是多少？',
          knowledgePointTitle: '数形结合：百分位小数',
          variantCount: 8
        }
      ],
      reward: { stars: 3, badgeName: '百分位小数星' }
    },
    'math-grade4-angle-classify-001': {
      code: 'math-grade4-angle-classify-001',
      title: '角度分类挑战',
      subjectTitle: '数学岛',
      description: '观察角的张口，判断锐角、直角和钝角。',
      steps: [
        {
          id: 'step-1',
          type: 'tap-choice',
          prompt: '135° 的角属于哪一类？',
          knowledgePointTitle: '图形认识：角的分类',
          variantCount: 8
        }
      ],
      reward: { stars: 3, badgeName: '角度分类星' }
    },
    'math-grade4-distributive-001': {
      code: 'math-grade4-distributive-001',
      title: '面积模型巧算',
      subjectTitle: '数学岛',
      description: '用面积模型理解乘法分配律，把复杂乘法拆开算。',
      steps: [
        {
          id: 'step-1',
          type: 'story-choice',
          prompt: '12 × 6 可以拆成 10×6 和 2×6，一共是多少？',
          knowledgePointTitle: '运算律：乘法分配律',
          variantCount: 10
        }
      ],
      reward: { stars: 3, badgeName: '巧算模型星' }
    },
    'math-grade4-distance-001': {
      code: 'math-grade4-distance-001',
      title: '路程线段图',
      subjectTitle: '数学岛',
      description: '用线段图分析速度、时间和路程的关系。',
      steps: [
        {
          id: 'step-1',
          type: 'story-choice',
          prompt: '小船每小时行 8 千米，3 小时行多少千米？',
          knowledgePointTitle: '数量关系：速度时间路程',
          variantCount: 10
        }
      ],
      reward: { stars: 3, badgeName: '路程策略星' }
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
          'math-grade4-hundredths-001',
          'math-grade4-angle-classify-001',
          'math-grade4-distributive-001',
          'math-grade4-distance-001',
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

  test('adds expanded grade 4 math knowledge levels to the math map', () => {
    const grade4LevelCodes = subjectMaps.math.chapters
      .filter((chapter) => chapter.stageLabel === '四年级')
      .flatMap((chapter) => chapter.levels.map((level) => level.code));

    expect(grade4LevelCodes).toContain('math-grade4-hundredths-001');
    expect(grade4LevelCodes).toContain('math-grade4-angle-classify-001');
    expect(grade4LevelCodes).toContain('math-grade4-distributive-001');
    expect(grade4LevelCodes).toContain('math-grade4-distance-001');
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

  test('renders interactive grade 4 hundredths decimal model', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={['/levels/math-grade4-hundredths-001']}>
        <App />
      </MemoryRouter>
    );

    expect(await screen.findAllByText('小数百格图')).toHaveLength(2);
    expect(screen.getByText('数形结合：百分位小数')).toBeInTheDocument();
    expect(screen.getByText('题库变体 8 组')).toBeInTheDocument();
    expect(screen.getByText('涂色 32 格，就是 32 个百分之一')).toBeInTheDocument();
    expect(screen.getAllByLabelText(/小数百格图 格子/)).toHaveLength(100);

    await user.click(screen.getByRole('button', { name: '小数卡 0.32' }));

    expect(screen.getByText('答对了，32 个百分之一就是 0.32')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '完成本关' })).toBeEnabled();
  });

  test('renders interactive grade 4 angle and strategy knowledge levels', async () => {
    const user = userEvent.setup();

    const angleLevel = render(
      <MemoryRouter initialEntries={['/levels/math-grade4-angle-classify-001']}>
        <App />
      </MemoryRouter>
    );

    expect(await screen.findByText('角度分类挑战')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: '汉字卡片 钝角' }));
    expect(screen.getByText('答对了，135° 大于 90° 小于 180°，是钝角')).toBeInTheDocument();

    angleLevel.unmount();

    const distributiveLevel = render(
      <MemoryRouter initialEntries={['/levels/math-grade4-distributive-001']}>
        <App />
      </MemoryRouter>
    );

    expect(await screen.findAllByText('面积模型巧算')).toHaveLength(2);
    expect(screen.getByText('10×6 + 2×6')).toBeInTheDocument();
    expect(screen.getAllByLabelText(/面积模型巧算 格子/)).toHaveLength(72);

    await user.click(screen.getByRole('button', { name: '答案卡片 72' }));
    expect(screen.getByText('答对了，10×6 是 60，2×6 是 12，一共 72')).toBeInTheDocument();

    distributiveLevel.unmount();

    render(
      <MemoryRouter initialEntries={['/levels/math-grade4-distance-001']}>
        <App />
      </MemoryRouter>
    );

    expect(await screen.findAllByText('路程线段图')).toHaveLength(2);
    expect(screen.getByLabelText('线段 每小时 8')).toBeInTheDocument();
    expect(screen.getByLabelText('线段 3 小时 24')).toBeInTheDocument();
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
