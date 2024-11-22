"use client";
import { useEffect, useState } from "react";

interface Player {
  id: string;
  name: string;
  win: number;
  loss: number;
}

// 승률 계산 함수
const calculateWinRate = (win: number, loss: number): number => {
  const totalGames = win + loss;
  if (totalGames === 0) return 0;
  return (win / totalGames) * 100;
};

const PlayerList = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<"wins" | "winRate">("winRate"); // 정렬 기준 상태 추가

  useEffect(() => {
    // 서버에서 플레이어 목록을 가져옵니다.
    const fetchPlayers = async () => {
      try {
        const response = await fetch("/api/player");
        const data = await response.json();

        if (response.ok) {
          setPlayers(data);
        } else {
          setError(data.message || "Failed to fetch players");
        }
      } catch {
        setError("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, []);

  if (loading) {
    return <div className="text-center text-sm text-gray-500">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-sm text-red-500">{error}</div>;
  }

  // 승률 또는 승 수로 정렬하는 함수
  const sortPlayersByWins = (players: Player[]) => {
    return [...players].sort((a, b) => b.win - a.win); // 승 수 기준 내림차순
  };

  const sortPlayersByWinRate = (players: Player[]) => {
    return [...players].sort(
      (a, b) =>
        calculateWinRate(b.win, b.loss) - calculateWinRate(a.win, a.loss)
    ); // 승률 기준 내림차순
  };

  // 정렬 기준에 따른 플레이어 목록
  const sortedPlayers =
    sortOption === "wins"
      ? sortPlayersByWins(players)
      : sortPlayersByWinRate(players);

  // 등수 부여 함수 (동일한 값에 대해서도 순위가 올라가도록)
  const assignRanks = (players: Player[]) => {
    let rank = 1;
    return players.map((player, index) => {
      const winRate = calculateWinRate(player.win, player.loss);
      // const totalGames = player.win + player.loss;

      // 첫 번째 값이 아니면, 이전 값과 비교하여 순위를 부여
      if (index > 0) {
        const prevPlayer = players[index - 1];
        const prevWinRate = calculateWinRate(prevPlayer.win, prevPlayer.loss);
        const prevWin = prevPlayer.win;

        if (
          (sortOption === "wins" && prevWin === player.win) ||
          (sortOption === "winRate" && prevWinRate === winRate)
        ) {
          // 동일한 값일 경우, 동일한 순위
          rank = index + 1;
        } else {
          // 다르면 순위 증가
          rank = index + 1;
        }
      }

      return { ...player, rank };
    });
  };

  const rankedPlayers = assignRanks(sortedPlayers);

  return (
    <div className="max-w-2xl mx-auto p-4 text-gray-700 bg-white shadow-md rounded-md">
      <h2 className="text-xl font-semibold text-center mb-3">Player List</h2>

      {/* 정렬 기준 선택 UI */}
      <div className="mb-4 text-center">
        <label htmlFor="sortOption" className="mr-2 text-sm font-medium">
          Sort by:
        </label>
        <select
          id="sortOption"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value as "wins" | "winRate")}
          className="p-2 border rounded-md text-sm"
        >
          <option value="wins">Wins</option>
          <option value="winRate">Win Rate</option>
        </select>
      </div>

      {rankedPlayers.length === 0 ? (
        <div className="text-center text-sm text-gray-500">
          No players found
        </div>
      ) : (
        <ul className="space-y-3">
          {rankedPlayers.map((player) => {
            const winRate = calculateWinRate(player.win, player.loss);
            const totalGames = player.win + player.loss; // 총 전적

            return (
              <li
                key={player.id}
                className="flex justify-between p-3 bg-gray-50 rounded-md shadow-sm"
              >
                <span className="text-sm font-medium">
                  {player.rank}. {player.name}
                </span>
                <div className="flex items-center space-x-3 text-xs">
                  <span className="text-gray-500">Total: {totalGames}</span>
                  <span className="text-green-500">Wins: {player.win}</span>
                  <span className="text-red-500">Losses: {player.loss}</span>
                  <span className="text-blue-500">
                    Win Rate: {winRate.toFixed(2)}%
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default PlayerList;
