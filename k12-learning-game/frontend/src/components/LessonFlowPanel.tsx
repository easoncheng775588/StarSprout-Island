interface LessonFlowPanelProps {
  completedStepCount: number;
  hasExplainer: boolean;
  isRewardVisible: boolean;
  isStepPracticeComplete: boolean;
  stepCount: number;
}

const lessonFlowItems = [
  {
    key: 'explain',
    title: '动画讲解',
    description: '先看模型，知道这一关在学什么。',
    icon: '▶'
  },
  {
    key: 'practice',
    title: '互动练习',
    description: '动手拖一拖、选一选，把想法变成答案。',
    icon: '✦'
  },
  {
    key: 'review',
    title: '复盘小结',
    description: '完成步骤后，回头说清楚解题方法。',
    icon: '✓'
  },
  {
    key: 'reward',
    title: '星光奖励',
    description: '领取星星、徽章和下一关鼓励。',
    icon: '★'
  }
] as const;

export function LessonFlowPanel({
  completedStepCount,
  hasExplainer,
  isRewardVisible,
  isStepPracticeComplete,
  stepCount
}: LessonFlowPanelProps) {
  const progressLabel = `${completedStepCount} / ${stepCount} 个练习步骤已点亮`;

  function getItemState(key: (typeof lessonFlowItems)[number]['key']) {
    if (key === 'explain') {
      return hasExplainer || completedStepCount > 0 ? 'done' : 'active';
    }

    if (key === 'practice') {
      return isStepPracticeComplete ? 'done' : 'active';
    }

    if (key === 'review') {
      return isRewardVisible ? 'done' : isStepPracticeComplete ? 'active' : 'upcoming';
    }

    return isRewardVisible ? 'active' : 'upcoming';
  }

  return (
    <section className="lesson-flow-panel" aria-label="数学小课路线">
      <div className="lesson-flow-header">
        <div>
          <p className="eyebrow">结构化小课</p>
          <h2>本节小课路线</h2>
        </div>
        <p>{progressLabel}</p>
      </div>
      <div className="lesson-flow-track">
        {lessonFlowItems.map((item, index) => {
          const state = getItemState(item.key);

          return (
            <article className={`lesson-flow-item lesson-flow-item-${state}`} key={item.key}>
              <span className="lesson-flow-index">{index + 1}</span>
              <span className="lesson-flow-icon" aria-hidden="true">{item.icon}</span>
              <div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
