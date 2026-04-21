import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import { PageTopBar } from '../components/PageTopBar';
import { Link, useParams } from 'react-router-dom';
import { completeLevel, getLevel } from '../api';
import basketImage from '../assets/basket-cartoon.svg';
import { subjectMaps } from '../data/mockData';
import { useSession } from '../session';
import type { LevelDetail, LevelStep } from '../types';

type ActivityConfigMetadata = {
  assetTheme?: string;
  audioQuality?: string;
  variantCount?: number;
};

type PictureMathGroup = {
  label: string;
  emoji: string;
  count: number;
  tone?: 'normal' | 'add' | 'remove' | 'result';
};

type MathVisualModel = (
  | {
      kind: 'grid';
      title: string;
      caption: string;
      rows: number;
      columns: number;
      filledCount: number;
      emoji?: string;
    }
  | {
      kind: 'number-line';
      title: string;
      caption: string;
      start: number;
      end: number;
      points: Array<{
        value: number;
        label: string;
        tone?: 'start' | 'end' | 'mid';
      }>;
      jumpLabel?: string;
    }
  | {
      kind: 'bar-model';
      title: string;
      caption: string;
      segments: Array<{
        label: string;
        value: number;
        tone?: 'known' | 'extra' | 'result';
      }>;
    }
  | {
      kind: 'fraction-bars';
      title: string;
      caption: string;
      bars: Array<{
        label: string;
        totalParts: number;
        filledParts: number;
        tone?: 'primary' | 'secondary';
      }>;
    }
);

type StepActivityConfig = ActivityConfigMetadata & (
  {
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
      pictureGroups?: PictureMathGroup[];
      mathModel?: MathVisualModel;
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
      pictureGroups?: PictureMathGroup[];
      mathModel?: MathVisualModel;
    }
);

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

interface AnimatedExplainer {
  title: string;
  subtitle: string;
  accentEmoji: string;
  scenes: Array<{
    title: string;
    narration: string;
    tokens: string[];
  }>;
}

