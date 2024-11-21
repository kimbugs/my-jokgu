"use client";
import { logout } from "@/actions/auth";

const Logout = () => {
  return (
    <button className="btn-neutral btn btn-block" onClick={() => logout()}>
      Logout
    </button>
  );
};

export default Logout;
