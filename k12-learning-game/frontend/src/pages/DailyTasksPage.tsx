import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { claimDailyTask, getDailyTasks, type DailyTaskBoardData } from '../api';
import { PageTopBar } from '../components/PageTopBar';
import { useSession } from '../session';

interface DailyTasksPageProps {
  data?: DailyTaskBoardData;
}

export function DailyTasksPage({ data }: DailyTasksPageProps) {
  const [taskBoard, setTaskBoard] = useState<DailyTaskBoardData | null>(data ?? null);
  const [claimingTaskCode, setClaimingTaskCode] = useState<string | null>(null);
  const [claimMessage, setClaimMessage] = useState('');
  const { session } = useSession();

  useEffect(() => {
    if (data) {
      return;
    }

    getDailyTasks().then(setTaskBoard);
  }, [data, session?.childProfileId]);

  const handleClaimTask = async (taskCode: string) => {
    setClaimingTaskCode(taskCode);
    setClaimMessage('');

    try {
      const response = await claimDailyTask(taskCode);
      setTaskBoard(response.taskBoard);
      setClaimMessage(response.message);
    } catch {
      setClaimMessage('奖励领取暂时迷路了，请稍后再试一次。');
    } finally {
      setClaimingTaskCode(null);
    }
  };

  if (!taskBoard) {
    return <main className="screen"><p>正在整理今天的小任务...</p></main>;
  }

  return (
    <main className="screen screen-engagement">
      <PageTopBar backLabel="返回首页" backTo="/" />

      <section className="map-header engagement-hero">
        <p className="eyebrow">每日任务</p>
        <h1>{taskBoard.childNickname}的每日任务</h1>
        <p>每天只需要几步小冒险，把主线、复习和成就节奏轻轻串起来。</p>
        <div className="engagement-stat-row">
          <span>今日已完成 {taskBoard.completedCount} / {taskBoard.totalCount} 个任务</span>
          <span>全部完成可获得 {taskBoard.bonusStars} 颗奖励星星</span>
        </div>
        {claimMessage ? <p className="settlement-message" role="status">{claimMessage}</p> : null}
      </section>

      <section className="daily-task-grid">
        {taskBoard.tasks.map((task) => (
          <article className={`daily-task-card ${task.completed ? 'daily-task-card-done' : ''}`} key={task.code}>
            <div>
              <span className="engagement-pill">{task.taskType}</span>
              <h2>{task.title}</h2>
              <p>{task.description}</p>
            </div>
            <div className="daily-task-footer">
              <strong>{task.statusLabel}</strong>
              <span>{task.rewardText}</span>
              {task.rewardClaimed ? <span className="reward-claimed-pill">已领取</span> : null}
              {task.claimable ? (
                <button
                  className="cta-button reward-claim-button"
                  disabled={claimingTaskCode === task.code}
                  type="button"
                  onClick={() => void handleClaimTask(task.code)}
                >
                  {claimingTaskCode === task.code ? '领取中...' : `领取${task.title}奖励`}
                </button>
              ) : null}
              {task.targetLevelCode ? (
                <Link className="cta-button cta-button-secondary" to={`/levels/${task.targetLevelCode}`}>
                  去完成{task.title}
                </Link>
              ) : null}
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
