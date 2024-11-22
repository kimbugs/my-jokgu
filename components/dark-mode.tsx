"use client";

import { useEffect, useState } from "react";

export default function DarkMode() {
  // 다크 모드 상태
  const [isDarkMode, setIsDarkMode] = useState(false);

  // 다크 모드 초기화
  useEffect(() => {
    // 시스템 테마에 맞춰 초기 상태 설정
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    setIsDarkMode(prefersDark);
  }, []);

  // 다크 모드 상태 변경
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  // 다크 모드 토글 함수
  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };
  return (
    <button className="btn btn-ghost" onClick={toggleDarkMode}>
      {isDarkMode ? "Light Mode" : "Dark Mode"}
    </button>
  );
}
