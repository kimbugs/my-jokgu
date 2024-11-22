"use client";

import { useEffect, useState, useCallback } from "react";

interface Player {
  id: string;
  name: string;
}

interface PlayerStats {
  name: string;
  win: number;
  loss: number;
}

interface GameResult {
  id: string;
  date: string;
  winPlayers: { id: string; name: string }[];
  lossPlayers: { id: string; name: string }[];
}

const GameResults = () => {
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  ); // 초기값은 오늘 날짜
  const [gameResults, setGameResults] = useState<GameResult[]>([]);
  const [playerStats, setPlayerStats] = useState<PlayerStats[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState<GameResult | null>(null);
  const [allPlayers, setAllPlayers] = useState<Player[]>([]);

  // 날짜 변경 핸들러
  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(event.target.value);
  };

  // GameResult API 호출 및 플레이어 통계 계산
  const fetchGameResults = useCallback(async () => {
    try {
      const response = await fetch(`/api/game?date=${selectedDate}`);
      const data = await response.json();
      setGameResults(data);

      // 플레이어 승/패 통계 계산
      const stats: Record<string, PlayerStats> = {};

      data.forEach((game: GameResult) => {
        game.winPlayers.forEach((player) => {
          if (!stats[player.name]) {
            stats[player.name] = { name: player.name, win: 0, loss: 0 };
          }
          stats[player.name].win += 1;
        });

        game.lossPlayers.forEach((player) => {
          if (!stats[player.name]) {
            stats[player.name] = { name: player.name, win: 0, loss: 0 };
          }
          stats[player.name].loss += 1;
        });
      });

      setPlayerStats(Object.values(stats));
    } catch (error) {
      console.error("Failed to fetch game results:", error);
    }
  }, [selectedDate]);

  // 전체 플레이어 목록 가져오기
  const fetchAllPlayers = useCallback(async () => {
    try {
      const response = await fetch(`/api/player`);
      const data = await response.json();
      setAllPlayers(data);
    } catch (error) {
      console.error("Failed to fetch players:", error);
    }
  }, []);

  // GameResult API 호출 및 플레이어 통계 계산
  useEffect(() => {
    fetchGameResults();
    fetchAllPlayers();
  }, [fetchGameResults, fetchAllPlayers]); // 의존성 배열에 메모이제이션된 함수 추가

  // 게임 결과 삭제
  const handleDeleteGame = async (gameId: string) => {
    try {
      const response = await fetch(`/api/game/${gameId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setGameResults(gameResults.filter((game) => game.id !== gameId));
        fetchGameResults(); // 통계 재계산
      }
    } catch (error) {
      console.error("Failed to delete game:", error);
    }
  };

  // 게임 결과 수정
  const handleOpenEditModal = (game: GameResult) => {
    setSelectedGame(game);
    setIsModalOpen(true);
  };

  const handleEditGameSubmit = async () => {
    if (!selectedGame) return;

    try {
      const response = await fetch(`/api/game/${selectedGame.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date: selectedGame.date,
          winPlayerIds: selectedGame.winPlayers.map((p) => p.id),
          lossPlayerIds: selectedGame.lossPlayers.map((p) => p.id),
        }),
      });

      if (response.ok) {
        setIsModalOpen(false);
        fetchGameResults(); // 수정 후 데이터 갱신
      }
    } catch (error) {
      console.error("Failed to edit game:", error);
    }
  };

  const togglePlayerSelection = (
    player: Player,
    teamKey: "winPlayers" | "lossPlayers"
  ) => {
    if (!selectedGame) return;
    // 선택하려는 팀이 이미 다른 팀에 해당 플레이어가 있을 경우 선택을 막음
    const otherTeamKey =
      teamKey === "winPlayers" ? "lossPlayers" : "winPlayers";
    const isPlayerInOtherTeam = selectedGame[otherTeamKey].some(
      (p) => p.id === player.id
    );

    if (isPlayerInOtherTeam) {
      return; // 이미 다른 팀에 있으면 선택 불가능
    }

    const isSelected = selectedGame[teamKey].some((p) => p.id === player.id);

    setSelectedGame({
      ...selectedGame,
      [teamKey]: isSelected
        ? selectedGame[teamKey].filter((p) => p.id !== player.id)
        : [...selectedGame[teamKey], player],
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-4 flex flex-col gap-4">
      {/* 제목 및 날짜 선택 */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Game Results</h1>
        <input
          type="date"
          value={selectedDate}
          onChange={handleDateChange}
          className="border rounded-md p-2"
        />
      </div>

      <div className="p-4 border rounded-md shadow-md bg-white mb-4">
        {/* 총 게임 수 */}
        <p className="text-lg font-medium mb-4">
          Total Games: {gameResults.length}
        </p>

        {/* 플레이어별 승패를 작은 카드 형태로 나열 */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {playerStats
            .sort((a, b) => b.win - a.win) // 승리가 높은 순으로 정렬
            .map((player, index, arr) => {
              const isTopPlayer = index === 0; // 1등
              const isLastPlayer = index === arr.length - 1; // 꼴찌

              return (
                <div
                  key={player.name}
                  className={`border rounded-md p-2 shadow-sm flex items-center ${
                    isTopPlayer
                      ? "bg-green-100 border-green-500"
                      : isLastPlayer
                      ? "bg-red-100 border-red-500"
                      : "bg-gray-50"
                  }`}
                >
                  <span
                    className={`font-medium text-sm ${
                      isTopPlayer
                        ? "text-green-700"
                        : isLastPlayer
                        ? "text-red-700"
                        : "text-gray-800"
                    }`}
                  >
                    {index + 1}. {player.name} ({player.win} / {player.loss})
                  </span>
                </div>
              );
            })}
        </div>
      </div>

      {/* 게임 결과 카드 */}
      <div className="flex flex-col gap-4">
        {gameResults.length > 0 ? (
          gameResults.map((result, index) => (
            <div
              key={result.id}
              className="p-4 border rounded-md shadow-md bg-white flex flex-col"
            >
              <h2 className="text-lg font-bold mb-2">
                {gameResults.length - index}. Game Date:{" "}
                {new Date(result.date).toLocaleString()}
              </h2>
              <p className="text-sm mb-1">
                <strong>Winning Team:</strong>{" "}
                {result.winPlayers.map((player) => player.name).join(", ")}
              </p>
              <p className="text-sm">
                <strong>Losing Team:</strong>{" "}
                {result.lossPlayers.map((player) => player.name).join(", ")}
              </p>

              {/* 수정/삭제 버튼 */}
              <div className="mt-2 flex justify-end gap-2">
                <button
                  onClick={() => handleOpenEditModal(result)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteGame(result.id)}
                  className="px-4 py-2 bg-red-500 text-white rounded-md"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">
            No results found for this date.
          </p>
        )}
      </div>
      {/* 수정 모달 */}
      {isModalOpen && selectedGame && (
        <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-md w-96">
            <h2 className="text-lg font-bold mb-4">Edit Game</h2>
            <label className="block mb-4">
              Date:
              <input
                type="date"
                value={selectedGame.date.split("T")[0]}
                onChange={(e) =>
                  setSelectedGame({ ...selectedGame, date: e.target.value })
                }
                className="w-full border rounded-md p-2 mt-1"
              />
            </label>
            <div className="mb-4">
              <strong>Winning Team:</strong>
              <div className="flex flex-wrap gap-2 mt-2">
                {allPlayers.map((player) => {
                  const isSelected = selectedGame.winPlayers.some(
                    (p) => p.id === player.id
                  );
                  return (
                    <div
                      key={player.id}
                      onClick={() =>
                        togglePlayerSelection(player, "winPlayers")
                      }
                      className={`px-3 py-1 rounded-full cursor-pointer ${
                        isSelected
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {player.name}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="mb-4">
              <strong>Losing Team:</strong>
              <div className="flex flex-wrap gap-2 mt-2">
                {allPlayers.map((player) => {
                  const isSelected = selectedGame.lossPlayers.some(
                    (p) => p.id === player.id
                  );
                  return (
                    <div
                      key={player.id}
                      onClick={() =>
                        togglePlayerSelection(player, "lossPlayers")
                      }
                      className={`px-3 py-1 rounded-full cursor-pointer ${
                        isSelected
                          ? "bg-red-500 text-white"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {player.name}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleEditGameSubmit}
                className="px-4 py-2 bg-blue-500 text-white rounded-md"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameResults;
