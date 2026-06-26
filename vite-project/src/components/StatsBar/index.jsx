import React from "react";
import "./StatsBar.css";

export default function StatsBar({ activeCount, tick, trailsCount, fps = 60, gravityMode = "Earth", windSpeed = 0 }) {
  return (
    <div className="stats-bar">
      <div className="stat-item">
        <span className="stat-label">Active</span>
        <span className="stat-value" style={{ color: "#c4b5fd" }}>{activeCount}</span>
      </div>

      <div className="stat-divider" />

      <div className="stat-item">
        <span className="stat-label">Trails</span>
        <span className="stat-value" style={{ color: "#a7f3d0" }}>{trailsCount}</span>
      </div>

      <div className="stat-divider" />

      <div className="stat-item">
        <span className="stat-label">Tick</span>
        <span className="stat-value" style={{ color: "#38bdf8" }}>{tick}</span>
      </div>

      <div className="stat-divider" />

      <div className="stat-item">
        <span className="stat-label">FPS</span>
        <span className="stat-value" style={{ color: fps >= 55 ? "#4ade80" : fps >= 30 ? "#facc15" : "#f87171" }}>
          {fps}
        </span>
      </div>

      <div className="stat-divider" />

      <div className="stat-item">
        <span className="stat-label">Gravity</span>
        <span className="stat-value" style={{ color: "#fb7185", textTransform: "capitalize" }}>
          {gravityMode.toLowerCase()}
        </span>
      </div>

      {windSpeed > 0 && (
        <>
          <div className="stat-divider" />
          <div className="stat-item">
            <span className="stat-label">Wind</span>
            <span className="stat-value" style={{ color: "#fbbf24" }}>
              {windSpeed.toFixed(1)}
            </span>
          </div>
        </>
      )}
    </div>
  );
}
