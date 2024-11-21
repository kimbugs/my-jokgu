"use client";

import Link from "next/link";
import { useState } from "react";

export default function BottomNav() {
  const [activeTab, setActiveTab] = useState("home");
  return (
    <div className="btm-nav ">
      {/* 홈 */}
      <Link
        href="/"
        className={`btm-nav-item ${activeTab === "home" ? "active" : ""}`}
        onClick={() => setActiveTab("home")}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          className="inline-block w-6 h-6 stroke-current"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 9l9-7 9 7v11l-9 7-9-7V9z"
          />
        </svg>
        <span className="btm-nav-label">Home</span>
      </Link>

      {/* 게임 */}
      <Link
        href="/game"
        className={`btm-nav-item ${activeTab === "game" ? "active" : ""}`}
        onClick={() => setActiveTab("game")}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          className="inline-block w-6 h-6 stroke-current"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M10 19l-7-7m0 0l7-7m-7 7h16"
          />
        </svg>
        <span className="btm-nav-label">Game</span>
      </Link>

      {/* 알림 */}
      <Link
        href="/notifications"
        className={`btm-nav-item ${
          activeTab === "notifications" ? "active" : ""
        }`}
        onClick={() => setActiveTab("notifications")}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          className="inline-block w-6 h-6 stroke-current"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 17h5l-1.405-1.405a2.032 2.032 0 01-.595-1.42V10c0-2.21-1.79-4-4-4H9c-2.21 0-4 1.79-4 4v4.175c0 .517-.195 1.01-.595 1.42L3 17h5m0 0a3 3 0 006 0z"
          />
        </svg>
        <span className="btm-nav-label">Notifications</span>
      </Link>

      {/* 프로필 */}
      <Link
        href="/player/show"
        className={`btm-nav-item ${activeTab === "player" ? "active" : ""}`}
        onClick={() => setActiveTab("player")}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          className="inline-block w-6 h-6 stroke-current"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5.121 19a6 6 0 0113.758 0m-6.879-6a6 6 0 110-12 6 6 0 010 12z"
          />
        </svg>
        <span className="btm-nav-label">Players</span>
      </Link>
    </div>
  );
}
