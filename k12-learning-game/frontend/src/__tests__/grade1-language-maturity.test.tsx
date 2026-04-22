import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import App from '../App';
import { subjectMaps } from '../data/mockData';

const grade1LanguageLevels = [
  'chinese-grade1-finals-001',
  'chinese-grade1-measure-word-001',
  'chinese-grade1-picture-speaking-001',
  'english-grade1-short-vowel-001',
  'english-grade1-number-color-001',
  'english-grade1-dialogue-001'
];

function mockLevelResponse(levelCode: string) {
  const payloads: Record<string, unknown> = {
    'chinese-grade1-finals-001': {
      code: 'chinese-grade1-finals-001',
      title: '韵母听辨站',
      subjectTitle: '语文岛',
      description: '听一听常见韵母，把拼读声音分清楚。',
      steps: [
        {
          id: 'step-1',
          type: 'listen-choice',
          prompt: '听老师读 ai，选出正确韵母。',
          knowledgePointTitle: '一年级拼音：复韵母听辨',
          variantCount: 8,
          activityConfigJson: JSON.stringify({
            kind: 'listen-choice',
            instruction: '听老师读 ai，选出正确韵母。',
            audioPrompt: 'ai',
            audioText: 'ai',
            lang: 'zh-CN',
            playButtonLabel: '播放韵母',
            choices: ['ai', 'ei', 'ao'],
            correctChoice: 'ai',
            successFeedback: '听对了，ai 像“挨着”的 ai',
            failureFeedback: '再听一遍，先听开头 a，再滑到 i。'
          })
        }
      ],
      reward: { stars: 2, badgeName: '韵母小耳朵' }
    },
    'chinese-grade1-measure-word-001': {
      code: 'chinese-grade1-measure-word-001',
      title: '量词搭配桥',
      subjectTitle: '语文岛',
      description: '把常见名词和合适的量词搭起来。',
      steps: [
        {
          id: 'step-1',
          type: 'tap-choice',
          prompt: '给“一条小鱼”选择正确的量词。',
          knowledgePointTitle: '一年级词语：量词搭配',
          variantCount: 8,
          activityConfigJson: JSON.stringify({
            kind: 'character-choice',
            instruction: '给“一条小鱼”选择正确的量词。',
            choices: [
              { label: '条', hint: '一条小鱼' },
              { label: '朵', hint: '一朵花' },
              { label: '本', hint: '一本书' }
            ],
            correctChoice: '条',
            successFeedback: '答对了，小鱼常说“一条小鱼”',
            detailLines: ['量词要和后面的事物搭配。', '鱼、河、路常用“条”。'],
            failureFeedback: '想一想，平时我们会说一什么小鱼？'
          })
        }
      ],
      reward: { stars: 2, badgeName: '量词搭配星' }
    },
    'chinese-grade1-picture-speaking-001': {
      code: 'chinese-grade1-picture-speaking-001',
      title: '看图说一句',
      subjectTitle: '语文岛',
      description: '看图读句，再试着把一句话说完整。',
      steps: [
        {
          id: 'step-1',
          type: 'sentence-read',
          prompt: '按顺序读完三句看图说话。',
          knowledgePointTitle: '一年级表达：看图说话',
          variantCount: 6,
          activityConfigJson: JSON.stringify({
            kind: 'sentence-read',
            instruction: '看图先找人物、地点和动作，再把句子读出来。',
            sentences: [
              { text: '早上，小明来到学校。', emoji: '🏫', scene: '小明背着书包到校门口' },
              { text: '他和老师说早上好。', emoji: '👩‍🏫', scene: '小明向老师问好' },
              { text: '同学们一起走进教室。', emoji: '📚', scene: '大家准备上课' }
            ],
            successFeedback: '看图说话读顺啦，人物、地点和动作都找到了'
          })
        }
      ],
      reward: { stars: 2, badgeName: '看图表达星' }
    },
    'english-grade1-short-vowel-001': {
      code: 'english-grade1-short-vowel-001',
      title: '短元音听辨',
      subjectTitle: '英语岛',
      description: '听短元音，把 cat、bed、pig 这类单词开口读准。',
      steps: [
        {
          id: 'step-1',
          type: 'listen-choice',
          prompt: '听 /æ/ 的声音，选出对应单词。',
          knowledgePointTitle: '一年级英语：短元音听辨',
          variantCount: 8,
          activityConfigJson: JSON.stringify({
            kind: 'listen-choice',
            instruction: '听 /æ/ 的声音，选出对应单词。',
            audioPrompt: '/æ/',
            audioText: 'cat',
            lang: 'en-US',
            playButtonLabel: '播放短元音单词',
            choiceAriaLabelPrefix: '短元音单词',
            choices: ['cat', 'bed', 'pig'],
            correctChoice: 'cat',
            successFeedback: '听对了，cat 里有短短的 /æ/',
            failureFeedback: '再听一遍，cat 的嘴巴要打开一点。'
          })
        }
      ],
      reward: { stars: 2, badgeName: '短元音小耳朵' }
    },
    'english-grade1-number-color-001': {
      code: 'english-grade1-number-color-001',
      title: '数字颜色配对',
      subjectTitle: '英语岛',
      description: '把数字、颜色和图标配起来，建立一年级常用词。',
      steps: [
        {
          id: 'step-1',
          type: 'drag-match',
          prompt: '把 one、two、red 和图片连起来。',
          knowledgePointTitle: '一年级英语：数字颜色词',
          variantCount: 8,
          activityConfigJson: JSON.stringify({
            kind: 'word-match',
            instruction: '先点英文词，再点对应图片。',
            pairs: [
              { word: 'one', pictureLabel: '一个星星', emoji: '⭐', phonetic: '/wʌn/' },
              { word: 'two', pictureLabel: '两个气球', emoji: '🎈', phonetic: '/tuː/' },
              { word: 'red', pictureLabel: '红色蜡笔', emoji: '🟥', phonetic: '/red/' }
            ]
          })
        }
      ],
      reward: { stars: 2, badgeName: '数字颜色星' }
    },
    'english-grade1-dialogue-001': {
      code: 'english-grade1-dialogue-001',
      title: '课堂对话跟读',
      subjectTitle: '英语岛',
      description: '跟读课堂里的常用短句，敢把英语说出口。',
      steps: [
        {
          id: 'step-1',
          type: 'sentence-read',
          prompt: '按顺序跟读课堂小对话。',
          knowledgePointTitle: '一年级英语：课堂日常表达',
          variantCount: 6,
          activityConfigJson: JSON.stringify({
            kind: 'sentence-read',
            instruction: '像课堂对话一样，点一句、听一句、跟一句。',
            sentences: [
              { text: 'May I come in?', emoji: '🚪', scene: '进教室前礼貌询问' },
              { text: 'Sit down, please.', emoji: '🪑', scene: '老师请同学坐下' },
              { text: 'Open your book.', emoji: '📘', scene: '打开书准备学习' }
            ],
            successFeedback: '课堂小对话跟读完成啦'
          })
        }
      ],
      reward: { stars: 2, badgeName: '课堂表达星' }
    }
  };

  return payloads[levelCode];
}

