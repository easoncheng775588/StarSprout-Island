import { useEffect, useState } from 'react';
import { PageTopBar } from '../components/PageTopBar';
import { Link, useParams } from 'react-router-dom';
import { completeLevel, getLevel } from '../api';
import basketImage from '../assets/basket-cartoon.svg';
import { subjectMaps } from '../data/mockData';
import { useSession } from '../session';
import type { LevelDetail } from '../types';

type StepActivityConfig =
  | {
      kind: 'basket-count';
      targetCount: number;
      instruction: string;
    }
  | {
      kind: 'number-choice';
      instruction: string;
      choices: number[];
      correctChoice: number;
      optionLabelPrefix: string;
      successFeedback: string;
      failureFeedback: string;
    }
  | {
      kind: 'take-away';
      instruction: string;
      initialCount: number;
      removeCount: number;
      itemLabel: string;
      emoji: string;
      successFeedback: string;
    }
  | {
      kind: 'pattern-choice';
      instruction: string;
      sequence: Array<{ label: string; emoji: string }>;
      choices: Array<{ label: string; emoji: string }>;
      correctChoice: string;
      successFeedback: string;
      failureFeedback: string;
    }
  | {
      kind: 'comparison-choice';
      instruction: string;
      emoji: string;
      leftLabel: string;
      rightLabel: string;
      leftCount: number;
      rightCount: number;
      choices: string[];
      correctChoice: string;
      successFeedback: string;
      failureFeedback: string;
    }
  | {
      kind: 'equation-choice';
      instruction: string;
      emoji: string;
      leftLabel: string;
      rightLabel: string;
      leftCount: number;
      rightCount: number;
      choices: string[];
      correctChoice: string;
      successFeedback: string;
      failureFeedback: string;
    }
  | {
      kind: 'character-choice';
      instruction: string;
      choices: Array<{ label: string; hint: string }>;
      correctChoice: string;
      successFeedback: string;
      detailLines: string[];
      failureFeedback: string;
    }
  | {
      kind: 'listen-choice';
      instruction: string;
      audioPrompt: string;
      audioText?: string;
      lang?: string;
      playButtonLabel?: string;
      choiceAriaLabelPrefix?: string;
      choices: string[];
      correctChoice: string;
      successFeedback: string;
      failureFeedback: string;
    }
  | {
      kind: 'follow-read';
      instruction: string;
      letters: Array<{ label: string; phonetic: string; exampleWord: string; emoji: string; audioText?: string }>;
    }
  | {
      kind: 'word-match';
      instruction: string;
      pairs: Array<{ word: string; pictureLabel: string; emoji: string; phonetic: string }>;
    }
  | {
      kind: 'stroke-order';
      instruction: string;
      character: string;
      strokes: Array<{ label: string; hint: string }>;
      successFeedback: string;
      detailLines: string[];
      failureFeedback: string;
    }
  | {
      kind: 'sentence-read';
      instruction: string;
      sentences: Array<{ text: string; emoji: string; scene: string; audioText?: string }>;
      successFeedback: string;
    }
  | {
      kind: 'story-choice';
      instruction: string;
      emoji: string;
      characterLabel: string;
      detailLines: string[];
      choices: number[];
      correctChoice: number;
      successFeedback: string;
      failureFeedback: string;
    };

interface StepProgressState {
  movedAppleIds?: number[];
  selectedChoice?: number | string;
  completedItems?: string[];
  selectedWord?: string;
  audioPlayed?: boolean;
  completed: boolean;
  feedback?: string;
  detailLines?: string[];
}

