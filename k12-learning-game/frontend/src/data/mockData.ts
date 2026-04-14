import type { HomeOverview, LevelDetail, SubjectMapData, SubjectCode } from '../types';

export const homeOverview: HomeOverview = {
  child: {
    nickname: '小星星',
    streakDays: 7,
    stars: 126,
    title: '晨光冒险家'
  },
  featuredWorld: '启航岛',
  todayTask: '完成数字小探险，点亮今天的第一颗星。',
  subjects: [
    { code: 'math', title: '数学岛', subtitle: '数感和规律正在闪闪发亮', color: '#ff8a5b' },
    { code: 'chinese', title: '语文岛', subtitle: '字形和拼音一起发芽', color: '#f2c14e' },
    { code: 'english', title: '英语岛', subtitle: '字母和单词在海风里唱歌', color: '#39b7a5' }
  ]
};

export const subjectMaps: Record<SubjectCode, SubjectMapData> = {
  math: {
    subjectCode: 'math',
    chapterTitle: '数字启蒙站',
    chapterSubtitle: '从看见数量到会认数字，完成第一段数学冒险。',
    levels: [
      { code: 'math-numbers-001', title: '认识 0-10', status: 'recommended' },
      { code: 'math-addition-001', title: '10 以内加法', status: 'available' },
      { code: 'math-thinking-001', title: '规律小火车', status: 'available' },
      { code: 'math-subtraction-001', title: '水果减减看', status: 'available' },
      { code: 'math-compare-001', title: '谁更多挑战', status: 'available' },
      { code: 'math-equation-001', title: '图像列式屋', status: 'available' },
      { code: 'math-wordproblem-001', title: '故事应用题', status: 'available' }
    ]
  },
  chinese: {
    subjectCode: 'chinese',
    chapterTitle: '汉字花园',
    chapterSubtitle: '跟着笔画和图像认识生活里的常见字。',
    levels: [
      { code: 'chinese-characters-001', title: '太阳和月亮', status: 'recommended' },
      { code: 'chinese-pinyin-001', title: '拼音泡泡', status: 'available' },
      { code: 'chinese-strokes-001', title: '笔顺小画家', status: 'available' }
    ]
  },
  english: {
    subjectCode: 'english',
    chapterTitle: '字母海湾',
    chapterSubtitle: '在轻快节奏里认识字母和单词的声音。',
    levels: [
      { code: 'english-letters-001', title: '字母 A 到 F', status: 'recommended' },
      { code: 'english-words-001', title: '日常单词配对', status: 'available' },
      { code: 'english-story-001', title: '海湾小绘本', status: 'available' }
    ]
  }
};

export const levelDetails: Record<string, LevelDetail> = {
  'math-numbers-001': {
    code: 'math-numbers-001',
    title: '数字小探险',
    subjectTitle: '数学岛',
    description: '拖一拖、选一选，把数字和数量变成好朋友。',
    steps: [
      { id: 'step-1', type: 'drag-match', prompt: '把 5 个苹果拖进篮子' },
      { id: 'step-2', type: 'tap-choice', prompt: '找到写着 5 的数字石牌' }
    ],
    reward: {
      stars: 3,
      badgeName: '数字小达人'
    }
  },
  'math-addition-001': {
    code: 'math-addition-001',
    title: '糖果加加看',
    subjectTitle: '数学岛',
    description: '看着糖果数量变化，学会简单加法。',
    steps: [
      { id: 'step-1', type: 'tap-choice', prompt: '2 颗糖果加 3 颗，一共有几颗？' }
    ],
    reward: {
      stars: 2,
      badgeName: '加法闪光星'
    }
  },
  'math-thinking-001': {
    code: 'math-thinking-001',
    title: '规律小火车',
    subjectTitle: '数学岛',
    description: '找一找颜色和图形的规律，让小火车继续往前开。',
    steps: [
      { id: 'step-1', type: 'pattern-choice', prompt: '看看规律，选出下一节车厢' }
    ],
    reward: {
      stars: 2,
      badgeName: '规律观察家'
    }
  },
  'math-subtraction-001': {
    code: 'math-subtraction-001',
    title: '水果减减看',
    subjectTitle: '数学岛',
    description: '点一点拿走水果，再想想还剩多少。',
    steps: [
      { id: 'step-1', type: 'take-away', prompt: '从 8 个草莓里拿走 3 个' },
      { id: 'step-2', type: 'tap-choice', prompt: '还剩几个草莓？' }
    ],
    reward: {
      stars: 2,
      badgeName: '减法小能手'
    }
  },
  'math-compare-001': {
    code: 'math-compare-001',
    title: '谁更多挑战',
    subjectTitle: '数学岛',
    description: '看一看两边的数量，选出更多的一组。',
    steps: [
      { id: 'step-1', type: 'comparison-choice', prompt: '哪一边的小鱼更多？' }
    ],
    reward: {
      stars: 2,
      badgeName: '数感小雷达'
    }
  },
  'math-equation-001': {
    code: 'math-equation-001',
    title: '图像列式屋',
    subjectTitle: '数学岛',
    description: '看着图片把加法算式列出来。',
    steps: [
      { id: 'step-1', type: 'equation-choice', prompt: '看图片，选出正确的算式' }
    ],
    reward: {
      stars: 2,
      badgeName: '列式小侦探'
    }
  },
  'math-wordproblem-001': {
    code: 'math-wordproblem-001',
    title: '故事应用题',
    subjectTitle: '数学岛',
    description: '听故事、看图画，再算出最后的答案。',
    steps: [
      { id: 'step-1', type: 'story-choice', prompt: '小兔子有 4 根胡萝卜，又收到 2 根，一共有几根？' }
    ],
    reward: {
      stars: 2,
      badgeName: '应用题小勇士'
    }
  },
  'chinese-strokes-001': {
    code: 'chinese-strokes-001',
    title: '笔顺小画家',
    subjectTitle: '语文岛',
    description: '按顺序点一点，把汉字的笔画排整齐。',
    steps: [
      { id: 'step-1', type: 'stroke-order', prompt: '按笔顺点出“口”的三笔' }
    ],
    reward: {
      stars: 2,
      badgeName: '笔顺小画家'
    }
  },
  'english-story-001': {
    code: 'english-story-001',
    title: '海湾小绘本',
    subjectTitle: '英语岛',
    description: '跟着图片读一读简单句子，把小故事完整读下来。',
    steps: [
      { id: 'step-1', type: 'sentence-read', prompt: '按顺序读完这三句小绘本' }
    ],
    reward: {
      stars: 2,
      badgeName: '绘本小海鸥'
    }
  }
};
