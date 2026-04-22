import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import App from '../App';
import { subjectMaps } from '../data/mockData';

const grade3MaturityLevels = [
  'math-grade3-remainder-001',
  'math-grade3-area-001',
  'chinese-grade3-main-idea-001',
  'chinese-grade3-writing-order-001',
  'english-grade3-listening-001',
  'english-grade3-question-001'
];

function levelPayload(levelCode: string) {
  const payloads: Record<string, unknown> = {
    'math-grade3-remainder-001': {
      code: levelCode,
      title: '有余数除法',
      subjectTitle: '数学岛',
      description: '把不能正好分完的数量说清楚，认识余数。',
      steps: [{ id: 'step-1', type: 'story-choice', prompt: '17 个橘子每 5 个装一袋，可以装满几袋，还剩几个？', knowledgePointTitle: '三年级运算：有余数除法', variantCount: 8 }],
      reward: { stars: 3, badgeName: '余数观察星' }
    },
    'math-grade3-area-001': {
      code: levelCode,
      title: '长方形面积',
      subjectTitle: '数学岛',
      description: '用长和宽组成面积模型，理解长方形面积。',
      steps: [{ id: 'step-1', type: 'story-choice', prompt: '长方形花坛长 8 米、宽 3 米，面积是多少平方米？', knowledgePointTitle: '三年级图形：长方形面积', variantCount: 8 }],
      reward: { stars: 3, badgeName: '面积花园星' }
    },
    'chinese-grade3-main-idea-001': {
      code: levelCode,
      title: '主要内容雷达',
      subjectTitle: '语文岛',
      description: '读一小段话，选择最能概括主要内容的句子。',
      steps: [{ id: 'step-1', type: 'tap-choice', prompt: '读秋游短文，选出最能概括内容的一句。', knowledgePointTitle: '三年级阅读：概括主要内容', variantCount: 6 }],
      reward: { stars: 2, badgeName: '概括雷达星' }
    },
    'chinese-grade3-writing-order-001': {
      code: levelCode,
      title: '顺序观察表达',
      subjectTitle: '语文岛',
      description: '用先、接着、最后把观察顺序说清楚。',
      steps: [{ id: 'step-1', type: 'sentence-read', prompt: '按顺序读完观察小蚂蚁的三句话。', knowledgePointTitle: '三年级表达：按顺序写观察', variantCount: 6 }],
      reward: { stars: 2, badgeName: '顺序表达星' }
    },
    'english-grade3-listening-001': {
      code: levelCode,
      title: '日常句听辨',
      subjectTitle: '英语岛',
      description: '听日常短句，选择听到的英语句子。',
      steps: [{ id: 'step-1', type: 'listen-choice', prompt: 'Listen and choose: I go to school by bus.', knowledgePointTitle: '三年级英语：日常句听辨', variantCount: 8 }],
      reward: { stars: 2, badgeName: '句子听辨星' }
    },
    'english-grade3-question-001': {
      code: levelCode,
      title: '一般疑问句转换',
      subjectTitle: '英语岛',
      description: '把陈述句转换成一般疑问句。',
      steps: [{ id: 'step-1', type: 'tap-choice', prompt: '找到 You like apples. 的一般疑问句。', knowledgePointTitle: '三年级英语：一般疑问句转换', variantCount: 8 }],
      reward: { stars: 2, badgeName: '问句转换星' }
    }
  };

  const activityConfigs: Record<string, unknown> = {
    'math-grade3-remainder-001': { kind: 'story-choice', instruction: '17 个橘子每 5 个装一袋，可以装满几袋，还剩几个？', emoji: '🍊', characterLabel: '橘子装袋站', detailLines: ['先每 5 个装一袋。', '17 里面有 3 个 5，还剩 2 个。'], choices: [2, 3, 4], correctChoice: 3, successFeedback: '答对了，17 ÷ 5 = 3 袋余 2 个', failureFeedback: '先数 5、10、15，看看离 17 还差几个。' },
    'math-grade3-area-001': { kind: 'story-choice', instruction: '长方形花坛长 8 米、宽 3 米，面积是多少平方米？', emoji: '🌷', characterLabel: '花坛面积格', detailLines: ['可以看成 3 行，每行 8 格。', '面积就是 8 × 3。'], choices: [22, 24, 28], correctChoice: 24, successFeedback: '答对了，8 × 3 = 24 平方米', failureFeedback: '长方形面积用长乘宽。' },
    'chinese-grade3-main-idea-001': { kind: 'character-choice', instruction: '读秋游短文，选出最能概括内容的一句。', choices: [{ label: '同学们秋游时观察了美丽的公园。', hint: '能概括地点、人物和主要活动' }, { label: '小明带了一个水壶。', hint: '只是细节' }, { label: '树叶是黄色的。', hint: '只是一个画面' }], correctChoice: '同学们秋游时观察了美丽的公园。', successFeedback: '答对了，这句话概括了人物、地点和主要活动', detailLines: ['概括主要内容时，要抓住谁、在哪里、做了什么。'], failureFeedback: '不要只选细节，要选能说完整段意思的句子。' },
    'chinese-grade3-writing-order-001': { kind: 'sentence-read', instruction: '按“先、接着、最后”的顺序读完观察小蚂蚁的三句话。', sentences: [{ text: '先看见一只小蚂蚁搬着米粒。', emoji: '🐜', scene: '先看到蚂蚁搬米粒' }, { text: '接着，它叫来了两个伙伴。', emoji: '👀', scene: '接着伙伴来了' }, { text: '最后，大家一起把米粒搬回洞里。', emoji: '🏡', scene: '最后搬回洞里' }], successFeedback: '顺序表达完成，观察过程说清楚了' },
    'english-grade3-listening-001': { kind: 'listen-choice', instruction: 'Listen and choose: I go to school by bus.', audioPrompt: 'I go to school by bus.', audioText: 'I go to school by bus.', lang: 'en-US', playButtonLabel: '播放日常句', choiceAriaLabelPrefix: '英语句子', choices: ['I go to school by bus.', 'I go home by bike.', 'I read books at school.'], correctChoice: 'I go to school by bus.', successFeedback: 'Good! You heard school and bus.', failureFeedback: 'Listen for the words school and bus.' },
    'english-grade3-question-001': { kind: 'character-choice', instruction: '找到 You like apples. 的一般疑问句。', choices: [{ label: 'Do you like apples?', hint: 'Do 放到句首，形成一般疑问句' }, { label: 'You do like apples.', hint: '这是强调句' }, { label: 'You like apples?', hint: '口语里可用，但不是标准转换' }], correctChoice: 'Do you like apples?', successFeedback: '答对了，一般疑问句要把 Do 放到句首', detailLines: ['You like apples. 变问句时，在句首加 Do。'], failureFeedback: '找一找哪一句以 Do 开头，并且句末是问号。' }
  };

  const payload = payloads[levelCode] as { steps: Array<Record<string, unknown>> };
  payload.steps[0].activityConfigJson = JSON.stringify(activityConfigs[levelCode]);
  return payload;
}

