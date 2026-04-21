import type { HomeOverview, LevelDetail, SubjectMapData, SubjectCode } from '../types';
import { olympiadSubjectMap } from './olympiadData';

export const homeOverview: HomeOverview = {
  child: {
    nickname: '小星星',
    streakDays: 7,
    stars: 126,
    title: '晨光冒险家'
  },
  featuredWorld: '启航岛',
  todayTask: '完成数字小探险，点亮今天的第一颗星。',
  nextLevelCode: 'math-numbers-001',
  nextLevelTitle: '认识 0-10',
  achievementPreview: {
    unlockedCount: 6,
    totalCount: 10,
    nextBadgeName: '本周小冠军'
  },
  subjects: [
    { code: 'math', title: '数学岛', subtitle: '数感和规律正在闪闪发亮', color: '#ff8a5b' },
    { code: 'chinese', title: '语文岛', subtitle: '字形和拼音一起发芽', color: '#f2c14e' },
    { code: 'english', title: '英语岛', subtitle: '字母和单词在海风里唱歌', color: '#39b7a5' }
  ]
};

export const subjectMaps: Record<SubjectCode, SubjectMapData> = {
  math: {
    subjectCode: 'math',
    subjectTitle: '数学岛',
    chapters: [
      {
        code: 'math-numbers',
        stageLabel: '幼小衔接',
        title: '数字启蒙站',
        subtitle: '从看见数量到会认数字，完成第一段数学冒险。',
        levels: [
          { code: 'math-numbers-001', title: '认识 0-10', status: 'recommended' },
          { code: 'math-numbers-002', title: '认识 11-20', status: 'available' },
          { code: 'math-addition-001', title: '10 以内加法', status: 'available' },
          { code: 'math-addition-002', title: '20 以内加法', status: 'available' },
          { code: 'math-thinking-001', title: '规律小火车', status: 'available' },
          { code: 'math-thinking-002', title: '图形规律屋', status: 'available' },
          { code: 'math-subtraction-001', title: '水果减减看', status: 'available' },
          { code: 'math-subtraction-002', title: '20 以内减法', status: 'available' },
          { code: 'math-compare-001', title: '谁更多挑战', status: 'available' },
          { code: 'math-equation-001', title: '图像列式屋', status: 'available' },
          { code: 'math-wordproblem-001', title: '故事应用题', status: 'available' },
          { code: 'math-shapes-001', title: '图形分类屋', status: 'available' },
          { code: 'math-position-001', title: '上下左右小地图', status: 'available' },
          { code: 'math-ordinal-001', title: '排队第几个', status: 'available' }
        ]
      },
      {
        code: 'math-grade1-numbers',
        stageLabel: '一年级',
        title: '百数启航站',
        subtitle: '认识 100 以内的数，把位值和大小规律慢慢看清楚。',
        levels: [
          { code: 'math-grade1-numbers-001', title: '认识 100 以内的数', status: 'recommended' },
          { code: 'math-grade1-hundredchart-001', title: '百格图认数', status: 'available' },
          { code: 'math-grade1-numberline-001', title: '数轴跳跳桥', status: 'available' },
          { code: 'math-grade1-addition-001', title: '20 以内进位加法', status: 'available' }
        ]
      },
      {
        code: 'math-grade1-life',
        stageLabel: '一年级',
        title: '生活应用站',
        subtitle: '把 20 以内加减法放进生活场景，学会用数学想问题。',
        levels: [
          { code: 'math-grade1-subtraction-001', title: '20 以内退位减法', status: 'available' },
          { code: 'math-grade1-wordproblem-001', title: '生活应用题', status: 'available' }
        ]
      },
      {
        code: 'math-grade2-skills',
        stageLabel: '二年级',
        title: '乘法巧思站',
        subtitle: '把乘法和长度观察放到一起，让二年级数学更有条理。',
        levels: [
          { code: 'math-grade2-multiply-001', title: '表内乘法起步', status: 'recommended' },
          { code: 'math-grade2-array-001', title: '乘法数组花园', status: 'available' },
          { code: 'math-grade2-length-001', title: '长度单位比一比', status: 'available' }
        ]
      },
      {
        code: 'math-grade2-life',
        stageLabel: '二年级',
        title: '时间应用站',
        subtitle: '把应用题和时间问题放进生活里，继续培养数学思维。',
        levels: [
          { code: 'math-grade2-wordproblem-001', title: '两步应用题', status: 'available' },
          { code: 'math-grade2-bar-model-001', title: '线段图应用题', status: 'available' },
          { code: 'math-grade2-time-001', title: '时间小管家', status: 'available' }
        ]
      },
      {
        code: 'math-grade3-operations',
        stageLabel: '三年级',
        title: '除法图形站',
        subtitle: '从平均分到周长，开始看见三年级数学里的结构。',
        levels: [
          { code: 'math-grade3-division-001', title: '除法平均分', status: 'recommended' },
          { code: 'math-grade3-perimeter-001', title: '周长小侦探', status: 'available' },
          { code: 'math-grade3-area-model-001', title: '面积模型乘法', status: 'available' }
        ]
      },
      {
        code: 'math-grade3-thinking',
        stageLabel: '三年级',
        title: '分数策略站',
        subtitle: '用分数和多步应用题继续训练推理与表达。',
        levels: [
          { code: 'math-grade3-fraction-001', title: '分数初步', status: 'available' },
          { code: 'math-grade3-fractionbar-001', title: '分数条比较', status: 'available' },
          { code: 'math-grade3-wordproblem-001', title: '多步应用题', status: 'available' }
        ]
      },
      {
        code: 'math-grade4-numbers',
        stageLabel: '四年级',
        title: '小数图形站',
        subtitle: '从小数到角和图形，把抽象概念放进可观察的画面。',
        levels: [
          { code: 'math-grade4-decimal-001', title: '小数初步', status: 'recommended' },
          { code: 'math-grade4-hundredths-001', title: '小数百格图', status: 'available' },
          { code: 'math-grade4-angle-001', title: '角与图形', status: 'available' },
          { code: 'math-grade4-angle-classify-001', title: '角度分类挑战', status: 'available' }
        ]
      },
      {
        code: 'math-grade4-strategy',
        stageLabel: '四年级',
        title: '运算策略站',
        subtitle: '把综合运算和策略应用题拆开看，练习更清晰的思考。',
        levels: [
          { code: 'math-grade4-operation-001', title: '运算综合', status: 'available' },
          { code: 'math-grade4-distributive-001', title: '面积模型巧算', status: 'available' },
          { code: 'math-grade4-strategy-001', title: '策略应用题', status: 'available' },
          { code: 'math-grade4-distance-001', title: '路程线段图', status: 'available' }
        ]
      }
    ]
  },
  chinese: {
    subjectCode: 'chinese',
    subjectTitle: '语文岛',
    chapters: [
      {
        code: 'chinese-characters',
        stageLabel: '幼小衔接',
        title: '汉字花园',
        subtitle: '跟着图像和生活场景认识常见字。',
        levels: [
          { code: 'chinese-characters-001', title: '太阳和月亮', status: 'recommended' },
          { code: 'chinese-characters-002', title: '生活常见字', status: 'available' },
          { code: 'chinese-characters-003', title: '身体小伙伴', status: 'available' },
          { code: 'chinese-radicals-001', title: '偏旁小树', status: 'available' }
        ]
      },
      {
        code: 'chinese-pinyin',
        stageLabel: '幼小衔接',
        title: '拼音乐园',
        subtitle: '听声音、认拼读，把拼音读得更稳。',
        levels: [
          { code: 'chinese-pinyin-001', title: '拼音泡泡', status: 'available' },
          { code: 'chinese-pinyin-002', title: '拼读小火车', status: 'available' },
          { code: 'chinese-pinyin-003', title: '声母找朋友', status: 'available' },
          { code: 'chinese-pinyin-tone-001', title: '声调小山坡', status: 'available' }
        ]
      },
      {
        code: 'chinese-writing',
        stageLabel: '幼小衔接',
        title: '笔画写字屋',
        subtitle: '跟着笔顺把字写整齐，越写越有信心。',
        levels: [
          { code: 'chinese-strokes-001', title: '笔顺小画家', status: 'available' },
          { code: 'chinese-strokes-002', title: '日字描描乐', status: 'available' },
          { code: 'chinese-strokes-003', title: '人字起步', status: 'available' },
          { code: 'chinese-strokes-004', title: '横竖撇捺练习', status: 'available' }
        ]
      },
      {
        code: 'chinese-grade1-words',
        stageLabel: '一年级',
        title: '识字组词站',
        subtitle: '从常见生字出发，试着把字放进词语里读一读。',
        levels: [
          { code: 'chinese-grade1-words-001', title: '生字组词', status: 'recommended' },
          { code: 'chinese-grade1-pinyin-001', title: '拼音拼读提升', status: 'available' }
        ]
      },
      {
        code: 'chinese-grade1-reading',
        stageLabel: '一年级',
        title: '看图读句屋',
        subtitle: '从拼音到词语再到句子，一步步把一年级基础读起来。',
        levels: [
          { code: 'chinese-grade1-sentence-001', title: '看图读句', status: 'available' },
          { code: 'chinese-grade1-punctuation-001', title: '标点小卫士', status: 'available' }
        ]
      },
      {
        code: 'chinese-grade2-words',
        stageLabel: '二年级',
        title: '搭配排序站',
        subtitle: '学会搭配词语、理清句子顺序，让表达更流畅。',
        levels: [
          { code: 'chinese-grade2-phrase-001', title: '词语搭配', status: 'recommended' },
          { code: 'chinese-grade2-order-001', title: '句子排序', status: 'available' }
        ]
      },
      {
        code: 'chinese-grade2-reading',
        stageLabel: '二年级',
        title: '表达朗读屋',
        subtitle: '从看图表达走到朗读理解，把二年级阅读基础搭起来。',
        levels: [
          { code: 'chinese-grade2-picture-001', title: '看图表达', status: 'available' },
          { code: 'chinese-grade2-reading-001', title: '朗读理解', status: 'available' }
        ]
      },
      {
        code: 'chinese-grade3-reading',
        stageLabel: '三年级',
        title: '段落理解站',
        subtitle: '读懂一小段话，也开始留意段落中的关键词。',
        levels: [
          { code: 'chinese-grade3-paragraph-001', title: '段落理解', status: 'recommended' },
          { code: 'chinese-grade3-antonym-001', title: '近反义词', status: 'available' }
        ]
      },
      {
        code: 'chinese-grade3-expression',
        stageLabel: '三年级',
        title: '表达修辞屋',
        subtitle: '认识简单修辞，试着把阅读感受说得更清楚。',
        levels: [
          { code: 'chinese-grade3-rhetoric-001', title: '修辞感知', status: 'available' },
          { code: 'chinese-grade3-expression-001', title: '阅读表达', status: 'available' }
        ]
      },
      {
        code: 'chinese-grade4-reading',
        stageLabel: '四年级',
        title: '篇章理解站',
        subtitle: '从段落走向篇章，学会抓住中心和线索。',
        levels: [
          { code: 'chinese-grade4-passage-001', title: '篇章理解', status: 'recommended' },
          { code: 'chinese-grade4-writing-001', title: '写作表达', status: 'available' }
        ]
      },
      {
        code: 'chinese-grade4-expression',
        stageLabel: '四年级',
        title: '古诗语法屋',
        subtitle: '积累古诗，也开始认识句子里的表达规则。',
        levels: [
          { code: 'chinese-grade4-poem-001', title: '古诗积累', status: 'available' },
          { code: 'chinese-grade4-grammar-001', title: '语法规范', status: 'available' }
        ]
      }
    ]
  },
  english: {
    subjectCode: 'english',
    subjectTitle: '英语岛',
    chapters: [
      {
        code: 'english-letters',
        stageLabel: '幼小衔接',
        title: '字母海湾',
        subtitle: '把 26 个字母分段点亮，读出熟悉的节奏。',
        levels: [
          { code: 'english-letters-001', title: '字母 A 到 F', status: 'recommended' },
          { code: 'english-letters-002', title: '字母 G 到 L', status: 'available' },
          { code: 'english-letters-003', title: '字母 M 到 R', status: 'available' },
          { code: 'english-letters-004', title: '字母 S 到 Z', status: 'available' },
          { code: 'english-case-001', title: '大小写找朋友', status: 'available' },
          { code: 'english-letter-sounds-001', title: '字母发音小剧场', status: 'available' }
        ]
      },
      {
        code: 'english-phonics',
        stageLabel: '幼小衔接',
        title: '拼读码头',
        subtitle: '听字母和开头音，把声音和单词连起来。',
        levels: [
          { code: 'english-phonics-001', title: '字母藏在单词里', status: 'available' },
          { code: 'english-phonics-002', title: '开头声音侦探', status: 'available' }
        ]
      },
      {
        code: 'english-words',
        stageLabel: '幼小衔接',
        title: '单词沙滩',
        subtitle: '把生活常见单词和图片配成一对。',
        levels: [
          { code: 'english-words-001', title: '日常单词配对', status: 'available' },
          { code: 'english-words-002', title: '生活单词跟读', status: 'available' },
          { code: 'english-words-003', title: '颜色单词沙堡', status: 'available' },
          { code: 'english-family-001', title: '家庭单词屋', status: 'available' },
          { code: 'english-word-sounds-001', title: '单词读音小耳朵', status: 'available' }
        ]
      },
      {
        code: 'english-story',
        stageLabel: '幼小衔接',
        title: '绘本港湾',
        subtitle: '跟着图画和句子，把简单绘本一页页读下来。',
        levels: [
          { code: 'english-story-001', title: '海湾小绘本', status: 'available' },
          { code: 'english-story-002', title: '晨光小绘本', status: 'available' },
          { code: 'english-story-003', title: '晚安小绘本', status: 'available' },
          { code: 'english-story-004', title: '公园小绘本', status: 'available' },
          { code: 'english-daily-sentences-001', title: '日常短句跟读', status: 'available' }
        ]
      },
      {
        code: 'english-grade1-words',
        stageLabel: '一年级',
        title: '校园单词港',
        subtitle: '把一年级常见校园和动作单词认出来、配起来。',
        levels: [
          { code: 'english-grade1-words-001', title: '校园单词配对', status: 'recommended' },
          { code: 'english-grade1-phonics-001', title: 'CVC 拼读入门', status: 'available' }
        ]
      },
      {
        code: 'english-grade1-sentences',
        stageLabel: '一年级',
        title: '问候句海湾',
        subtitle: '从自然拼读到问候句，把英语说得更完整。',
        levels: [
          { code: 'english-grade1-sentence-001', title: '问候句跟读', status: 'available' },
          { code: 'english-grade1-actions-001', title: '动作单词配对', status: 'available' }
        ]
      },
      {
        code: 'english-grade2-phonics',
        stageLabel: '二年级',
        title: '拼读进阶港',
        subtitle: '继续认识字母组合和基础句型，把英语听懂一点、读顺一点。',
        levels: [
          { code: 'english-grade2-phonics-001', title: '自然拼读进阶', status: 'recommended' },
          { code: 'english-grade2-sentence-001', title: '句型理解', status: 'available' }
        ]
      },
      {
        code: 'english-grade2-story',
        stageLabel: '二年级',
        title: '表达故事湾',
        subtitle: '从日常对话走进简单绘本，让英语表达更像真实场景。',
        levels: [
          { code: 'english-grade2-dialogue-001', title: '日常对话', status: 'available' },
          { code: 'english-grade2-story-001', title: '绘本理解', status: 'available' }
        ]
      },
      {
        code: 'english-grade3-sentences',
        stageLabel: '三年级',
        title: '句型变化港',
        subtitle: '从句型变换到词组搭配，开始搭建更完整的英语表达。',
        levels: [
          { code: 'english-grade3-transform-001', title: '句型变换', status: 'recommended' },
          { code: 'english-grade3-phrase-001', title: '词组搭配', status: 'available' }
        ]
      },
      {
        code: 'english-grade3-reading',
        stageLabel: '三年级',
        title: '阅读表达湾',
        subtitle: '读短文、聊主题，把英语从句子推进到小段表达。',
        levels: [
          { code: 'english-grade3-reading-001', title: '阅读理解', status: 'available' },
          { code: 'english-grade3-topic-001', title: '主题表达', status: 'available' }
        ]
      },
      {
        code: 'english-grade4-language',
        stageLabel: '四年级',
        title: '时态语句港',
        subtitle: '从时态线索到短文理解，学会判断句子发生的时间。',
        levels: [
          { code: 'english-grade4-tense-001', title: '时态初步', status: 'recommended' },
          { code: 'english-grade4-passage-001', title: '短文理解', status: 'available' }
        ]
      },
      {
        code: 'english-grade4-expression',
        stageLabel: '四年级',
        title: '话题综合湾',
        subtitle: '围绕话题组织句子，并通过综合练习巩固表达。',
        levels: [
          { code: 'english-grade4-topic-001', title: '话题表达', status: 'available' },
          { code: 'english-grade4-review-001', title: '综合练习', status: 'available' }
        ]
      }
    ]
  },
  olympiad: olympiadSubjectMap
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
  'math-numbers-002': {
    code: 'math-numbers-002',
    title: '数到二十站',
    subjectTitle: '数学岛',
    description: '继续认识 11 到 20，让数数变得更熟练。',
    steps: [
      { id: 'step-1', type: 'tap-choice', prompt: '找到表示 14 的数字石牌' }
    ],
    reward: {
      stars: 2,
      badgeName: '十几数小勇士'
    }
  },
  'math-addition-002': {
    code: 'math-addition-002',
    title: '彩虹桥加法',
    subjectTitle: '数学岛',
    description: '用 20 以内的数字继续练习加法。',
    steps: [
      { id: 'step-1', type: 'tap-choice', prompt: '9 只小鸟又飞来 5 只，一共有几只？' }
    ],
    reward: {
      stars: 2,
      badgeName: '20 以内加法星'
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
  'math-thinking-002': {
    code: 'math-thinking-002',
    title: '图形规律屋',
    subjectTitle: '数学岛',
    description: '继续观察图形和顺序，把规律一眼看出来。',
    steps: [
      { id: 'step-1', type: 'pattern-choice', prompt: '看看图形规律，选出下一节车厢' }
    ],
    reward: {
      stars: 2,
      badgeName: '图形观察家'
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
  'math-subtraction-002': {
    code: 'math-subtraction-002',
    title: '树上小鸟减法',
    subjectTitle: '数学岛',
    description: '把 20 以内减法放进故事里，一边听一边算。',
    steps: [
      { id: 'step-1', type: 'story-choice', prompt: '树上有 15 只小鸟，飞走 6 只，还剩几只？' }
    ],
    reward: {
      stars: 2,
      badgeName: '20 以内减法星'
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
  'math-shapes-001': {
    code: 'math-shapes-001',
    title: '图形分类屋',
    subjectTitle: '数学岛',
    description: '看一看圆形、三角形和正方形，把图形朋友认出来。',
    steps: [
      { id: 'step-1', type: 'tap-choice', prompt: '找到像太阳一样圆圆的图形' }
    ],
    reward: {
      stars: 2,
      badgeName: '图形小侦探'
    }
  },
  'math-position-001': {
    code: 'math-position-001',
    title: '上下左右小地图',
    subjectTitle: '数学岛',
    description: '帮小动物找到上下左右的位置，建立空间方向感。',
    steps: [
      { id: 'step-1', type: 'story-choice', prompt: '小猫在桌子上面，小狗在哪里？' }
    ],
    reward: {
      stars: 2,
      badgeName: '方位小导航'
    }
  },
  'math-ordinal-001': {
    code: 'math-ordinal-001',
    title: '排队第几个',
    subjectTitle: '数学岛',
    description: '数一数队伍里的位置，认识第几个。',
    steps: [
      { id: 'step-1', type: 'tap-choice', prompt: '从左往右数，小兔排第几？' }
    ],
    reward: {
      stars: 2,
      badgeName: '序数小队长'
    }
  },
  'chinese-characters-001': {
    code: 'chinese-characters-001',
    title: '汉字日月冒险',
    subjectTitle: '语文岛',
    description: '从图像和笔画开始认识两个常见汉字。',
    steps: [
      { id: 'step-1', type: 'tap-choice', prompt: '找到像太阳的字' }
    ],
    reward: {
      stars: 1,
      badgeName: '识字小种子'
    }
  },
  'chinese-characters-002': {
    code: 'chinese-characters-002',
    title: '生活常见字',
    subjectTitle: '语文岛',
    description: '把身体和生活里的常见字认出来。',
    steps: [
      { id: 'step-1', type: 'tap-choice', prompt: '找到表示“小手”的汉字' }
    ],
    reward: {
      stars: 2,
      badgeName: '生活识字员'
    }
  },
  'chinese-characters-003': {
    code: 'chinese-characters-003',
    title: '身体小伙伴',
    subjectTitle: '语文岛',
    description: '把耳朵、眼睛和小手这些身体常见字认出来。',
    steps: [
      { id: 'step-1', type: 'tap-choice', prompt: '找到表示“耳朵”的汉字' }
    ],
    reward: {
      stars: 2,
      badgeName: '身体识字员'
    }
  },
  'chinese-radicals-001': {
    code: 'chinese-radicals-001',
    title: '偏旁小树',
    subjectTitle: '语文岛',
    description: '观察带木字旁的汉字，发现汉字里的小线索。',
    steps: [
      { id: 'step-1', type: 'tap-choice', prompt: '找到带木字旁的字' }
    ],
    reward: {
      stars: 2,
      badgeName: '偏旁观察员'
    }
  },
  'chinese-pinyin-001': {
    code: 'chinese-pinyin-001',
    title: '拼音泡泡大作战',
    subjectTitle: '语文岛',
    description: '听一听、认一认，把声母和韵母连起来。',
    steps: [
      { id: 'step-1', type: 'listen-choice', prompt: '听一听，选出读音正确的拼音泡泡' }
    ],
    reward: {
      stars: 1,
      badgeName: '拼音小耳朵'
    }
  },
  'chinese-pinyin-002': {
    code: 'chinese-pinyin-002',
    title: '拼读小火车',
    subjectTitle: '语文岛',
    description: '把拼读的声音和拼音火车连起来。',
    steps: [
      { id: 'step-1', type: 'listen-choice', prompt: '听老师读，选出正确的拼读小火车' }
    ],
    reward: {
      stars: 2,
      badgeName: '拼读小火车长'
    }
  },
  'chinese-pinyin-003': {
    code: 'chinese-pinyin-003',
    title: '声母找朋友',
    subjectTitle: '语文岛',
    description: '听一听声母的声音，把一样的发音找出来。',
    steps: [
      { id: 'step-1', type: 'listen-choice', prompt: '听老师读，选出正确的声母' }
    ],
    reward: {
      stars: 2,
      badgeName: '声母小侦探'
    }
  },
  'chinese-pinyin-tone-001': {
    code: 'chinese-pinyin-tone-001',
    title: '声调小山坡',
    subjectTitle: '语文岛',
    description: '听一听四个声调的高低变化，把音调认出来。',
    steps: [
      { id: 'step-1', type: 'listen-choice', prompt: '听一听，选出第三声的小山坡' }
    ],
    reward: {
      stars: 2,
      badgeName: '声调小耳朵'
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
  'chinese-strokes-002': {
    code: 'chinese-strokes-002',
    title: '日字描描乐',
    subjectTitle: '语文岛',
    description: '继续按顺序点一点，把“日”字写完整。',
    steps: [
      { id: 'step-1', type: 'stroke-order', prompt: '按笔顺点出“日”的四笔' }
    ],
    reward: {
      stars: 2,
      badgeName: '小小写字家'
    }
  },
  'chinese-strokes-003': {
    code: 'chinese-strokes-003',
    title: '人字起步',
    subjectTitle: '语文岛',
    description: '从简单的两笔开始，把“人”字写稳写好。',
    steps: [
      { id: 'step-1', type: 'stroke-order', prompt: '按笔顺点出“人”的两笔' }
    ],
    reward: {
      stars: 2,
      badgeName: '起步写字星'
    }
  },
  'chinese-strokes-004': {
    code: 'chinese-strokes-004',
    title: '横竖撇捺练习',
    subjectTitle: '语文岛',
    description: '认识横、竖、撇、捺四种基础笔画。',
    steps: [
      { id: 'step-1', type: 'stroke-order', prompt: '按顺序点出横、竖、撇、捺' }
    ],
    reward: {
      stars: 2,
      badgeName: '基础笔画星'
    }
  },
  'english-letters-001': {
    code: 'english-letters-001',
    title: '字母小船出发',
    subjectTitle: '英语岛',
    description: '跟着发音和形状，认识第一组字母朋友。',
    steps: [
      { id: 'step-1', type: 'follow-read', prompt: '跟读 A、B、C、D、E、F' }
    ],
    reward: {
      stars: 1,
      badgeName: '字母小船长'
    }
  },
  'english-letters-002': {
    code: 'english-letters-002',
    title: '字母 G 到 L',
    subjectTitle: '英语岛',
    description: '继续认识第二组字母朋友。',
    steps: [
      { id: 'step-1', type: 'follow-read', prompt: '跟读 G、H、I、J、K、L' }
    ],
    reward: {
      stars: 1,
      badgeName: '字母快帆手'
    }
  },
  'english-letters-003': {
    code: 'english-letters-003',
    title: '字母 M 到 R',
    subjectTitle: '英语岛',
    description: '把第三组字母也读熟。',
    steps: [
      { id: 'step-1', type: 'follow-read', prompt: '跟读 M、N、O、P、Q、R' }
    ],
    reward: {
      stars: 1,
      badgeName: '字母领航员'
    }
  },
  'english-letters-004': {
    code: 'english-letters-004',
    title: '字母 S 到 Z',
    subjectTitle: '英语岛',
    description: '完成 26 个字母的最后一程。',
    steps: [
      { id: 'step-1', type: 'follow-read', prompt: '跟读 S、T、U、V、W、X、Y、Z' }
    ],
    reward: {
      stars: 2,
      badgeName: '全字母船长'
    }
  },
  'english-case-001': {
    code: 'english-case-001',
    title: '大小写找朋友',
    subjectTitle: '英语岛',
    description: '把大写字母和小写字母配成一对。',
    steps: [
      { id: 'step-1', type: 'drag-match', prompt: '把 A、B、C 和小写字母连起来' }
    ],
    reward: {
      stars: 2,
      badgeName: '大小写配对星'
    }
  },
  'english-letter-sounds-001': {
    code: 'english-letter-sounds-001',
    title: '字母发音小剧场',
    subjectTitle: '英语岛',
    description: '把字母名和常见字母音分开听、分开跟读。',
    steps: [
      { id: 'step-1', type: 'follow-read', prompt: '跟读 A、B、C 的字母名和字母音' }
    ],
    reward: {
      stars: 2,
      badgeName: '字母发音星'
    }
  },
  'english-phonics-001': {
    code: 'english-phonics-001',
    title: '字母藏在单词里',
    subjectTitle: '英语岛',
    description: '听字母声音，再找出发音一样的单词。',
    steps: [
      { id: 'step-1', type: 'listen-choice', prompt: '听一听 /b/ 的声音，找到正确单词' }
    ],
    reward: {
      stars: 2,
      badgeName: '拼读小船员'
    }
  },
  'english-phonics-002': {
    code: 'english-phonics-002',
    title: '开头声音侦探',
    subjectTitle: '英语岛',
    description: '听一听单词开头的声音，再找出发音一样的单词。',
    steps: [
      { id: 'step-1', type: 'listen-choice', prompt: '听一听 /s/ 的声音，找到正确单词' }
    ],
    reward: {
      stars: 2,
      badgeName: '声音侦探员'
    }
  },
  'english-words-001': {
    code: 'english-words-001',
    title: '单词海风配对赛',
    subjectTitle: '英语岛',
    description: '把常见生活单词和图像轻松对应起来。',
    steps: [
      { id: 'step-1', type: 'drag-match', prompt: '把 apple、book、cat 和图片连起来' }
    ],
    reward: {
      stars: 1,
      badgeName: '单词小海星'
    }
  },
  'english-words-002': {
    code: 'english-words-002',
    title: '生活单词跟读',
    subjectTitle: '英语岛',
    description: '边配对边跟读，把常见生活单词读出来。',
    steps: [
      { id: 'step-1', type: 'drag-match', prompt: '把 sun、bag、milk 和图片连起来' }
    ],
    reward: {
      stars: 2,
      badgeName: '单词跟读手'
    }
  },
  'english-words-003': {
    code: 'english-words-003',
    title: '颜色单词沙堡',
    subjectTitle: '英语岛',
    description: '把颜色单词和对应的彩色旗子配成一对。',
    steps: [
      { id: 'step-1', type: 'drag-match', prompt: '把 red、blue、green 和颜色旗子连起来' }
    ],
    reward: {
      stars: 2,
      badgeName: '颜色小沙堡师'
    }
  },
  'english-family-001': {
    code: 'english-family-001',
    title: '家庭单词屋',
    subjectTitle: '英语岛',
    description: '把 family、mom、dad 和图标配成一对。',
    steps: [
      { id: 'step-1', type: 'drag-match', prompt: '把 family、mom、dad 和图片连起来' }
    ],
    reward: {
      stars: 2,
      badgeName: '家庭单词星'
    }
  },
  'english-word-sounds-001': {
    code: 'english-word-sounds-001',
    title: '单词读音小耳朵',
    subjectTitle: '英语岛',
    description: '听单词读音，选择对应的日常单词卡。',
    steps: [
      { id: 'step-1', type: 'listen-choice', prompt: '听老师读 apple，选出正确单词' }
    ],
    reward: {
      stars: 2,
      badgeName: '单词读音星'
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
  },
  'english-story-002': {
    code: 'english-story-002',
    title: '晨光小绘本',
    subjectTitle: '英语岛',
    description: '继续跟着图片读一读简单句子。',
    steps: [
      { id: 'step-1', type: 'sentence-read', prompt: '按顺序读完晨光小绘本' }
    ],
    reward: {
      stars: 2,
      badgeName: '晨光朗读员'
    }
  },
  'english-story-003': {
    code: 'english-story-003',
    title: '晚安小绘本',
    subjectTitle: '英语岛',
    description: '跟着夜晚场景读句子，把晚安小绘本完整读下来。',
    steps: [
      { id: 'step-1', type: 'sentence-read', prompt: '按顺序读完晚安小绘本' }
    ],
    reward: {
      stars: 2,
      badgeName: '晚安朗读星'
    }
  },
  'english-story-004': {
    code: 'english-story-004',
    title: '公园小绘本',
    subjectTitle: '英语岛',
    description: '跟着公园场景读简单句子，把新绘本读完整。',
    steps: [
      { id: 'step-1', type: 'sentence-read', prompt: '按顺序读完公园小绘本' }
    ],
    reward: {
      stars: 2,
      badgeName: '公园朗读星'
    }
  },
  'english-daily-sentences-001': {
    code: 'english-daily-sentences-001',
    title: '日常短句跟读',
    subjectTitle: '英语岛',
    description: '跟读早安、喜欢、感谢这些生活里马上能用的小句子。',
    steps: [
      { id: 'step-1', type: 'sentence-read', prompt: '按顺序跟读三句日常短句' }
    ],
    reward: {
      stars: 2,
      badgeName: '日常表达星'
    }
  }
};
