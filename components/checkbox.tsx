"use client";
import { useState } from "react";

type CheckboxListProps = {
  options: string[];
};

const CheckboxList = ({ options }: CheckboxListProps) => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [team1, setTeam1] = useState<string[]>([]);
  const [team2, setTeam2] = useState<string[]>([]);
  const [winningTeam, setWinningTeam] = useState<"team1" | "team2" | null>(
    null
  );

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

  // 승리 팀 선택
  const handleVictory = (team: "team1" | "team2") => {
    setWinningTeam(team);
  };

  return (
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
      {/* 승리 팀 선택 버튼 */}
      {team1.length > 0 && team2.length > 0 && (
        <div className="mt-4">
          <button
            onClick={() => handleVictory("team1")}
            className={`px-6 py-3 ${
              winningTeam === "team1" ? "bg-blue-500" : "bg-gray-400"
            } text-white rounded-full mr-4`}
          >
            Team 1 Wins
          </button>
          <button
            onClick={() => handleVictory("team2")}
            className={`px-6 py-3 ${
              winningTeam === "team2" ? "bg-blue-500" : "bg-gray-400"
            } text-white rounded-full`}
          >
            Team 2 Wins
          </button>
        </div>
      )}
      {/* 선택된 항목을 두 팀으로 나누어서 카드 형태로 출력 */}
      {selectedItems.length > 0 && (
        <div className="mt-8 flex space-x-8">
          {/* Team 1 */}
          <div
            className={`flex-1 ${
              winningTeam === "team1" ? "border-4 border-blue-500" : ""
            }`}
          >
            <h3 className="text-lg font-semibold mb-4">Team 1</h3>
            <div className="space-y-2">
              {team1.length === 0 ? (
                <div className="text-gray-500 text-sm">No members selected</div>
              ) : (
                team1.map((member) => (
                  <div
                    key={member}
                    className="p-2 text-sm border rounded-lg shadow-md bg-white"
                  >
                    {member}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Team 2 */}
          <div
            className={`flex-1 ${
              winningTeam === "team2" ? "border-4 border-blue-500" : ""
            }`}
          >
            <h3 className="text-lg font-semibold mb-4">Team 2</h3>
            <div className="space-y-2">
              {team2.length === 0 ? (
                <div className="text-gray-500 text-sm">No members selected</div>
              ) : (
                team2.map((member) => (
                  <div
                    key={member}
                    className="p-2 text-sm border rounded-lg shadow-md bg-white"
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
          <p className={`text-${winningTeam === "team1" ? "blue" : "red"}-500`}>
            {winningTeam === "team1" ? "Team 1 Wins!" : "Team 2 Wins!"}
          </p>
        </div>
      )}
      {/* <div className="grid gap-4">
        <div key="a" className="border p-4 rounded-lg shadow">
          <p className="font-bold">a"</p>
          <p className="text-gray-600">b</p>
          <p className="text-sm text-gray-500">
            Joined: {new Date().toLocaleString()}
          </p>
        </div>
      </div> */}
    </div>
  );
};

export default CheckboxList;
