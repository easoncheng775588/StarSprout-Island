import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import App from '../App';
import { subjectMaps } from '../data/mockData';

const grade2MaturityLevels = [
  'math-grade2-division-001',
  'math-grade2-statistics-001',
  'chinese-grade2-punctuation-001',
  'chinese-grade2-main-idea-001',
  'english-grade2-food-listening-001',
  'english-grade2-animal-dialogue-001'
];

function levelPayload(levelCode: string) {
  const payloads: Record<string, unknown> = {
    'math-grade2-division-001': {
      code: levelCode,
      title: '除法平均分',
      subjectTitle: '数学岛',
      description: '把物品平均分给几个人，看懂除法的意义。',
      steps: [{ id: 'step-1', type: 'story-choice', prompt: '12 个苹果平均分给 3 个小朋友，每人几个？', knowledgePointTitle: '二年级运算：平均分除法', variantCount: 8 }],
      reward: { stars: 3, badgeName: '平均分小队长' }
    },
    'math-grade2-statistics-001': {
      code: levelCode,
      title: '统计图读数',
      subjectTitle: '数学岛',
      description: '读懂简单统计图，比较哪一类最多。',
      steps: [{ id: 'step-1', type: 'tap-choice', prompt: '看水果统计图，哪种水果最多？', knowledgePointTitle: '二年级统计：读图比较', variantCount: 8 }],
      reward: { stars: 3, badgeName: '统计观察星' }
    },
    'chinese-grade2-punctuation-001': {
      code: levelCode,
      title: '标点语气站',
      subjectTitle: '语文岛',
      description: '根据句子的语气，选择更合适的标点。',
      steps: [{ id: 'step-1', type: 'tap-choice', prompt: '“你今天开心吗”后面应该加什么标点？', knowledgePointTitle: '二年级表达：标点语气', variantCount: 8 }],
      reward: { stars: 2, badgeName: '语气小侦探' }
    },
    'chinese-grade2-main-idea-001': {
      code: levelCode,
      title: '中心句小雷达',
      subjectTitle: '语文岛',
      description: '读一小段话，找到最能概括意思的句子。',
      steps: [{ id: 'step-1', type: 'tap-choice', prompt: '读短段，找出中心句。', knowledgePointTitle: '二年级阅读：中心句初步', variantCount: 6 }],
      reward: { stars: 2, badgeName: '中心句雷达' }
    },
    'english-grade2-food-listening-001': {
      code: levelCode,
      title: '食物单词听辨',
      subjectTitle: '英语岛',
      description: '听食物单词，选出正确的词卡。',
      steps: [{ id: 'step-1', type: 'listen-choice', prompt: 'Listen and choose: rice.', knowledgePointTitle: '二年级英语：食物词听辨', variantCount: 8 }],
      reward: { stars: 2, badgeName: '食物听辨星' }
    },
    'english-grade2-animal-dialogue-001': {
      code: levelCode,
      title: '动物对话跟读',
      subjectTitle: '英语岛',
      description: '围绕喜欢的动物，跟读简单问答。',
      steps: [{ id: 'step-1', type: 'sentence-read', prompt: '按顺序跟读动物问答。', knowledgePointTitle: '二年级英语：动物主题对话', variantCount: 6 }],
      reward: { stars: 2, badgeName: '动物对话星' }
    }
  };

  const activityConfigs: Record<string, unknown> = {
    'math-grade2-division-001': { kind: 'story-choice', instruction: '12 个苹果平均分给 3 个小朋友，每人几个？', emoji: '🍎', characterLabel: '平均分餐桌', detailLines: ['先把 12 个苹果分成 3 份。', '每份一样多，就是平均分。'], choices: [3, 4, 5], correctChoice: 4, successFeedback: '答对了，12 平均分成 3 份，每份 4 个', failureFeedback: '可以 3 个小朋友轮流每人拿 1 个，数数每人最后有几个。' },
    'math-grade2-statistics-001': { kind: 'character-choice', instruction: '看水果统计图，哪种水果最多？', choices: [{ label: '苹果', hint: '5 个' }, { label: '香蕉', hint: '8 个' }, { label: '梨', hint: '6 个' }], correctChoice: '香蕉', successFeedback: '答对了，香蕉有 8 个，是最多的', detailLines: ['读统计图时先看每一类有几个。', '再比较数量大小。'], failureFeedback: '先比较 5、8、6，哪个数最大？' },
    'chinese-grade2-punctuation-001': { kind: 'character-choice', instruction: '“你今天开心吗”后面应该加什么标点？', choices: [{ label: '？', hint: '问号' }, { label: '。', hint: '句号' }, { label: '！', hint: '感叹号' }], correctChoice: '？', successFeedback: '答对了，这是在提问，要用问号', detailLines: ['看到“吗”，通常表示问题。'], failureFeedback: '这句话是在问别人，要选能表示提问的标点。' },
    'chinese-grade2-main-idea-001': { kind: 'character-choice', instruction: '读短段，找出中心句。', choices: [{ label: '小松鼠很勤劳。', hint: '能概括整段意思' }, { label: '它摘了三个松果。', hint: '只是一个细节' }, { label: '树林里有风。', hint: '不是主要内容' }], correctChoice: '小松鼠很勤劳。', successFeedback: '答对了，这句话能概括整段主要意思', detailLines: ['中心句常常能说出这一段主要讲什么。'], failureFeedback: '找一找哪一句能把整段意思都说出来。' },
    'english-grade2-food-listening-001': { kind: 'listen-choice', instruction: 'Listen and choose: rice.', audioPrompt: 'rice', audioText: 'rice', lang: 'en-US', playButtonLabel: '播放食物单词', choiceAriaLabelPrefix: '食物单词', choices: ['rice', 'milk', 'cake'], correctChoice: 'rice', successFeedback: 'Good! rice is 米饭。', failureFeedback: 'Listen again. rice starts with /r/.' },
    'english-grade2-animal-dialogue-001': { kind: 'sentence-read', instruction: '围绕喜欢的动物，跟读简单问答。', sentences: [{ text: 'Do you like cats?', emoji: '🐱', scene: '询问是否喜欢猫' }, { text: 'Yes, I do.', emoji: '😊', scene: '肯定回答' }, { text: 'Cats are cute.', emoji: '🐾', scene: '描述猫很可爱' }], successFeedback: '动物对话跟读完成啦' }
  };

  const payload = payloads[levelCode] as { steps: Array<Record<string, unknown>> };
  payload.steps[0].activityConfigJson = JSON.stringify(activityConfigs[levelCode]);
  return payload;
}