function PictureMathBoard({ groups }: { groups?: PictureMathGroup[] }) {
  if (!groups?.length) {
    return null;
  }

  return (
    <div aria-label="图片算式" className="picture-math-board">
      {groups.map((group) => (
        <div className={`picture-math-group picture-math-group-${group.tone ?? 'normal'}`} key={group.label}>
          <div className="picture-math-group-header">
            <strong>{group.label}</strong>
            <span>{group.count} 个</span>
          </div>
          <div className="picture-math-token-row">
            {Array.from({ length: group.count }, (_, itemIndex) => (
              <span
                aria-label={`${group.label} 图片 ${itemIndex + 1}`}
                className="picture-math-token"
                key={`${group.label}-${itemIndex + 1}`}
              >
                {group.emoji}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function MathModelBoard({ model }: { model?: MathVisualModel }) {
  if (!model) {
    return null;
  }

  return (
    <div aria-label="数形结合模型" className={`math-model-board math-model-board-${model.kind}`}>
      <div className="math-model-header">
        <strong>{model.title}</strong>
        <span>{model.caption}</span>
      </div>

      {model.kind === 'grid' ? (
        <div
          className="math-model-grid"
          style={{
            '--math-grid-columns': model.columns
          } as CSSProperties}
        >
          {Array.from({ length: model.rows * model.columns }, (_, cellIndex) => {
            const isFilled = cellIndex < model.filledCount;

            return (
              <span
                aria-label={`${model.title} 格子 ${cellIndex + 1}`}
                className={`math-model-cell ${isFilled ? 'math-model-cell-filled' : ''}`}
                key={`${model.title}-${cellIndex + 1}`}
              >
                {isFilled ? model.emoji ?? '' : ''}
              </span>
            );
          })}
        </div>
      ) : null}

      {model.kind === 'number-line' ? (
        <div className="math-model-number-line">
          {model.jumpLabel ? <p>{model.jumpLabel}</p> : null}
          <div className="math-model-number-track">
            {Array.from({ length: model.end - model.start + 1 }, (_, tickIndex) => {
              const value = model.start + tickIndex;
              const point = model.points.find((item) => item.value === value);

              return (
                <span
                  aria-label={point ? `数轴点 ${value} ${point.label}` : `数轴点 ${value}`}
                  className={`math-model-number-point ${point ? 'math-model-number-point-active' : ''} ${point?.tone ? `math-model-number-point-${point.tone}` : ''}`}
                  key={value}
                >
                  {value}
                  {point ? <small>{point.label}</small> : null}
                </span>
              );
            })}
          </div>
        </div>
      ) : null}

      {model.kind === 'bar-model' ? (
        <div className="math-model-bars">
          {model.segments.map((segment) => (
            <span
              aria-label={`线段 ${segment.label} ${segment.value}`}
              className={`math-model-bar-segment ${segment.tone ? `math-model-bar-segment-${segment.tone}` : ''}`}
              key={segment.label}
              style={{ '--math-bar-flex': segment.value } as CSSProperties}
            >
              <strong>{segment.label}</strong>
              <small>{segment.value}</small>
            </span>
          ))}
        </div>
      ) : null}

      {model.kind === 'fraction-bars' ? (
        <div className="math-model-fraction-list">
          {model.bars.map((bar) => (
            <div className="math-model-fraction-row" key={bar.label}>
              <span>{bar.label}</span>
              <div className="math-model-fraction-parts">
                {Array.from({ length: bar.totalParts }, (_, partIndex) => (
                  <span
                    aria-label={`${bar.label} 分数条 ${partIndex + 1}`}
                    className={`math-model-fraction-part ${partIndex < bar.filledParts ? 'math-model-fraction-part-filled' : ''} ${bar.tone ? `math-model-fraction-part-${bar.tone}` : ''}`}
                    key={`${bar.label}-${partIndex + 1}`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
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
      failureFeedback: '差一点点，再算一遍看看',
      pictureGroups: [
        { label: '原来有 2 颗糖果', emoji: '🍬', count: 2, tone: 'normal' },
        { label: '又放进 3 颗糖果', emoji: '🍭', count: 3, tone: 'add' }
      ]
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
      failureFeedback: '可以先想 9 再往后数 5 个',
      pictureGroups: [
        { label: '原来有 9 只小鸟', emoji: '🐦', count: 9, tone: 'normal' },
        { label: '又飞来 5 只小鸟', emoji: '🕊️', count: 5, tone: 'add' }
      ]
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
      failureFeedback: '把 15 只小鸟减去飞走的 6 只再想一想',
      pictureGroups: [
        { label: '树上原来 15 只小鸟', emoji: '🐦', count: 15, tone: 'normal' },
        { label: '飞走 6 只小鸟', emoji: '🕊️', count: 6, tone: 'remove' },
        { label: '还剩 9 只小鸟', emoji: '🐦', count: 9, tone: 'result' }
      ]
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
  'math-shapes-001': {
    'step-1': {
      kind: 'character-choice',
      instruction: '观察图形朋友的样子，找出圆圆的图形。',
      choices: [
        { label: '圆形', hint: '像太阳、皮球' },
        { label: '三角形', hint: '有 3 条直直的边' },
        { label: '正方形', hint: '4 条边一样长' }
      ],
      correctChoice: '圆形',
      successFeedback: '答对了，圆形像太阳和皮球，边边是弯弯的',
      detailLines: ['图形提示：圆形没有尖角，三角形有 3 个角，正方形有 4 个角。'],
      failureFeedback: '再找一找，太阳和皮球更像哪一个图形'
    }
  },
  'math-position-001': {
    'step-1': {
      kind: 'story-choice',
      instruction: '看小动物的位置，选出小狗在哪里。',
      emoji: '🐶',
      characterLabel: '小动物位置图',
      detailLines: ['小猫在桌子上面。', '小狗趴在桌子下面。'],
      choices: [1, 2, 3],
      correctChoice: 2,
      successFeedback: '答对了，小狗在桌子下面',
      failureFeedback: '再看看桌子和小狗的位置，上面还是下面？'
    }
  },
  'math-ordinal-001': {
    'step-1': {
      kind: 'number-choice',
      instruction: '从左往右数一数，小兔排在第几个？',
      choices: [2, 3, 4],
      correctChoice: 3,
      optionLabelPrefix: '位置卡',
      successFeedback: '答对了，小兔排在第 3 个',
      failureFeedback: '从左边第一个开始，一个一个数到小兔'
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
  'chinese-radicals-001': {
    'step-1': {
      kind: 'character-choice',
      instruction: '看一看哪个字里藏着“木”的样子。',
      choices: [
        { label: '林', hint: '两个木靠在一起' },
        { label: '明', hint: '日和月在一起' },
        { label: '口', hint: '像小嘴巴' }
      ],
      correctChoice: '林',
      successFeedback: '答对了，“林”里有两个木，和树木有关系',
      detailLines: ['偏旁提示：木字旁常常和树木、植物有关系'],
      failureFeedback: '再找一找，哪个字里藏着“木”'
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
  'chinese-pinyin-tone-001': {
    'step-1': {
      kind: 'listen-choice',
      instruction: '先听老师读，再选出第三声的小山坡。',
      audioPrompt: 'mǎ',
      audioText: '马',
      lang: 'zh-CN',
      playButtonLabel: '播放声调读音',
      choiceAriaLabelPrefix: '声调卡',
      choices: ['mā', 'má', 'mǎ'],
      correctChoice: 'mǎ',
      successFeedback: '听对了，mǎ 是第三声，声音先低再抬起来',
      failureFeedback: '再听一遍，第三声像小山坡，先下再上'
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
  'chinese-strokes-004': {
    'step-1': {
      kind: 'stroke-order',
      instruction: '按顺序点一点，认识横、竖、撇、捺。',
      character: '木',
      strokes: [
        { label: '横', hint: '先写平平的一横' },
        { label: '竖', hint: '再写中间直直的一竖' },
        { label: '撇', hint: '第三笔向左下撇' },
        { label: '捺', hint: '最后向右下舒展开' }
      ],
      successFeedback: '真棒，横、竖、撇、捺都点对了',
      detailLines: ['基础笔画是写字积木，先认清笔画，写字会更稳。'],
      failureFeedback: '慢慢来，先横后竖，再撇再捺'
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
  'english-case-001': {
    'step-1': {
      kind: 'word-match',
      instruction: '先点大写字母，再点对应的小写字母，把大小写配成朋友。',
      pairs: [
        { word: 'A', pictureLabel: 'a', emoji: '🍎', phonetic: 'apple' },
        { word: 'B', pictureLabel: 'b', emoji: '📘', phonetic: 'book' },
        { word: 'C', pictureLabel: 'c', emoji: '🐱', phonetic: 'cat' }
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
  'english-family-001': {
    'step-1': {
      kind: 'word-match',
      instruction: '把家庭单词和图标配成一对，边点边跟读。',
      pairs: [
        { word: 'mom', pictureLabel: '妈妈', emoji: '👩', phonetic: '/mɑːm/' },
        { word: 'dad', pictureLabel: '爸爸', emoji: '👨', phonetic: '/dæd/' },
        { word: 'family', pictureLabel: '家人', emoji: '🏠', phonetic: '/ˈfæməli/' }
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
  'english-story-004': {
    'step-1': {
      kind: 'sentence-read',
      instruction: '点一点公园绘本，把三句话按顺序读完。',
      sentences: [
        { text: 'I go to the park.', emoji: '🌳', scene: '我去公园玩' },
        { text: 'I see a bird.', emoji: '🐦', scene: '我看见一只小鸟' },
        { text: 'I like the park.', emoji: '💚', scene: '我喜欢公园' }
      ],
      successFeedback: '公园小绘本读完啦'
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
  'math-grade1-hundredchart-001': {
    'step-1': {
      kind: 'number-choice',
      instruction: '先看百格图，数一数点亮了几个格子，再选出对应数字。',
      choices: [27, 37, 73],
      correctChoice: 37,
      optionLabelPrefix: '数字卡',
      successFeedback: '答对了，37 是 3 个十和 7 个一',
      failureFeedback: '再看一看，点亮了 3 行多 7 个，不是 73',
      mathModel: {
        kind: 'grid',
        title: '百格图认数',
        caption: '点亮 37：3 个十和 7 个一',
        rows: 10,
        columns: 10,
        filledCount: 37
      }
    }
  },
  'math-grade1-numberline-001': {
    'step-1': {
      kind: 'number-choice',
      instruction: '把加法放到数轴上，从起点往右跳，看看落在哪个数。',
      choices: [16, 17, 18],
      correctChoice: 17,
      optionLabelPrefix: '数字卡',
      successFeedback: '答对了，12 往前跳 5 格就是 17',
      failureFeedback: '从 12 开始往右数 5 格：13、14、15、16、17',
      mathModel: {
        kind: 'number-line',
        title: '数轴跳跳桥',
        caption: '从 12 到 17 的移动',
        start: 10,
        end: 20,
        jumpLabel: '从 12 出发，向右跳 5 格',
        points: [
          { value: 12, label: '起点', tone: 'start' },
          { value: 17, label: '终点', tone: 'end' }
        ]
      }
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
  'math-grade2-array-001': {
    'step-1': {
      kind: 'number-choice',
      instruction: '把花摆成整齐的行和列，先看几行，再看每行几个。',
      choices: [16, 20, 25],
      correctChoice: 20,
      optionLabelPrefix: '数字石牌',
      successFeedback: '答对了，4 行 5 列就是 20 朵花',
      failureFeedback: '再按一行 5 朵数：5、10、15、20',
      mathModel: {
        kind: 'grid',
        title: '乘法数组花园',
        caption: '4 行，每行 5 朵花',
        rows: 4,
        columns: 5,
        filledCount: 20,
        emoji: '🌼'
      }
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
  'math-grade2-bar-model-001': {
    'step-1': {
      kind: 'story-choice',
      instruction: '先看线段图：蓝气球和红气球一样多，还多出 7 个。',
      emoji: '🎈',
      characterLabel: '线段图',
      detailLines: ['红气球 18 个', '蓝气球比红气球多 7 个', '蓝气球 = 18 + 7'],
      choices: [24, 25, 26],
      correctChoice: 25,
      successFeedback: '答对了，18 + 7 = 25，蓝气球有 25 个',
      failureFeedback: '蓝气球比红气球更多，要在 18 的基础上再加 7',
      mathModel: {
        kind: 'bar-model',
        title: '线段图应用题',
        caption: '用线段看见“同样多”和“多出的部分”',
        segments: [
          { label: '红气球', value: 18, tone: 'known' },
          { label: '多出的', value: 7, tone: 'extra' }
        ]
      }
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
  },
  'math-grade3-division-001': {
    'step-1': {
      kind: 'story-choice',
      instruction: '把贝壳平均分给 3 个小朋友，想想每个人拿到几个。',
      emoji: '🐚',
      characterLabel: '贝壳小队',
      detailLines: ['12 个贝壳平均分给 3 个小朋友', '平均分就是每个人拿到一样多。'],
      choices: [3, 4, 5],
      correctChoice: 4,
      successFeedback: '答对了，12 平均分成 3 份，每份是 4',
      failureFeedback: '再把 12 个贝壳分成 3 组试试看'
    }
  },
  'math-grade3-perimeter-001': {
    'step-1': {
      kind: 'story-choice',
      instruction: '绕着长方形走一圈，把四条边都加起来。',
      emoji: '🧱',
      characterLabel: '操场围栏',
      detailLines: ['长方形操场长 6 米，宽 4 米。', '周长要把四条边都算进去。'],
      choices: [18, 20, 24],
      correctChoice: 20,
      successFeedback: '答对了，6 + 4 + 6 + 4 = 20 米',
      failureFeedback: '别忘了长方形有两条长边和两条宽边'
    }
  },
  'math-grade3-area-model-001': {
    'step-1': {
      kind: 'story-choice',
      instruction: '把 12×4 拆成 10×4 和 2×4，用长方形面积模型看清楚。',
      emoji: '🧩',
      characterLabel: '面积模型',
      detailLines: ['10×4 + 2×4', '先算整十部分 40，再算剩下 8。'],
      choices: [46, 48, 52],
      correctChoice: 48,
      successFeedback: '答对了，10×4 是 40，2×4 是 8，一共 48',
      failureFeedback: '先把 12 拆成 10 和 2，再分别乘 4',
      mathModel: {
        kind: 'grid',
        title: '面积模型乘法',
        caption: '12 列 × 4 行，可以拆成 10 列和 2 列',
        rows: 4,
        columns: 12,
        filledCount: 48
      }
    }
  },
  'math-grade3-fraction-001': {
    'step-1': {
      kind: 'story-choice',
      instruction: '把披萨平均分，再想想涂色部分有几份。',
      emoji: '🍕',
      characterLabel: '披萨分数',
      detailLines: ['一张披萨平均分成 8 份。', '其中 3 份涂上了颜色。'],
      choices: [2, 3, 5],
      correctChoice: 3,
      successFeedback: '答对了，涂色部分是 8 份里的 3 份',
      failureFeedback: '先看一共分成几份，再数涂色的几份'
    }
  },
  'math-grade3-fractionbar-001': {
    'step-1': {
      kind: 'story-choice',
      instruction: '两个分数条都平均分成 8 份，只要比较涂色份数。',
      emoji: '🟦',
      characterLabel: '分数条',
      detailLines: ['5/8 和 3/8 比大小', '分母相同，分子越大，涂色越多。'],
      choices: [3, 5, 8],
      correctChoice: 5,
      successFeedback: '答对了，5/8 的涂色更多，所以 5/8 更大',
      failureFeedback: '两个分数条都分成 8 份，比较涂色了几份',
      mathModel: {
        kind: 'fraction-bars',
        title: '分数条比较',
        caption: '5/8 和 3/8 比大小',
        bars: [
          { label: '5/8', totalParts: 8, filledParts: 5, tone: 'primary' },
          { label: '3/8', totalParts: 8, filledParts: 3, tone: 'secondary' }
        ]
      }
    }
  },
  'math-grade3-wordproblem-001': {
    'step-1': {
      kind: 'story-choice',
      instruction: '把题目拆成两步，先算每盒，再算一共。',
      emoji: '📦',
      characterLabel: '图书角',
      detailLines: ['每个书架放 3 层，每层 8 本书。', '2 个书架一共有多少本书？'],
      choices: [24, 36, 48],
      correctChoice: 48,
      successFeedback: '答对了，先算 3 × 8 = 24，再算 24 × 2 = 48',
      failureFeedback: '先算一个书架有多少本，再算两个书架'
    }
  },
  'chinese-grade3-paragraph-001': {
    'step-1': {
      kind: 'sentence-read',
      instruction: '按顺序读完一小段话，把春天的画面连起来。',
      sentences: [
        { text: '春天来了，小草从泥土里探出头。', emoji: '🌱', scene: '小草从土里长出来' },
        { text: '河边的柳树长出了嫩绿的叶子。', emoji: '🌿', scene: '柳树叶子变绿' },
        { text: '小朋友们在风里放起了风筝。', emoji: '🪁', scene: '孩子们在春风里玩耍' }
      ],
      successFeedback: '段落读完啦，春天的画面已经连起来了'
    }
  },
  'chinese-grade3-antonym-001': {
    'step-1': {
      kind: 'character-choice',
      instruction: '找到和“热闹”意思相反的词语。',
      choices: [
        { label: '安静', hint: '没有声音，很平静' },
        { label: '高兴', hint: '心情很好' },
        { label: '整齐', hint: '排得很有顺序' }
      ],
      correctChoice: '安静',
      successFeedback: '答对了，“热闹”的反义词可以是“安静”',
      detailLines: ['近义词和反义词能帮助我们更准确地理解词语。'],
      failureFeedback: '再想一想，热闹是声音多，人也多'
    }
  },
  'chinese-grade3-rhetoric-001': {
    'step-1': {
      kind: 'character-choice',
      instruction: '哪一句用了“像”来打比方？',
      choices: [
        { label: '月亮像小船。', hint: '把月亮比作小船' },
        { label: '我看见月亮。', hint: '只是说明看见了什么' },
        { label: '月亮升起来了。', hint: '说明月亮的位置变化' }
      ],
      correctChoice: '月亮像小船。',
      successFeedback: '答对了，“像”把月亮和小船联系起来了',
      detailLines: ['三年级可以先感受比喻，让句子变得更有画面。'],
      failureFeedback: '找一找哪一句把一个东西说成像另一个东西'
    }
  },
  'chinese-grade3-expression-001': {
    'step-1': {
      kind: 'sentence-read',
      instruction: '读完后试着感受：这一段主要写了什么。',
      sentences: [
        { text: '雨停了，空气里有青草的味道。', emoji: '🌧️', scene: '雨后空气清新' },
        { text: '小蜗牛慢慢爬过湿湿的石板路。', emoji: '🐌', scene: '蜗牛在路上移动' },
        { text: '我蹲下来，轻轻和它说了一声你好。', emoji: '👋', scene: '我温柔地观察小动物' }
      ],
      successFeedback: '阅读表达完成，已经能抓住雨后观察的画面了'
    }
  },
  'english-grade3-transform-001': {
    'step-1': {
      kind: 'character-choice',
      instruction: '找到 I like apples. 的否定句。',
      choices: [
        { label: 'I do not like apples.', hint: '加上 do not，表示不喜欢' },
        { label: 'I likes apples.', hint: '主谓不一致' },
        { label: 'Do I like apples?', hint: '这是疑问句' }
      ],
      correctChoice: 'I do not like apples.',
      successFeedback: '答对了，do not 可以把 like 变成“不喜欢”',
      detailLines: ['句型变换先从肯定句、否定句和疑问句开始观察。'],
      failureFeedback: '再想一想，否定句里常会出现 not'
    }
  },
  'english-grade3-phrase-001': {
    'step-1': {
      kind: 'word-match',
      instruction: '把常见词组和中文意思配起来。',
      pairs: [
        { word: 'look at', pictureLabel: '看一看', emoji: '👀', phonetic: '/lʊk æt/' },
        { word: 'get up', pictureLabel: '起床', emoji: '🛏️', phonetic: '/ɡet ʌp/' },
        { word: 'go home', pictureLabel: '回家', emoji: '🏠', phonetic: '/ɡoʊ hoʊm/' }
      ]
    }
  },
  'english-grade3-reading-001': {
    'step-1': {
      kind: 'sentence-read',
      instruction: '按顺序读完短文，看看 Ben 周末做了什么。',
      sentences: [
        { text: 'Ben goes to the park on Sunday.', emoji: '🌳', scene: 'Ben 周日去公园' },
        { text: 'He plays with his dog.', emoji: '🐶', scene: '他和小狗玩' },
        { text: 'They run under the big trees.', emoji: '🏃', scene: '他们在树下跑步' }
      ],
      successFeedback: '短文读完啦，Ben 的周末活动已经清楚了'
    }
  },
  'english-grade3-topic-001': {
    'step-1': {
      kind: 'sentence-read',
      instruction: '围绕“My day”主题读三句话，再试着自己说一说。',
      sentences: [
        { text: 'I get up at seven.', emoji: '⏰', scene: '我七点起床' },
        { text: 'I go to school with my bag.', emoji: '🎒', scene: '我背着书包上学' },
        { text: 'I read books after class.', emoji: '📚', scene: '课后我读书' }
      ],
      successFeedback: '主题表达完成，可以试着说说自己的一天'
    }
  },
  'math-grade4-decimal-001': {
    'step-1': {
      kind: 'number-choice',
      instruction: '看一看 10 格里涂色的部分，选出对应的小数。',
      choices: [0.5, 0.7, 0.9],
      correctChoice: 0.7,
      optionLabelPrefix: '数字石牌',
      successFeedback: '答对了，10 格里有 7 格就是 0.7',
      failureFeedback: '再想想 10 份中的 7 份可以写成 0.7'
    }
  },
  'math-grade4-hundredths-001': {
    'step-1': {
      kind: 'number-choice',
      instruction: '把 100 格看成 1 个整体，数一数涂色部分对应多少个百分之一。',
      choices: [0.23, 0.32, 3.2],
      correctChoice: 0.32,
      optionLabelPrefix: '小数卡',
      successFeedback: '答对了，32 个百分之一就是 0.32',
      failureFeedback: '再看一看，是 100 格里的 32 格，所以是 0.32',
      mathModel: {
        kind: 'grid',
        title: '小数百格图',
        caption: '涂色 32 格，就是 32 个百分之一',
        rows: 10,
        columns: 10,
        filledCount: 32
      }
    }
  },
  'math-grade4-angle-001': {
    'step-1': {
      kind: 'character-choice',
      instruction: '找到像书本打开后形成的锐角。',
      choices: [
        { label: '小于 90° 的角', hint: '张口比较小' },
        { label: '等于 90° 的角', hint: '像直直的墙角' },
        { label: '大于 90° 的角', hint: '张口比较大' }
      ],
      correctChoice: '小于 90° 的角',
      successFeedback: '答对了，小于 90° 的角叫锐角',
      detailLines: ['四年级先认识锐角、直角、钝角，再观察图形里的角。'],
      failureFeedback: '再想一想，锐角的张口比直角更小'
    }
  },
  'math-grade4-angle-classify-001': {
    'step-1': {
      kind: 'character-choice',
      instruction: '观察 135° 的张口，它比直角大、比平角小，选出角的类别。',
      choices: [
        { label: '锐角', hint: '小于 90°' },
        { label: '直角', hint: '等于 90°' },
        { label: '钝角', hint: '大于 90° 且小于 180°' }
      ],
      correctChoice: '钝角',
      successFeedback: '答对了，135° 大于 90° 小于 180°，是钝角',
      detailLines: ['锐角 < 90°，直角 = 90°，钝角在 90° 和 180° 之间。'],
      failureFeedback: '再比较一下 135° 和 90°，它的张口更大'
    }
  },
  'math-grade4-operation-001': {
    'step-1': {
      kind: 'story-choice',
      instruction: '先算乘法，再算加法，注意运算顺序。',
      emoji: '🧮',
      characterLabel: '运算算盘',
      detailLines: ['算式是 6 × 4 + 8。', '先算 6 × 4，再加 8。'],
      choices: [30, 32, 36],
      correctChoice: 32,
      successFeedback: '答对了，6 × 4 = 24，24 + 8 = 32',
      failureFeedback: '先把乘法算出来，再接着加 8'
    }
  },
  'math-grade4-distributive-001': {
    'step-1': {
      kind: 'story-choice',
      instruction: '把 12×6 拆成 10×6 和 2×6，用面积模型看见乘法分配律。',
      emoji: '🧱',
      characterLabel: '巧算模型',
      detailLines: ['10×6 + 2×6', '先算 60，再算 12，最后合起来。'],
      choices: [68, 72, 78],
      correctChoice: 72,
      successFeedback: '答对了，10×6 是 60，2×6 是 12，一共 72',
      failureFeedback: '先把 12 拆成 10 和 2，再分别乘 6',
      mathModel: {
        kind: 'grid',
        title: '面积模型巧算',
        caption: '12 列 × 6 行，可以拆成 10 列和 2 列',
        rows: 6,
        columns: 12,
        filledCount: 72
      }
    }
  },
  'math-grade4-strategy-001': {
    'step-1': {
      kind: 'story-choice',
      instruction: '用列表思路把两种票价组合起来。',
      emoji: '🎟️',
      characterLabel: '游乐园门票',
      detailLines: ['成人票 20 元，儿童票 10 元。', '1 张成人票和 3 张儿童票一共多少钱？'],
      choices: [40, 50, 60],
      correctChoice: 50,
      successFeedback: '答对了，20 + 10 × 3 = 50',
      failureFeedback: '先算 3 张儿童票，再加 1 张成人票'
    }
  },
  'math-grade4-distance-001': {
    'step-1': {
      kind: 'story-choice',
      instruction: '把“每小时 8 千米”连续走 3 小时放到线段图里，再算总路程。',
      emoji: '⛵',
      characterLabel: '小船路程',
      detailLines: ['速度是每小时 8 千米。', '行驶 3 小时，路程 = 速度 × 时间。'],
      choices: [18, 24, 32],
      correctChoice: 24,
      successFeedback: '答对了，8 × 3 = 24，小船一共行 24 千米',
      failureFeedback: '把每小时 8 千米看成一段，连续 3 段再合起来',
      mathModel: {
        kind: 'bar-model',
        title: '路程线段图',
        caption: '每小时 8 千米，走 3 小时，一共 24 千米',
        segments: [
          { label: '每小时', value: 8, tone: 'known' },
          { label: '3 小时', value: 24, tone: 'result' }
        ]
      }
    }
  },
  'chinese-grade4-passage-001': {
    'step-1': {
      kind: 'sentence-read',
      instruction: '按顺序读完篇章片段，抓住中心画面。',
      sentences: [
        { text: '傍晚，海面被夕阳染成金色。', emoji: '🌅', scene: '夕阳照在海面上' },
        { text: '渔船慢慢靠岸，海鸥在船边盘旋。', emoji: '⛵', scene: '船回到岸边' },
        { text: '这一刻，海边显得安静又温暖。', emoji: '🕊️', scene: '画面安静温暖' }
      ],
      successFeedback: '篇章片段读完，中心画面已经抓住了'
    }
  },
  'chinese-grade4-writing-001': {
    'step-1': {
      kind: 'sentence-read',
      instruction: '读一读写作表达句，学习把观察写具体。',
      sentences: [
        { text: '我先听见雨点敲在窗台上的声音。', emoji: '🌧️', scene: '先写声音' },
        { text: '接着看见水珠沿着玻璃慢慢滑下。', emoji: '🪟', scene: '再写看到的细节' },
        { text: '最后，我把这场雨写进了日记。', emoji: '📓', scene: '把观察写下来' }
      ],
      successFeedback: '写作表达读完，观察顺序更清楚了'
    }
  },
  'chinese-grade4-poem-001': {
    'step-1': {
      kind: 'sentence-read',
      instruction: '按顺序朗读古诗句，感受山路和枫林的画面。',
      sentences: [
        { text: '远上寒山石径斜。', emoji: '⛰️', scene: '山路弯弯向远处延伸' },
        { text: '白云生处有人家。', emoji: '☁️', scene: '白云深处有人居住' },
        { text: '停车坐爱枫林晚。', emoji: '🍁', scene: '停下车欣赏晚霞里的枫林' }
      ],
      successFeedback: '古诗积累完成，画面已经读出来了'
    }
  },
  'chinese-grade4-grammar-001': {
    'step-1': {
      kind: 'character-choice',
      instruction: '找到标点使用更规范的句子。',
      choices: [
        { label: '你今天读书了吗？', hint: '问句用问号' },
        { label: '你今天读书了吗。', hint: '问句不该用句号' },
        { label: '你今天读书了吗！', hint: '语气过强，不是普通疑问' }
      ],
      correctChoice: '你今天读书了吗？',
      successFeedback: '答对了，普通问句后面要用问号',
      detailLines: ['语法规范先从句子意思和标点搭配开始。'],
      failureFeedback: '再想一想，这句话是在提出问题'
    }
  },
  'english-grade4-tense-001': {
    'step-1': {
      kind: 'character-choice',
      instruction: '找到表示昨天踢足球的句子。',
      choices: [
        { label: 'I played football yesterday.', hint: 'played 表示过去发生' },
        { label: 'I play football today.', hint: 'today 是今天' },
        { label: 'I will play football tomorrow.', hint: 'will 表示将来' }
      ],
      correctChoice: 'I played football yesterday.',
      successFeedback: '答对了，yesterday 提醒我们动作发生在过去',
      detailLines: ['时态先看时间词，再观察动词有没有变化。'],
      failureFeedback: '再找一找带有 yesterday 和过去式 played 的句子'
    }
  },
  'english-grade4-passage-001': {
    'step-1': {
      kind: 'sentence-read',
      instruction: '按顺序读完短文，理解 Lucy 的周末计划。',
      sentences: [
        { text: 'Lucy visited her grandma last weekend.', emoji: '👵', scene: 'Lucy 上周末看望奶奶' },
        { text: 'They made soup together.', emoji: '🍲', scene: '她们一起做汤' },
        { text: 'Lucy felt warm and happy.', emoji: '😊', scene: 'Lucy 感到温暖开心' }
      ],
      successFeedback: '短文理解完成，Lucy 的周末已经读明白了'
    }
  },
  'english-grade4-topic-001': {
    'step-1': {
      kind: 'sentence-read',
      instruction: '围绕“My favorite season”读三句话，学习主题表达。',
      sentences: [
        { text: 'My favorite season is autumn.', emoji: '🍂', scene: '我最喜欢秋天' },
        { text: 'The leaves are yellow and red.', emoji: '🍁', scene: '树叶变黄变红' },
        { text: 'I can fly a kite with my friends.', emoji: '🪁', scene: '我和朋友放风筝' }
      ],
      successFeedback: '话题表达完成，可以试着说说自己最喜欢的季节'
    }
  },
  'english-grade4-review-001': {
    'step-1': {
      kind: 'listen-choice',
      instruction: '听一句综合练习，选出听到的关键词。',
      audioPrompt: 'season',
      audioText: 'season',
      lang: 'en-US',
      choices: ['season', 'student', 'story'],
      correctChoice: 'season',
      successFeedback: '答对了，听到的关键词是 season',
      failureFeedback: '再听一遍，注意开头是 see 的声音'
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
  英语岛: 'english',
  奥数训练营: 'olympiad'
};

const celebrationStars = ['★', '✦', '★', '✦', '★', '✦'];
const AUDIO_MODE_STORAGE_KEY = 'k12-learning-game-audio-mode';
const stepActivityKinds = new Set([
  'basket-count',
  'number-choice',
  'take-away',
  'pattern-choice',
  'comparison-choice',
  'equation-choice',
  'character-choice',
  'listen-choice',
  'follow-read',
  'word-match',
  'stroke-order',
  'sentence-read',
  'story-choice'
]);

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
    .filter((chapter) => subjectCode === 'olympiad' || (chapter.stageLabel ?? '幼小衔接') === stageLabel)
    .flatMap((chapter) => chapter.levels.map((level) => level.code));
  const currentIndex = orderedLevels.indexOf(levelCode);

  if (currentIndex === -1 || currentIndex === orderedLevels.length - 1) {
    return null;
  }

  return orderedLevels[currentIndex + 1];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function hasStringFields(value: Record<string, unknown>, fields: string[]) {
  return fields.every((field) => typeof value[field] === 'string');
}

function hasNumberFields(value: Record<string, unknown>, fields: string[]) {
  return fields.every((field) => typeof value[field] === 'number');
}

function hasStringArrayField(value: Record<string, unknown>, field: string) {
  return Array.isArray(value[field]) && value[field].every((item) => typeof item === 'string');
}

function hasNumberArrayField(value: Record<string, unknown>, field: string) {
  return Array.isArray(value[field]) && value[field].every((item) => typeof item === 'number');
}

function hasObjectArrayField(value: Record<string, unknown>, field: string) {
  return Array.isArray(value[field]) && value[field].every(isRecord);
}

function isBackendActivityConfig(value: Record<string, unknown>): value is StepActivityConfig {
  if (typeof value.kind !== 'string' || !stepActivityKinds.has(value.kind)) {
    return false;
  }

  switch (value.kind) {
    case 'basket-count':
      return hasStringFields(value, ['instruction']) && hasNumberFields(value, ['targetCount']);
    case 'number-choice':
      return hasStringFields(value, ['instruction', 'optionLabelPrefix', 'successFeedback', 'failureFeedback'])
        && hasNumberFields(value, ['correctChoice'])
        && hasNumberArrayField(value, 'choices');
    case 'take-away':
      return hasStringFields(value, ['instruction', 'itemLabel', 'emoji', 'successFeedback'])
        && hasNumberFields(value, ['initialCount', 'removeCount']);
    case 'pattern-choice':
      return hasStringFields(value, ['instruction', 'correctChoice', 'successFeedback', 'failureFeedback'])
        && hasObjectArrayField(value, 'sequence')
        && hasObjectArrayField(value, 'choices');
    case 'comparison-choice':
    case 'equation-choice':
      return hasStringFields(value, ['instruction', 'emoji', 'leftLabel', 'rightLabel', 'correctChoice', 'successFeedback', 'failureFeedback'])
        && hasNumberFields(value, ['leftCount', 'rightCount'])
        && hasStringArrayField(value, 'choices');
    case 'character-choice':
      return hasStringFields(value, ['instruction', 'correctChoice', 'successFeedback', 'failureFeedback'])
        && hasObjectArrayField(value, 'choices')
        && hasStringArrayField(value, 'detailLines');
    case 'listen-choice':
      return hasStringFields(value, ['instruction', 'audioPrompt', 'correctChoice', 'successFeedback', 'failureFeedback'])
        && hasStringArrayField(value, 'choices');
    case 'follow-read':
      return hasStringFields(value, ['instruction']) && hasObjectArrayField(value, 'letters');
    case 'word-match':
      return hasStringFields(value, ['instruction']) && hasObjectArrayField(value, 'pairs');
    case 'stroke-order':
      return hasStringFields(value, ['instruction', 'character', 'successFeedback', 'failureFeedback'])
        && hasObjectArrayField(value, 'strokes')
        && hasStringArrayField(value, 'detailLines');
    case 'sentence-read':
      return hasStringFields(value, ['instruction', 'successFeedback']) && hasObjectArrayField(value, 'sentences');
    case 'story-choice':
      return hasStringFields(value, ['instruction', 'emoji', 'characterLabel', 'successFeedback', 'failureFeedback'])
        && hasStringArrayField(value, 'detailLines')
        && hasNumberFields(value, ['correctChoice'])
        && hasNumberArrayField(value, 'choices');
    default:
      return false;
  }
}

function parseBackendActivityConfig(activityConfigJson?: string): StepActivityConfig | undefined {
  if (!activityConfigJson) {
    return undefined;
  }

  try {
    const parsedValue: unknown = JSON.parse(activityConfigJson);
    if (!isRecord(parsedValue) || !isBackendActivityConfig(parsedValue)) {
      return undefined;
    }

    return parsedValue;
  } catch {
    return undefined;
  }
}

function getActivityMetaLabels(step: LevelStep, config?: StepActivityConfig) {
  const labels: string[] = [];
  const variantCount = config?.variantCount ?? step.variantCount;

  if (step.knowledgePointTitle) {
    labels.push(step.knowledgePointTitle);
  }

  if (typeof variantCount === 'number' && Number.isFinite(variantCount) && variantCount > 0) {
    labels.push(`题库变体 ${variantCount} 组`);
  }

  if (config?.assetTheme) {
    labels.push(`素材风格：${config.assetTheme}`);
  }

  if (config?.audioQuality) {
    labels.push(`音频质量：${config.audioQuality}`);
  }

  return labels;
}

function getAnimatedExplainer(level: LevelDetail): AnimatedExplainer | null {
  if (level.code.includes('-grade')) {
    return null;
  }

  if (level.subjectTitle === '数学岛') {
    return {
      title: '先看动画解读：数量怎么变成数字',
      subtitle: '用 20 秒先看懂规则，再开始动手玩。',
      accentEmoji: '🍎',
      scenes: [
        {
          title: '第一幕：先看见数量',
          narration: '苹果一个一个出现，孩子先用眼睛感受“有几个”。',
          tokens: ['🍎', '🍎', '🍎', '🍎', '🍎']
        },
        {
          title: '第二幕：把数量放进篮子',
          narration: '把苹果收进篮子，数量不会消失，只是换了一个地方。',
          tokens: ['🧺', '🍎', '🍎', '🍎', '🍎', '🍎']
        },
        {
          title: '第三幕：找到对应数字',
          narration: '最后把看到的数量和数字符号连起来。',
          tokens: ['5', '=', '🍎🍎🍎🍎🍎']
        }
      ]
    };
  }

  if (level.subjectTitle === '语文岛') {
    return {
      title: '先看动画解读：字音字形怎么连起来',
      subtitle: '用图像、声音和笔画，把抽象文字变得可观察。',
      accentEmoji: '☀️',
      scenes: [
        {
          title: '第一幕：从图像开始',
          narration: '先看太阳、月亮这些熟悉图像，降低识字难度。',
          tokens: ['☀️', '🌙', '⛰️']
        },
        {
          title: '第二幕：听见正确读音',
          narration: '再听拼音或汉字读音，让眼睛和耳朵一起记住。',
          tokens: ['ma', 'ba', 'pa']
        },
        {
          title: '第三幕：看笔画顺序',
          narration: '最后按顺序观察笔画，知道字是一步一步写出来的。',
          tokens: ['一', '丨', '𠃍', '日']
        }
      ]
    };
  }

  if (level.subjectTitle === '英语岛') {
    return {
      title: '先看动画解读：字母怎么藏进单词',
      subtitle: '先听字母音，再把字母、图片和单词连起来。',
      accentEmoji: 'A',
      scenes: [
        {
          title: '第一幕：认识字母朋友',
          narration: '字母先单独出现，孩子跟着形状和声音熟悉它。',
          tokens: ['A', 'B', 'C']
        },
        {
          title: '第二幕：听开头声音',
          narration: '把字母音放进单词开头，听见 apple 里的 A。',
          tokens: ['A', 'a-a', 'apple']
        },
        {
          title: '第三幕：和图片配成一对',
          narration: '最后把声音、单词和图片连起来，形成真实理解。',
          tokens: ['🍎', 'apple', '✓']
        }
      ]
    };
  }

  return null;
}

export function LevelPlayer() {
  const { levelCode } = useParams<{ levelCode: string }>();
  const { session } = useSession();
  const [level, setLevel] = useState<LevelDetail | null>(null);
  const [completionResult, setCompletionResult] = useState<Awaited<ReturnType<typeof completeLevel>> | null>(null);
  const [stepProgress, setStepProgress] = useState<Record<string, StepProgressState>>({});
  const [draggingApple, setDraggingApple] = useState<{ stepId: string; appleId: number } | null>(null);
  const [showNextLevelNudge, setShowNextLevelNudge] = useState(false);
  const [showAnimatedExplainer, setShowAnimatedExplainer] = useState(false);
  const [audioSpeedMode, setAudioSpeedMode] = useState<'normal' | 'slow'>(readAudioSpeedMode);
  const [audioTeacherLabel, setAudioTeacherLabel] = useState('系统默认老师');
  const [levelStartedAt, setLevelStartedAt] = useState(() => Date.now());
  const currentLevel = level;
  const activeChildStageLabel = session?.children.find((child) => child.id === session.childProfileId)?.stageLabel ?? '幼小衔接';
  const subjectCode = currentLevel ? subjectTitleToCode[currentLevel.subjectTitle] : undefined;
  const nextLevelCode = currentLevel ? getNextLevelCode(currentLevel.code, subjectCode, activeChildStageLabel) : null;
  const animatedExplainer = currentLevel && activeChildStageLabel === '幼小衔接' ? getAnimatedExplainer(currentLevel) : null;
  const reward = completionResult?.reward ?? null;

  useEffect(() => {
    if (!levelCode) {
      return;
    }

    setLevel(null);
    setCompletionResult(null);
    setStepProgress({});
    setShowNextLevelNudge(false);
    setShowAnimatedExplainer(false);
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
  const backTarget = subjectCode === 'olympiad' ? '/olympiad' : subjectCode ? `/subjects/${subjectCode}` : '/';
  const backLabel = subjectCode ? `返回${currentLevel.subjectTitle}` : '返回首页';

  function getStepConfig(step: LevelStep): StepActivityConfig | undefined {
    return parseBackendActivityConfig(step.activityConfigJson) ?? levelActivityConfigs[currentLevel!.code]?.[step.id];
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

        {animatedExplainer ? (
          <section className="animated-explainer-panel">
            <div className="animated-explainer-intro">
              <div>
                <p className="eyebrow">动画解读</p>
                <h2>{animatedExplainer.title}</h2>
                <p>{animatedExplainer.subtitle}</p>
              </div>
              <button
                className="cta-button cta-button-secondary"
                type="button"
                onClick={() => setShowAnimatedExplainer((current) => !current)}
              >
                {showAnimatedExplainer ? '收起动画解读' : '播放动画解读'}
              </button>
            </div>

            {showAnimatedExplainer ? (
              <div aria-label="动画解读视频" className="animated-explainer-video">
                <div className="animated-explainer-stage" aria-hidden="true">
                  <span className="animated-explainer-orbit animated-explainer-orbit-one">{animatedExplainer.accentEmoji}</span>
                  <span className="animated-explainer-orbit animated-explainer-orbit-two">✨</span>
                  <span className="animated-explainer-orbit animated-explainer-orbit-three">▶</span>
                </div>
                <div className="animated-explainer-scenes">
                  {animatedExplainer.scenes.map((scene, sceneIndex) => (
                    <article className="animated-explainer-scene" key={scene.title}>
                      <span className="node-step">镜头 {sceneIndex + 1}</span>
                      <h3>{scene.title}</h3>
                      <p>{scene.narration}</p>
                      <div className="animated-explainer-token-row" aria-label={`${scene.title} 动画元素`}>
                        {scene.tokens.map((token, tokenIndex) => (
                          <span
                            className="animated-explainer-token"
                            key={`${scene.title}-${token}-${tokenIndex}`}
                            style={{ animationDelay: `${tokenIndex * 0.18}s` }}
                          >
                            {token}
                          </span>
                        ))}
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            ) : null}
          </section>
        ) : null}

        <div className="step-list">
          {currentLevel.steps.map((step, index) => {
            const config = getStepConfig(step);
            const progress = stepProgress[step.id];
            const activityMetaLabels = getActivityMetaLabels(step, config);

            return (
              <article className="step-card" key={step.id}>
                <span className="node-step">第 {index + 1} / {currentLevel.steps.length} 步</span>
                <h2>{step.prompt}</h2>
                {activityMetaLabels.length > 0 ? (
                  <div className="level-activity-meta" aria-label="关卡素材和题库提示">
                    {activityMetaLabels.map((label) => (
                      <span className="level-activity-meta-chip" key={label}>{label}</span>
                    ))}
                  </div>
                ) : null}

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
                    <MathModelBoard model={config.mathModel} />
                    <PictureMathBoard groups={config.pictureGroups} />
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
                    <MathModelBoard model={config.mathModel} />
                    <PictureMathBoard groups={config.pictureGroups} />
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
          <div className="reward-hero-badge" aria-label="通关鼓励徽章">
            <span>闯关成功</span>
            <strong>星光能量已充满</strong>
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
          <div className="reward-leaderboard-card" aria-label="通关后的星光榜反馈">
            <div>
              <p className="eyebrow">{completionResult.leaderboardFeedback.boardTitle}</p>
              <strong>{completionResult.leaderboardFeedback.trendLabel}</strong>
              <p>{completionResult.leaderboardFeedback.message}</p>
            </div>
            <span>累计 {completionResult.leaderboardFeedback.totalStars} 星</span>
          </div>
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
