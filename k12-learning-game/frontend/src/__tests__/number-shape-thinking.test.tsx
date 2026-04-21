import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import App from '../App';
import { subjectMaps } from '../data/mockData';

function mockLevelResponse(levelCode: string) {
  const payloads: Record<string, unknown> = {
    'math-grade1-hundredchart-001': {
      code: 'math-grade1-hundredchart-001',
      title: '百格图认数',
      subjectTitle: '数学岛',
      description: '在百格图里看十位和个位，找到数字的位置。',
      steps: [
        {
          id: 'step-1',
          type: 'tap-choice',
          prompt: '百格图上点亮了 37，选出这个数。',
          knowledgePointTitle: '数形结合：百格图认数',
          variantCount: 8
        }
      ],
      reward: { stars: 3, badgeName: '百格观察星' }
    },
    'math-grade1-numberline-001': {
      code: 'math-grade1-numberline-001',
      title: '数轴跳跳桥',
      subjectTitle: '数学岛',
      description: '沿着数轴往前跳，把加法看成移动。',
      steps: [
        {
          id: 'step-1',
          type: 'tap-choice',
          prompt: '从 12 往前跳 5 格，会到哪个数？',
          knowledgePointTitle: '数形结合：数轴加减',
          variantCount: 8
        }
      ],
      reward: { stars: 3, badgeName: '数轴跳跳星' }
    },
    'math-grade2-array-001': {
      code: 'math-grade2-array-001',
      title: '乘法数组花园',
      subjectTitle: '数学岛',
      description: '把乘法摆成几行几列，看见乘法的结构。',
      steps: [
        {
          id: 'step-1',
          type: 'tap-choice',
          prompt: '4 行花，每行 5 朵，一共有几朵？',
          knowledgePointTitle: '数形结合：乘法数组',
          variantCount: 10
        }
      ],
      reward: { stars: 3, badgeName: '数组花园星' }
    },
    'math-grade2-bar-model-001': {
      code: 'math-grade2-bar-model-001',
      title: '线段图应用题',
      subjectTitle: '数学岛',
      description: '用线段图拆开两步应用题，先看关系再计算。',
      steps: [
        {
          id: 'step-1',
          type: 'story-choice',
          prompt: '红气球 18 个，蓝气球比红气球多 7 个，蓝气球有几个？',
          knowledgePointTitle: '数形结合：线段图分析',
          variantCount: 10
        }
      ],
      reward: { stars: 3, badgeName: '线段图思考星' }
    },
    'math-grade3-area-model-001': {
      code: 'math-grade3-area-model-001',
      title: '面积模型乘法',
      subjectTitle: '数学岛',
      description: '用长方形面积模型理解两位数乘一位数。',
      steps: [
        {
          id: 'step-1',
          type: 'story-choice',
          prompt: '12 × 4 可以看成 10×4 和 2×4，一共是多少？',
          knowledgePointTitle: '数形结合：面积模型',
          variantCount: 10
        }
      ],
      reward: { stars: 3, badgeName: '面积模型星' }
    },
    'math-grade3-fractionbar-001': {
      code: 'math-grade3-fractionbar-001',
      title: '分数条比较',
      subjectTitle: '数学岛',
      description: '用分数条比较同分母分数的大小。',
      steps: [
        {
          id: 'step-1',
          type: 'story-choice',
          prompt: '同样分成 8 份，5 份和 3 份，哪一个更大？',
          knowledgePointTitle: '数形结合：分数条比较',
          variantCount: 10
        }
      ],
      reward: { stars: 3, badgeName: '分数条观察星' }
    }
  };

  return payloads[levelCode];
}

const mathShapeLevels = [
  'math-grade1-hundredchart-001',
  'math-grade1-numberline-001',
  'math-grade2-array-001',
  'math-grade2-bar-model-001',
  'math-grade3-area-model-001',
  'math-grade3-fractionbar-001'
];

