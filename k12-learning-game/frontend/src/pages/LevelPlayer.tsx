import { useEffect, useState } from 'react';
import { PageBackLink } from '../components/PageBackLink';
import { useParams } from 'react-router-dom';
import { completeLevel, getLevel } from '../api';
import applePhoto from '../assets/apple-photo.jpg';
import basketImage from '../assets/basket-cartoon.svg';
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
      choices: ['ma', 'ba', 'da'],
      correctChoice: 'ma',
      successFeedback: '听对了，这个泡泡读作 ma',
      failureFeedback: '再听一遍，注意嘴巴张开的声音'
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

function speakText(text: string, lang: string) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window)) {
    return;
  }

  window.speechSynthesis.cancel();
  const utterance = new window.SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = lang.startsWith('zh') ? 0.85 : 0.92;
  utterance.pitch = lang.startsWith('zh') ? 1.05 : 1;

  const preferredVoice = getPreferredVoice(lang);
  if (preferredVoice) {
    utterance.voice = preferredVoice;
  }

  window.speechSynthesis.speak(utterance);
}

const subjectTitleToCode: Record<string, string> = {
  数学岛: 'math',
  语文岛: 'chinese',
  英语岛: 'english'
};

export function LevelPlayer() {
  const { levelCode } = useParams<{ levelCode: string }>();
  const [level, setLevel] = useState<LevelDetail | null>(null);
  const [reward, setReward] = useState<LevelDetail['reward'] | null>(null);
  const [stepProgress, setStepProgress] = useState<Record<string, StepProgressState>>({});
  const [draggingApple, setDraggingApple] = useState<{ stepId: string; appleId: number } | null>(null);

  useEffect(() => {
    if (!levelCode) {
      return;
    }

    setLevel(null);
    setReward(null);
    setStepProgress({});
    getLevel(levelCode).then(setLevel);
  }, [levelCode]);

  if (!levelCode) {
    return <main className="screen"><p>这道关卡还在准备中。</p></main>;
  }

  if (!level) {
    return <main className="screen"><p>正在装载这一关的任务道具...</p></main>;
  }

  const currentLevel = level;
  const allStepsCompleted = currentLevel.steps.every((step) => stepProgress[step.id]?.completed);
  const subjectCode = subjectTitleToCode[currentLevel.subjectTitle];
  const backTarget = subjectCode ? `/subjects/${subjectCode}` : '/';
  const backLabel = subjectCode ? `返回${currentLevel.subjectTitle}` : '返回首页';

  function getStepConfig(stepId: string): StepActivityConfig | undefined {
    return levelActivityConfigs[currentLevel.code]?.[stepId];
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
    speakText(audioText, 'zh-CN');

    setStepProgress((current) => ({
      ...current,
      [stepId]: {
        ...current[stepId],
        completed: current[stepId]?.completed ?? false,
        audioPlayed: true,
        feedback: `老师正在读：${audioText}`
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
    speakText(letter.audioText ?? letter.label, 'en-US');
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
              : `${letter.label} ${letter.phonetic} · ${letter.exampleWord}`
        }
      };
    });
  }

  function handleWordSelected(stepId: string, pair: Extract<StepActivityConfig, { kind: 'word-match' }>['pairs'][number]) {
    speakText(pair.word, 'en-US');
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
        speakText(pair.word, 'en-US');
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
    speakText(sentence.audioText ?? sentence.text, 'en-US');

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

    const response = await completeLevel(currentLevel.code);
    setReward(response.reward);
  }

  return (
    <main className="screen screen-level">
      <PageBackLink label={backLabel} to={backTarget} />

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
                              <img alt="苹果图片" className="apple-token-image" src={applePhoto} />
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
                    <button className="audio-button" onClick={() => handlePlayAudio(step.id, config)} type="button">
                      播放拼音读音
                    </button>
                    <div className="bubble-row">
                      {config.choices.map((choice) => {
                        const isSelected = progress?.selectedChoice === choice;
                        const isCorrect = isSelected && progress?.completed;

                        return (
                          <button
                            aria-label={`拼音泡泡 ${choice}`}
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

      {reward ? (
        <section className="reward-card" aria-live="polite">
          <p className="eyebrow">奖励已送达</p>
          <h2>获得 {reward.stars} 颗星星</h2>
          <p>{reward.badgeName}</p>
        </section>
      ) : null}
    </main>
  );
}
