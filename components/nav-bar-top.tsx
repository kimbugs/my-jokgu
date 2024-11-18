export default function TopNav() {
  return (
    <div className="navbar shadow-lg">
      {/* 왼쪽: 메뉴 아이콘과 이름 */}
      <div className="flex-1">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost btn-circle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block w-5 h-5 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </label>
          <ul
            tabIndex={0}
            className="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52"
          >
            <li>
              <a href="#">Home</a>
            </li>
            <li>
              <a href="#">About</a>
            </li>
            <li>
              <a href="#">Contact</a>
            </li>
          </ul>
        </div>
        <span className="text-lg font-bold ml-2">MyApp</span>
      </div>

      {/* 오른쪽: 사용자 정보 */}
      <div className="flex-none">
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            className="btn btn-ghost btn-circle avatar bg-gray-400 placeholder"
          >
            <div className="bg-neutral text-neutral-content w-12 rounded-full">
              <span className="text-xl">강산</span>
            </div>
          </div>
          <ul
            tabIndex={0}
            className="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52"
          >
            <li>
              <a href="/">Profile</a>
            </li>
            <li>
              <a href="/">Settings</a>
            </li>
            <li>
              <a href="/">Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
