"use client";
import { useState, useEffect } from "react";

const STORAGE_KEY = "checkboxListState";

export default function Main() {
  const options = [
    "강산",
    "커두",
    "바키",
    "푸름",
    "영쿠",
    "서재",
    "빵길",
    "성현",
    "광해",
    "영호",
    "승민",
  ];
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [team1, setTeam1] = useState<string[]>([]);
  const [team2, setTeam2] = useState<string[]>([]);
  const [winningTeam, setWinningTeam] = useState<"team1" | "team2" | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  // 초기 로드 시 Local Storage에서 상태 복원
  useEffect(() => {
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (savedState) {
      try {
        const { selectedItems, team1, team2, winningTeam } =
          JSON.parse(savedState);
        setSelectedItems(selectedItems || []);
        setTeam1(team1 || []);
        setTeam2(team2 || []);
        setWinningTeam(winningTeam || null);
      } catch (error) {
        console.error("Error parsing localStorage data:", error);
      }
    }
    setLoading(false);
  }, []);

  // 상태 변경 시 Local Storage에 저장
  useEffect(() => {
    if (!loading) {
      const state = { selectedItems, team1, team2, winningTeam };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [selectedItems, team1, team2, winningTeam, loading]);

  // 선택 또는 해제된 항목 처리
  const handleTagClick = (item: string) => {
    setSelectedItems((prevSelectedItems) => {
      if (prevSelectedItems.includes(item)) {
        // 이미 선택된 항목이 클릭되면 제거
        return prevSelectedItems.filter(
          (selectedItem) => selectedItem !== item
        );
      } else {
        // 선택되지 않은 항목이 클릭되면 추가
        return [...prevSelectedItems, item];
      }
    });
  };

  // 랜덤으로 팀 나누기
  const handleRandomTeams = () => {
    const shuffledItems = [...selectedItems].sort(() => Math.random() - 0.5);
    const midIndex = Math.ceil(shuffledItems.length / 2);
    setTeam1(shuffledItems.slice(0, midIndex));
    setTeam2(shuffledItems.slice(midIndex));
    setWinningTeam(null); // 팀을 나누면 승리 팀은 초기화
  };

  // 팀 카드 클릭 시 승리 팀 설정
  const handleCardClick = (team: "team1" | "team2") => {
    setWinningTeam(team);
  };

  if (loading) {
    // 로딩 중일 때 간단한 로딩 UI 표시
    return <div className="text-center text-gray-500">Loading...</div>;
  }
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-xl font-bold">
          오늘의 게임 ({new Date().toLocaleDateString()})
        </h1>
      </div>
      <div className="grid gap-4">
        <div className="border p-1 rounded-lg shadow">
          <div className="p-1">
            <h2 className="text-xl font-semibold">인원</h2>

            {/* 태그 형태의 선택 항목 */}
            <div className="flex flex-wrap gap-4 mt-4">
              {options.map((option) => (
                <button
                  key={option}
                  onClick={() => handleTagClick(option)}
                  className={`px-4 py-2 rounded-full cursor-pointer transition-all ${
                    selectedItems.includes(option)
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-black"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>

            {/* 선택된 항목 출력 */}
            <div className="mt-4">
              <strong>참여자:</strong>{" "}
              {selectedItems.length > 0 ? selectedItems.join(", ") : "None"}
            </div>
            <div className="mt-4">
              <button
                onClick={handleRandomTeams}
                className="btn-neutral btn btn-block"
              >
                랜덤게임
              </button>
            </div>

            {/* 두 팀 카드 출력 */}
            {selectedItems.length > 0 && (
              <div className="mt-8 grid grid-cols-2 gap-4">
                {/* Team 1 */}
                <div
                  onClick={() => handleCardClick("team1")}
                  className={`p-4 border rounded-lg shadow-md cursor-pointer transition-all ${
                    winningTeam === "team1"
                      ? "border-blue-500 bg-blue-100 dark:border-blue-700 dark:bg-blue-900"
                      : "border-gray-300 dark:border-gray-700 dark:bg-gray-800"
                  }`}
                >
                  <h3 className="text-lg font-semibold mb-4 text-center text-gray-800 dark:text-white">
                    Team 1
                  </h3>
                  <div className="space-y-2">
                    {team1.length === 0 ? (
                      <div className="text-gray-500 text-sm text-center dark:text-gray-400">
                        No members selected
                      </div>
                    ) : (
                      team1.map((member) => (
                        <div
                          key={member}
                          className="p-2 text-sm border rounded-lg shadow bg-gray-100 dark:bg-gray-700 dark:text-white"
                        >
                          {member}
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Team 2 */}
                <div
                  onClick={() => handleCardClick("team2")}
                  className={`p-4 border rounded-lg shadow-md cursor-pointer transition-all ${
                    winningTeam === "team2"
                      ? "border-blue-500 bg-blue-100 dark:border-blue-700 dark:bg-blue-900"
                      : "border-gray-300 dark:border-gray-700 dark:bg-gray-800"
                  }`}
                >
                  <h3 className="text-lg font-semibold mb-4 text-center text-gray-800 dark:text-white">
                    Team 2
                  </h3>
                  <div className="space-y-2">
                    {team2.length === 0 ? (
                      <div className="text-gray-500 text-sm text-center dark:text-gray-400">
                        No members selected
                      </div>
                    ) : (
                      team2.map((member) => (
                        <div
                          key={member}
                          className="p-2 text-sm border rounded-lg shadow bg-gray-100 dark:bg-gray-700 dark:text-white"
                        >
                          {member}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 승리 팀 표시 */}
            {winningTeam && (
              <div className="mt-4 text-xl font-bold text-center">
                <p
                  className={`text-${
                    winningTeam === "team1" ? "blue" : "red"
                  }-500`}
                >
                  {winningTeam === "team1" ? "Team 1 Wins!" : "Team 2 Wins!"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="grid gap-4">
        <div key="a" className="border p-4 rounded-lg shadow">
          <p className="font-bold">a</p>
          <p className="text-gray-600">b</p>
          <p className="text-sm text-gray-500">
            Joined: {new Date().toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}
