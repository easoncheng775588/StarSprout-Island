import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import App from '../App';
import { subjectMaps } from '../data/mockData';

const grade4MaturityLevels = [
  'math-grade4-decimal-compare-001',
  'math-grade4-parallel-001',
  'chinese-grade4-central-clue-001',
  'chinese-grade4-poem-image-001',
  'english-grade4-listening-judgment-001',
  'english-grade4-scene-dialogue-001'
];

function levelPayload(levelCode: string) {
  const payloads: Record<string, unknown> = {
    'math-grade4-decimal-compare-001': {
      code: levelCode,
      title: '小数大小比较',
      subjectTitle: '数学岛',
      description: '比较十分位、百分位，找出最大的小数。',
      steps: [{ id: 'step-1', type: 'tap-choice', prompt: '0.6、0.48、0.75 中，哪个小数最大？', knowledgePointTitle: '四年级小数：大小比较', variantCount: 8 }],
      reward: { stars: 3, badgeName: '小数比较星' }
    },
    'math-grade4-parallel-001': {
      code: levelCode,
      title: '平行与垂直',
      subjectTitle: '数学岛',
      description: '认识平行、垂直和相交关系。',
      steps: [{ id: 'step-1', type: 'tap-choice', prompt: '找到“两条直线永不相交”的关系。', knowledgePointTitle: '四年级图形：平行与垂直', variantCount: 8 }],
      reward: { stars: 3, badgeName: '直线关系星' }
    },
    'chinese-grade4-central-clue-001': {
      code: levelCode,
      title: '中心线索站',
      subjectTitle: '语文岛',
      description: '读海边短文，找出贯穿全文的线索词。',
      steps: [{ id: 'step-1', type: 'tap-choice', prompt: '读海边短文，选出贯穿全文的线索词。', knowledgePointTitle: '四年级阅读：中心与线索', variantCount: 6 }],
      reward: { stars: 2, badgeName: '线索观察星' }
    },
    'chinese-grade4-poem-image-001': {
      code: levelCode,
      title: '古诗意象理解',
      subjectTitle: '语文岛',
      description: '从诗句里找画面，理解古诗意象。',
      steps: [{ id: 'step-1', type: 'tap-choice', prompt: '“月落乌啼霜满天”主要写出了什么画面？', knowledgePointTitle: '四年级古诗：意象理解', variantCount: 6 }],
      reward: { stars: 2, badgeName: '诗意画面星' }
    },
    'english-grade4-listening-judgment-001': {
      code: levelCode,
      title: '时态关键词听辨',
      subjectTitle: '英语岛',
      description: '听句子，抓住表示过去时间的关键词。',
      steps: [{ id: 'step-1', type: 'listen-choice', prompt: 'Listen and choose the sentence with last Sunday.', knowledgePointTitle: '四年级英语：时态关键词听辨', variantCount: 8 }],
      reward: { stars: 2, badgeName: '时态听辨星' }
    },
    'english-grade4-scene-dialogue-001': {
      code: levelCode,
      title: '购物场景对话',
      subjectTitle: '英语岛',
      description: '按顺序跟读购物场景三句话。',
      steps: [{ id: 'step-1', type: 'sentence-read', prompt: '按顺序跟读购物场景三句话。', knowledgePointTitle: '四年级英语：场景对话表达', variantCount: 6 }],
      reward: { stars: 2, badgeName: '场景表达星' }
    }
  };

  const activityConfigs: Record<string, unknown> = {
    'math-grade4-decimal-compare-001': { kind: 'number-choice', instruction: '0.6、0.48、0.75 中，哪个小数最大？', choices: [0.6, 0.48, 0.75], correctChoice: 0.75, optionLabelPrefix: '小数卡', successFeedback: '答对了，0.75 最大，因为 75 个百分之一比 60 个百分之一更多', failureFeedback: '可以先把 0.6 看成 0.60，再比较百分位。' },
    'math-grade4-parallel-001': { kind: 'character-choice', instruction: '找到“两条直线永不相交”的关系。', choices: [{ label: '平行', hint: '两条线保持一样远' }, { label: '垂直', hint: '相交成直角' }, { label: '相交', hint: '两条线会碰到一起' }], correctChoice: '平行', successFeedback: '答对了，永不相交的两条直线互相平行', detailLines: ['平行线之间的距离处处相等。'], failureFeedback: '想一想铁路轨道的两条线。' },
    'chinese-grade4-central-clue-001': { kind: 'character-choice', instruction: '读海边短文，选出贯穿全文的线索词。', choices: [{ label: '海风', hint: '开头、中间、结尾都出现并推动画面' }, { label: '贝壳', hint: '只是一个细节' }, { label: '书包', hint: '不是全文重点' }], correctChoice: '海风', successFeedback: '答对了，海风贯穿全文，是这段文字的线索', detailLines: ['线索常常把多个画面串在一起。'], failureFeedback: '找一找哪个词反复出现，并连接了不同画面。' },
    'chinese-grade4-poem-image-001': { kind: 'character-choice', instruction: '“月落乌啼霜满天”主要写出了什么画面？', choices: [{ label: '夜晚清冷的江边景象', hint: '月落、乌啼、霜满天都让画面清冷' }, { label: '热闹的春游场景', hint: '和诗句氛围不符' }, { label: '中午阳光很强', hint: '诗句写的是夜晚' }], correctChoice: '夜晚清冷的江边景象', successFeedback: '答对了，这句诗写出夜晚清冷的画面', detailLines: ['读古诗可以先抓景物，再感受氛围。'], failureFeedback: '看看月落、乌啼、霜这些景物带来什么感觉。' },
    'english-grade4-listening-judgment-001': { kind: 'listen-choice', instruction: 'Listen and choose the sentence with last Sunday.', audioPrompt: 'I visited my grandma last Sunday.', audioText: 'I visited my grandma last Sunday.', lang: 'en-US', playButtonLabel: '播放时态关键词句', choiceAriaLabelPrefix: '英语句子', choices: ['I visited my grandma last Sunday.', 'I visit my grandma every Sunday.', 'I will visit my grandma tomorrow.'], correctChoice: 'I visited my grandma last Sunday.', successFeedback: 'Good! last Sunday tells us it happened in the past.', failureFeedback: 'Listen for last Sunday and visited.' },
    'english-grade4-scene-dialogue-001': { kind: 'sentence-read', instruction: '按顺序跟读购物场景三句话。', sentences: [{ text: 'Can I help you?', emoji: '🛍️', scene: '店员询问需要帮助吗' }, { text: 'I want a blue pencil.', emoji: '✏️', scene: '说出想买的物品' }, { text: 'Here you are.', emoji: '🤲', scene: '递给对方物品' }], successFeedback: '购物场景对话跟读完成啦' }
  };

  const payload = payloads[levelCode] as { steps: Array<Record<string, unknown>> };
  payload.steps[0].activityConfigJson = JSON.stringify(activityConfigs[levelCode]);
  return payload;
}