const levelActivityConfigs: Record<string, Record<string, StepActivityConfig>> = {
  'math-numbers-001': {
    'step-1': {
      kind: 'basket-count',
      targetCount: 5,
      instruction: '把苹果送进篮子里，装满 5 个就过关。'
    },
    'step-2': {
      kind: 'number-choice',
      instruction: '点一点数字石牌，找到和题目一样的数字。',
      choices: [4, 5, 6],
      correctChoice: 5,
      optionLabelPrefix: '数字石牌',
      successFeedback: '找对了，数字 5 已经点亮',
      failureFeedback: '再试试看，换一块石牌吧'
    }
  },
  'math-numbers-002': {
    'step-1': {
      kind: 'number-choice',
      instruction: '看看数字朋友，找到表示 14 的石牌。',
      choices: [12, 14, 16],
      correctChoice: 14,
      optionLabelPrefix: '数字石牌',
      successFeedback: '找对了，14 就是 10 和 4 合在一起',
      failureFeedback: '再数一数，14 里有 1 个十和 4 个一'
    }
  },
  'math-addition-001': {
    'step-1': {
      kind: 'number-choice',
      instruction: '先想一想，再点出正确答案。',
      choices: [4, 5, 6],
      correctChoice: 5,
      optionLabelPrefix: '数字石牌',
      successFeedback: '答对了，2 + 3 = 5',
      failureFeedback: '差一点点，再算一遍看看'
    }
  },
  'math-addition-002': {
    'step-1': {
      kind: 'number-choice',
      instruction: '先把 9 和 5 合在一起，再点出正确答案。',
      choices: [13, 14, 15],
      correctChoice: 14,
      optionLabelPrefix: '数字石牌',
      successFeedback: '答对了，9 + 5 = 14',
      failureFeedback: '可以先想 9 再往后数 5 个'
    }
  },
  'math-thinking-001': {
    'step-1': {
      kind: 'pattern-choice',
      instruction: '看一看火车车厢的颜色规律，选出下一节。',
      sequence: [
        { label: '红色车厢', emoji: '🟥' },
        { label: '蓝色车厢', emoji: '🟦' },
        { label: '红色车厢', emoji: '🟥' },
        { label: '蓝色车厢', emoji: '🟦' }
      ],
      choices: [
        { label: '蓝色车厢', emoji: '🟦' },
        { label: '绿色车厢', emoji: '🟩' },
        { label: '黄色车厢', emoji: '🟨' }
      ],
      correctChoice: '蓝色车厢',
      successFeedback: '答对了，红蓝红蓝的规律要继续排下去',
      failureFeedback: '再看看前面两组车厢的颜色顺序'
    }
  },
  'math-thinking-002': {
    'step-1': {
      kind: 'pattern-choice',
      instruction: '观察图形火车的顺序，找出下一节该出现什么。',
      sequence: [
        { label: '圆形车厢', emoji: '🟡' },
        { label: '三角车厢', emoji: '🔺' },
        { label: '方形车厢', emoji: '🟦' },
        { label: '圆形车厢', emoji: '🟡' },
        { label: '三角车厢', emoji: '🔺' }
      ],
      choices: [
        { label: '方形车厢', emoji: '🟦' },
        { label: '星星车厢', emoji: '⭐' },
        { label: '圆形车厢', emoji: '🟡' }
      ],
      correctChoice: '方形车厢',
      successFeedback: '答对了，圆形、三角、方形的规律继续向前开',
      failureFeedback: '再把前三节车厢连起来看看'
    }
  },
  'math-subtraction-001': {
    'step-1': {
      kind: 'take-away',
      instruction: '轻轻点走 3 个草莓，看看盘子里还剩多少。',
      initialCount: 8,
      removeCount: 3,
      itemLabel: '草莓',
      emoji: '🍓',
      successFeedback: '已经拿走 3 / 3 个草莓'
    },
    'step-2': {
      kind: 'number-choice',
      instruction: '数一数剩下的草莓，再点出正确答案。',
      choices: [4, 5, 6],
      correctChoice: 5,
      optionLabelPrefix: '数字石牌',
      successFeedback: '答对了，8 - 3 = 5',
      failureFeedback: '再数一数盘子里的草莓'
    }
  },
  'math-subtraction-002': {
    'step-1': {
      kind: 'story-choice',
      instruction: '先听故事，再算算还剩多少。',
      emoji: '🐦',
      characterLabel: '树上的小鸟',
      detailLines: ['树上原来有 15 只小鸟', '飞走了 6 只小鸟'],
      choices: [8, 9, 10],
      correctChoice: 9,
      successFeedback: '答对了，15 - 6 = 9',
      failureFeedback: '把 15 只小鸟减去飞走的 6 只再想一想'
    }
  },
  'math-compare-001': {
    'step-1': {
      kind: 'comparison-choice',
      instruction: '比一比左右两边的小鱼数量，选出更多的一边。',
      emoji: '🐟',
      leftLabel: '左边小鱼',
      rightLabel: '右边小鱼',
      leftCount: 6,
      rightCount: 4,
      choices: ['左边更多', '右边更多', '一样多'],
      correctChoice: '左边更多',
      successFeedback: '答对了，左边有 6 条小鱼，更多一些',
      failureFeedback: '再数一数左右两边的小鱼'
    }
  },
  'math-equation-001': {
    'step-1': {
      kind: 'equation-choice',
      instruction: '先看图，再选出最合适的加法算式。',
      emoji: '🦆',
      leftLabel: '左边有 2 只小鸭',
      rightLabel: '右边又来了 3 只',
      leftCount: 2,
      rightCount: 3,
      choices: ['2 + 3 = 5', '2 + 2 = 4', '3 + 3 = 6'],
      correctChoice: '2 + 3 = 5',
      successFeedback: '答对了，2 只加 3 只一共是 5 只',
      failureFeedback: '再看一看两边的小鸭数量'
    }
  },
  'math-wordproblem-001': {
    'step-1': {
      kind: 'story-choice',
      instruction: '看图听故事，再选出正确答案。',
      emoji: '🐰',
      characterLabel: '小兔子',
      detailLines: ['原来有 4 根胡萝卜', '又收到 2 根胡萝卜'],
      choices: [5, 6, 7],
      correctChoice: 6,
      successFeedback: '答对了，4 + 2 = 6',
      failureFeedback: '再把故事里的数字连起来想一想'
    }
  },
  'chinese-characters-001': {
    'step-1': {
      kind: 'character-choice',
      instruction: '观察字形和意思，找到最像太阳的汉字。',
      choices: [
        { label: '日', hint: '太阳' },
        { label: '月', hint: '月亮' },
        { label: '山', hint: '山峰' }
      ],
      correctChoice: '日',
      successFeedback: '答对了，“日”像太阳，4 笔写成',
      detailLines: ['笔顺提示：竖、横折、横、横'],
      failureFeedback: '再想一想，太阳对应的字会更方一些'
    }
  },
  'chinese-pinyin-001': {
    'step-1': {
      kind: 'listen-choice',
      instruction: '先听老师读，再选出一样的拼音泡泡。',
      audioPrompt: 'ma',
      audioText: '妈',
      lang: 'zh-CN',
      choices: ['ma', 'ba', 'da'],
      correctChoice: 'ma',
      successFeedback: '听对了，这个泡泡读作 ma',
      failureFeedback: '再听一遍，注意嘴巴张开的声音'
    }
  },
  'chinese-characters-002': {
    'step-1': {
      kind: 'character-choice',
      instruction: '看看图意和字形，找到表示“小手”的汉字。',
      choices: [
        { label: '手', hint: '小手' },
        { label: '口', hint: '嘴巴' },
        { label: '目', hint: '眼睛' }
      ],
      correctChoice: '手',
      successFeedback: '答对了，“手”就是我们拍手、握手的手',
      detailLines: ['小朋友常见字：手、口、目都来自生活动作和器官'],
      failureFeedback: '再想一想，哪一个字和小手最有关系'
    }
  },
  'chinese-characters-003': {
    'step-1': {
      kind: 'character-choice',
      instruction: '想一想身体的小伙伴，找到表示“耳朵”的汉字。',
      choices: [
        { label: '耳', hint: '耳朵' },
        { label: '目', hint: '眼睛' },
        { label: '手', hint: '小手' }
      ],
      correctChoice: '耳',
      successFeedback: '答对了，“耳”就是耳朵的耳',
      detailLines: ['身体常见字：耳、目、手，都是生活里经常会用到的字'],
      failureFeedback: '再想一想，哪个字最像我们听声音的小耳朵'
    }
  },
  'chinese-pinyin-002': {
    'step-1': {
      kind: 'listen-choice',
      instruction: '听一听老师读的拼读，再选出正确的小火车。',
      audioPrompt: 'gua',
      audioText: '瓜',
      lang: 'zh-CN',
      playButtonLabel: '播放拼读读音',
      choiceAriaLabelPrefix: '拼读火车',
      choices: ['gua', 'guo', 'hua'],
      correctChoice: 'gua',
      successFeedback: '拼对了，g-u-a 连起来就读 gua',
      failureFeedback: '再听一遍，注意最后的 a 音'
    }
  },
  'chinese-pinyin-003': {
    'step-1': {
      kind: 'listen-choice',
      instruction: '先听一听声母发音，再选出一样的拼音泡泡。',
      audioPrompt: 'sh',
      audioText: 'sh',
      lang: 'zh-CN',
      choices: ['sh', 's', 'm'],
      correctChoice: 'sh',
      successFeedback: '答对了，声母 sh 读起来像小狮子轻轻呼气',
      failureFeedback: '再听一遍，注意这是卷舌一点点的 sh 音'
    }
  },
  'chinese-strokes-001': {
    'step-1': {
      kind: 'stroke-order',
      instruction: '按顺序点一点，把“口”字的笔画排好。',
      character: '口',
      strokes: [
        { label: '竖', hint: '先写左边' },
        { label: '横折', hint: '再绕到右上角' },
        { label: '横', hint: '最后封口' }
      ],
      successFeedback: '真棒，“口”字写完整了',
      detailLines: ['笔顺口诀：先外后里，最后封口'],
      failureFeedback: '再想一想，要按从上到下、从左到右的顺序'
    }
  },
  'chinese-strokes-002': {
    'step-1': {
      kind: 'stroke-order',
      instruction: '按顺序点一点，把“日”字的笔顺排好。',
      character: '日',
      strokes: [
        { label: '竖', hint: '先写左边' },
        { label: '横折', hint: '再绕到右上角' },
        { label: '横（中间）', hint: '先写中间' },
        { label: '横（底部）', hint: '最后封底' }
      ],
      successFeedback: '太好了，“日”字也会写啦',
      detailLines: ['笔顺口诀：先外后里，再把下面写完整'],
      failureFeedback: '试试看从左边开始写，会更顺手'
    }
  },
  'chinese-strokes-003': {
    'step-1': {
      kind: 'stroke-order',
      instruction: '按顺序点一点，把“人”字的两笔排好。',
      character: '人',
      strokes: [
        { label: '撇', hint: '先从左上往下轻轻撇出去' },
        { label: '捺', hint: '再从右上往下舒展开来' }
      ],
      successFeedback: '真棒，“人”字也会写啦',
      detailLines: ['笔顺口诀：先撇后捺，左右舒展开'],
      failureFeedback: '再想一想，“人”字要先写左边的撇'
    }
  },
  'english-letters-001': {
    'step-1': {
      kind: 'follow-read',
      instruction: '轻轻点一下每张字母卡，跟着老师一起读。',
      letters: [
        { label: 'A', phonetic: '/ei/', exampleWord: 'apple', emoji: '🍎' },
        { label: 'B', phonetic: '/biː/', exampleWord: 'book', emoji: '📘' },
        { label: 'C', phonetic: '/siː/', exampleWord: 'cat', emoji: '🐱' },
        { label: 'D', phonetic: '/diː/', exampleWord: 'dog', emoji: '🐶' },
        { label: 'E', phonetic: '/iː/', exampleWord: 'egg', emoji: '🥚' },
        { label: 'F', phonetic: '/ef/', exampleWord: 'fish', emoji: '🐟' }
      ]
    }
  },
  'english-letters-002': {
    'step-1': {
      kind: 'follow-read',
      instruction: '继续点一点字母卡，把 G 到 L 都读出来。',
      letters: [
        { label: 'G', phonetic: '/dʒiː/', exampleWord: 'goat', emoji: '🐐' },
        { label: 'H', phonetic: '/eɪtʃ/', exampleWord: 'hat', emoji: '🎩' },
        { label: 'I', phonetic: '/aɪ/', exampleWord: 'ice', emoji: '🧊' },
        { label: 'J', phonetic: '/dʒeɪ/', exampleWord: 'jam', emoji: '🍓' },
        { label: 'K', phonetic: '/keɪ/', exampleWord: 'kite', emoji: '🪁' },
        { label: 'L', phonetic: '/el/', exampleWord: 'lion', emoji: '🦁' }
      ]
    }
  },
  'english-letters-003': {
    'step-1': {
      kind: 'follow-read',
      instruction: '把 M 到 R 的字母朋友也读一遍。',
      letters: [
        { label: 'M', phonetic: '/em/', exampleWord: 'moon', emoji: '🌙' },
        { label: 'N', phonetic: '/en/', exampleWord: 'nest', emoji: '🪺' },
        { label: 'O', phonetic: '/oʊ/', exampleWord: 'orange', emoji: '🍊' },
        { label: 'P', phonetic: '/piː/', exampleWord: 'pig', emoji: '🐷' },
        { label: 'Q', phonetic: '/kjuː/', exampleWord: 'queen', emoji: '👑' },
        { label: 'R', phonetic: '/ɑr/', exampleWord: 'rain', emoji: '🌧️' }
      ]
    }
  },
  'english-letters-004': {
    'step-1': {
      kind: 'follow-read',
      instruction: '最后一组字母来了，把 S 到 Z 都点亮吧。',
      letters: [
        { label: 'S', phonetic: '/es/', exampleWord: 'sun', emoji: '☀️' },
        { label: 'T', phonetic: '/tiː/', exampleWord: 'tree', emoji: '🌳' },
        { label: 'U', phonetic: '/juː/', exampleWord: 'umbrella', emoji: '☂️' },
        { label: 'V', phonetic: '/viː/', exampleWord: 'van', emoji: '🚐' },
        { label: 'W', phonetic: '/ˈdʌbəl.juː/', exampleWord: 'water', emoji: '💧' },
        { label: 'X', phonetic: '/eks/', exampleWord: 'x-ray', emoji: '🩻' },
        { label: 'Y', phonetic: '/waɪ/', exampleWord: 'yoyo', emoji: '🪀' },
        { label: 'Z', phonetic: '/ziː/', exampleWord: 'zebra', emoji: '🦓' }
      ]
    }
  },
  'english-phonics-001': {
    'step-1': {
      kind: 'listen-choice',
      instruction: '先听字母开头的声音，再点出发音一样的单词。',
      audioPrompt: '/b/',
      audioText: 'buh',
      lang: 'en-US',
      playButtonLabel: '播放字母发音',
      choiceAriaLabelPrefix: '发音单词',
      choices: ['ball', 'sun', 'cat'],
      correctChoice: 'ball',
      successFeedback: '答对了，ball 开头就是 /b/ 的声音',
      failureFeedback: '再听一遍，想想哪个单词一开始嘴巴会轻轻闭上'
    }
  },
  'english-phonics-002': {
    'step-1': {
      kind: 'listen-choice',
      instruction: '先听开头音，再找出发音一样的单词。',
      audioPrompt: '/s/',
      audioText: 'sss',
      lang: 'en-US',
      playButtonLabel: '播放字母发音',
      choiceAriaLabelPrefix: '发音单词',
      choices: ['sun', 'milk', 'dog'],
      correctChoice: 'sun',
      successFeedback: '答对了，sun 开头就是 /s/ 的声音',
      failureFeedback: '再听一遍，想想哪个单词像小蛇一样发出 sss 的声音'
    }
  },
  'english-words-001': {
    'step-1': {
      kind: 'word-match',
      instruction: '先点单词卡，再点对应的图片卡，把它们配成一对。',
      pairs: [
        { word: 'apple', pictureLabel: '苹果', emoji: '🍎', phonetic: '/ˈaepəl/' },
        { word: 'book', pictureLabel: '书本', emoji: '📘', phonetic: '/bʊk/' },
        { word: 'cat', pictureLabel: '小猫', emoji: '🐱', phonetic: '/kaet/' }
      ]
    }
  },
  'english-words-002': {
    'step-1': {
      kind: 'word-match',
      instruction: '再玩一轮单词配对，边点边跟读。',
      pairs: [
        { word: 'sun', pictureLabel: '太阳', emoji: '☀️', phonetic: '/sʌn/' },
        { word: 'bag', pictureLabel: '书包', emoji: '🎒', phonetic: '/bæg/' },
        { word: 'milk', pictureLabel: '牛奶', emoji: '🥛', phonetic: '/mɪlk/' }
      ]
    }
  },
  'english-words-003': {
    'step-1': {
      kind: 'word-match',
      instruction: '把颜色单词和沙堡旗子配成正确的一对。',
      pairs: [
        { word: 'red', pictureLabel: '红色旗子', emoji: '🚩', phonetic: '/red/' },
        { word: 'blue', pictureLabel: '蓝色旗子', emoji: '🟦', phonetic: '/bluː/' },
        { word: 'green', pictureLabel: '绿色旗子', emoji: '🟩', phonetic: '/griːn/' }
      ]
    }
  },
  'english-story-001': {
    'step-1': {
      kind: 'sentence-read',
      instruction: '点一点句子卡，跟着小绘本按顺序读完。',
      sentences: [
        { text: 'I see a cat.', emoji: '🐱', scene: '我看见一只小猫' },
        { text: 'The cat can run.', emoji: '🏃', scene: '小猫会跑步' },
        { text: 'I can wave hi.', emoji: '👋', scene: '我会挥手说嗨' }
      ],
      successFeedback: '小绘本读完啦，给自己一个掌声'
    }
  },
  'english-story-002': {
    'step-1': {
      kind: 'sentence-read',
      instruction: '点一点晨光绘本，按顺序把三句话读完。',
      sentences: [
        { text: 'The sun is up.', emoji: '☀️', scene: '太阳升起来了' },
        { text: 'I pack my bag.', emoji: '🎒', scene: '我背好书包' },
        { text: 'I say hello.', emoji: '👋', scene: '我开口打招呼' }
      ],
      successFeedback: '晨光小绘本读完啦'
    }
  },
  'english-story-003': {
    'step-1': {
      kind: 'sentence-read',
      instruction: '点一点晚安绘本，把夜晚故事按顺序读完。',
      sentences: [
        { text: 'The moon is bright.', emoji: '🌙', scene: '月亮亮起来了' },
        { text: 'I hug my bear.', emoji: '🧸', scene: '我抱抱小熊' },
        { text: 'I say good night.', emoji: '💤', scene: '我说晚安啦' }
      ],
      successFeedback: '晚安小绘本读完啦'
    }
  },
  'math-grade1-numbers-001': {
    'step-1': {
      kind: 'number-choice',
      instruction: '看看数字卡，找到和题目一样的两位数。',
      choices: [36, 46, 64],
      correctChoice: 46,
      optionLabelPrefix: '数字卡',
      successFeedback: '找对了，46 这个两位数已经点亮',
      failureFeedback: '再看看十位和个位，4 在前面，6 在后面'
    }
  },
  'math-grade1-addition-001': {
    'step-1': {
      kind: 'story-choice',
      instruction: '把故事里的两个数量合在一起，想想一共有多少。',
      emoji: '🦆',
      characterLabel: '小鸭',
      detailLines: ['先算 9 + 8，再想想满 10 以后还剩多少。'],
      choices: [16, 17, 18],
      correctChoice: 17,
      successFeedback: '答对了，9 + 8 = 17',
      failureFeedback: '再把 8 分成 1 和 7，先和 9 凑成 10 试试看'
    }
  },
  'math-grade1-subtraction-001': {
    'step-1': {
      kind: 'story-choice',
      instruction: '先想想飞走了多少，再算还剩几个。',
      emoji: '🎈',
      characterLabel: '气球',
      detailLines: ['16 - 7 可以先想 16 - 6 = 10，再减 1。'],
      choices: [8, 9, 10],
      correctChoice: 9,
      successFeedback: '答对了，16 - 7 = 9',
      failureFeedback: '再试试看从 16 先退到 10，再继续减'
    }
  },
  'math-grade1-wordproblem-001': {
    'step-1': {
      kind: 'story-choice',
      instruction: '把文具盒里的数量连起来想，算出最后一共有几支。',
      emoji: '✏️',
      characterLabel: '铅笔',
      detailLines: ['先看原来有几支，再看又放进几支。'],
      choices: [12, 13, 14],
      correctChoice: 14,
      successFeedback: '答对了，8 + 6 = 14',
      failureFeedback: '再把两部分铅笔合起来数一数'
    }
  },
  'chinese-grade1-words-001': {
    'step-1': {
      kind: 'character-choice',
      instruction: '看看词语火车，找到能和“花”组成词语的字。',
      choices: [
        { label: '园', hint: '花园' },
        { label: '跑', hint: '跑步' },
        { label: '看', hint: '看见' }
      ],
      correctChoice: '园',
      successFeedback: '答对了，“花园”是春天里常见的词语',
      detailLines: ['一年级常见词语会把熟悉的字连起来，一起读更顺口。'],
      failureFeedback: '再想一想，哪个字和“花”放在一起最像一个地方'
    }
  },
  'chinese-grade1-pinyin-001': {
    'step-1': {
      kind: 'listen-choice',
      instruction: '先听老师读，再选出一样的音节。',
      audioPrompt: 'xue',
      audioText: '学',
      lang: 'zh-CN',
      choices: ['xue', 'xiao', 'xiu'],
      correctChoice: 'xue',
      successFeedback: '听对了，这个音节读作 xue',
      failureFeedback: '再听一遍，注意最后是 e 的声音'
    }
  },
  'chinese-grade1-sentence-001': {
    'step-1': {
      kind: 'sentence-read',
      instruction: '点一点句子卡，按顺序把图画短句读完。',
      sentences: [
        { text: '小鸟在唱歌。', emoji: '🐦', scene: '小鸟在树上唱歌' },
        { text: '我背着书包。', emoji: '🎒', scene: '我背好书包去上学' },
        { text: '太阳笑眯眯。', emoji: '☀️', scene: '太阳高高挂在天上' }
      ],
      successFeedback: '三句图画短句都读完啦'
    }
  },
  'chinese-grade1-punctuation-001': {
    'step-1': {
      kind: 'character-choice',
      instruction: '句子说完了，要给它选一个合适的标点。',
      choices: [
        { label: '。', hint: '句号' },
        { label: '？', hint: '问号' },
        { label: '！', hint: '感叹号' }
      ],
      correctChoice: '。',
      successFeedback: '答对了，句子说完了，后面要加句号',
      detailLines: ['一年级先认识最常见的三种标点：句号、问号、感叹号。'],
      failureFeedback: '再想一想，这句话是在平静地把意思说完整'
    }
  },
  'english-grade1-words-001': {
    'step-1': {
      kind: 'word-match',
      instruction: '先点单词卡，再点对应的图片卡，把校园单词配成一对。',
      pairs: [
        { word: 'teacher', pictureLabel: '老师', emoji: '🧑‍🏫', phonetic: '/ˈtiːtʃər/' },
        { word: 'desk', pictureLabel: '课桌', emoji: '🪑', phonetic: '/desk/' },
        { word: 'book', pictureLabel: '书本', emoji: '📘', phonetic: '/bʊk/' }
      ]
    }
  },
  'english-grade1-phonics-001': {
    'step-1': {
      kind: 'listen-choice',
      instruction: '先听开头音，再找出发音一样的短单词。',
      audioPrompt: '/k/',
      audioText: 'kuh',
      lang: 'en-US',
      playButtonLabel: '播放开头音',
      choiceAriaLabelPrefix: '拼读单词',
      choices: ['cat', 'sun', 'pig'],
      correctChoice: 'cat',
      successFeedback: '答对了，cat 开头就是 /k/ 的声音',
      failureFeedback: '再听一遍，想想哪个单词一开始像轻轻敲门的 k 声'
    }
  },
  'english-grade1-sentence-001': {
    'step-1': {
      kind: 'sentence-read',
      instruction: '点一点句子卡，按顺序把问候句读完。',
      sentences: [
        { text: 'Hello, teacher.', emoji: '👋', scene: '我向老师打招呼' },
        { text: 'I am ready.', emoji: '⭐', scene: '我准备好开始上课' },
        { text: 'Good morning.', emoji: '☀️', scene: '我说早上好', audioText: 'Good morning.' }
      ],
      successFeedback: '三句问候句都读完啦'
    }
  },
  'english-grade1-actions-001': {
    'step-1': {
      kind: 'word-match',
      instruction: '把动作单词和图标配起来，边配边读。',
      pairs: [
        { word: 'run', pictureLabel: '跑步', emoji: '🏃', phonetic: '/rʌn/' },
        { word: 'jump', pictureLabel: '跳跃', emoji: '🦘', phonetic: '/dʒʌmp/' },
        { word: 'read', pictureLabel: '读书', emoji: '📖', phonetic: '/riːd/' }
      ]
    }
  },
  'math-grade2-multiply-001': {
    'step-1': {
      kind: 'number-choice',
      instruction: '先按组数一数，再点出正确答案。',
      choices: [10, 12, 14],
      correctChoice: 12,
      optionLabelPrefix: '数字石牌',
      successFeedback: '答对了，3 组 4 颗就是 12 颗',
      failureFeedback: '再想一想，4 + 4 + 4 一共是多少'
    }
  },
  'math-grade2-length-001': {
    'step-1': {
      kind: 'story-choice',
      instruction: '看看尺子上的刻度，选出铅笔大约有多长。',
      emoji: '📏',
      characterLabel: '小尺子',
      detailLines: ['铅笔从 0 刻度量到 12 刻度，单位是厘米。'],
      choices: [9, 12, 15],
      correctChoice: 12,
      successFeedback: '答对了，这支铅笔大约长 12 厘米',
      failureFeedback: '再看看刻度线，终点停在 12 的位置'
    }
  },
  'math-grade2-wordproblem-001': {
    'step-1': {
      kind: 'story-choice',
      instruction: '把两步都想清楚，再选出最后答案。',
      emoji: '🛍️',
      characterLabel: '文具店',
      detailLines: ['先买了 8 本练习本，又买了 6 本。', '送给同学 5 本后，还剩多少本？'],
      choices: [8, 9, 10],
      correctChoice: 9,
      successFeedback: '答对了，先算 8 + 6 = 14，再算 14 - 5 = 9',
      failureFeedback: '先把买来的本子合起来，再减去送出去的数量'
    }
  },
  'math-grade2-time-001': {
    'step-1': {
      kind: 'story-choice',
      instruction: '想想时间往后走了几小时，再选出答案。',
      emoji: '⏰',
      characterLabel: '小闹钟',
      detailLines: ['小朋友 7 点开始做作业。', '再过 2 小时，就到了几点？'],
      choices: [8, 9, 10],
      correctChoice: 9,
      successFeedback: '答对了，7 点再过 2 小时就是 9 点',
      failureFeedback: '从 7 点往后数两格：8 点、9 点'
    }
  },
  'chinese-grade2-phrase-001': {
    'step-1': {
      kind: 'character-choice',
      instruction: '看看哪个词能和“认真”搭配成常用词语。',
      choices: [
        { label: '听讲', hint: '课堂上的好习惯' },
        { label: '飞快', hint: '表示速度很快' },
        { label: '晴天', hint: '天气很好' }
      ],
      correctChoice: '听讲',
      successFeedback: '答对了，“认真听讲”是课堂里的好习惯',
      detailLines: ['词语搭配要看意思是不是自然，也要看是不是生活里常说的表达。'],
      failureFeedback: '再想一想，“认真”常常用来形容学习和做事的态度'
    }
  },
  'chinese-grade2-order-001': {
    'step-1': {
      kind: 'pattern-choice',
      instruction: '按事情发生的顺序想一想，下一步应该是什么。',
      sequence: [
        { label: '起床', emoji: '🛏️' },
        { label: '刷牙', emoji: '🪥' },
        { label: '吃早饭', emoji: '🥣' }
      ],
      choices: [
        { label: '背书包上学', emoji: '🎒' },
        { label: '睡午觉', emoji: '😴' },
        { label: '看星星', emoji: '⭐' }
      ],
      correctChoice: '背书包上学',
      successFeedback: '答对了，早晨的事情按顺序接下来就是背书包上学',
      failureFeedback: '再把早晨这几件事连起来想一想'
    }
  },
  'chinese-grade2-picture-001': {
    'step-1': {
      kind: 'sentence-read',
      instruction: '看着图画按顺序读句子，学会把画面说完整。',
      sentences: [
        { text: '小朋友在操场上放风筝。', emoji: '🪁', scene: '风筝飞得高高的' },
        { text: '天空蓝蓝的，白云慢慢飘。', emoji: '☁️', scene: '天气晴朗舒服' },
        { text: '大家玩得很开心。', emoji: '😊', scene: '画面里充满笑声' }
      ],
      successFeedback: '这幅图已经读完整啦'
    }
  },
  'chinese-grade2-reading-001': {
    'step-1': {
      kind: 'sentence-read',
      instruction: '按顺序读完短文句子，感受每一句在说什么。',
      sentences: [
        { text: '清晨，小河边很安静。', emoji: '🌅', scene: '早晨的河边静静的' },
        { text: '一只白鹭站在石头上。', emoji: '🕊️', scene: '白鹭停在河边' },
        { text: '它忽然展开翅膀飞向天空。', emoji: '🪽', scene: '白鹭一下子飞起来了' }
      ],
      successFeedback: '短文朗读完成，继续保持这样的节奏'
    }
  },
  'english-grade2-phonics-001': {
    'step-1': {
      kind: 'listen-choice',
      instruction: '先听字母组合的声音，再找出对应单词。',
      audioPrompt: '/sh/',
      audioText: 'shh',
      lang: 'en-US',
      choices: ['sheep', 'cat', 'pig'],
      correctChoice: 'sheep',
      successFeedback: '答对了，sheep 开头就是 /sh/ 的声音',
      failureFeedback: '再听一遍，想想哪个单词像轻轻说 shhh'
    }
  },
  'english-grade2-sentence-001': {
    'step-1': {
      kind: 'sentence-read',
      instruction: '按顺序读句子，感受句型里的人和物。',
      sentences: [
        { text: 'I have a kite.', emoji: '🪁', scene: '我有一个风筝' },
        { text: 'It is blue.', emoji: '🔵', scene: '它是蓝色的' },
        { text: 'I like it very much.', emoji: '💙', scene: '我很喜欢它' }
      ],
      successFeedback: '三句句型都读顺啦'
    }
  },
  'english-grade2-dialogue-001': {
    'step-1': {
      kind: 'sentence-read',
      instruction: '跟着对话顺序读一读，把日常交流说完整。',
      sentences: [
        { text: 'Hi, what are you doing?', emoji: '👋', scene: '朋友在打招呼' },
        { text: 'I am reading a book.', emoji: '📖', scene: '我正在读书' },
        { text: 'That sounds fun!', emoji: '✨', scene: '朋友觉得很有趣' }
      ],
      successFeedback: '这组对话已经读完啦'
    }
  },
  'english-grade2-story-001': {
    'step-1': {
      kind: 'sentence-read',
      instruction: '把小绘本按顺序读下来，看看故事发生了什么。',
      sentences: [
        { text: 'Tom sees a little boat.', emoji: '⛵', scene: 'Tom 看见一条小船' },
        { text: 'He waves to his friend on the shore.', emoji: '👋', scene: '他向岸边的朋友挥手' },
        { text: 'They smile and start their trip.', emoji: '😊', scene: '他们笑着开始旅行' }
      ],
      successFeedback: '小绘本已经读完，做得真棒'
    }
  }
};