describe('Grade 2 maturity levels', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      for (const levelCode of grade2MaturityLevels) {
        if (url.endsWith(`/api/levels/${levelCode}`)) {
          return { ok: true, json: async () => levelPayload(levelCode) } as Response;
        }
      }
      throw new Error(`Unhandled fetch: ${url}`);
    }));
  });

  afterEach(() => vi.unstubAllGlobals());

  test('adds grade 2 maturity levels to subject maps', () => {
    const mathCodes = subjectMaps.math.chapters.filter((chapter) => chapter.stageLabel === '二年级').flatMap((chapter) => chapter.levels.map((level) => level.code));
    const chineseCodes = subjectMaps.chinese.chapters.filter((chapter) => chapter.stageLabel === '二年级').flatMap((chapter) => chapter.levels.map((level) => level.code));
    const englishCodes = subjectMaps.english.chapters.filter((chapter) => chapter.stageLabel === '二年级').flatMap((chapter) => chapter.levels.map((level) => level.code));

    expect(mathCodes).toEqual(expect.arrayContaining(['math-grade2-division-001', 'math-grade2-statistics-001']));
    expect(chineseCodes).toEqual(expect.arrayContaining(['chinese-grade2-punctuation-001', 'chinese-grade2-main-idea-001']));
    expect(englishCodes).toEqual(expect.arrayContaining(['english-grade2-food-listening-001', 'english-grade2-animal-dialogue-001']));
  });

  test('renders representative grade 2 math chinese and english interactions', async () => {
    const user = userEvent.setup();

    const mathLevel = render(<MemoryRouter initialEntries={['/levels/math-grade2-division-001']}><App /></MemoryRouter>);
    expect(await screen.findByText('除法平均分')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: '答案卡片 4' }));
    expect(screen.getByText('答对了，12 平均分成 3 份，每份 4 个')).toBeInTheDocument();
    mathLevel.unmount();

    const chineseLevel = render(<MemoryRouter initialEntries={['/levels/chinese-grade2-main-idea-001']}><App /></MemoryRouter>);
    expect(await screen.findByText('中心句小雷达')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: '汉字卡片 小松鼠很勤劳。' }));
    expect(screen.getByText('答对了，这句话能概括整段主要意思')).toBeInTheDocument();
    chineseLevel.unmount();

    render(<MemoryRouter initialEntries={['/levels/english-grade2-food-listening-001']}><App /></MemoryRouter>);
    expect(await screen.findByText('食物单词听辨')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: '食物单词 rice' }));
    expect(screen.getByText('Good! rice is 米饭。')).toBeInTheDocument();
  });
});
