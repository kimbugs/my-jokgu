import CheckboxList from "@/components/checkbox";

export default function Game() {
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
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-xl font-bold">
          오늘의 게임 ({new Date().toLocaleDateString()})
        </h1>
      </div>
      <div className="grid gap-4">
        <div className="border p-1 rounded-lg shadow">
          <CheckboxList options={options} />
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
