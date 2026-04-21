import type { SubjectChapter, SubjectMapData } from '../types';

export interface OlympiadTopic {
  title: string;
  skill: string;
  levelCode: string;
  lesson: string;
  icon: string;
  ability: '观察规律' | '计算策略' | '图形空间' | '模型应用' | '逻辑推理';
  difficulty: '启蒙' | '进阶' | '挑战';
  recommendation: string;
}

export interface OlympiadGrade {
  grade: string;
  subtitle: string;
  color: string;
  topics: OlympiadTopic[];
}

export const olympiadGrades: OlympiadGrade[] = [
  {
    grade: '一年级',
    subtitle: '从观察规律和简单巧算开始，先让孩子觉得“想一想很好玩”。',
    color: '#ff9f6e',
    topics: [
      { title: '找规律', skill: '观察序列、补全下一项', levelCode: 'olympiad-g1-pattern-001', lesson: '彩珠规律桥', icon: '🧩', ability: '观察规律', difficulty: '启蒙', recommendation: '适合刚开始训练奥数思维，先建立“看一组、说规律”的习惯。' },
      { title: '巧算', skill: '凑十与拆分', levelCode: 'olympiad-g1-clever-calc-001', lesson: '凑十魔法糖', icon: '✨', ability: '计算策略', difficulty: '启蒙', recommendation: '适合练习把算式拆开，培养不硬算的策略感。' }
    ]
  },
  {
    grade: '二年级',
    subtitle: '把“有几种办法”和“图形怎么切”变成可操作的探索。',
    color: '#f2c14e',
    topics: [
      { title: '枚举法', skill: '不重复、不遗漏地数方案', levelCode: 'olympiad-g2-enumeration-001', lesson: '衣帽搭配站', icon: '🎒', ability: '逻辑推理', difficulty: '启蒙', recommendation: '适合训练按顺序列举，减少漏数和重复数。' },
      { title: '图形分割', skill: '观察分割后的形状数量', levelCode: 'olympiad-g2-shape-split-001', lesson: '披萨切切看', icon: '🔷', ability: '图形空间', difficulty: '启蒙', recommendation: '适合用动手想象训练空间观察。' }
    ]
  },
  {
    grade: '三年级',
    subtitle: '引入线段图和周期规律，让应用题开始有结构。',
    color: '#67cdb4',
    topics: [
      { title: '和差倍', skill: '用线段图看数量关系', levelCode: 'olympiad-g3-sum-diff-001', lesson: '彩带线段图', icon: '📏', ability: '模型应用', difficulty: '进阶', recommendation: '适合从文字题过渡到线段图模型。' },
      { title: '周期问题', skill: '找循环、算余数', levelCode: 'olympiad-g3-period-001', lesson: '灯笼循环街', icon: '🏮', ability: '观察规律', difficulty: '进阶', recommendation: '适合把规律观察推进到余数判断。' }
    ]
  },
  {
    grade: '四年级',
    subtitle: '开始接触经典奥数模型，用故事题训练推理表达。',
    color: '#4f7cff',
    topics: [
      { title: '鸡兔同笼', skill: '假设法与数量关系', levelCode: 'olympiad-g4-chicken-rabbit-001', lesson: '农场脚印谜题', icon: '🐰', ability: '模型应用', difficulty: '进阶', recommendation: '适合训练“先假设、再修正”的经典奥数方法。' },
      { title: '还原问题', skill: '倒推每一步', levelCode: 'olympiad-g4-reverse-001', lesson: '魔法盒倒推', icon: '🎁', ability: '逻辑推理', difficulty: '进阶', recommendation: '适合训练从结果倒推原因的逆向思维。' }
    ]
  },
  {
    grade: '五年级',
    subtitle: '从行程和数论切入，让高年级思维题更像策略游戏。',
    color: '#8f7df8',
    topics: [
      { title: '行程问题', skill: '速度、时间、路程建模', levelCode: 'olympiad-g5-travel-001', lesson: '双车相遇线', icon: '🚗', ability: '模型应用', difficulty: '挑战', recommendation: '适合训练把速度、时间、路程放到一条线里看。' },
      { title: '数论初步', skill: '因数、倍数与整除', levelCode: 'olympiad-g5-number-theory-001', lesson: '倍数星门', icon: '🔢', ability: '计算策略', difficulty: '挑战', recommendation: '适合建立因数倍数意识，为高年级数论打底。' }
    ]
  },
  {
    grade: '六年级',
    subtitle: '面向小升初思维训练，强化综合建模和严谨推理。',
    color: '#2f4858',
    topics: [
      { title: '工程问题', skill: '工作效率与总量关系', levelCode: 'olympiad-g6-work-001', lesson: '修桥协作队', icon: '🛠️', ability: '模型应用', difficulty: '挑战', recommendation: '适合训练把总工程看成 1 的抽象建模能力。' },
      { title: '逻辑推理', skill: '条件排除与真假判断', levelCode: 'olympiad-g6-logic-001', lesson: '侦探线索墙', icon: '🕵️', ability: '逻辑推理', difficulty: '挑战', recommendation: '适合训练逐个假设、排除矛盾的严谨表达。' }
    ]
  }
];

export const olympiadMethodSteps = [
  { title: '圈关键词', description: '先找数量、关系词和问题，避免一上来就乱算。', icon: '🔎' },
  { title: '画模型', description: '能画线段图、表格或示意图时，先把关系看见。', icon: '📐' },
  { title: '试策略', description: '用假设、倒推、枚举、周期等方法一步步验证。', icon: '🧠' },
  { title: '讲思路', description: '说清“为什么这样做”，比只写答案更重要。', icon: '🗣️' }
];

export const olympiadChapters: SubjectChapter[] = olympiadGrades.map((grade, index) => ({
  code: `olympiad-grade-${index + 1}`,
  stageLabel: '奥数训练',
  title: `${grade.grade}奥数星图`,
  subtitle: grade.subtitle,
  levels: grade.topics.map((topic, topicIndex) => ({
    code: topic.levelCode,
    title: topic.title,
    status: index === 0 && topicIndex === 0 ? 'recommended' : 'available'
  }))
}));

export const olympiadSubjectMap: SubjectMapData = {
  subjectCode: 'olympiad',
  subjectTitle: '奥数训练营',
  chapters: olympiadChapters
};
