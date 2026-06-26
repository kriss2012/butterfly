import React from "react";
import "./ControlPanel.css";
import { WING_COLORS } from "../../systems/spawner";

const GRAVITY_MODES = {
  "Moon": [-0.3, -0.08],
  "Mars": [-0.5, -0.15],
  "Earth": [-1.2, -0.3],
  "Jupiter": [-2.5, -1.0],
  "Deep Space": [-0.08, 0.08]
};

export default function ControlPanel({ config, onChange, onReset, isCollapsed, setIsCollapsed }) {
  if (isCollapsed) {
    return (
      <button
        className="panel-toggle-btn"
        onClick={() => setIsCollapsed(false)}
        title="Open Physics Settings"
      >
        ⚙️
      </button>
    );
  }

  const handleGravityModeChange = (modeName) => {
    onChange({
      ...config,
      GRAVITY_MODE: modeName,
      GRAVITY_Y: GRAVITY_MODES[modeName]
    });
  };

  const handleSliderChange = (key, value) => {
    onChange({
      ...config,
      [key]: value
    });
  };

  const handleColorChange = (index) => {
    if (index === -1) {
      // All colors (shuffle)
      onChange({
        ...config,
        PALETTE_INDEX: -1,
        WING_COLORS: WING_COLORS
      });
    } else {
      onChange({
        ...config,
        PALETTE_INDEX: index,
        WING_COLORS: [WING_COLORS[index]]
      });
    }
  };

  return (
    <div className="control-panel">
      <h3>
        <span>PHYSICS ENGINE TUNER</span>
        <button className="close-btn" onClick={() => setIsCollapsed(true)}>✕</button>
      </h3>

      {/* SWARM CONFIG */}
      <div className="panel-section">
        <h4>Swarm Configurations</h4>
        
        <div className="control-group">
          <div className="control-label">
            <span>Butterfly Cap</span>
            <span className="control-value">{config.BUTTERFLY_CAP}</span>
          </div>
          <input
            type="range"
            min="5"
            max="60"
            step="1"
            value={config.BUTTERFLY_CAP}
            onChange={(e) => handleSliderChange("BUTTERFLY_CAP", parseInt(e.target.value))}
            className="slider-input"
          />
        </div>

        <div className="control-group">
          <div className="control-label">
            <span>Repulsion Radius</span>
            <span className="control-value">{config.REPULSION_RADIUS}px</span>
          </div>
          <input
            type="range"
            min="40"
            max="250"
            step="5"
            value={config.REPULSION_RADIUS}
            onChange={(e) => handleSliderChange("REPULSION_RADIUS", parseInt(e.target.value))}
            className="slider-input"
          />
        </div>

        <div className="control-group">
          <div className="control-label">
            <span>Repulsion Force</span>
            <span className="control-value">{config.REPULSION_FORCE.toFixed(1)}</span>
          </div>
          <input
            type="range"
            min="0.1"
            max="2.5"
            step="0.1"
            value={config.REPULSION_FORCE}
            onChange={(e) => handleSliderChange("REPULSION_FORCE", parseFloat(e.target.value))}
            className="slider-input"
          />
        </div>
      </div>

      {/* GRAVITY & WIND */}
      <div className="panel-section">
        <h4>Gravity & Forces</h4>
        
        <div className="control-group" style={{ marginBottom: "16px" }}>
          <div className="control-label" style={{ marginBottom: "8px" }}>
            <span>Gravity Mode</span>
            <span className="control-value" style={{ textTransform: "uppercase" }}>{config.GRAVITY_MODE}</span>
          </div>
          <div className="mode-grid">
            {Object.keys(GRAVITY_MODES).map((mode) => (
              <button
                key={mode}
                className={`mode-btn ${config.GRAVITY_MODE === mode ? "active" : ""}`}
                onClick={() => handleGravityModeChange(mode)}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        <div className="control-group">
          <div className="control-label">
            <span>Wind Speed</span>
            <span className="control-value">{config.WIND_STRENGTH.toFixed(1)}</span>
          </div>
          <input
            type="range"
            min="0"
            max="5"
            step="0.1"
            value={config.WIND_STRENGTH}
            onChange={(e) => handleSliderChange("WIND_STRENGTH", parseFloat(e.target.value))}
            className="slider-input"
          />
        </div>

        <div className="control-group">
          <div className="control-label">
            <span>Wind Angle</span>
            <span className="control-value">{config.WIND_ANGLE}°</span>
          </div>
          <input
            type="range"
            min="0"
            max="360"
            step="5"
            value={config.WIND_ANGLE}
            onChange={(e) => handleSliderChange("WIND_ANGLE", parseInt(e.target.value))}
            className="slider-input"
          />
        </div>
      </div>

      {/* RENDER STYLES */}
      <div className="panel-section">
        <h4>Render Details</h4>

        <div className="control-group">
          <div className="control-label">
            <span>Trail Pool Size</span>
            <span className="control-value">{config.TRAIL_LENGTH}</span>
          </div>
          <input
            type="range"
            min="30"
            max="300"
            step="5"
            value={config.TRAIL_LENGTH}
            onChange={(e) => handleSliderChange("TRAIL_LENGTH", parseInt(e.target.value))}
            className="slider-input"
          />
        </div>

        <div className="control-group" style={{ marginTop: "12px" }}>
          <div className="control-label" style={{ marginBottom: "8px" }}>
            <span>Color Palettes</span>
          </div>
          <div className="palette-selector">
            <button
              className={`palette-btn ${config.PALETTE_INDEX === -1 ? "active" : ""}`}
              onClick={() => handleColorChange(-1)}
              title="All Palettes mixed"
            >
              <div className="palette-dot" style={{ background: "linear-gradient(45deg, #7C3AED, #EC4899, #10B981)" }} />
            </button>
            {WING_COLORS.map((colors, i) => (
              <button
                key={i}
                className={`palette-btn ${config.PALETTE_INDEX === i ? "active" : ""}`}
                onClick={() => handleColorChange(i)}
                title={`Palette ${i + 1}`}
              >
                <div className="palette-dot" style={{ background: colors[0] }} />
              </button>
            ))}
          </div>
        </div>
      </div>

      <button className="reset-btn" onClick={onReset}>
        Reset Engine
      </button>
    </div>
  );
}