describe('Grade 3 maturity levels', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      for (const levelCode of grade3MaturityLevels) {
        if (url.endsWith(`/api/levels/${levelCode}`)) {
          return { ok: true, json: async () => levelPayload(levelCode) } as Response;
        }
      }
      throw new Error(`Unhandled fetch: ${url}`);
    }));
  });

  afterEach(() => vi.unstubAllGlobals());

  test('adds grade 3 maturity levels to subject maps', () => {
    const mathCodes = subjectMaps.math.chapters.filter((chapter) => chapter.stageLabel === '三年级').flatMap((chapter) => chapter.levels.map((level) => level.code));
    const chineseCodes = subjectMaps.chinese.chapters.filter((chapter) => chapter.stageLabel === '三年级').flatMap((chapter) => chapter.levels.map((level) => level.code));
    const englishCodes = subjectMaps.english.chapters.filter((chapter) => chapter.stageLabel === '三年级').flatMap((chapter) => chapter.levels.map((level) => level.code));

    expect(mathCodes).toEqual(expect.arrayContaining(['math-grade3-remainder-001', 'math-grade3-area-001']));
    expect(chineseCodes).toEqual(expect.arrayContaining(['chinese-grade3-main-idea-001', 'chinese-grade3-writing-order-001']));
    expect(englishCodes).toEqual(expect.arrayContaining(['english-grade3-listening-001', 'english-grade3-question-001']));
  });

  test('renders representative grade 3 math chinese and english interactions', async () => {
    const user = userEvent.setup();

    const mathLevel = render(<MemoryRouter initialEntries={['/levels/math-grade3-remainder-001']}><App /></MemoryRouter>);
    expect(await screen.findByText('有余数除法')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: '答案卡片 3' }));
    expect(screen.getByText('答对了，17 ÷ 5 = 3 袋余 2 个')).toBeInTheDocument();
    mathLevel.unmount();

    const chineseLevel = render(<MemoryRouter initialEntries={['/levels/chinese-grade3-main-idea-001']}><App /></MemoryRouter>);
    expect(await screen.findByText('主要内容雷达')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: '汉字卡片 同学们秋游时观察了美丽的公园。' }));
    expect(screen.getByText('答对了，这句话概括了人物、地点和主要活动')).toBeInTheDocument();
    chineseLevel.unmount();

    render(<MemoryRouter initialEntries={['/levels/english-grade3-listening-001']}><App /></MemoryRouter>);
    expect(await screen.findByText('日常句听辨')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: '英语句子 I go to school by bus.' }));
    expect(screen.getByText('Good! You heard school and bus.')).toBeInTheDocument();
  });
});