describe('Grade 4 maturity levels', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      for (const levelCode of grade4MaturityLevels) {
        if (url.endsWith(`/api/levels/${levelCode}`)) {
          return { ok: true, json: async () => levelPayload(levelCode) } as Response;
        }
      }
      throw new Error(`Unhandled fetch: ${url}`);
    }));
  });

  afterEach(() => vi.unstubAllGlobals());

  test('adds grade 4 maturity levels to subject maps', () => {
    const mathCodes = subjectMaps.math.chapters.filter((chapter) => chapter.stageLabel === '四年级').flatMap((chapter) => chapter.levels.map((level) => level.code));
    const chineseCodes = subjectMaps.chinese.chapters.filter((chapter) => chapter.stageLabel === '四年级').flatMap((chapter) => chapter.levels.map((level) => level.code));
    const englishCodes = subjectMaps.english.chapters.filter((chapter) => chapter.stageLabel === '四年级').flatMap((chapter) => chapter.levels.map((level) => level.code));

    expect(mathCodes).toEqual(expect.arrayContaining(['math-grade4-decimal-compare-001', 'math-grade4-parallel-001']));
    expect(chineseCodes).toEqual(expect.arrayContaining(['chinese-grade4-central-clue-001', 'chinese-grade4-poem-image-001']));
    expect(englishCodes).toEqual(expect.arrayContaining(['english-grade4-listening-judgment-001', 'english-grade4-scene-dialogue-001']));
  });

  test('renders representative grade 4 math chinese and english interactions', async () => {
    const user = userEvent.setup();

    const mathLevel = render(<MemoryRouter initialEntries={['/levels/math-grade4-decimal-compare-001']}><App /></MemoryRouter>);
    expect(await screen.findByText('小数大小比较')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: '小数卡 0.75' }));
    expect(screen.getByText('答对了，0.75 最大，因为 75 个百分之一比 60 个百分之一更多')).toBeInTheDocument();
    mathLevel.unmount();

    const chineseLevel = render(<MemoryRouter initialEntries={['/levels/chinese-grade4-central-clue-001']}><App /></MemoryRouter>);
    expect(await screen.findByText('中心线索站')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: '汉字卡片 海风' }));
    expect(screen.getByText('答对了，海风贯穿全文，是这段文字的线索')).toBeInTheDocument();
    chineseLevel.unmount();

    render(<MemoryRouter initialEntries={['/levels/english-grade4-listening-judgment-001']}><App /></MemoryRouter>);
    expect(await screen.findByText('时态关键词听辨')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: '英语句子 I visited my grandma last Sunday.' }));
    expect(screen.getByText('Good! last Sunday tells us it happened in the past.')).toBeInTheDocument();
  });
});
