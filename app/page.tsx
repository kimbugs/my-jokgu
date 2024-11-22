"use client";
import { useEffect, useState } from "react";

interface Player {
  id: string;
  name: string;
  win: number;
  loss: number;
  selected: boolean;
}

const TodaysGame = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [team1, setTeam1] = useState<Player[]>([]);
  const [team2, setTeam2] = useState<Player[]>([]);
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([]);
  const [winningTeam, setWinningTeam] = useState<"team1" | "team2" | null>(
    null
  );
  const [recentGameResult, setRecentGameResult] = useState<{
    date: string;
    winPlayers: string[];
    lossPlayers: string[];
  } | null>(null);

  // 로딩 상태 추가
  const [loading, setLoading] = useState<boolean>(false);

  // 페이지 로드 시 Local Storage에서 저장된 플레이어와 팀 정보 불러오기
  useEffect(() => {
    const storedPlayers = localStorage.getItem("selectedPlayers");
    const storedTeam1 = localStorage.getItem("team1");
    const storedTeam2 = localStorage.getItem("team2");
    const storedWinningTeam = localStorage.getItem("winningTeam");

    // 플레이어 API 호출
    const fetchPlayers = async () => {
      try {
        const response = await fetch("/api/player"); // API URL 변경
        const data = await response.json();
        setPlayers(data);

        // LocalStorage에 저장된 선택된 플레이어가 있을 경우
        if (storedPlayers) {
          const selectedFromLocalStorage = JSON.parse(storedPlayers);
          setSelectedPlayers(selectedFromLocalStorage);

          // players 상태에서 selected 상태 업데이트
          const updatedPlayers = data.map((player: { id: string }) => ({
            ...player,
            selected: selectedFromLocalStorage.some(
              (selectedPlayer: Player) => selectedPlayer.id === player.id
            ),
          }));
          setPlayers(updatedPlayers);
        }
      } catch (error) {
        console.error("Failed to fetch players:", error);
      }
    };

    fetchPlayers();

    if (storedTeam1) {
      setTeam1(JSON.parse(storedTeam1));
    }
    if (storedTeam2) {
      setTeam2(JSON.parse(storedTeam2));
    }
    if (storedWinningTeam) {
      setWinningTeam(storedWinningTeam === "team1" ? "team1" : "team2");
    }
  }, []);

  // 플레이어 선택 핸들러
  const togglePlayerSelection = (playerId: string) => {
    const updatedPlayers = players.map((player) => {
      if (player.id === playerId) {
        player.selected = !player.selected;
      }
      return player;
    });

    setPlayers(updatedPlayers);

    const selected = updatedPlayers.filter((player) => player.selected);
    setSelectedPlayers(selected);

    // Local Storage에 선택된 플레이어 저장
    localStorage.setItem("selectedPlayers", JSON.stringify(selected));
  };

  // 팀 분배 핸들러
  const randomizeTeams = () => {
    // 승리팀 초기화
    setWinningTeam(null);

    const shuffledPlayers = [...selectedPlayers].sort(
      () => Math.random() - 0.5
    );
    const newTeam1 = shuffledPlayers.slice(0, shuffledPlayers.length / 2);
    const newTeam2 = shuffledPlayers.slice(shuffledPlayers.length / 2);
    setTeam1(newTeam1);
    setTeam2(newTeam2);

    // Local Storage에 팀 정보 저장
    localStorage.setItem("team1", JSON.stringify(newTeam1));
    localStorage.setItem("team2", JSON.stringify(newTeam2));
    localStorage.setItem("winningTeam", "");
  };

  // 팀 승리 처리
  const handleTeamSelection = (team: "team1" | "team2") => {
    setWinningTeam(team);

    // Local Storage에 승리 팀 정보 저장
    localStorage.setItem("winningTeam", team);
  };

  // 승률 계산 함수
  const calculateWinRate = (win: number, loss: number) => {
    return win + loss === 0 ? 0 : (win / (win + loss)) * 100;
  };

  // 팀 평균 승률 계산 함수 (승률이 0%인 플레이어 제외)
  const calculateTeamAverageWinRate = (team: Player[]) => {
    const validPlayers = team.filter(
      (player) => calculateWinRate(player.win, player.loss) > 0
    ); // 0% 승률 제외
    if (validPlayers.length === 0) return "0"; // 유효한 플레이어가 없으면 0%
    const totalWinRate = validPlayers.reduce(
      (sum, player) => sum + calculateWinRate(player.win, player.loss),
      0
    );
    return (totalWinRate / validPlayers.length).toFixed(2);
  };

  // GameResult 저장하는 함수
  const saveGameResult = async () => {
    const winPlayerIds = (winningTeam === "team1" ? team1 : team2).map(
      (player) => player.id
    );
    const lossPlayerIds = (winningTeam === "team1" ? team2 : team1).map(
      (player) => player.id
    );

    setLoading(true);

    // API를 통해 게임 결과 저장
    try {
      const response = await fetch("/api/game", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ winPlayerIds, lossPlayerIds }),
      });

      if (response.ok) {
        // const result = await response.json();

        // 최근 저장한 GameResult 내용을 업데이트
        setRecentGameResult({
          date: new Date().toLocaleString(),
          // date: result.date,
          winPlayers: (winningTeam === "team1" ? team1 : team2).map(
            (player) => player.name
          ),
          lossPlayers: (winningTeam === "team1" ? team2 : team1).map(
            (player) => player.name
          ),
        });
        // 팀 및 승리 상태 초기화
        setTeam1([]);
        setTeam2([]);
        setWinningTeam(null);

        // Local Storage 초기화
        localStorage.removeItem("team1");
        localStorage.removeItem("team2");
        localStorage.removeItem("winningTeam");
        console.log("Game result saved successfully");
      } else {
        console.error("Failed to save game result");
      }
    } catch (error) {
      console.error("Error saving game result:", error);
    } finally {
      // 로딩 상태 종료
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 bg-white shadow-md rounded-md">
      <h2 className="text-xl font-semibold text-center mb-4">
        Today Game ({new Date().toLocaleDateString()})
      </h2>

      {/* 플레이어 선택 */}
      <div className="mb-6 flex flex-wrap gap-2 justify-center">
        {players.map((player) => (
          <button
            key={player.id}
            onClick={() => togglePlayerSelection(player.id)}
            className={`px-4 py-2 rounded-full text-sm ${
              player.selected
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {player.name}
          </button>
        ))}
      </div>

      {/* 팀 분배 버튼 */}
      <div className="text-center mb-6">
        <button
          onClick={randomizeTeams}
          disabled={selectedPlayers.length < 2}
          className="px-4 py-2 bg-green-500 text-white rounded-md"
        >
          Randomize Teams
        </button>
      </div>

      {/* 팀 1과 팀 2 카드 */}
      {team1.length > 0 && team2.length > 0 && (
        <div className="grid grid-cols-2 gap-4">
          <div
            className={`p-4 rounded-md ${
              winningTeam === "team1" ? "bg-green-100" : "bg-gray-100"
            }`}
            onClick={() => handleTeamSelection("team1")}
          >
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold mb-2">Team 1</h3>
              <span className="text-sm text-gray-700">
                {calculateTeamAverageWinRate(team1)}%
              </span>
            </div>
            <ul className="list-disc pl-5">
              {team1.map((player) => (
                <li key={player.id} className="text-sm">
                  {player.name}
                </li>
              ))}
            </ul>
            {winningTeam === "team1" && (
              <div className="mt-2 text-green-600 font-semibold">
                Winning Team!
              </div>
            )}
          </div>

          <div
            className={`p-4 rounded-md ${
              winningTeam === "team2" ? "bg-green-100" : "bg-gray-100"
            }`}
            onClick={() => handleTeamSelection("team2")}
          >
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold mb-2">Team 2</h3>
              <span className="text-sm text-gray-700">
                {calculateTeamAverageWinRate(team2)}%
              </span>
            </div>
            <ul className="list-disc pl-5">
              {team2.map((player) => (
                <li key={player.id} className="text-sm">
                  {player.name}
                </li>
              ))}
            </ul>
            {winningTeam === "team2" && (
              <div className="mt-2 text-green-600 font-semibold">
                Winning Team!
              </div>
            )}
          </div>
        </div>
      )}
      {/* 저장 버튼 */}
      <div className="text-center mt-6">
        <button
          onClick={saveGameResult}
          disabled={loading || !winningTeam}
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          {loading ? <span>Saving...</span> : <span>Save Game Result</span>}
        </button>
      </div>
      {/* 최근 저장한 GameResult 표시 */}
      {recentGameResult && (
        <div className="mt-6 p-4 bg-gray-100 text-gray-800 rounded-md">
          <p className="text-lg">
            <strong>Recent Game</strong>
          </p>
          <p className="text-sm">
            <strong>Date:</strong> {recentGameResult.date}
          </p>
          <p className="text-sm">
            <strong>Winning Team:</strong>{" "}
            {recentGameResult.winPlayers.join(", ")}
          </p>
          <p className="text-sm">
            <strong>Losing Team:</strong>{" "}
            {recentGameResult.lossPlayers.join(", ")}
          </p>
        </div>
      )}
    </div>
  );
};

export default TodaysGame;
