"use client";

import { useState } from "react";

const PlayerForm = () => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("Player name is required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/player", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setName("");
      } else {
        setError(data.message || "Failed to create player");
      }
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-semibold text-center mb-4">
        Create New Player
      </h2>
      {error && <div className="alert alert-error mb-4">{error}</div>}
      {success && (
        <div className="alert alert-success mb-4">
          Player created successfully!
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="form-control mb-4">
          <label className="label" htmlFor="name">
            <span className="label-text">Player Name</span>
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input input-bordered w-full"
            placeholder="Enter player name"
            required
          />
        </div>
        <div className="form-control mt-4">
          <button
            type="submit"
            className={`btn btn-primary w-full ${loading ? "loading" : ""}`}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Player"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PlayerForm;
