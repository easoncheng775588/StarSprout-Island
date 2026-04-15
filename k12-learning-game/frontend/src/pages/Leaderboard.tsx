import { useEffect, useState } from 'react';
import { getLeaderboard, type LeaderboardData } from '../api';
import { PageBackLink } from '../components/PageBackLink';

interface LeaderboardProps {
  data?: LeaderboardData;
}

export function Leaderboard({ data }: LeaderboardProps) {
  const [board, setBoard] = useState<LeaderboardData | null>(data ?? null);
  const [selectedBoardType, setSelectedBoardType] = useState(data?.boardType ?? 'weekly_star');

  useEffect(() => {
    if (data) {
      setBoard(data);
      setSelectedBoardType(data.boardType);
      return;
    }

    getLeaderboard(selectedBoardType).then(setBoard);
  }, [data, selectedBoardType]);

  if (!board) {
    return <main className="screen"><p>正在整理本周排行榜...</p></main>;
  }

  return (
    <main className="screen screen-leaderboard">
      <PageBackLink label="返回首页" to="/" />

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
          <h2>第 {board.myRank.rank} 名</h2>
          <p>{board.myRank.nickname}，{board.myRank.trendLabel}</p>
        </article>
      </section>

      <section className="dashboard-grid">
        <article className="panel-card">
          <p className="eyebrow">前排选手</p>
          <div className="rank-list">
            {board.topPlayers.map((player) => (
              <div className="rank-card" key={`${player.rank}-${player.nickname}`}>
                <strong>#{player.rank} {player.nickname}</strong>
                <p>{player.stars} 颗星星</p>
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
                <p>{player.stars} 颗星星</p>
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