function getPreferredVoice(lang: string) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return undefined;
  }

  const voices = window.speechSynthesis.getVoices?.() ?? [];
  const languageRoot = lang.toLowerCase().split('-')[0];
  const preferredNames = languageRoot === 'zh'
    ? ['Tingting', 'Meijia', 'Eddy', 'Flo', 'Shelley', 'Reed', 'Rocko', 'Sandy']
    : ['Samantha', 'Karen', 'Daniel', 'Alex'];

  const languageMatches = voices.filter((voice) => voice.lang.toLowerCase().startsWith(languageRoot));

  for (const preferredName of preferredNames) {
    const matchedVoice = languageMatches.find((voice) => voice.name.includes(preferredName));
    if (matchedVoice) {
      return matchedVoice;
    }
  }

  return languageMatches[0];
}

function speakText(text: string, lang: string, speedMode: 'normal' | 'slow' = 'normal') {
  if (typeof window === 'undefined' || !('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window)) {
    return {
      played: false,
      voiceLabel: '当前设备暂未准备好语音老师'
    };
  }

  window.speechSynthesis.cancel();
  const utterance = new window.SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = speedMode === 'slow'
    ? (lang.startsWith('zh') ? 0.72 : 0.78)
    : (lang.startsWith('zh') ? 0.85 : 0.92);
  utterance.pitch = lang.startsWith('zh') ? 1.05 : 1;

  const preferredVoice = getPreferredVoice(lang);
  if (preferredVoice) {
    utterance.voice = preferredVoice;
  }

  window.speechSynthesis.speak(utterance);
  return {
    played: true,
    voiceLabel: preferredVoice ? `${preferredVoice.lang} · ${preferredVoice.name}` : `${lang} · 系统默认老师`
  };
}

const subjectTitleToCode: Record<string, string> = {
  数学岛: 'math',
  语文岛: 'chinese',
  英语岛: 'english'
};

const celebrationStars = ['★', '✦', '★', '✦', '★', '✦'];
const AUDIO_MODE_STORAGE_KEY = 'k12-learning-game-audio-mode';

function readAudioSpeedMode(): 'normal' | 'slow' {
  if (typeof window === 'undefined') {
    return 'normal';
  }

  return window.localStorage.getItem(AUDIO_MODE_STORAGE_KEY) === 'slow' ? 'slow' : 'normal';
}

function getNextLevelCode(levelCode: string, subjectCode?: string, stageLabel = '幼小衔接') {
  if (!subjectCode || !(subjectCode in subjectMaps)) {
    return null;
  }

  const orderedLevels = subjectMaps[subjectCode as keyof typeof subjectMaps].chapters
    .filter((chapter) => (chapter.stageLabel ?? '幼小衔接') === stageLabel)
    .flatMap((chapter) => chapter.levels.map((level) => level.code));
  const currentIndex = orderedLevels.indexOf(levelCode);

  if (currentIndex === -1 || currentIndex === orderedLevels.length - 1) {
    return null;
  }

  return orderedLevels[currentIndex + 1];
}

export function LevelPlayer() {
  const { levelCode } = useParams<{ levelCode: string }>();
  const { session } = useSession();
  const [level, setLevel] = useState<LevelDetail | null>(null);
  const [completionResult, setCompletionResult] = useState<Awaited<ReturnType<typeof completeLevel>> | null>(null);
  const [stepProgress, setStepProgress] = useState<Record<string, StepProgressState>>({});
  const [draggingApple, setDraggingApple] = useState<{ stepId: string; appleId: number } | null>(null);
  const [showNextLevelNudge, setShowNextLevelNudge] = useState(false);
  const [audioSpeedMode, setAudioSpeedMode] = useState<'normal' | 'slow'>(readAudioSpeedMode);
  const [audioTeacherLabel, setAudioTeacherLabel] = useState('系统默认老师');
  const [levelStartedAt, setLevelStartedAt] = useState(() => Date.now());
  const currentLevel = level;
  const activeChildStageLabel = session?.children.find((child) => child.id === session.childProfileId)?.stageLabel ?? '幼小衔接';
  const subjectCode = currentLevel ? subjectTitleToCode[currentLevel.subjectTitle] : undefined;
  const nextLevelCode = currentLevel ? getNextLevelCode(currentLevel.code, subjectCode, activeChildStageLabel) : null;
  const reward = completionResult?.reward ?? null;

  useEffect(() => {
    if (!levelCode) {
      return;
    }

    setLevel(null);
    setCompletionResult(null);
    setStepProgress({});
    setShowNextLevelNudge(false);
    setLevelStartedAt(Date.now());
    getLevel(levelCode).then(setLevel);
  }, [levelCode]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem(AUDIO_MODE_STORAGE_KEY, audioSpeedMode);
  }, [audioSpeedMode]);

  useEffect(() => {
    if (!completionResult || !nextLevelCode) {
      setShowNextLevelNudge(false);
      return;
    }

    const timer = window.setTimeout(() => {
      setShowNextLevelNudge(true);
    }, 1500);

    return () => window.clearTimeout(timer);
  }, [completionResult, nextLevelCode]);

  if (!levelCode) {
    return <main className="screen"><p>这道关卡还在准备中。</p></main>;
  }

  if (!currentLevel) {
    return <main className="screen"><p>正在装载这一关的任务道具...</p></main>;
  }

  const allStepsCompleted = currentLevel.steps.every((step) => stepProgress[step.id]?.completed);
  const backTarget = subjectCode ? `/subjects/${subjectCode}` : '/';
  const backLabel = subjectCode ? `返回${currentLevel.subjectTitle}` : '返回首页';

  function getStepConfig(stepId: string): StepActivityConfig | undefined {
    return levelActivityConfigs[currentLevel!.code]?.[stepId];
  }

  function playNarration(text: string, lang: string) {
    const result = speakText(text, lang, audioSpeedMode);
    setAudioTeacherLabel(result.voiceLabel);
    return result.played;
  }

  function handleAppleCollected(stepId: string, appleId: number, targetCount: number) {
    setStepProgress((current) => {
      const movedAppleIds = current[stepId]?.movedAppleIds ?? [];
      if (movedAppleIds.includes(appleId)) {
        return current;
      }

      const nextMovedAppleIds = [...movedAppleIds, appleId];
      const completed = nextMovedAppleIds.length >= targetCount;

      return {
        ...current,
        [stepId]: {
          ...current[stepId],
          movedAppleIds: nextMovedAppleIds,
          completed,
          feedback: completed
            ? `篮子里已经有 ${targetCount} 个苹果啦`
            : `真棒，已经送进 ${nextMovedAppleIds.length} 个苹果`
        }
      };
    });
  }

  function handleNumberChoiceSelected(
    stepId: string,
    selectedChoice: number,
    config: Extract<StepActivityConfig, { kind: 'number-choice' }>
  ) {
    const completed = selectedChoice === config.correctChoice;
    setStepProgress((current) => ({
      ...current,
      [stepId]: {
        ...current[stepId],
        selectedChoice,
        completed,
        feedback: completed ? config.successFeedback : config.failureFeedback
      }
    }));
  }

  function handleTakeAwaySelected(
    stepId: string,
    itemId: number,
    config: Extract<StepActivityConfig, { kind: 'take-away' }>
  ) {
    setStepProgress((current) => {
      const movedAppleIds = current[stepId]?.movedAppleIds ?? [];
      if (movedAppleIds.includes(itemId) || movedAppleIds.length >= config.removeCount) {
        return current;
      }

      const nextMovedItemIds = [...movedAppleIds, itemId];
      const completed = nextMovedItemIds.length === config.removeCount;

      return {
        ...current,
        [stepId]: {
          ...current[stepId],
          movedAppleIds: nextMovedItemIds,
          completed,
          feedback: completed ? config.successFeedback : `已经拿走 ${nextMovedItemIds.length} / ${config.removeCount} 个${config.itemLabel}`
        }
      };
    });
  }

  function handlePatternChoiceSelected(
    stepId: string,
    selectedChoice: string,
    config: Extract<StepActivityConfig, { kind: 'pattern-choice' }>
  ) {
    const completed = selectedChoice === config.correctChoice;
    setStepProgress((current) => ({
      ...current,
      [stepId]: {
        ...current[stepId],
        selectedChoice,
        completed,
        feedback: completed ? config.successFeedback : config.failureFeedback
      }
    }));
  }

  function handleComparisonChoiceSelected(
    stepId: string,
    selectedChoice: string,
    config: Extract<StepActivityConfig, { kind: 'comparison-choice' }>
  ) {
    const completed = selectedChoice === config.correctChoice;
    setStepProgress((current) => ({
      ...current,
      [stepId]: {
        ...current[stepId],
        selectedChoice,
        completed,
        feedback: completed ? config.successFeedback : config.failureFeedback
      }
    }));
  }

  function handleEquationChoiceSelected(
    stepId: string,
    selectedChoice: string,
    config: Extract<StepActivityConfig, { kind: 'equation-choice' }>
  ) {
    const completed = selectedChoice === config.correctChoice;
    setStepProgress((current) => ({
      ...current,
      [stepId]: {
        ...current[stepId],
        selectedChoice,
        completed,
        feedback: completed ? config.successFeedback : config.failureFeedback
      }
    }));
  }

  function handleCharacterChoiceSelected(
    stepId: string,
    selectedChoice: string,
    config: Extract<StepActivityConfig, { kind: 'character-choice' }>
  ) {
    const completed = selectedChoice === config.correctChoice;
    setStepProgress((current) => ({
      ...current,
      [stepId]: {
        ...current[stepId],
        selectedChoice,
        completed,
        feedback: completed ? config.successFeedback : config.failureFeedback,
        detailLines: completed ? config.detailLines : []
      }
    }));
  }

  function handlePlayAudio(stepId: string, config: Extract<StepActivityConfig, { kind: 'listen-choice' }>) {
    const audioText = config.audioText ?? config.audioPrompt;
    const played = playNarration(audioText, config.lang ?? 'zh-CN');

    setStepProgress((current) => ({
      ...current,
      [stepId]: {
        ...current[stepId],
        completed: current[stepId]?.completed ?? false,
        audioPlayed: true,
        feedback: played
          ? audioSpeedMode === 'slow'
            ? `老师正在用慢速模式读：${audioText}`
            : `老师正在读：${audioText}`
          : '这个设备暂时不能播放语音，先看文字提示继续闯关吧'
      }
    }));
  }

  function handleListenChoiceSelected(
    stepId: string,
    selectedChoice: string,
    config: Extract<StepActivityConfig, { kind: 'listen-choice' }>
  ) {
    const completed = selectedChoice === config.correctChoice;
    setStepProgress((current) => ({
      ...current,
      [stepId]: {
        ...current[stepId],
        selectedChoice,
        completed,
        audioPlayed: current[stepId]?.audioPlayed ?? false,
        feedback: completed ? config.successFeedback : config.failureFeedback
      }
    }));
  }

  function handleFollowRead(
    stepId: string,
    letter: Extract<StepActivityConfig, { kind: 'follow-read' }>['letters'][number],
    totalCount: number
  ) {
    const played = playNarration(letter.audioText ?? letter.label, 'en-US');
    setStepProgress((current) => {
      const completedItems = current[stepId]?.completedItems ?? [];
      const nextCompletedItems = completedItems.includes(letter.label) ? completedItems : [...completedItems, letter.label];

      return {
        ...current,
        [stepId]: {
          ...current[stepId],
          completedItems: nextCompletedItems,
          completed: nextCompletedItems.length === totalCount,
          feedback:
            nextCompletedItems.length === totalCount
              ? `已跟读 ${totalCount} / ${totalCount} 个字母`
              : played
                ? `${letter.label} ${letter.phonetic} · ${letter.exampleWord}`
                : `先看口型和提示词：${letter.label} ${letter.phonetic} · ${letter.exampleWord}`
        }
      };
    });
  }

  function handleWordSelected(stepId: string, pair: Extract<StepActivityConfig, { kind: 'word-match' }>['pairs'][number]) {
    playNarration(pair.word, 'en-US');
    setStepProgress((current) => ({
      ...current,
      [stepId]: {
        ...current[stepId],
        completed: current[stepId]?.completed ?? false,
        completedItems: current[stepId]?.completedItems ?? [],
        selectedWord: pair.word,
        feedback: `听一听 ${pair.word}，再点对应图片`
      }
    }));
  }

  function handleWordMatch(
    stepId: string,
    pictureLabel: string,
    config: Extract<StepActivityConfig, { kind: 'word-match' }>
  ) {
    setStepProgress((current) => {
      const selectedWord = current[stepId]?.selectedWord;
      const completedItems = current[stepId]?.completedItems ?? [];
      const pair = config.pairs.find((item) => item.pictureLabel === pictureLabel);

      if (!selectedWord || !pair || completedItems.includes(pair.word)) {
        return current;
      }

      const isCorrect = pair.word === selectedWord;
      const nextCompletedItems = isCorrect ? [...completedItems, pair.word] : completedItems;

      if (isCorrect) {
        playNarration(pair.word, 'en-US');
      }

      return {
        ...current,
        [stepId]: {
          ...current[stepId],
          selectedWord: isCorrect ? undefined : selectedWord,
          completedItems: nextCompletedItems,
          completed: nextCompletedItems.length === config.pairs.length,
          feedback: isCorrect
            ? nextCompletedItems.length === config.pairs.length
              ? `太好了，${config.pairs.length} 组单词都连对了`
              : `连对了 ${nextCompletedItems.length} / ${config.pairs.length} 组，${pair.word} 是${pair.pictureLabel}`
            : `${selectedWord} 还没找到这个图片，再试试看`
        }
      };
    });
  }

  function handleStrokeSelected(
    stepId: string,
    strokeLabel: string,
    config: Extract<StepActivityConfig, { kind: 'stroke-order' }>
  ) {
    setStepProgress((current) => {
      const completedItems = current[stepId]?.completedItems ?? [];

      if (completedItems.includes(strokeLabel)) {
        return current;
      }

      const expectedStroke = config.strokes[completedItems.length];
      if (!expectedStroke) {
        return current;
      }

      if (strokeLabel !== expectedStroke.label) {
        return {
          ...current,
          [stepId]: {
            ...current[stepId],
            completed: false,
            completedItems,
            feedback: `${config.failureFeedback} 先点“${expectedStroke.label}”`
          }
        };
      }

      const nextCompletedItems = [...completedItems, strokeLabel];
      const completed = nextCompletedItems.length === config.strokes.length;

      return {
        ...current,
        [stepId]: {
          ...current[stepId],
          completedItems: nextCompletedItems,
          completed,
          feedback: completed ? config.successFeedback : `笔顺进度 ${nextCompletedItems.length} / ${config.strokes.length}`,
          detailLines: completed ? config.detailLines : []
        }
      };
    });
  }

  function handleSentenceRead(
    stepId: string,
    sentence: Extract<StepActivityConfig, { kind: 'sentence-read' }>['sentences'][number],
    totalCount: number,
    successFeedback: string
  ) {
    playNarration(sentence.audioText ?? sentence.text, 'en-US');

    setStepProgress((current) => {
      const completedItems = current[stepId]?.completedItems ?? [];
      const nextCompletedItems = completedItems.includes(sentence.text)
        ? completedItems
        : [...completedItems, sentence.text];
      const completed = nextCompletedItems.length === totalCount;

      return {
        ...current,
        [stepId]: {
          ...current[stepId],
          completedItems: nextCompletedItems,
          completed,
          feedback: completed ? successFeedback : `已跟读 ${nextCompletedItems.length} / ${totalCount} 句`
        }
      };
    });
  }

  function handleReadStoryAll(
    stepId: string,
    config: Extract<StepActivityConfig, { kind: 'sentence-read' }>
  ) {
    const played = playNarration(
      config.sentences.map((sentence) => sentence.audioText ?? sentence.text).join(' ... '),
      'en-US'
    );

    setStepProgress((current) => ({
      ...current,
      [stepId]: {
        ...current[stepId],
        completed: current[stepId]?.completed ?? false,
        completedItems: current[stepId]?.completedItems ?? [],
        feedback: played ? '老师先把整段小绘本读了一遍，轮到你来一句一句跟读啦' : '当前设备不能整段领读，可以继续点句子卡练习'
      }
    }));
  }

  function handleStoryChoiceSelected(
    stepId: string,
    selectedChoice: number,
    config: Extract<StepActivityConfig, { kind: 'story-choice' }>
  ) {
    const completed = selectedChoice === config.correctChoice;
    setStepProgress((current) => ({
      ...current,
      [stepId]: {
        ...current[stepId],
        selectedChoice,
        completed,
        feedback: completed ? config.successFeedback : config.failureFeedback,
        detailLines: config.detailLines
      }
    }));
  }

  async function handleComplete() {
    if (!allStepsCompleted) {
      return;
    }

    const response = await completeLevel(currentLevel!.code, {
      correctCount: currentLevel!.steps.length,
      wrongCount: 0,
      durationSeconds: Math.max(30, Math.round((Date.now() - levelStartedAt) / 1000))
    });
    setCompletionResult(response);
  }

  return (
    <main className="screen screen-level">
      <PageTopBar backLabel={backLabel} backTo={backTarget} />

      <section className="level-card">
        <div className="level-heading">
          <p className="eyebrow">{currentLevel.subjectTitle}</p>
          <h1>{currentLevel.title}</h1>
          <p>{currentLevel.description}</p>
        </div>

        <div className="step-list">
          {currentLevel.steps.map((step, index) => {
            const config = getStepConfig(step.id);
            const progress = stepProgress[step.id];

            return (
              <article className="step-card" key={step.id}>
                <span className="node-step">第 {index + 1} / {currentLevel.steps.length} 步</span>
                <h2>{step.prompt}</h2>

                {config?.kind === 'basket-count' ? (
                  <div className="play-surface">
                    <div className="play-zone">
                      <p className="play-instruction">{config.instruction}</p>
                      <div className="apple-row">
                        {Array.from({ length: config.targetCount }, (_, appleIndex) => {
                          const appleId = appleIndex + 1;
                          const movedAppleIds = progress?.movedAppleIds ?? [];
                          const isMoved = movedAppleIds.includes(appleId);

                          return (
                            <button
                              aria-label={`苹果 ${appleId}`}
                              className={`apple-token ${isMoved ? 'apple-token-hidden' : ''}`}
                              disabled={isMoved}
                              draggable={!isMoved}
                              key={appleId}
                              onClick={() => handleAppleCollected(step.id, appleId, config.targetCount)}
                              onDragEnd={() => setDraggingApple(null)}
                              onDragStart={() => setDraggingApple({ stepId: step.id, appleId })}
                              type="button"
                            >
                              <span aria-hidden="true" className="apple-token-emoji">🍎</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div
                      aria-label="苹果篮子"
                      className="basket-zone"
                      onDragOver={(event) => event.preventDefault()}
                      onDrop={(event) => {
                        event.preventDefault();

                        if (draggingApple?.stepId === step.id) {
                          handleAppleCollected(step.id, draggingApple.appleId, config.targetCount);
                          setDraggingApple(null);
                        }
                      }}
                    >
                      <img alt="篮子图片" className="basket-image" src={basketImage} />
                      <div className="basket-count">
                        {(progress?.movedAppleIds ?? []).length} / {config.targetCount}
                      </div>
                    </div>
                  </div>
                ) : null}

                {config?.kind === 'number-choice' ? (
                  <div className="play-surface">
                    <p className="play-instruction">{config.instruction}</p>
                    <div className="stone-row">
                      {config.choices.map((choice) => {
                        const isSelected = progress?.selectedChoice === choice;
                        const isCorrect = isSelected && progress?.completed;

                        return (
                          <button
                            aria-label={`${config.optionLabelPrefix} ${choice}`}
                            className={`stone-choice ${isSelected ? 'stone-choice-selected' : ''} ${isCorrect ? 'stone-choice-correct' : ''}`}
                            key={choice}
                            onClick={() => handleNumberChoiceSelected(step.id, choice, config)}
                            type="button"
                          >
                            {choice}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : null}

                {config?.kind === 'take-away' ? (
                  <div className="play-surface">
                    <p className="play-instruction">{config.instruction}</p>
                    <div className="take-away-board">
                      <div className="take-away-row">
                        {Array.from({ length: config.initialCount }, (_, itemIndex) => {
                          const itemId = itemIndex + 1;
                          const movedItemIds = progress?.movedAppleIds ?? [];
                          const isRemoved = movedItemIds.includes(itemId);

                          return (
                            <button
                              aria-label={`${config.itemLabel} ${itemId}`}
                              className={`count-token ${isRemoved ? 'count-token-hidden' : ''}`}
                              disabled={isRemoved}
                              key={itemId}
                              onClick={() => handleTakeAwaySelected(step.id, itemId, config)}
                              type="button"
                            >
                              <span>{config.emoji}</span>
                            </button>
                          );
                        })}
                      </div>
                      <div className="take-away-target">
                        <strong>拿走区</strong>
                        <p>{(progress?.movedAppleIds ?? []).length} / {config.removeCount}</p>
                      </div>
                    </div>
                  </div>
                ) : null}

                {config?.kind === 'pattern-choice' ? (
                  <div className="play-surface">
                    <p className="play-instruction">{config.instruction}</p>
                    <div className="train-row" aria-label="规律火车">
                      {config.sequence.map((item, itemIndex) => (
                        <div className="train-car" key={`${item.label}-${itemIndex}`}>
                          <span>{item.emoji}</span>
                          <strong>{item.label}</strong>
                        </div>
                      ))}
                      <div className="train-car train-car-question">
                        <span>❓</span>
                        <strong>下一节</strong>
                      </div>
                    </div>
                    <div className="pattern-choice-row">
                      {config.choices.map((choice) => {
                        const isSelected = progress?.selectedChoice === choice.label;
                        const isCorrect = isSelected && progress?.completed;

                        return (
                          <button
                            aria-label={`规律卡片 ${choice.label}`}
                            className={`pattern-card ${isSelected ? 'pattern-card-selected' : ''} ${isCorrect ? 'pattern-card-correct' : ''}`}
                            key={choice.label}
                            onClick={() => handlePatternChoiceSelected(step.id, choice.label, config)}
                            type="button"
                          >
                            <span>{choice.emoji}</span>
                            <strong>{choice.label}</strong>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : null}

                {config?.kind === 'comparison-choice' ? (
                  <div className="play-surface">
                    <p className="play-instruction">{config.instruction}</p>
                    <div className="comparison-board">
                      <div className="comparison-group">
                        <strong>{config.leftLabel}</strong>
                        <div className="comparison-icons" aria-label={config.leftLabel}>
                          {Array.from({ length: config.leftCount }, (_, itemIndex) => (
                            <span className="comparison-icon" key={`left-${itemIndex + 1}`}>{config.emoji}</span>
                          ))}
                        </div>
                      </div>
                      <div className="comparison-group">
                        <strong>{config.rightLabel}</strong>
                        <div className="comparison-icons" aria-label={config.rightLabel}>
                          {Array.from({ length: config.rightCount }, (_, itemIndex) => (
                            <span className="comparison-icon" key={`right-${itemIndex + 1}`}>{config.emoji}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="comparison-choice-row">
                      {config.choices.map((choice) => {
                        const isSelected = progress?.selectedChoice === choice;
                        const isCorrect = isSelected && progress?.completed;

                        return (
                          <button
                            aria-label={`比较卡片 ${choice}`}
                            className={`comparison-card ${isSelected ? 'comparison-card-selected' : ''} ${isCorrect ? 'comparison-card-correct' : ''}`}
                            key={choice}
                            onClick={() => handleComparisonChoiceSelected(step.id, choice, config)}
                            type="button"
                          >
                            {choice}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : null}

                {config?.kind === 'equation-choice' ? (
                  <div className="play-surface">
                    <p className="play-instruction">{config.instruction}</p>
                    <div className="equation-board">
                      <div className="equation-group">
                        <strong>{config.leftLabel}</strong>
                        <div className="equation-icons">
                          {Array.from({ length: config.leftCount }, (_, itemIndex) => (
                            <span className="equation-icon" key={`equation-left-${itemIndex + 1}`}>{config.emoji}</span>
                          ))}
                        </div>
                      </div>
                      <span className="equation-symbol">+</span>
                      <div className="equation-group">
                        <strong>{config.rightLabel}</strong>
                        <div className="equation-icons">
                          {Array.from({ length: config.rightCount }, (_, itemIndex) => (
                            <span className="equation-icon" key={`equation-right-${itemIndex + 1}`}>{config.emoji}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="equation-choice-row">
                      {config.choices.map((choice) => {
                        const isSelected = progress?.selectedChoice === choice;
                        const isCorrect = isSelected && progress?.completed;

                        return (
                          <button
                            aria-label={`算式卡片 ${choice}`}
                            className={`equation-card ${isSelected ? 'equation-card-selected' : ''} ${isCorrect ? 'equation-card-correct' : ''}`}
                            key={choice}
                            onClick={() => handleEquationChoiceSelected(step.id, choice, config)}
                            type="button"
                          >
                            {choice}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : null}

                {config?.kind === 'character-choice' ? (
                  <div className="play-surface">
                    <p className="play-instruction">{config.instruction}</p>
                    <div className="character-row">
                      {config.choices.map((choice) => {
                        const isSelected = progress?.selectedChoice === choice.label;
                        const isCorrect = isSelected && progress?.completed;

                        return (
                          <button
                            aria-label={`汉字卡片 ${choice.label}`}
                            className={`character-card ${isSelected ? 'character-card-selected' : ''} ${isCorrect ? 'character-card-correct' : ''}`}
                            key={choice.label}
                            onClick={() => handleCharacterChoiceSelected(step.id, choice.label, config)}
                            type="button"
                          >
                            <strong>{choice.label}</strong>
                            <span>{choice.hint}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : null}

                {config?.kind === 'listen-choice' ? (
                  <div className="play-surface">
                    <p className="play-instruction">{config.instruction}</p>
                    <div className="audio-mode-row">
                      <button
                        className={`audio-mode-chip ${audioSpeedMode === 'normal' ? 'audio-mode-chip-active' : ''}`}
                        onClick={() => setAudioSpeedMode('normal')}
                        type="button"
                      >
                        标准速度
                      </button>
                      <button
                        className={`audio-mode-chip ${audioSpeedMode === 'slow' ? 'audio-mode-chip-active' : ''}`}
                        onClick={() => setAudioSpeedMode('slow')}
                        type="button"
                      >
                        慢速跟读
                      </button>
                    </div>
                    <p className="audio-helper-text">当前老师音色：{audioTeacherLabel}</p>
                    <button className="audio-button" onClick={() => handlePlayAudio(step.id, config)} type="button">
                      {config.playButtonLabel ?? '播放拼音读音'}
                    </button>
                    <div className="bubble-row">
                      {config.choices.map((choice) => {
                        const isSelected = progress?.selectedChoice === choice;
                        const isCorrect = isSelected && progress?.completed;

                        return (
                          <button
                            aria-label={`${config.choiceAriaLabelPrefix ?? '拼音泡泡'} ${choice}`}
                            className={`bubble-choice ${isSelected ? 'bubble-choice-selected' : ''} ${isCorrect ? 'bubble-choice-correct' : ''}`}
                            key={choice}
                            onClick={() => handleListenChoiceSelected(step.id, choice, config)}
                            type="button"
                          >
                            {choice}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : null}

                {config?.kind === 'follow-read' ? (
                  <div className="play-surface">
                    <p className="play-instruction">{config.instruction}</p>
                    <div className="audio-mode-row">
                      <button
                        className={`audio-mode-chip ${audioSpeedMode === 'normal' ? 'audio-mode-chip-active' : ''}`}
                        onClick={() => setAudioSpeedMode('normal')}
                        type="button"
                      >
                        标准速度
                      </button>
                      <button
                        className={`audio-mode-chip ${audioSpeedMode === 'slow' ? 'audio-mode-chip-active' : ''}`}
                        onClick={() => setAudioSpeedMode('slow')}
                        type="button"
                      >
                        慢速跟读
                      </button>
                    </div>
                    <p className="audio-helper-text">当前老师音色：{audioTeacherLabel}</p>
                    <div className="letter-row">
                      {config.letters.map((letter) => {
                        const isRead = progress?.completedItems?.includes(letter.label) ?? false;

                        return (
                          <button
                            aria-label={`字母卡片 ${letter.label}`}
                            className={`letter-card ${isRead ? 'letter-card-read' : ''}`}
                            key={letter.label}
                            onClick={() => handleFollowRead(step.id, letter, config.letters.length)}
                            type="button"
                          >
                            <strong>{letter.label}</strong>
                            <span>{letter.phonetic}</span>
                            <span>{`${letter.emoji} ${letter.exampleWord}`}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : null}

                {config?.kind === 'word-match' ? (
                  <div className="play-surface">
                    <p className="play-instruction">{config.instruction}</p>
                    <div className="word-chip-row">
                      {config.pairs.map((pair) => {
                        const isMatched = progress?.completedItems?.includes(pair.word) ?? false;
                        const isSelected = progress?.selectedWord === pair.word;

                        return (
                          <button
                            aria-label={`单词卡 ${pair.word}`}
                            className={`word-chip ${isSelected ? 'word-chip-selected' : ''} ${isMatched ? 'word-chip-matched' : ''}`}
                            disabled={isMatched}
                            key={pair.word}
                            onClick={() => handleWordSelected(step.id, pair)}
                            type="button"
                          >
                            <strong>{pair.word}</strong>
                            <span>{pair.phonetic}</span>
                          </button>
                        );
                      })}
                    </div>
                    <div className="picture-card-row">
                      {config.pairs.map((pair) => {
                        const isMatched = progress?.completedItems?.includes(pair.word) ?? false;

                        return (
                          <button
                            aria-label={`图片卡 ${pair.pictureLabel}`}
                            className={`picture-card ${isMatched ? 'picture-card-matched' : ''}`}
                            disabled={isMatched}
                            key={pair.pictureLabel}
                            onClick={() => handleWordMatch(step.id, pair.pictureLabel, config)}
                            type="button"
                          >
                            <span className="picture-card-emoji">{pair.emoji}</span>
                            <span>{pair.pictureLabel}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : null}

                {config?.kind === 'stroke-order' ? (
                  <div className="play-surface">
                    <p className="play-instruction">{config.instruction}</p>
                    <div className="stroke-preview">
                      <span className="stroke-preview-character">{config.character}</span>
                      <p>{config.character} 字正在等你来排笔顺</p>
                    </div>
                    <div className="stroke-row">
                      {config.strokes.map((stroke) => {
                        const isDone = progress?.completedItems?.includes(stroke.label) ?? false;

                        return (
                          <button
                            aria-label={`笔画卡片 ${stroke.label}`}
                            className={`stroke-card ${isDone ? 'stroke-card-done' : ''}`}
                            key={stroke.label}
                            onClick={() => handleStrokeSelected(step.id, stroke.label, config)}
                            type="button"
                          >
                            <strong>{stroke.label}</strong>
                            <span>{stroke.hint}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : null}

                {config?.kind === 'sentence-read' ? (
                  <div className="play-surface">
                    <p className="play-instruction">{config.instruction}</p>
                    <div className="audio-mode-row">
                      <button
                        className={`audio-mode-chip ${audioSpeedMode === 'normal' ? 'audio-mode-chip-active' : ''}`}
                        onClick={() => setAudioSpeedMode('normal')}
                        type="button"
                      >
                        标准速度
                      </button>
                      <button
                        className={`audio-mode-chip ${audioSpeedMode === 'slow' ? 'audio-mode-chip-active' : ''}`}
                        onClick={() => setAudioSpeedMode('slow')}
                        type="button"
                      >
                        慢速跟读
                      </button>
                    </div>
                    <p className="audio-helper-text">当前老师音色：{audioTeacherLabel}</p>
                    <button className="audio-button audio-button-secondary" onClick={() => handleReadStoryAll(step.id, config)} type="button">
                      老师先整段领读
                    </button>
                    <div className="story-card-row">
                      {config.sentences.map((sentence) => {
                        const isRead = progress?.completedItems?.includes(sentence.text) ?? false;

                        return (
                          <button
                            aria-label={`句子卡片 ${sentence.text}`}
                            className={`story-card ${isRead ? 'story-card-read' : ''}`}
                            key={sentence.text}
                            onClick={() => handleSentenceRead(step.id, sentence, config.sentences.length, config.successFeedback)}
                            type="button"
                          >
                            <span className="story-card-emoji">{sentence.emoji}</span>
                            <strong>{sentence.text}</strong>
                            <span>{sentence.scene}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : null}

                {config?.kind === 'story-choice' ? (
                  <div className="play-surface">
                    <p className="play-instruction">{config.instruction}</p>
                    <div className="story-problem-board">
                      <div className="story-problem-hero">
                        <span className="story-problem-emoji">{config.emoji}</span>
                        <strong>{config.characterLabel}</strong>
                      </div>
                      <div className="story-problem-lines">
                        {config.detailLines.map((line) => (
                          <p key={line}>{line}</p>
                        ))}
                      </div>
                    </div>
                    <div className="story-answer-row">
                      {config.choices.map((choice) => {
                        const isSelected = progress?.selectedChoice === choice;
                        const isCorrect = isSelected && progress?.completed;

                        return (
                          <button
                            aria-label={`答案卡片 ${choice}`}
                            className={`answer-card ${isSelected ? 'answer-card-selected' : ''} ${isCorrect ? 'answer-card-correct' : ''}`}
                            key={choice}
                            onClick={() => handleStoryChoiceSelected(step.id, choice, config)}
                            type="button"
                          >
                            {choice}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : null}

                {progress?.feedback ? (
                  <div className="feedback-stack">
                    <p className={`step-feedback ${progress.completed ? 'step-feedback-success' : ''}`}>
                      {progress.feedback}
                    </p>
                    {progress.detailLines?.map((line) => (
                      <p className="step-feedback-detail" key={line}>{line}</p>
                    ))}
                  </div>
                ) : (
                  <p className="step-feedback">玩法：{step.type}</p>
                )}
              </article>
            );
          })}
        </div>

        <button className="cta-button" disabled={!allStepsCompleted} type="button" onClick={() => void handleComplete()}>
          完成本关
        </button>
      </section>

      {completionResult && reward ? (
        <section className="reward-card reward-card-celebration" aria-live="polite">
          <div aria-label="通关庆祝动画" className="celebration-burst">
            {celebrationStars.map((star, index) => (
              <span
                aria-label="庆祝星星"
                className={`celebration-star celebration-star-${index + 1}`}
                key={`${star}-${index}`}
              >
                {star}
              </span>
            ))}
          </div>
          <p className="eyebrow">奖励已送达</p>
          <h2>{completionResult.isFirstCompletion ? `获得 ${reward.stars} 颗星星` : '复习完成啦'}</h2>
          {nextLevelCode ? <p className="reward-unlock-pill">下一关已解锁</p> : null}
          <p className="reward-card-copy">
            {completionResult.isFirstCompletion ? '太棒啦，继续去点亮下一关' : '这次是复习练习，星星奖励已在首通时发放'}
          </p>
          {!completionResult.isFirstCompletion ? (
            <p className="reward-total-stars">累计星星 {completionResult.totalStars} 颗</p>
          ) : null}
          <p className="reward-badge-pill">{reward.badgeName}</p>
          {completionResult.newlyUnlockedBadges.length > 0 ? (
            <div className="reward-achievement-stack">
              <p className="eyebrow">新成就解锁</p>
              {completionResult.newlyUnlockedBadges.map((badge) => (
                <article className="reward-achievement-card" key={badge.code}>
                  <strong>{badge.title}</strong>
                  <p>{badge.description}</p>
                </article>
              ))}
            </div>
          ) : null}
          <div className="reward-card-actions">
            {nextLevelCode ? (
              <Link className="cta-button reward-next-button" to={`/levels/${nextLevelCode}`}>
                前往下一关
                {showNextLevelNudge ? <span aria-label="下一关提示箭头" className="reward-next-arrow">→</span> : null}
              </Link>
            ) : (
              <Link className="cta-button reward-next-button" to={backTarget}>
                返回{currentLevel.subjectTitle}
              </Link>
            )}
          </div>
        </section>
      ) : null}
    </main>
  );
}
