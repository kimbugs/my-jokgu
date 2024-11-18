"use client";
import { logout } from "@/actions/auth";

const Logout = () => {
  return (
    <button className="btn btn-primary" onClick={() => logout()}>
      Logout
    </button>
  );
};

export default Logout;
