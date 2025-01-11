"use client";
import { useEffect, useState } from "react";

interface Player {
  id: string;
  name: string;
  winsByYear: { [year: number]: number };
  lossesByYear: { [year: number]: number };
}

// 승률 계산 함수 (특정 연도의 승률을 계산)
const calculateWinRate = (wins: number, losses: number): number => {
  const totalGames = wins + losses;
  if (totalGames === 0) return 0;
  return (wins / totalGames) * 100;
};

const PlayerList = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<"wins" | "winRate">("winRate");
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  ); // 기본 연도는 현재 연도

  useEffect(() => {
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

  // 선택한 연도의 승률 계산 함수
  const getWinLossForYear = (player: Player, year: number) => {
    return {
      wins: player.winsByYear[year] || 0,
      losses: player.lossesByYear[year] || 0,
    };
  };

  // 승률 또는 승 수로 정렬하는 함수
  const sortPlayersByWins = (players: Player[]) => {
    return [...players].sort((a, b) => {
      const aWinLoss = getWinLossForYear(a, selectedYear);
      const bWinLoss = getWinLossForYear(b, selectedYear);
      return bWinLoss.wins - aWinLoss.wins;
    });
  };

  const sortPlayersByWinRate = (players: Player[]) => {
    return [...players].sort((a, b) => {
      const aWinLoss = getWinLossForYear(a, selectedYear);
      const bWinLoss = getWinLossForYear(b, selectedYear);
      return (
        calculateWinRate(bWinLoss.wins, bWinLoss.losses) -
        calculateWinRate(aWinLoss.wins, aWinLoss.losses)
      );
    });
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
      const winLoss = getWinLossForYear(player, selectedYear);
      const winRate = calculateWinRate(winLoss.wins, winLoss.losses);

      if (index > 0) {
        const prevPlayer = players[index - 1];
        const prevWinLoss = getWinLossForYear(prevPlayer, selectedYear);
        const prevWinRate = calculateWinRate(
          prevWinLoss.wins,
          prevWinLoss.losses
        );

        if (
          (sortOption === "wins" && prevWinLoss.wins === winLoss.wins) ||
          (sortOption === "winRate" && prevWinRate === winRate)
        ) {
          rank = index + 1;
        } else {
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
        <div className="flex items-center justify-center space-x-4">
          <div className="flex items-center space-x-2">
            <label htmlFor="sortOption" className="text-sm font-medium">
              Sort by:
            </label>
            <select
              id="sortOption"
              value={sortOption}
              onChange={(e) =>
                setSortOption(e.target.value as "wins" | "winRate")
              }
              className="p-2 border rounded-md text-sm"
            >
              <option value="wins">Wins</option>
              <option value="winRate">Win Rate</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <label htmlFor="year" className="text-sm font-medium">
              Select Year:
            </label>
            <select
              id="year"
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="p-2 border rounded-md text-sm"
            >
              {Array.from({ length: 5 }).map((_, i) => {
                const year = new Date().getFullYear() - i;
                return (
                  <option key={year} value={year}>
                    {year}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
      </div>

      {rankedPlayers.length === 0 ? (
        <div className="text-center text-sm text-gray-500">
          No players found
        </div>
      ) : (
        <ul className="space-y-3">
          {rankedPlayers.map((player) => {
            const winLoss = getWinLossForYear(player, selectedYear);
            const winRate = calculateWinRate(winLoss.wins, winLoss.losses);
            const totalGames = winLoss.wins + winLoss.losses;

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
                  <span className="text-green-500">Wins: {winLoss.wins}</span>
                  <span className="text-red-500">Losses: {winLoss.losses}</span>
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