describe('Number-shape thinking levels', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
        const url = String(input);

        for (const levelCode of mathShapeLevels) {
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

  test('adds grade 1 number-shape thinking levels to the math map', () => {
    const grade1LevelCodes = subjectMaps.math.chapters
      .filter((chapter) => chapter.stageLabel === '一年级')
      .flatMap((chapter) => chapter.levels.map((level) => level.code));

    expect(grade1LevelCodes).toContain('math-grade1-hundredchart-001');
    expect(grade1LevelCodes).toContain('math-grade1-numberline-001');
  });

  test('renders grade 1 number line thinking as a visual model', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={['/levels/math-grade1-numberline-001']}>
        <App />
      </MemoryRouter>
    );

    expect(await screen.findAllByText('数轴跳跳桥')).toHaveLength(2);
    expect(screen.getByText('数形结合：数轴加减')).toBeInTheDocument();
    expect(screen.getByText('题库变体 8 组')).toBeInTheDocument();
    expect(screen.getByLabelText('数形结合模型')).toBeInTheDocument();
    expect(screen.getByText('从 12 出发，向右跳 5 格')).toBeInTheDocument();
    expect(screen.getByLabelText('数轴点 12 起点')).toBeInTheDocument();
    expect(screen.getByLabelText('数轴点 17 终点')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '数字卡 17' }));

    expect(screen.getByText('答对了，12 往前跳 5 格就是 17')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '完成本关' })).toBeEnabled();
  });

  test('renders grade 2 array and bar-model thinking levels', async () => {
    const user = userEvent.setup();

    const arrayLevel = render(
      <MemoryRouter initialEntries={['/levels/math-grade2-array-001']}>
        <App />
      </MemoryRouter>
    );

    expect(await screen.findAllByText('乘法数组花园')).toHaveLength(2);
    expect(screen.getByText('4 行，每行 5 朵花')).toBeInTheDocument();
    expect(screen.getAllByLabelText(/乘法数组花园 格子/)).toHaveLength(20);

    await user.click(screen.getByRole('button', { name: '数字石牌 20' }));
    expect(screen.getByText('答对了，4 行 5 列就是 20 朵花')).toBeInTheDocument();

    arrayLevel.unmount();

    render(
      <MemoryRouter initialEntries={['/levels/math-grade2-bar-model-001']}>
        <App />
      </MemoryRouter>
    );

    expect(await screen.findAllByText('线段图应用题')).toHaveLength(2);
    expect(screen.getByText('红气球 18 个')).toBeInTheDocument();
    expect(screen.getByLabelText('线段 红气球 18')).toBeInTheDocument();
    expect(screen.getByLabelText('线段 多出的 7')).toBeInTheDocument();
  });

  test('renders grade 3 area model and fraction bar thinking levels', async () => {
    const user = userEvent.setup();

    const areaLevel = render(
      <MemoryRouter initialEntries={['/levels/math-grade3-area-model-001']}>
        <App />
      </MemoryRouter>
    );

    expect(await screen.findAllByText('面积模型乘法')).toHaveLength(2);
    expect(screen.getByText('10×4 + 2×4')).toBeInTheDocument();
    expect(screen.getAllByLabelText(/面积模型乘法 格子/)).toHaveLength(48);

    await user.click(screen.getByRole('button', { name: '答案卡片 48' }));
    expect(screen.getByText('答对了，10×4 是 40，2×4 是 8，一共 48')).toBeInTheDocument();

    areaLevel.unmount();

    render(
      <MemoryRouter initialEntries={['/levels/math-grade3-fractionbar-001']}>
        <App />
      </MemoryRouter>
    );

    expect(await screen.findAllByText('分数条比较')).toHaveLength(2);
    expect(screen.getAllByText('5/8 和 3/8 比大小')).toHaveLength(2);
    expect(screen.getAllByLabelText(/5\/8 分数条/)).toHaveLength(8);
    expect(screen.getAllByLabelText(/3\/8 分数条/)).toHaveLength(8);
  });
});
