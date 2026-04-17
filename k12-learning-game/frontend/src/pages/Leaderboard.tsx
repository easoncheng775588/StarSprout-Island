import { useEffect, useState } from 'react';
import { getLeaderboard, type LeaderboardData } from '../api';
import { PageTopBar } from '../components/PageTopBar';
import { useSession } from '../session';

interface LeaderboardProps {
  data?: LeaderboardData;
}

export function Leaderboard({ data }: LeaderboardProps) {
  const [board, setBoard] = useState<LeaderboardData | null>(data ?? null);
  const [selectedBoardType, setSelectedBoardType] = useState(data?.boardType ?? 'weekly_star');
  const { session } = useSession();

  useEffect(() => {
    if (data) {
      setBoard(data);
      setSelectedBoardType(data.boardType);
      return;
    }

    getLeaderboard(selectedBoardType).then(setBoard);
  }, [data, selectedBoardType, session?.childProfileId]);

  if (!board) {
    return <main className="screen"><p>正在整理本周排行榜...</p></main>;
  }

  return (
    <main className="screen screen-leaderboard">
      <PageTopBar backLabel="返回首页" backTo="/" />

      <section className="map-header">
        <p className="eyebrow">排行榜</p>
        <h1>{board.boardTitle}</h1>
        <p>轻竞技、低压力，只看成长和进步，不放大比较焦虑。</p>
      </section>

      <section className="board-tabs">
        <button
          className={`tab-chip ${selectedBoardType === 'weekly_star' ? 'tab-chip-active' : ''}`}
          onClick={() => setSelectedBoardType('weekly_star')}
          type="button"
        >
          本周星星榜
        </button>
        <button
          className={`tab-chip ${selectedBoardType === 'streak_master' ? 'tab-chip-active' : ''}`}
          onClick={() => setSelectedBoardType('streak_master')}
          type="button"
        >
          连续学习榜
        </button>
        <button
          className={`tab-chip ${selectedBoardType === 'challenge_hero' ? 'tab-chip-active' : ''}`}
          onClick={() => setSelectedBoardType('challenge_hero')}
          type="button"
        >
          挑战达人榜
        </button>
      </section>

      <section className="summary-grid">
        <article className="summary-card">
          <span className="node-step">我的排名</span>
          <h2>{board.participationEnabled ? `第 ${board.myRank.rank} 名` : '榜单展示已暂停'}</h2>
          <p>{board.myRank.nickname}，{board.myRank.trendLabel}</p>
        </article>
        <article className="summary-card">
          <span className="node-step">结算说明</span>
          <h2>{board.settlementWindowLabel}</h2>
          <p>{board.updatedAtLabel}</p>
        </article>
        <article className="summary-card">
          <span className="node-step">下一目标</span>
          <h2>继续往前冲</h2>
          <p>{board.participationEnabled ? board.nextTargetText : '可在家长中心重新开启参与'}</p>
        </article>
      </section>

      {!board.participationEnabled ? (
        <section className="panel-card">
          <p className="eyebrow">当前状态</p>
          <h2>未参与排行榜</h2>
          <p>{board.nextTargetText}</p>
        </section>
      ) : null}

      <section className="dashboard-grid">
        <article className="panel-card">
          <p className="eyebrow">前排选手</p>
          <div className="rank-list">
            {board.topPlayers.map((player) => (
              <div className="rank-card" key={`${player.rank}-${player.nickname}`}>
                <strong>#{player.rank} {player.nickname}</strong>
                <p>{player.stars} {board.metricUnit}</p>
                <span>{player.trendLabel}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="panel-card">
          <p className="eyebrow">你附近的排名</p>
          <div className="rank-list">
            {board.nearbyPlayers.map((player) => (
              <div className={`rank-card ${player.nickname === board.myRank.nickname ? 'rank-card-self' : ''}`} key={`${player.rank}-${player.nickname}`}>
                <strong>#{player.rank} {player.nickname}</strong>
                <p>{player.stars} {board.metricUnit}</p>
                <span>{player.trendLabel}</span>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="panel-card">
        <p className="eyebrow">隐私提示</p>
        <p>{board.privacyTip}</p>
      </section>
    </main>
  );
}