describe('Grade 1 language maturity levels', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
        const url = String(input);

        for (const levelCode of grade1LanguageLevels) {
          if (url.endsWith(`/api/levels/${levelCode}`) && !init?.method) {
            return {
              ok: true,
              json: async () => mockLevelResponse(levelCode)
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

  test('adds grade 1 language maturity levels to subject maps', () => {
    const chineseLevelCodes = subjectMaps.chinese.chapters
      .filter((chapter) => chapter.stageLabel === '一年级')
      .flatMap((chapter) => chapter.levels.map((level) => level.code));
    const englishLevelCodes = subjectMaps.english.chapters
      .filter((chapter) => chapter.stageLabel === '一年级')
      .flatMap((chapter) => chapter.levels.map((level) => level.code));

    expect(chineseLevelCodes).toEqual(expect.arrayContaining([
      'chinese-grade1-finals-001',
      'chinese-grade1-measure-word-001',
      'chinese-grade1-picture-speaking-001'
    ]));
    expect(englishLevelCodes).toEqual(expect.arrayContaining([
      'english-grade1-short-vowel-001',
      'english-grade1-number-color-001',
      'english-grade1-dialogue-001'
    ]));
  });

  test('renders interactive grade 1 chinese phonics and expression levels', async () => {
    const user = userEvent.setup();

    const finalsLevel = render(
      <MemoryRouter initialEntries={['/levels/chinese-grade1-finals-001']}>
        <App />
      </MemoryRouter>
    );

    expect(await screen.findByText('韵母听辨站')).toBeInTheDocument();
    expect(screen.getByText('一年级拼音：复韵母听辨')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: '拼音泡泡 ai' }));
    expect(screen.getByText('听对了，ai 像“挨着”的 ai')).toBeInTheDocument();

    finalsLevel.unmount();

    const measureLevel = render(
      <MemoryRouter initialEntries={['/levels/chinese-grade1-measure-word-001']}>
        <App />
      </MemoryRouter>
    );

    expect(await screen.findByText('量词搭配桥')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: '汉字卡片 条' }));
    expect(screen.getByText('答对了，小鱼常说“一条小鱼”')).toBeInTheDocument();

    measureLevel.unmount();

    render(
      <MemoryRouter initialEntries={['/levels/chinese-grade1-picture-speaking-001']}>
        <App />
      </MemoryRouter>
    );

    expect(await screen.findByText('看图说一句')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: '句子卡片 早上，小明来到学校。' }));
    await user.click(screen.getByRole('button', { name: '句子卡片 他和老师说早上好。' }));
    await user.click(screen.getByRole('button', { name: '句子卡片 同学们一起走进教室。' }));
    expect(screen.getByText('看图说话读顺啦，人物、地点和动作都找到了')).toBeInTheDocument();
  });

  test('renders interactive grade 1 english listening matching and dialogue levels', async () => {
    const user = userEvent.setup();

    const vowelLevel = render(
      <MemoryRouter initialEntries={['/levels/english-grade1-short-vowel-001']}>
        <App />
      </MemoryRouter>
    );

    expect(await screen.findByText('短元音听辨')).toBeInTheDocument();
    expect(screen.getByText('一年级英语：短元音听辨')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: '短元音单词 cat' }));
    expect(screen.getByText('听对了，cat 里有短短的 /æ/')).toBeInTheDocument();

    vowelLevel.unmount();

    const wordLevel = render(
      <MemoryRouter initialEntries={['/levels/english-grade1-number-color-001']}>
        <App />
      </MemoryRouter>
    );

    expect(await screen.findByText('数字颜色配对')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: '单词卡 one' }));
    await user.click(screen.getByRole('button', { name: '图片卡 一个星星' }));
    expect(screen.getByText('连对了 1 / 3 组，one 是一个星星')).toBeInTheDocument();

    wordLevel.unmount();

    render(
      <MemoryRouter initialEntries={['/levels/english-grade1-dialogue-001']}>
        <App />
      </MemoryRouter>
    );

    expect(await screen.findByText('课堂对话跟读')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: '句子卡片 May I come in?' }));
    await user.click(screen.getByRole('button', { name: '句子卡片 Sit down, please.' }));
    await user.click(screen.getByRole('button', { name: '句子卡片 Open your book.' }));
    expect(screen.getByText('课堂小对话跟读完成啦')).toBeInTheDocument();
  });
});
